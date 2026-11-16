// Kundenportal · Grundlage. Läuft als Cloudflare Worker mit einer D1-Datenbank (Bindung DB).
// Der Betrieb legt in der geschützten Verwaltung Kunden an und pflegt je Kunde den Stand, Mitteilungen, Termine und Unterlagen.
// Jeder Kunde bekommt einen persönlichen, langen Zugangslink und sieht damit nur seine eigene Seite.
// Alles Veränderliche steht in ../einstellungen.json; dieses Programm wird nicht je Betrieb umgeschrieben.
// Sprache: Die Oberfläche ist deutsch (lang="de"). Das ist eine bewusste Festlegung für den Einsatzort: Der Baukasten richtet sich an
// Betriebe in Deutschland, und Impressum und Datenschutzseite folgen deutschen Vorgaben. Der Betreiber entscheidet sich mit dem
// Baukasten für diese Sprache; der Agent sagt es ihm vor dem Einrichten. Eine Sprachwahl für Besucher hat diese Fassung nicht.
import cfg from '../einstellungen.json' with { type: 'json' };
import { STIL } from './stil.mjs';

const TAGNAMEN = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const SITZUNG_STUNDEN = 12;
const GRENZEN = { anmelden: { anzahl: 8, minuten: 15 }, zugang: { anzahl: 20, minuten: 15 } };
const DATEI_MAX = 4 * 1024 * 1024, STUECK = 1024 * 1024, DATEIEN_JE_KUNDE = 20;
const DATEITYPEN = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' };

const esc = wert => String(wert ?? '').replace(/[&<>"']/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[z]));
const zweistellig = zahl => String(zahl).padStart(2, '0');

// ---- Zeit: gerechnet wird in der Ortszeit des Betriebs, als Text „JJJJ-MM-TTTHH:MM“.
function ortszeit(datum) {
  const teile = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: cfg.zeitzone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(datum).map(t => [t.type, t.value]));
  return teile.year + '-' + teile.month + '-' + teile.day + 'T' + teile.hour + ':' + teile.minute;
}
function plusTage(tag, anzahl) { const [j, m, t] = tag.split('-').map(Number); return new Date(Date.UTC(j, m - 1, t + anzahl)).toISOString().slice(0, 10); }
function tagText(tag) { const [j, m, t] = tag.split('-').map(Number); return TAGNAMEN[new Date(Date.UTC(j, m - 1, t)).getUTCDay()] + ', ' + t + '.' + m + '.' + j; }
const zeitText = stempel => tagText(stempel.slice(0, 10)) + (stempel.length > 10 ? ', ' + stempel.slice(11) + ' Uhr' : '');
const gueltigerTag = tag => /^\d{4}-\d{2}-\d{2}$/.test(tag) && plusTage(tag, 0) === tag;
const gueltigeZeit = zeit => /^([01]\d|2[0-3]):[0-5]\d$/.test(zeit);
const groesseText = bytes => bytes >= 1048576 ? (bytes / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB';

// ---- Hilfen für Antworten
const KOPF = {
  'content-security-policy': "default-src 'none'; style-src 'self'; img-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin', 'x-frame-options': 'DENY',
};
const PRIVAT = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' };
function seite(titel, inhalt, { status = 200, kopf = {} } = {}) {
  const html = '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>' + esc(titel) + ' · ' + esc(cfg.name) + '</title><link rel="stylesheet" href="/stil.css"></head><body><header class="kopf"><span class="marke">' + esc(cfg.name) + '</span></header><main class="inhalt">' + inhalt + '</main><footer class="fuss"><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a></footer></body></html>';
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', ...KOPF, ...PRIVAT, ...kopf } });
}
const weiter = (ziel, kopf = {}) => new Response(null, { status: 303, headers: { location: ziel, ...KOPF, ...PRIVAT, ...kopf } });
const fehler = (status, titel, text) => seite(titel, '<h1>' + esc(titel) + '</h1><p>' + esc(text) + '</p>', { status });

async function sha256(text) { const roh = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return [...new Uint8Array(roh)].map(b => zweistellig(b.toString(16))).join(''); }
function zufall(bytes = 32) { const roh = crypto.getRandomValues(new Uint8Array(bytes)); return btoa(String.fromCharCode(...roh)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function gleich(a, b) { if (a.length !== b.length) return false; let unterschied = 0; for (let i = 0; i < a.length; i++) unterschied |= a.charCodeAt(i) ^ b.charCodeAt(i); return unterschied === 0; }
// Kommt die Anfrage von dieser Seite selbst? Browser nennen den Absender im Kopf „Origin“. Manche lassen ihn bei Formularen weg oder
// schicken „null“; dann zählt die Angabe „Sec-Fetch-Site“, die der Browser selbst setzt und die eine fremde Seite nicht fälschen kann.
function eigeneSeite(request, url) {
  const absenderseite = request.headers.get('origin');
  if (absenderseite && absenderseite !== 'null') return absenderseite === url.origin;
  return request.headers.get('sec-fetch-site') === 'same-origin';
}
// Liest ein Formular. Normale Formulare sind klein; nur das Hochladen einer Datei darf größer sein.
async function formular(request, mitDatei = false) {
  const art = request.headers.get('content-type') || '', laenge = Number(request.headers.get('content-length') || 0);
  try {
    if (mitDatei && art.startsWith('multipart/form-data')) { if (laenge > DATEI_MAX + 20000) return null; return await request.formData(); }
    const text = await request.text(); if (text.length > 8000) return null; return new URLSearchParams(text);
  } catch { return null; }
}

async function einstellung(db, schluessel) { const zeile = await db.prepare('SELECT v FROM einstellung WHERE k = ?').bind(schluessel).first(); return zeile ? zeile.v : ''; }
// Begrenzung je Absender: gespeichert wird nur ein Hash der Adresse, nach Ablauf wird er gelöscht.
async function absender(db, request) { return sha256((await einstellung(db, 'salz')) + '|' + (request.headers.get('cf-connecting-ip') || 'unbekannt')); }
// Trägt einen Versuch ein und meldet, ob damit die Grenze überschritten ist. Erst eintragen, dann zählen: So können gleichzeitige
// Anfragen die Grenze nicht gemeinsam unterlaufen. Zurück kommt auch die Nummer des Eintrags, damit ein gelungener Versuch nicht zählt.
async function versuch(db, art, wer, jetztMs) {
  const grenze = GRENZEN[art];
  const eintrag = await db.prepare('INSERT INTO versuch (art, wer, zeit) VALUES (?, ?, ?) RETURNING rowid AS nr').bind(art, wer, jetztMs).first();
  const bisher = await db.prepare('SELECT COUNT(*) AS n FROM versuch WHERE art = ? AND wer = ? AND zeit >= ?').bind(art, wer, jetztMs - grenze.minuten * 60000).first();
  return { zuViele: Number(bisher.n) > grenze.anzahl, nr: eintrag.nr };
}
const vergiss = (db, nr) => db.prepare('DELETE FROM versuch WHERE rowid = ?').bind(nr).run();

// ---- Kundenseite: erreichbar nur über den persönlichen Zugangslink /k/<Zugang>
// Findet den Kunden zum Zugang. Falsche Zugänge werden je Absender gezählt, damit niemand Links durchprobieren kann.
async function kundeZumZugang(db, request, zugang, jetztMs) {
  const wer = await absender(db, request), v = await versuch(db, 'zugang', wer, jetztMs);
  const kunde = /^[\w-]{40,50}$/.test(zugang) ? await db.prepare('SELECT id, name, vorgang, stufe FROM kunde WHERE token_hash = ?').bind(await sha256(zugang)).first() : null;
  // Wer zu oft danebenlag, wird gebremst, auch mit richtigem Zugang. Ein richtiger Zugang zählt selbst nicht als Versuch.
  if (v.zuViele) return { gebremst: true };
  if (kunde) await vergiss(db, v.nr);
  return { kunde };
}
function stufenleiste(stufe) {
  return '<ol class="stufen">' + cfg.stufen.map((name, i) => '<li class="' + (i < stufe ? 'erledigt' : i === stufe ? 'aktuell' : 'offen') + '"' + (i === stufe ? ' aria-current="step"' : '') + '><span>' + esc(name) + '</span>' + (i < stufe ? '<span class="nurvorlesen"> (erledigt)</span>' : i === stufe ? '<span class="nurvorlesen"> (aktueller Stand)</span>' : '') + '</li>').join('') + '</ol>';
}
async function kundenseite(db, request, zugang, rest, jetzt) {
  const { kunde, gebremst } = await kundeZumZugang(db, request, zugang, jetzt.getTime());
  if (gebremst) return fehler(429, 'Zu viele Versuche', 'Bitte prüfen Sie Ihren Link, warten Sie eine Viertelstunde und versuchen Sie es dann erneut.');
  if (!kunde) return fehler(404, 'Nicht gefunden', 'Diese Seite gibt es nicht. Bitte prüfen Sie Ihren Link oder fragen Sie bei uns nach.');
  const pfad = '/k/' + zugang;
  if (rest) {
    // Unterlage herunterladen: Die Datei muss diesem Kunden gehören. Die Kundennummer steht in der Abfrage selbst.
    const treffer = rest.match(/^\/datei\/(\d{1,9})$/);
    return treffer ? datei(db, Number(treffer[1]), kunde.id) : fehler(404, 'Nicht gefunden', 'Diese Seite gibt es nicht.');
  }
  const heute = ortszeit(jetzt).slice(0, 10);
  const mitteilungen = (await db.prepare('SELECT text, angelegt FROM mitteilung WHERE kunde_id = ? ORDER BY id DESC').bind(kunde.id).all()).results;
  const termine = (await db.prepare('SELECT start, text FROM termin WHERE kunde_id = ? AND start >= ? ORDER BY start').bind(kunde.id, heute).all()).results;
  const dateien = (await db.prepare('SELECT id, name, groesse, angelegt FROM datei WHERE kunde_id = ? ORDER BY id DESC').bind(kunde.id).all()).results;
  const inhalt = '<p class="anrede">Guten Tag, ' + esc(kunde.name) + '</p><h1>' + esc(kunde.vorgang) + '</h1><p class="einleitung">' + esc(cfg.begruessung) + '</p>'
    + '<section aria-labelledby="t-stand"><h2 id="t-stand">Stand</h2>' + stufenleiste(kunde.stufe) + '</section>'
    + '<section aria-labelledby="t-mitteilungen"><h2 id="t-mitteilungen">Mitteilungen</h2>' + (mitteilungen.length ? '<ul class="liste" role="list">' + mitteilungen.map(m => '<li class="karte"><p class="klein">' + esc(zeitText(m.angelegt.slice(0, 10))) + '</p><p class="text">' + esc(m.text) + '</p></li>').join('') + '</ul>' : '<p class="leer">Noch keine Mitteilung.</p>') + '</section>'
    + '<section aria-labelledby="t-termine"><h2 id="t-termine">Termine</h2>' + (termine.length ? '<ul class="liste" role="list">' + termine.map(t => '<li class="karte"><strong>' + esc(zeitText(t.start)) + '</strong><p class="text">' + esc(t.text) + '</p></li>').join('') + '</ul>' : '<p class="leer">Zurzeit steht kein Termin an.</p>') + '</section>'
    + '<section aria-labelledby="t-unterlagen"><h2 id="t-unterlagen">Unterlagen</h2>' + (dateien.length ? '<ul class="liste" role="list">' + dateien.map(d => '<li class="karte datei"><a href="' + esc(pfad) + '/datei/' + d.id + '">' + esc(d.name) + '</a><span class="klein">' + esc(groesseText(d.groesse)) + ' · ' + esc(zeitText(d.angelegt.slice(0, 10))) + '</span></li>').join('') + '</ul>' : '<p class="leer">Noch keine Unterlagen.</p>') + '</section>'
    + '<p class="merken">' + esc(cfg.erreichbar) + '</p><p class="klein">Diese Seite ist nur über Ihren persönlichen Link erreichbar. Geben Sie ihn nicht weiter: Wer den Link kennt, sieht diese Seite.</p>';
  return seite(kunde.vorgang, inhalt);
}
// Liefert eine Datei aus, wenn sie zum genannten Kunden gehört.
async function datei(db, dateiId, kundeId) {
  const d = await db.prepare('SELECT id, name, typ, groesse FROM datei WHERE id = ? AND kunde_id = ?').bind(dateiId, kundeId).first();
  if (!d) return fehler(404, 'Nicht gefunden', 'Diese Unterlage gibt es nicht.');
  const teile = (await db.prepare('SELECT daten FROM dateiteil WHERE datei_id = ? ORDER BY nr').bind(d.id).all()).results.map(z => new Uint8Array(z.daten));
  const alles = new Uint8Array(teile.reduce((summe, t) => summe + t.length, 0)); let stelle = 0;
  for (const t of teile) { alles.set(t, stelle); stelle += t.length; }
  return new Response(alles, { headers: { 'content-type': d.typ in DATEITYPEN ? d.typ : 'application/octet-stream', 'content-disposition': "attachment; filename*=UTF-8''" + encodeURIComponent(d.name), ...KOPF, ...PRIVAT } });
}
function rechtsseite(art) {
  const r = cfg.rechtliches || {}, fehlt = wert => (String(wert || '').trim() ? esc(wert) : '<strong>ANGABE FEHLT</strong>');
  const absatz = text => String(text || '').split(/\n+/).filter(Boolean).map(z => '<p>' + esc(z) + '</p>').join('');
  const entwurf = '<p class="klein">Dieser Text ist ein Entwurf aus den Angaben des Betriebs und keine Rechtsberatung.</p>';
  if (art === 'impressum') return seite('Impressum', '<h1>Impressum</h1><p>' + fehlt(r.verantwortlich) + '<br>' + fehlt(r.anschrift) + '</p><p>Telefon: ' + fehlt(r.telefon) + '<br>E-Mail: ' + fehlt(r.email) + '</p>' + absatz(r.weitere_angaben) + entwurf);
  return seite('Datenschutz', '<h1>Datenschutz</h1><h2>Wer ist verantwortlich?</h2><p>' + fehlt(r.verantwortlich) + ', ' + fehlt(r.anschrift) + ', ' + fehlt(r.email) + '</p><h2>Welche Angaben speichern wir?</h2><p>Für Ihre persönliche Seite speichern wir Ihren Namen, Ihre Kontaktangabe, die Bezeichnung und den Stand Ihres Vorgangs sowie die Mitteilungen, Termine und Unterlagen, die wir Ihnen dort bereitstellen. Wir verwenden diese Angaben nur, um Sie über Ihren Vorgang zu informieren.</p><h2>Wie lange?</h2><p>' + esc(cfg.aufbewahrung_tage) + ' Tage nach Abschluss Ihres Vorgangs wird Ihre Seite mit allen Angaben und Unterlagen gelöscht (beim nächsten täglichen Aufräumen ab diesem Tag). Möchten Sie, dass das früher geschieht, schreiben Sie uns: Wir löschen Ihre Seite dann von Hand.</p><h2>Ihr Zugangslink</h2><p>Ihre Seite ist nur über Ihren persönlichen Link erreichbar. Wir speichern den Link nicht im Klartext. Geben Sie ihn nicht weiter. Geht er verloren oder ist er in falsche Hände geraten, stellen wir Ihnen einen neuen aus; der alte gilt dann nicht mehr.</p><h2>Schutz vor Missbrauch</h2><p>Um das Durchprobieren von Links und von Anmeldungen zu bremsen, speichern wir bei einem falschen Link und bei jedem Anmeldeversuch in der Verwaltung für höchstens 24 Stunden einen nicht rückrechenbaren Kurzwert der Internetadresse. Beim Aufruf mit einem richtigen Link wird dieser Kurzwert nur für die Dauer des Aufrufs eingetragen und sofort wieder gelöscht. Die Seite setzt für Kunden keine Cookies und bindet keine fremden Inhalte ein.</p><h2>Wo liegen die Daten?</h2><p>Seite und Datenbank laufen bei Cloudflare, Inc. (USA) als technischem Dienstleister; die Datenbank ist auf Rechenzentren in der Europäischen Union festgelegt. Anfragen können über Rechenzentren außerhalb der EU geleitet werden.</p><h2>Ihre Rechte</h2><p>Sie können Auskunft, Berichtigung und Löschung Ihrer Angaben verlangen und sich bei einer Datenschutzaufsichtsbehörde beschweren. Schreiben Sie uns dazu an die oben genannte Adresse.</p>' + entwurf);
}

// ---- Geschützter Bereich des Betriebs
async function sitzung(db, request, jetztMs) {
  const keks = (request.headers.get('cookie') || '').split(/;\s*/).find(k => k.startsWith('sitzung='));
  if (!keks) return null;
  const zeile = await db.prepare('SELECT hash, marke, bis FROM sitzung WHERE hash = ?').bind(await sha256(keks.slice(8))).first();
  return zeile && Number(zeile.bis) > jetztMs ? zeile : null;
}
const anmeldeseite = (meldung = '', status = 200) => seite('Verwaltung', '<h1>Verwaltung</h1>' + (meldung ? '<p class="meldung">' + esc(meldung) + '</p>' : '') + '<form method="post" action="/verwaltung/anmelden" class="formular"><label>Zugangsschlüssel<input type="password" name="schluessel" required autocomplete="current-password"></label><button class="knopf" type="submit">Anmelden</button></form>', { status });
async function anmelden(db, request, url, jetzt) {
  if (!eigeneSeite(request, url)) return fehler(403, 'Anfrage nicht angenommen', 'Bitte benutzen Sie das Formular auf dieser Seite.');
  const wer = await absender(db, request), jetztMs = jetzt.getTime();
  if ((await versuch(db, 'anmelden', wer, jetztMs)).zuViele) return anmeldeseite('Zu viele Versuche. Bitte warten Sie eine Viertelstunde.', 429);
  const f = await formular(request), soll = await einstellung(db, 'zugang_hash'), ist = await sha256(f?.get('schluessel') || '');
  if (!soll || !gleich(soll, ist)) return anmeldeseite('Der Zugangsschlüssel stimmt nicht.', 401);
  const wert = zufall(), marke = zufall(18), bis = jetztMs + SITZUNG_STUNDEN * 3600000;
  await db.prepare('DELETE FROM sitzung WHERE bis < ?').bind(jetztMs).run();
  await db.prepare('INSERT INTO sitzung (hash, marke, bis) VALUES (?, ?, ?)').bind(await sha256(wert), marke, bis).run();
  return weiter('/verwaltung', { 'set-cookie': 'sitzung=' + wert + '; Path=/verwaltung; HttpOnly; Secure; SameSite=Strict; Max-Age=' + SITZUNG_STUNDEN * 3600 });
}
// Entfernt einen Kunden mit seinen Mitteilungen, Terminen und Unterlagen. Die Schritte laufen als ein zusammenhängender Vorgang (batch):
// ganz oder gar nicht. Die Zähler für Fehlversuche hängen an keiner Person (nur an einem Kurzwert des Absenders) und laufen nach 24 Stunden ab.
async function kundeLoeschen(db, id) {
  await db.batch([
    db.prepare('DELETE FROM dateiteil WHERE datei_id IN (SELECT id FROM datei WHERE kunde_id = ?)').bind(id),
    db.prepare('DELETE FROM datei WHERE kunde_id = ?').bind(id),
    db.prepare('DELETE FROM mitteilung WHERE kunde_id = ?').bind(id),
    db.prepare('DELETE FROM termin WHERE kunde_id = ?').bind(id),
    db.prepare('DELETE FROM kunde WHERE id = ?').bind(id),
  ]);
}
// Wurde die Person gelöscht, während noch etwas zu ihr gespeichert wurde, darf nichts davon übrig bleiben.
async function ohneKundeWeg(db, id) {
  if (await db.prepare('SELECT id FROM kunde WHERE id = ?').bind(id).first()) return;
  await db.batch([db.prepare('DELETE FROM mitteilung WHERE kunde_id = ?').bind(id), db.prepare('DELETE FROM termin WHERE kunde_id = ?').bind(id)]);
}
// Löscht, was abgelaufen ist: alle abgeschlossenen Vorgänge nach der eingestellten Frist (gleich wie viele), dazu alles, was zu keinem
// vorhandenen Kunden mehr gehört (zum Beispiel eine Unterlage, deren Hochladen sich mit dem Löschen der Person überschnitten hat),
// alte Anmeldungen und Zähler. Läuft beim Öffnen der Verwaltung und einmal täglich zeitgesteuert (siehe wrangler.jsonc).
export async function aufraeumen(db, jetzt) {
  const grenze = plusTage(ortszeit(jetzt).slice(0, 10), -cfg.aufbewahrung_tage);
  await db.batch([
    db.prepare('DELETE FROM kunde WHERE abgeschlossen_am IS NOT NULL AND abgeschlossen_am <= ?').bind(grenze),
    db.prepare('DELETE FROM mitteilung WHERE kunde_id NOT IN (SELECT id FROM kunde)'),
    db.prepare('DELETE FROM termin WHERE kunde_id NOT IN (SELECT id FROM kunde)'),
    db.prepare('DELETE FROM datei WHERE kunde_id NOT IN (SELECT id FROM kunde)'),
    db.prepare('DELETE FROM dateiteil WHERE datei_id NOT IN (SELECT id FROM datei)'),
    db.prepare('DELETE FROM sitzung WHERE bis < ?').bind(jetzt.getTime()),
    db.prepare('DELETE FROM versuch WHERE zeit < ?').bind(jetzt.getTime() - 86400000),
  ]);
}
const markeFeld = s => '<input type="hidden" name="marke" value="' + esc(s.marke) + '">';
const abmelden = s => '<form method="post" action="/verwaltung/abmelden">' + markeFeld(s) + '<button class="knopf zweitrangig" type="submit">Abmelden</button></form>';
async function uebersicht(db, s, jetzt) {
  await aufraeumen(db, jetzt);
  const kunden = (await db.prepare('SELECT id, name, vorgang, stufe, abgeschlossen_am FROM kunde ORDER BY abgeschlossen_am IS NOT NULL, name COLLATE NOCASE').all()).results;
  const liste = kunden.map(k => '<li><a class="zeile-link" href="/verwaltung/kunde/' + k.id + '"><strong>' + esc(k.name) + '</strong><span>' + esc(k.vorgang) + ' · ' + esc(cfg.stufen[k.stufe] ?? '') + '</span></a></li>').join('');
  return seite('Verwaltung', '<h1>' + esc(cfg.wort_kunden) + '</h1>' + (liste ? '<ul class="liste" role="list">' + liste + '</ul>' : '<p class="leer">Noch niemand angelegt.</p>')
    + '<h2>' + esc(cfg.wort_kunde) + ' anlegen</h2><form method="post" action="/verwaltung/neu" class="formular">' + markeFeld(s) + '<label>Name<input name="name" required maxlength="80"></label><label>Telefon oder E-Mail (nur für Sie, freiwillig)<input name="kontakt" maxlength="120"></label><label>' + esc(cfg.wort_vorgang) + ' (so heißt die persönliche Seite, zum Beispiel „Badsanierung“)<input name="vorgang" required maxlength="80"></label><button class="knopf" type="submit">Anlegen</button></form>'
    + '<p class="klein">Abgeschlossene Vorgänge werden ' + esc(cfg.aufbewahrung_tage) + ' Tage nach dem Abschluss automatisch mit allen Unterlagen gelöscht (einmal täglich und bei jedem Öffnen dieser Seite).</p>' + abmelden(s));
}
function zugangsseite(url, kunde, zugang) {
  const link = url.origin + '/k/' + zugang;
  return seite('Zugangslink', '<h1>Zugangslink für ' + esc(kunde.name) + '</h1><p class="meldung">Dieser Link wird nur jetzt angezeigt. Kopieren Sie ihn und geben Sie ihn nur dieser einen Person, am besten persönlich oder über einen Weg, den nur sie liest.</p><p class="link" id="zugangslink">' + esc(link) + '</p><p>Wer den Link kennt, sieht die Seite mit Stand, Mitteilungen, Terminen und Unterlagen. Geht er verloren, stellen Sie in der Verwaltung bei dieser Person einen neuen aus; der alte gilt dann nicht mehr.</p><p><a class="knopf" href="/verwaltung/kunde/' + kunde.id + '">Weiter</a></p>');
}
async function kundendetail(db, s, id, jetzt, meldung = '') {
  const k = await db.prepare('SELECT id, name, kontakt, vorgang, stufe, angelegt, abgeschlossen_am FROM kunde WHERE id = ?').bind(id).first();
  if (!k) return fehler(404, 'Nicht gefunden', 'Diesen Eintrag gibt es nicht.');
  const basis = '/verwaltung/kunde/' + k.id, m = markeFeld(s), heute = ortszeit(jetzt).slice(0, 10);
  const weg = (art, eintrag) => '<form method="post" action="' + basis + '/' + art + '-loeschen">' + m + '<input type="hidden" name="eintrag" value="' + eintrag + '"><button class="knopf klein" type="submit">Löschen</button></form>';
  const mitteilungen = (await db.prepare('SELECT id, text, angelegt FROM mitteilung WHERE kunde_id = ? ORDER BY id DESC').bind(k.id).all()).results;
  const termine = (await db.prepare('SELECT id, start, text FROM termin WHERE kunde_id = ? ORDER BY start').bind(k.id).all()).results;
  const dateien = (await db.prepare('SELECT id, name, groesse, angelegt FROM datei WHERE kunde_id = ? ORDER BY id DESC').bind(k.id).all()).results;
  const stufen = cfg.stufen.map((name, i) => '<option value="' + i + '"' + (i === k.stufe ? ' selected' : '') + '>' + esc(name) + '</option>').join('');
  return seite(k.name, '<p><a href="/verwaltung">Alle ' + esc(cfg.wort_kunden) + '</a></p><h1>' + esc(k.name) + '</h1>' + (meldung ? '<p class="meldung">' + esc(meldung) + '</p>' : '') + '<p class="einleitung">' + esc(k.vorgang) + (k.kontakt ? ' · ' + esc(k.kontakt) : '') + (k.abgeschlossen_am ? ' · abgeschlossen am ' + esc(tagText(k.abgeschlossen_am)) + ', wird am ' + esc(tagText(plusTage(k.abgeschlossen_am, cfg.aufbewahrung_tage))) + ' gelöscht' : '') + '</p>'
    + '<h2>Stand</h2><form method="post" action="' + basis + '/stufe" class="zeile">' + m + '<label>Stand<select name="stufe">' + stufen + '</select></label><button class="knopf" type="submit">Speichern</button></form><p class="klein">Der letzte Stand („' + esc(cfg.stufen[cfg.stufen.length - 1]) + '“) schließt den Vorgang ab; ab dann läuft die Löschfrist.</p>'
    + '<h2>Mitteilungen</h2>' + (mitteilungen.length ? '<ul class="liste" role="list">' + mitteilungen.map(x => '<li class="karte reihe"><div><p class="klein">' + esc(zeitText(x.angelegt.slice(0, 10))) + '</p><p class="text">' + esc(x.text) + '</p></div>' + weg('mitteilung', x.id) + '</li>').join('') + '</ul>' : '') + '<form method="post" action="' + basis + '/mitteilung" class="formular">' + m + '<label>Neue Mitteilung<textarea name="text" required maxlength="1000" rows="3"></textarea></label><button class="knopf" type="submit">Mitteilung speichern</button></form>'
    + '<h2>Termine</h2>' + (termine.length ? '<ul class="liste" role="list">' + termine.map(x => '<li class="karte reihe"><div><strong>' + esc(zeitText(x.start)) + '</strong><p class="text">' + esc(x.text) + '</p></div>' + weg('termin', x.id) + '</li>').join('') + '</ul>' : '') + '<form method="post" action="' + basis + '/termin" class="formular">' + m + '<div class="zeile"><label>Tag<input type="date" name="tag" required min="' + heute + '"></label><label>Uhrzeit (freiwillig)<input type="time" name="zeit"></label></div><label>Worum geht es?<input name="text" required maxlength="200"></label><button class="knopf" type="submit">Termin speichern</button></form>'
    + '<h2>Unterlagen</h2>' + (dateien.length ? '<ul class="liste" role="list">' + dateien.map(x => '<li class="karte reihe"><div><a href="' + basis + '/datei/' + x.id + '">' + esc(x.name) + '</a><p class="klein">' + esc(groesseText(x.groesse)) + ' · ' + esc(zeitText(x.angelegt.slice(0, 10))) + '</p></div>' + weg('datei', x.id) + '</li>').join('') + '</ul>' : '') + '<form method="post" action="' + basis + '/datei" enctype="multipart/form-data" class="formular">' + m + '<label>Datei (PDF, JPG oder PNG, höchstens 4 MB; der Inhalt wird nicht geprüft)<input type="file" name="datei" required accept="application/pdf,image/jpeg,image/png"></label><button class="knopf" type="submit">Hochladen</button></form>'
    + '<h2>Zugang und Daten</h2><form method="post" action="' + basis + '/zugang-neu">' + m + '<button class="knopf zweitrangig" type="submit">Neuen Zugangslink ausstellen</button></form><p class="klein">Der bisherige Link gilt dann sofort nicht mehr.</p><p><a class="knopf zweitrangig" href="' + basis + '/auskunft.json">Auskunft zu dieser Person herunterladen</a></p><p class="klein">Die Datei enthält Namen, Kontakt, Stand, Mitteilungen und Termine und die Liste der Unterlagen. Die Unterlagen selbst laden Sie oben einzeln herunter. Bewahren Sie alles sicher auf.</p><form method="post" action="' + basis + '/loeschen">' + m + '<label class="haken"><input type="checkbox" name="sicher" value="ja" required><span>Ja, diese Person mit allen Mitteilungen, Terminen und Unterlagen endgültig löschen.</span></label><button class="knopf warnung" type="submit">Endgültig löschen</button></form>');
}
async function auskunft(db, id) {
  const k = await db.prepare('SELECT name, kontakt, vorgang, stufe, angelegt, abgeschlossen_am FROM kunde WHERE id = ?').bind(id).first();
  if (!k) return fehler(404, 'Nicht gefunden', 'Diesen Eintrag gibt es nicht.');
  const alle = async sql => (await db.prepare(sql).bind(id).all()).results;
  const inhalt = { hinweis: 'Alles, was im Kundenportal zu dieser Person gespeichert ist. Die Unterlagen selbst laden Sie in der Verwaltung einzeln herunter.', name: k.name, kontakt: k.kontakt, vorgang: k.vorgang, stand: cfg.stufen[k.stufe] ?? '', angelegt: k.angelegt, abgeschlossen_am: k.abgeschlossen_am, mitteilungen: await alle('SELECT text, angelegt FROM mitteilung WHERE kunde_id = ? ORDER BY id'), termine: await alle('SELECT start, text FROM termin WHERE kunde_id = ? ORDER BY start'), unterlagen: await alle('SELECT name, groesse, angelegt FROM datei WHERE kunde_id = ? ORDER BY id') };
  return new Response(JSON.stringify(inhalt, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': 'attachment; filename="auskunft.json"', ...KOPF, ...PRIVAT } });
}
// Erkennt den Dateityp an Anfang und Ende der Datei, nicht an der Endung oder der Angabe des Browsers. Das ist eine Plausibilitätsprüfung:
// Sie hält falsch benannte Dateien fern, ist aber keine Prüfung des Inhalts und kein Schutz vor Schadsoftware.
function dateityp(bytes) {
  const beginnt = folge => folge.every((wert, i) => bytes[i] === wert), n = bytes.length;
  const schluss = new TextDecoder('latin1').decode(bytes.slice(Math.max(0, n - 1024)));
  if (n > 20 && beginnt([0x25, 0x50, 0x44, 0x46, 0x2d]) && schluss.includes('%%EOF')) return 'application/pdf';
  if (n > 20 && beginnt([0xff, 0xd8, 0xff]) && schluss.includes('\u00ff\u00d9')) return 'image/jpeg';
  if (n > 20 && beginnt([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) && schluss.includes('IEND')) return 'image/png';
  return '';
}
async function hochladen(db, f, kundeId, jetztOrt) {
  const eingang = f.get('datei');
  if (!eingang || typeof eingang === 'string' || !eingang.size) return 'Bitte wählen Sie eine Datei aus.';
  if (eingang.size > DATEI_MAX) return 'Die Datei ist größer als 4 MB.';
  const bytes = new Uint8Array(await eingang.arrayBuffer()), typ = dateityp(bytes);
  if (!typ) return 'Erlaubt sind nur vollständige PDF-, JPG- und PNG-Dateien.';
  const anzahl = await db.prepare('SELECT COUNT(*) AS n FROM datei WHERE kunde_id = ?').bind(kundeId).first();
  if (Number(anzahl.n) >= DATEIEN_JE_KUNDE) return 'Je Person sind höchstens ' + DATEIEN_JE_KUNDE + ' Unterlagen möglich. Löschen Sie zuerst eine ältere.';
  let name = String(eingang.name || 'Unterlage').replace(/[^\p{L}\p{N} ._()-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (!name.toLowerCase().endsWith('.' + DATEITYPEN[typ]) && !(typ === 'image/jpeg' && name.toLowerCase().endsWith('.jpeg'))) name = (name.replace(/\.[^.]*$/, '') || 'Unterlage') + '.' + DATEITYPEN[typ];
  const neu = await db.prepare('INSERT INTO datei (kunde_id, name, typ, groesse, angelegt) VALUES (?, ?, ?, ?, ?) RETURNING id').bind(kundeId, name, typ, bytes.length, jetztOrt).first();
  for (let nr = 0; nr * STUECK < bytes.length; nr++) await db.prepare('INSERT INTO dateiteil (datei_id, nr, daten) VALUES (?, ?, ?)').bind(neu.id, nr, bytes.slice(nr * STUECK, (nr + 1) * STUECK)).run();
  // Wurde die Person inzwischen gelöscht, darf die Unterlage nicht übrig bleiben.
  if (!(await db.prepare('SELECT id FROM kunde WHERE id = ?').bind(kundeId).first())) {
    await db.batch([db.prepare('DELETE FROM dateiteil WHERE datei_id = ?').bind(neu.id), db.prepare('DELETE FROM datei WHERE id = ?').bind(neu.id)]);
    return 'Diese Person wurde inzwischen gelöscht. Die Unterlage wurde nicht gespeichert.';
  }
  return '';
}
async function verwaltung(db, request, url, jetzt) {
  const pfad = url.pathname, jetztMs = jetzt.getTime(), jetztOrt = ortszeit(jetzt);
  if (pfad === '/verwaltung/anmelden' && request.method === 'POST') return anmelden(db, request, url, jetzt);
  const s = await sitzung(db, request, jetztMs);
  if (!s) return pfad === '/verwaltung' ? anmeldeseite() : weiter('/verwaltung');
  const treffer = pfad.match(/^\/verwaltung\/kunde\/(\d{1,9})(\/.*)?$/), id = treffer ? Number(treffer[1]) : 0, rest = treffer ? treffer[2] || '' : '';
  if (request.method === 'GET') {
    if (pfad === '/verwaltung') return uebersicht(db, s, jetzt);
    if (treffer && !rest) return kundendetail(db, s, id, jetzt);
    if (treffer && rest === '/auskunft.json') return auskunft(db, id);
    const d = treffer && rest.match(/^\/datei\/(\d{1,9})$/);
    if (d) return datei(db, Number(d[1]), id);
    return fehler(404, 'Nicht gefunden', 'Diese Seite gibt es nicht.');
  }
  if (request.method !== 'POST') return fehler(405, 'Nicht erlaubt', 'Diese Anfrage wird nicht unterstützt.');
  const f = await formular(request, rest === '/datei');
  if (!f || !eigeneSeite(request, url) || !gleich(String(f.get('marke') || ''), s.marke)) return fehler(403, 'Anfrage nicht angenommen', 'Bitte laden Sie die Verwaltung neu und versuchen Sie es noch einmal. Dateien dürfen höchstens 4 MB groß sein.');
  const text = wert => String(f.get(wert) || '').trim();
  if (pfad === '/verwaltung/abmelden') { await db.prepare('DELETE FROM sitzung WHERE hash = ?').bind(s.hash).run(); return weiter('/verwaltung', { 'set-cookie': 'sitzung=; Path=/verwaltung; HttpOnly; Secure; SameSite=Strict; Max-Age=0' }); }
  if (pfad === '/verwaltung/neu') {
    const name = text('name'), vorgang = text('vorgang'), kontakt = text('kontakt');
    if (name.length < 2 || name.length > 80 || vorgang.length < 2 || vorgang.length > 80 || kontakt.length > 120) return fehler(400, 'Angaben unvollständig', 'Bitte geben Sie einen Namen und eine Bezeichnung an.');
    const zugang = zufall();
    const neu = await db.prepare('INSERT INTO kunde (name, kontakt, vorgang, stufe, token_hash, angelegt) VALUES (?, ?, ?, 0, ?, ?) RETURNING id').bind(name, kontakt, vorgang, await sha256(zugang), jetztOrt).first();
    return zugangsseite(url, { id: neu.id, name }, zugang);
  }
  const kunde = treffer ? await db.prepare('SELECT id, name FROM kunde WHERE id = ?').bind(id).first() : null;
  if (!kunde) return fehler(404, 'Nicht gefunden', 'Diesen Eintrag gibt es nicht.');
  const eintrag = Number(f.get('eintrag'));
  if (rest === '/stufe') {
    const stufe = Number(f.get('stufe'));
    if (!Number.isInteger(stufe) || stufe < 0 || stufe >= cfg.stufen.length) return fehler(400, 'Anfrage nicht verstanden', 'Diesen Stand gibt es nicht.');
    // Die Löschfrist beginnt mit dem Abschluss. Wer einen schon abgeschlossenen Vorgang noch einmal speichert, verschiebt sie nicht.
    if (stufe === cfg.stufen.length - 1) await db.prepare('UPDATE kunde SET stufe = ?, abgeschlossen_am = COALESCE(abgeschlossen_am, ?) WHERE id = ?').bind(stufe, jetztOrt.slice(0, 10), id).run();
    else await db.prepare('UPDATE kunde SET stufe = ?, abgeschlossen_am = NULL WHERE id = ?').bind(stufe, id).run();
  } else if (rest === '/mitteilung') {
    if (text('text').length < 1 || text('text').length > 1000) return fehler(400, 'Angaben unvollständig', 'Die Mitteilung fehlt oder ist länger als 1.000 Zeichen.');
    await db.prepare('INSERT INTO mitteilung (kunde_id, text, angelegt) VALUES (?, ?, ?)').bind(id, text('text'), jetztOrt).run();
    await ohneKundeWeg(db, id);
  } else if (rest === '/termin') {
    const tag = text('tag'), zeit = text('zeit');
    if (!gueltigerTag(tag) || (zeit && !gueltigeZeit(zeit)) || text('text').length < 1 || text('text').length > 200) return fehler(400, 'Angaben unvollständig', 'Bitte geben Sie einen Tag und eine kurze Beschreibung an.');
    await db.prepare('INSERT INTO termin (kunde_id, start, text) VALUES (?, ?, ?)').bind(id, zeit ? tag + 'T' + zeit : tag, text('text')).run();
    await ohneKundeWeg(db, id);
  } else if (rest === '/datei') {
    const meldung = await hochladen(db, f, id, jetztOrt);
    if (meldung) return kundendetail(db, s, id, jetzt, meldung);
  } else if (rest === '/mitteilung-loeschen' && Number.isInteger(eintrag)) await db.prepare('DELETE FROM mitteilung WHERE id = ? AND kunde_id = ?').bind(eintrag, id).run();
  else if (rest === '/termin-loeschen' && Number.isInteger(eintrag)) await db.prepare('DELETE FROM termin WHERE id = ? AND kunde_id = ?').bind(eintrag, id).run();
  else if (rest === '/datei-loeschen' && Number.isInteger(eintrag)) {
    await db.prepare('DELETE FROM dateiteil WHERE datei_id IN (SELECT id FROM datei WHERE id = ? AND kunde_id = ?)').bind(eintrag, id).run();
    await db.prepare('DELETE FROM datei WHERE id = ? AND kunde_id = ?').bind(eintrag, id).run();
  } else if (rest === '/zugang-neu') {
    const zugang = zufall();
    await db.prepare('UPDATE kunde SET token_hash = ? WHERE id = ?').bind(await sha256(zugang), id).run();
    return zugangsseite(url, kunde, zugang);
  } else if (rest === '/loeschen') {
    if (f.get('sicher') !== 'ja') return fehler(400, 'Nicht gelöscht', 'Bitte bestätigen Sie das Löschen mit dem Haken.');
    await kundeLoeschen(db, id);
    return weiter('/verwaltung');
  } else return fehler(400, 'Anfrage nicht verstanden', 'Bitte laden Sie die Verwaltung neu.');
  return weiter('/verwaltung/kunde/' + id);
}

// ---- Einstieg
export async function behandle(request, env, jetztGeber = () => new Date()) {
  const url = new URL(request.url), pfad = url.pathname, db = env.DB, jetzt = jetztGeber();
  try {
    if (pfad === '/stil.css') return new Response(STIL, { headers: { 'content-type': 'text/css; charset=utf-8', 'cache-control': 'public, max-age=3600', ...KOPF } });
    if (pfad === '/verwaltung' || pfad.startsWith('/verwaltung/')) return await verwaltung(db, request, url, jetzt);
    if (request.method === 'GET') {
      if (pfad === '/') return seite('Kundenportal', '<h1>Kundenportal</h1><p>Ihre persönliche Seite erreichen Sie über den Link, den Sie von uns bekommen haben.</p><p>' + esc(cfg.erreichbar) + '</p>');
      if (pfad === '/impressum' || pfad === '/datenschutz') return rechtsseite(pfad.slice(1));
      const treffer = pfad.match(/^\/k\/([^/]+)(\/.*)?$/);
      if (treffer) return await kundenseite(db, request, treffer[1], treffer[2] || '', jetzt);
    }
    return fehler(404, 'Nicht gefunden', 'Diese Seite gibt es nicht.');
  } catch {
    return fehler(500, 'Etwas ist schiefgegangen', 'Bitte versuchen Sie es in einem Moment noch einmal.');
  }
}

export default {
  fetch: (request, env) => behandle(request, env),
  // Zeitgesteuerter Aufruf des Anbieters (einmal täglich): räumt Abgelaufenes weg.
  scheduled: (ereignis, env) => aufraeumen(env.DB, new Date()),
};
