// Online-Terminbuchung · Grundlage. Läuft als Cloudflare Worker mit einer D1-Datenbank (Bindung DB).
// Alles Veränderliche steht in ../einstellungen.json; dieses Programm wird nicht je Betrieb umgeschrieben.
// Sprache: Die Oberfläche ist deutsch (lang="de"). Das ist eine bewusste Festlegung für den Einsatzort: Der Baukasten richtet sich an
// Betriebe in Deutschland, und Impressum und Datenschutzseite folgen deutschen Vorgaben. Der Betreiber entscheidet sich mit dem
// Baukasten für diese Sprache; der Agent sagt es ihm vor dem Einrichten. Eine Sprachwahl für Besucher hat diese Fassung nicht.
import cfg from '../einstellungen.json' with { type: 'json' };
import { STIL } from './stil.mjs';

const WOCHENTAGE = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'];
const TAGNAMEN = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const SITZUNG_STUNDEN = 12;
const GRENZEN = { buchen: { anzahl: 5, minuten: 60 }, anmelden: { anzahl: 8, minuten: 15 } };

const esc = wert => String(wert ?? '').replace(/[&<>"']/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[z]));
const zweistellig = zahl => String(zahl).padStart(2, '0');
const minuten = zeit => { const [h, m] = zeit.split(':').map(Number); return h * 60 + m; };
const uhrzeit = min => zweistellig(Math.floor(min / 60)) + ':' + zweistellig(min % 60);

// ---- Zeit: gerechnet wird in der Ortszeit des Betriebs, als Text „JJJJ-MM-TTTHH:MM“.
function ortszeit(datum) {
  const teile = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: cfg.zeitzone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(datum).map(t => [t.type, t.value]));
  return teile.year + '-' + teile.month + '-' + teile.day + 'T' + teile.hour + ':' + teile.minute;
}
function plusTage(tag, anzahl) { const [j, m, t] = tag.split('-').map(Number); return new Date(Date.UTC(j, m - 1, t + anzahl)).toISOString().slice(0, 10); }
function wochentag(tag) { const [j, m, t] = tag.split('-').map(Number); return new Date(Date.UTC(j, m - 1, t)).getUTCDay(); }
function tagText(tag) { const [j, m, t] = tag.split('-').map(Number); return TAGNAMEN[wochentag(tag)] + ', ' + t + '.' + m + '.' + j; }
const gueltigerTag = tag => /^\d{4}-\d{2}-\d{2}$/.test(tag) && plusTage(tag, 0) === tag;

// Alle Termine eines Tages laut Einstellungen, ohne Rücksicht auf Buchungen.
function termineAm(tag) {
  const liste = [];
  for (const [von, bis] of cfg.zeiten[WOCHENTAGE[wochentag(tag)]] || []) for (let m = minuten(von); m + cfg.termin_minuten <= minuten(bis); m += cfg.termin_minuten) liste.push(tag + 'T' + uhrzeit(m));
  return liste;
}
function buchbar(start, jetztOrt) {
  const tag = start.slice(0, 10), heute = jetztOrt.slice(0, 10);
  if (!gueltigerTag(tag) || !termineAm(tag).includes(start)) return false;
  if (tag > plusTage(heute, cfg.tage_im_voraus)) return false;
  const frueh = new Date(Date.parse(jetztOrt + ':00Z') + cfg.vorlauf_stunden * 3600000).toISOString().slice(0, 16);
  return start >= frueh;
}

// ---- Hilfen für Antworten
const KOPF = {
  'content-security-policy': "default-src 'none'; style-src 'self'; img-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin', 'x-frame-options': 'DENY',
};
function seite(titel, inhalt, { status = 200, privat = false, kopf = {} } = {}) {
  const html = '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + esc(titel) + ' · ' + esc(cfg.name) + '</title><link rel="stylesheet" href="/stil.css"></head><body><header class="kopf"><a class="marke" href="/">' + esc(cfg.name) + '</a></header><main class="inhalt">' + inhalt + '</main><footer class="fuss"><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a></footer></body></html>';
  const zusatz = privat ? { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' } : {};
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', ...KOPF, ...zusatz, ...kopf } });
}
const weiter = (ziel, kopf = {}) => new Response(null, { status: 303, headers: { location: ziel, 'cache-control': 'no-store', ...KOPF, ...kopf } });
const fehler = (status, titel, text) => seite(titel, '<h1>' + esc(titel) + '</h1><p>' + esc(text) + '</p><p><a class="knopf" href="/">Zur Terminauswahl</a></p>', { status, privat: true });

async function sha256(text) { const roh = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return [...new Uint8Array(roh)].map(b => zweistellig(b.toString(16))).join(''); }
function zufall(bytes = 32) { const roh = crypto.getRandomValues(new Uint8Array(bytes)); return btoa(String.fromCharCode(...roh)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function gleich(a, b) { if (a.length !== b.length) return false; let unterschied = 0; for (let i = 0; i < a.length; i++) unterschied |= a.charCodeAt(i) ^ b.charCodeAt(i); return unterschied === 0; }
async function formular(request) { const text = await request.text(); if (text.length > 6000) return null; return new URLSearchParams(text); }
// Kommt die Anfrage von dieser Seite selbst? Browser nennen den Absender im Kopf „Origin“. Manche lassen ihn bei Formularen weg oder
// schicken „null“; dann zählt die Angabe „Sec-Fetch-Site“, die der Browser selbst setzt und die eine fremde Seite nicht fälschen kann.
function eigeneSeite(request, url) {
  const absenderseite = request.headers.get('origin');
  if (absenderseite && absenderseite !== 'null') return absenderseite === url.origin;
  return request.headers.get('sec-fetch-site') === 'same-origin';
}

async function einstellung(db, schluessel) { const zeile = await db.prepare('SELECT v FROM einstellung WHERE k = ?').bind(schluessel).first(); return zeile ? zeile.v : ''; }
// Begrenzung je Absender: gespeichert wird nur ein Hash der Adresse, nach Ablauf wird er gelöscht.
async function gebremst(db, art, request, jetztMs) {
  const grenze = GRENZEN[art], seit = jetztMs - grenze.minuten * 60000;
  const wer = await sha256((await einstellung(db, 'salz')) + '|' + (request.headers.get('cf-connecting-ip') || 'unbekannt'));
  await db.prepare('DELETE FROM versuch WHERE zeit < ?').bind(jetztMs - 86400000).run();
  // Erst eintragen, dann zählen: So können gleichzeitige Anfragen die Grenze nicht gemeinsam unterlaufen.
  await db.prepare('INSERT INTO versuch (art, wer, zeit) VALUES (?, ?, ?)').bind(art, wer, jetztMs).run();
  const bisher = await db.prepare('SELECT COUNT(*) AS n FROM versuch WHERE art = ? AND wer = ? AND zeit >= ?').bind(art, wer, seit).first();
  return Number(bisher.n) > grenze.anzahl;
}

// ---- Öffentlicher Teil
async function freieTermine(db, tag, jetztOrt) {
  if (await db.prepare('SELECT tag FROM sperre WHERE tag = ?').bind(tag).first()) return [];
  const belegt = new Set((await db.prepare('SELECT start FROM buchung WHERE abgesagt = 0 AND start >= ? AND start < ?').bind(tag + 'T00:00', tag + 'T99:99').all()).results.map(z => z.start));
  return termineAm(tag).filter(start => !belegt.has(start) && buchbar(start, jetztOrt));
}
async function startseite(db, url, jetztOrt) {
  const heute = jetztOrt.slice(0, 10), gewaehlt = url.searchParams.get('tag') || '';
  if (gewaehlt && gueltigerTag(gewaehlt)) {
    const frei = await freieTermine(db, gewaehlt, jetztOrt);
    if (!frei.length) return seite('Kein freier Termin', '<h1>' + esc(tagText(gewaehlt)) + '</h1><p>An diesem Tag ist kein Termin mehr frei.</p><p><a class="knopf" href="/">Anderen Tag wählen</a></p>');
    const zeiten = frei.map((start, i) => '<label class="zeit"><input type="radio" name="start" value="' + esc(start) + '" required' + (i === 0 ? ' checked' : '') + '><span>' + esc(start.slice(11)) + ' Uhr</span></label>').join('');
    const leistungen = cfg.leistungen.map(l => '<option>' + esc(l) + '</option>').join('');
    return seite('Termin am ' + tagText(gewaehlt), '<p><a href="/">Anderen Tag wählen</a></p><h1>' + esc(tagText(gewaehlt)) + '</h1><form method="post" action="/buchen" class="formular"><fieldset><legend>Uhrzeit</legend><div class="zeiten">' + zeiten + '</div></fieldset><label>Worum geht es?<select name="leistung">' + leistungen + '</select></label><label>Ihr Name<input name="name" required maxlength="80" autocomplete="name"></label><label>Telefon oder E-Mail<input name="kontakt" required maxlength="120" autocomplete="tel"></label><label>Hinweis für uns (freiwillig)<textarea name="notiz" maxlength="300" rows="3"></textarea></label><div class="falle" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><label class="haken"><input type="checkbox" name="einverstanden" value="ja" required><span>Ich bin einverstanden, dass meine Angaben für diesen Termin gespeichert werden. Näheres steht unter <a href="/datenschutz">Datenschutz</a>.</span></label><button class="knopf" type="submit">Termin buchen</button></form>');
  }
  const tage = [];
  for (let n = 0; n <= cfg.tage_im_voraus && tage.length < 14; n++) { const tag = plusTage(heute, n), frei = await freieTermine(db, tag, jetztOrt); if (frei.length) tage.push('<li><a class="tag" href="/?tag=' + tag + '"><strong>' + esc(tagText(tag)) + '</strong><span>' + frei.length + (frei.length === 1 ? ' freier Termin' : ' freie Termine') + '</span></a></li>'); }
  return seite('Termin buchen', '<h1>Termin buchen</h1><p class="einleitung">' + esc(cfg.einleitung) + '</p>' + (tage.length ? '<ul class="tage" role="list">' + tage.join('') + '</ul>' : '<p>Zurzeit ist kein Termin frei. Bitte versuchen Sie es später noch einmal.</p>'));
}
async function buchen(db, request, url, jetzt) {
  if (!eigeneSeite(request, url)) return fehler(403, 'Anfrage nicht angenommen', 'Bitte benutzen Sie das Formular auf dieser Seite.');
  const f = await formular(request), jetztOrt = ortszeit(jetzt);
  const name = (f?.get('name') || '').trim(), kontakt = (f?.get('kontakt') || '').trim(), notiz = (f?.get('notiz') || '').trim(), start = f?.get('start') || '', leistung = f?.get('leistung') || '';
  const kontaktGut = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(kontakt) || (kontakt.replace(/\D/g, '').length >= 6 && /^[\d\s+()\/-]+$/.test(kontakt));
  if (!f || f.get('website') || f.get('einverstanden') !== 'ja' || name.length < 2 || name.length > 80 || !kontaktGut || kontakt.length > 120 || notiz.length > 300 || !cfg.leistungen.includes(leistung) || !buchbar(start, jetztOrt))
    return fehler(400, 'Buchung nicht möglich', 'Bitte prüfen Sie Ihre Angaben und wählen Sie einen freien Termin.');
  if (await db.prepare('SELECT tag FROM sperre WHERE tag = ?').bind(start.slice(0, 10)).first()) return fehler(400, 'Buchung nicht möglich', 'An diesem Tag ist kein Termin frei.');
  if (await gebremst(db, 'buchen', request, jetzt.getTime())) return fehler(429, 'Zu viele Buchungen', 'Von diesem Anschluss wurden gerade mehrere Termine gebucht. Bitte versuchen Sie es später noch einmal.');
  const token = zufall();
  try { await db.prepare('INSERT INTO buchung (start, leistung, name, kontakt, notiz, token_hash, angelegt) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(start, leistung, name, kontakt, notiz, await sha256(token), jetztOrt).run(); }
  catch { return fehler(409, 'Termin gerade vergeben', 'Dieser Termin wurde in der Zwischenzeit gebucht. Bitte wählen Sie einen anderen.'); }
  return weiter('/termin/' + token);
}
async function terminseite(db, request, url, token, absagen) {
  if (!/^[\w-]{30,60}$/.test(token)) return fehler(404, 'Nicht gefunden', 'Diesen Termin gibt es nicht.');
  const b = await db.prepare('SELECT id, start, leistung, name, abgesagt FROM buchung WHERE token_hash = ?').bind(await sha256(token)).first();
  if (!b) return fehler(404, 'Nicht gefunden', 'Diesen Termin gibt es nicht.');
  if (absagen) {
    if (!eigeneSeite(request, url)) return fehler(403, 'Anfrage nicht angenommen', 'Bitte benutzen Sie die Schaltfläche auf Ihrer Terminseite.');
    await db.prepare('UPDATE buchung SET abgesagt = 1 WHERE id = ?').bind(b.id).run();
    return seite('Termin abgesagt', '<h1>Termin abgesagt</h1><p>Ihr Termin am ' + esc(tagText(b.start.slice(0, 10))) + ' um ' + esc(b.start.slice(11)) + ' Uhr ist abgesagt.</p><p><a class="knopf" href="/">Neuen Termin buchen</a></p>', { privat: true });
  }
  const kopfzeile = b.abgesagt ? '<h1>Dieser Termin ist abgesagt</h1>' : '<h1>Ihr Termin ist gebucht</h1>';
  const absage = b.abgesagt ? '' : '<p>' + esc(cfg.hinweis_nach_buchung) + '</p><p class="merken">Speichern Sie diese Seite als Lesezeichen: Nur über diese Adresse können Sie den Termin ansehen und absagen.</p><form method="post" action="/termin/' + esc(token) + '/absagen"><button class="knopf zweitrangig" type="submit">Termin absagen</button></form>';
  return seite('Ihr Termin', kopfzeile + '<dl class="angaben"><dt>Tag</dt><dd>' + esc(tagText(b.start.slice(0, 10))) + '</dd><dt>Uhrzeit</dt><dd>' + esc(b.start.slice(11)) + ' Uhr</dd><dt>Anliegen</dt><dd>' + esc(b.leistung) + '</dd><dt>Name</dt><dd>' + esc(b.name) + '</dd></dl>' + absage, { privat: true });
}
function rechtsseite(art) {
  const r = cfg.rechtliches || {}, fehlt = wert => (String(wert || '').trim() ? esc(wert) : '<strong>ANGABE FEHLT</strong>');
  const absatz = text => String(text || '').split(/\n+/).filter(Boolean).map(z => '<p>' + esc(z) + '</p>').join('');
  if (art === 'impressum') return seite('Impressum', '<h1>Impressum</h1><p>' + fehlt(r.verantwortlich) + '<br>' + fehlt(r.anschrift) + '</p><p>Telefon: ' + fehlt(r.telefon) + '<br>E-Mail: ' + fehlt(r.email) + '</p>' + absatz(r.weitere_angaben) + '<p class="klein">Dieser Text ist ein Entwurf aus den Angaben des Betriebs und keine Rechtsberatung.</p>');
  return seite('Datenschutz', '<h1>Datenschutz</h1><h2>Wer ist verantwortlich?</h2><p>' + fehlt(r.verantwortlich) + ', ' + fehlt(r.anschrift) + ', ' + fehlt(r.email) + '</p><h2>Welche Angaben speichern wir?</h2><p>Wenn Sie einen Termin buchen, speichern wir den gewählten Termin, Ihr Anliegen, Ihren Namen, Ihre Telefonnummer oder E-Mail-Adresse und Ihren freiwilligen Hinweis. Wir verwenden diese Angaben nur, um den Termin vorzubereiten und Sie dazu zu erreichen.</p><h2>Wie lange?</h2><p>Buchungen werden ' + esc(cfg.aufbewahrung_tage) + ' Tage nach dem Termin gelöscht. Ihren Termin können Sie jederzeit selbst über Ihre Terminseite absagen; die Buchung bleibt dann als abgesagt gespeichert, bis die Frist abläuft. Möchten Sie, dass Ihre Angaben sofort gelöscht werden, schreiben Sie uns: Wir löschen die Buchung dann von Hand in unserer Verwaltung.</p><h2>Schutz vor Missbrauch</h2><p>Um Massenbuchungen zu bremsen, speichern wir für höchstens 24 Stunden einen nicht rückrechenbaren Kurzwert Ihrer Internetadresse. Die Seite setzt für Besucher keine Cookies und bindet keine fremden Inhalte ein.</p><h2>Wo liegen die Daten?</h2><p>Seite und Datenbank laufen bei Cloudflare, Inc. (USA) als technischem Dienstleister; die Datenbank ist auf Rechenzentren in der Europäischen Union festgelegt. Anfragen können über Rechenzentren außerhalb der EU geleitet werden.</p><h2>Ihre Rechte</h2><p>Sie können Auskunft, Berichtigung und Löschung Ihrer Angaben verlangen und sich bei einer Datenschutzaufsichtsbehörde beschweren. Schreiben Sie uns dazu an die oben genannte Adresse.</p><p class="klein">Dieser Text ist ein Entwurf aus den Angaben des Betriebs und keine Rechtsberatung.</p>');
}

// ---- Geschützter Bereich
async function sitzung(db, request, jetztMs) {
  const keks = (request.headers.get('cookie') || '').split(/;\s*/).find(k => k.startsWith('sitzung='));
  if (!keks) return null;
  const zeile = await db.prepare('SELECT hash, marke, bis FROM sitzung WHERE hash = ?').bind(await sha256(keks.slice(8))).first();
  return zeile && Number(zeile.bis) > jetztMs ? zeile : null;
}
const anmeldeseite = (meldung = '', status = 200) => seite('Verwaltung', '<h1>Verwaltung</h1>' + (meldung ? '<p class="meldung">' + esc(meldung) + '</p>' : '') + '<form method="post" action="/verwaltung/anmelden" class="formular"><label>Zugangsschlüssel<input type="password" name="schluessel" required autocomplete="current-password"></label><button class="knopf" type="submit">Anmelden</button></form>', { status, privat: true });
async function anmelden(db, request, url, jetzt) {
  if (!eigeneSeite(request, url)) return fehler(403, 'Anfrage nicht angenommen', 'Bitte benutzen Sie das Formular auf dieser Seite.');
  if (await gebremst(db, 'anmelden', request, jetzt.getTime())) return anmeldeseite('Zu viele Versuche. Bitte warten Sie eine Viertelstunde.', 429);
  const f = await formular(request), soll = await einstellung(db, 'zugang_hash'), ist = await sha256(f?.get('schluessel') || '');
  if (!soll || !gleich(soll, ist)) return anmeldeseite('Der Zugangsschlüssel stimmt nicht.', 401);
  const wert = zufall(), marke = zufall(18), bis = jetzt.getTime() + SITZUNG_STUNDEN * 3600000;
  await db.prepare('DELETE FROM sitzung WHERE bis < ?').bind(jetzt.getTime()).run();
  await db.prepare('INSERT INTO sitzung (hash, marke, bis) VALUES (?, ?, ?)').bind(await sha256(wert), marke, bis).run();
  return weiter('/verwaltung', { 'set-cookie': 'sitzung=' + wert + '; Path=/verwaltung; HttpOnly; Secure; SameSite=Strict; Max-Age=' + SITZUNG_STUNDEN * 3600 });
}
// Löscht, was abgelaufen ist: Buchungen nach der eingestellten Frist, vergangene Sperrtage, alte Anmeldungen und Zähler.
// Läuft beim Öffnen der Verwaltung und einmal täglich zeitgesteuert (siehe wrangler.jsonc), also auch ohne Zutun des Betriebs.
export async function aufraeumen(db, jetzt) {
  const heute = ortszeit(jetzt).slice(0, 10), grenze = plusTage(heute, -cfg.aufbewahrung_tage);
  await db.prepare('DELETE FROM buchung WHERE start < ?').bind(grenze + 'T00:00').run();
  await db.prepare('DELETE FROM sperre WHERE tag < ?').bind(heute).run();
  await db.prepare('DELETE FROM sitzung WHERE bis < ?').bind(jetzt.getTime()).run();
  await db.prepare('DELETE FROM versuch WHERE zeit < ?').bind(jetzt.getTime() - 86400000).run();
}
async function uebersicht(db, s, jetzt) {
  const jetztOrt = ortszeit(jetzt), heute = jetztOrt.slice(0, 10);
  await aufraeumen(db, jetzt);
  const marke = '<input type="hidden" name="marke" value="' + esc(s.marke) + '">';
  const knopf = (ziel, id, text) => '<form method="post" action="/verwaltung/' + ziel + '">' + marke + '<input type="hidden" name="id" value="' + esc(id) + '"><button class="knopf klein" type="submit">' + text + '</button></form>';
  const zeilen = (await db.prepare('SELECT id, start, leistung, name, kontakt, notiz, abgesagt FROM buchung WHERE start >= ? ORDER BY start').bind(heute + 'T00:00').all()).results;
  const eintrag = b => '<li class="buchung' + (b.abgesagt ? ' abgesagt' : '') + '"><div><strong>' + esc(tagText(b.start.slice(0, 10))) + ', ' + esc(b.start.slice(11)) + ' Uhr</strong>' + (b.abgesagt ? ' <span class="marker">abgesagt</span>' : '') + '<br>' + esc(b.name) + ' · ' + esc(b.kontakt) + '<br>' + esc(b.leistung) + (b.notiz ? '<br><em>' + esc(b.notiz) + '</em>' : '') + '</div><div class="aktionen">' + (b.abgesagt ? '' : knopf('absagen', b.id, 'Absagen')) + knopf('loeschen', b.id, 'Löschen') + '</div></li>';
  const liste = zeilen.map(eintrag).join('');
  const frueher = (await db.prepare('SELECT id, start, leistung, name, kontakt, notiz, abgesagt FROM buchung WHERE start < ? ORDER BY start DESC').bind(heute + 'T00:00').all()).results.map(eintrag).join('');
  const sperren = (await db.prepare('SELECT tag FROM sperre ORDER BY tag').all()).results.map(z => '<li>' + esc(tagText(z.tag)) + ' <form method="post" action="/verwaltung/freigeben">' + marke + '<input type="hidden" name="tag" value="' + esc(z.tag) + '"><button class="knopf klein" type="submit">Freigeben</button></form></li>').join('');
  return seite('Verwaltung', '<h1>Kommende Termine</h1>' + (liste ? '<ul class="buchungen" role="list">' + liste + '</ul>' : '<p>Es ist kein Termin gebucht.</p>') + (frueher ? '<h2>Vergangene Termine</h2><p class="klein">Sie bleiben bis zum Ablauf der Löschfrist gespeichert und lassen sich hier einzeln löschen.</p><ul class="buchungen" role="list">' + frueher + '</ul>' : '') + '<h2>Tag sperren</h2><form method="post" action="/verwaltung/sperren" class="zeile">' + marke + '<label>Tag<input type="date" name="tag" required min="' + heute + '"></label><button class="knopf" type="submit">Sperren</button></form>' + (sperren ? '<ul class="sperren" role="list">' + sperren + '</ul>' : '') + '<h2>Daten</h2><p><a class="knopf zweitrangig" href="/verwaltung/tabelle.csv">Alle Buchungen als Tabelle herunterladen</a></p><p class="klein">Die Tabelle enthält Namen und Kontaktangaben. Bewahren Sie sie sicher auf und löschen Sie sie, wenn Sie sie nicht mehr brauchen. Buchungen werden ' + esc(cfg.aufbewahrung_tage) + ' Tage nach dem Termin automatisch gelöscht (einmal täglich und bei jedem Öffnen dieser Seite).</p><form method="post" action="/verwaltung/abmelden">' + marke + '<button class="knopf zweitrangig" type="submit">Abmelden</button></form>', { privat: true });
}
async function tabelle(db) {
  const feld = wert => { let text = String(wert ?? ''); if (/^[=+\-@\t\r]/.test(text)) text = "'" + text; return '"' + text.replace(/"/g, '""') + '"'; };
  const zeilen = (await db.prepare('SELECT start, leistung, name, kontakt, notiz, abgesagt, angelegt FROM buchung ORDER BY start').all()).results;
  const csv = ['Termin;Anliegen;Name;Kontakt;Hinweis;Abgesagt;Gebucht am', ...zeilen.map(b => [b.start.replace('T', ' '), b.leistung, b.name, b.kontakt, b.notiz, b.abgesagt ? 'ja' : 'nein', b.angelegt.replace('T', ' ')].map(feld).join(';'))].join('\r\n');
  return new Response('﻿' + csv, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="termine.csv"', 'cache-control': 'no-store', ...KOPF } });
}
async function verwaltung(db, request, url, jetzt) {
  const pfad = url.pathname, jetztMs = jetzt.getTime();
  if (pfad === '/verwaltung/anmelden' && request.method === 'POST') return anmelden(db, request, url, jetzt);
  const s = await sitzung(db, request, jetztMs);
  if (!s) return pfad === '/verwaltung' ? anmeldeseite() : weiter('/verwaltung');
  if (request.method === 'GET') {
    if (pfad === '/verwaltung') return uebersicht(db, s, jetzt);
    if (pfad === '/verwaltung/tabelle.csv') return tabelle(db);
    return fehler(404, 'Nicht gefunden', 'Diese Seite gibt es nicht.');
  }
  if (request.method !== 'POST') return fehler(405, 'Nicht erlaubt', 'Diese Anfrage wird nicht unterstützt.');
  const f = await formular(request);
  if (!f || !eigeneSeite(request, url) || !gleich(String(f.get('marke') || ''), s.marke)) return fehler(403, 'Anfrage nicht angenommen', 'Bitte laden Sie die Verwaltung neu und versuchen Sie es noch einmal.');
  const id = Number(f.get('id')), tag = String(f.get('tag') || '');
  if (pfad === '/verwaltung/absagen' && Number.isInteger(id)) await db.prepare('UPDATE buchung SET abgesagt = 1 WHERE id = ?').bind(id).run();
  else if (pfad === '/verwaltung/loeschen' && Number.isInteger(id)) await db.prepare('DELETE FROM buchung WHERE id = ?').bind(id).run();
  else if (pfad === '/verwaltung/sperren' && gueltigerTag(tag)) await db.prepare('INSERT OR IGNORE INTO sperre (tag) VALUES (?)').bind(tag).run();
  else if (pfad === '/verwaltung/freigeben' && gueltigerTag(tag)) await db.prepare('DELETE FROM sperre WHERE tag = ?').bind(tag).run();
  else if (pfad === '/verwaltung/abmelden') { await db.prepare('DELETE FROM sitzung WHERE hash = ?').bind(s.hash).run(); return weiter('/verwaltung', { 'set-cookie': 'sitzung=; Path=/verwaltung; HttpOnly; Secure; SameSite=Strict; Max-Age=0' }); }
  else return fehler(400, 'Anfrage nicht verstanden', 'Bitte laden Sie die Verwaltung neu.');
  return weiter('/verwaltung');
}

// ---- Einstieg
export async function behandle(request, env, jetztGeber = () => new Date()) {
  const url = new URL(request.url), pfad = url.pathname, db = env.DB, jetzt = jetztGeber();
  try {
    if (pfad === '/stil.css') return new Response(STIL, { headers: { 'content-type': 'text/css; charset=utf-8', 'cache-control': 'public, max-age=3600', ...KOPF } });
    if (pfad.startsWith('/verwaltung')) return await verwaltung(db, request, url, jetzt);
    if (request.method === 'GET') {
      if (pfad === '/') return await startseite(db, url, ortszeit(jetzt));
      if (pfad === '/impressum' || pfad === '/datenschutz') return rechtsseite(pfad.slice(1));
      const treffer = pfad.match(/^\/termin\/([^/]+)$/);
      if (treffer) return await terminseite(db, request, url, treffer[1], false);
    }
    if (request.method === 'POST') {
      if (pfad === '/buchen') return await buchen(db, request, url, jetzt);
      const treffer = pfad.match(/^\/termin\/([^/]+)\/absagen$/);
      if (treffer) return await terminseite(db, request, url, treffer[1], true);
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
