// Kleine Kundenverwaltung · Grundlage des Baukastens.
// Läuft auf dem eigenen Rechner mit Node.js ab Version 22.13, ohne fremde Abhängigkeiten: eingebauter Webserver, eingebaute SQLite-Datenbank.
// Start: node server.mjs   (Daten in ./daten/crm.db, tägliche Sicherung in ./daten/sicherungen/, Adresse http://127.0.0.1:4310)
// Sprache: Die Oberfläche ist mit Absicht durchgehend deutsch (lang="de"); der Baukasten richtet sich an deutschsprachige Betriebe. Eine Sprachwahl gibt es nicht.
// Was pro Vorhaben angepasst wird, steht in einstellungen.json (Name, Bezeichnungen, Stufen, eigene Felder). Dieser Code bleibt dafür unverändert.
// Sicherheit: Passwörter als scrypt-Hash, Sitzung per HttpOnly-Cookie (SameSite=Strict, zwölf Stunden), jedes Formular mit Sitzungs-Token,
// alle Datenbankzugriffe mit Platzhaltern (Schreiben über .all()/.get(), Einfügen mit RETURNING id), alle eingegebenen und gespeicherten Werte werden vor der Ausgabe maskiert (auch das Sitzungs-Token), Anmeldeversuche gebremst. Lauscht nur auf 127.0.0.1 und nimmt nur Anfragen an diese Adresse an.
import http from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {randomBytes, scryptSync, timingSafeEqual} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url)), PORT = Number(process.env.PORT || 4310);

// ---------- Einstellungen ----------
const ARTEN = ['text', 'lang', 'datum', 'zahl', 'auswahl'];
const roh = JSON.parse(readFileSync(path.join(HIER, 'einstellungen.json'), 'utf8'));
const falsch = grund => { if (process.env.CRM_OHNE_START === '1') throw new Error('einstellungen.json: ' + grund); console.error(`einstellungen.json: ${grund}`); process.exit(1); };
for (const f of roh.felder || []) {
  if (!/^[a-z][a-z0-9_]{0,30}$/.test(f.id || '')) falsch(`Feld-Kennung „${f.id}“ ist ungültig (nur Kleinbuchstaben, Ziffern, Unterstrich).`);
  if (!f.name) falsch(`Feld „${f.id}“ braucht einen Namen.`);
  if (!ARTEN.includes(f.art)) falsch(`Feld „${f.id}“: Art „${f.art}“ gibt es nicht (${ARTEN.join(', ')}).`);
  if (f.art === 'auswahl' && !(Array.isArray(f.auswahl) && f.auswahl.length)) falsch(`Feld „${f.id}“ braucht eine Liste „auswahl“.`);
}
if ((roh.felder || []).length > 12) falsch('Höchstens zwölf eigene Felder.');
if (new Set((roh.felder || []).map(f => f.id)).size !== (roh.felder || []).length) falsch('Zwei Felder haben dieselbe Kennung.');
const E = {
  titel: String(roh.titel || 'Kundenverwaltung').slice(0, 60),
  einzahl: String(roh.einzahl || 'Kontakt').slice(0, 30),
  mehrzahl: String(roh.mehrzahl || 'Kontakte').slice(0, 30),
  stufen: (roh.stufen || []).map(String).filter(Boolean).slice(0, 8),
  felder: (roh.felder || []).map(f => ({id: f.id, name: String(f.name), art: f.art, auswahl: (f.auswahl || []).map(String)})),
};

// ---------- Datenbank ----------
mkdirSync(path.join(HIER, 'daten'), {recursive: true});
const dbPfad = process.env.CRM_DB || path.join(HIER, 'daten/crm.db'), gabEs = existsSync(dbPfad);
const db = new DatabaseSync(dbPfad);
db.prepare('PRAGMA foreign_keys = ON').all();
db.prepare("CREATE TABLE IF NOT EXISTS nutzer (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, salz TEXT NOT NULL, hash TEXT NOT NULL)").all();
db.prepare("CREATE TABLE IF NOT EXISTS kontakt (id INTEGER PRIMARY KEY, name TEXT NOT NULL, firma TEXT DEFAULT '', telefon TEXT DEFAULT '', email TEXT DEFAULT '', stufe TEXT DEFAULT '', mehr TEXT DEFAULT '{}', angelegt TEXT DEFAULT (date('now','localtime')))").all();
db.prepare("CREATE TABLE IF NOT EXISTS notiz (id INTEGER PRIMARY KEY, kontakt_id INTEGER NOT NULL REFERENCES kontakt(id) ON DELETE CASCADE, text TEXT NOT NULL, von TEXT DEFAULT '', am TEXT DEFAULT (date('now','localtime')), faellig TEXT, erledigt INTEGER DEFAULT 0)").all();

// Sicherung: beim ersten Start eines Tages eine Kopie der Datenbank nach daten/sicherungen/, die 14 jüngsten bleiben liegen.
if (gabEs) {
  const ordner = path.join(path.dirname(dbPfad), 'sicherungen'), ziel = path.join(ordner, 'crm-' + new Date().toLocaleDateString('sv-SE') + '.db');
  mkdirSync(ordner, {recursive: true});
  if (!existsSync(ziel)) { db.prepare('VACUUM INTO ?').all(ziel); for (const n of readdirSync(ordner).filter(n => /^crm-\d{4}-\d{2}-\d{2}\.db$/.test(n)).sort().slice(0, -14)) unlinkSync(path.join(ordner, n)); }
}

// ---------- Helfer ----------
const sitzungen = new Map();      // Sitzungsnummer -> {nutzer, token, bis}; nur im Arbeitsspeicher: Ein Neustart meldet alle ab
const fehlversuche = new Map();   // Benutzername -> {n, bis}
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const hash = (pw, salz) => scryptSync(pw, salz, 64).toString('hex');
const datum = d => d ? d.split('-').reverse().join('.') : '';
const heute = () => new Date().toLocaleDateString('sv-SE');
const kurz = s => String(s || '').trim().slice(0, 200);
const mehrVon = k => { try { return JSON.parse(k.mehr || '{}'); } catch { return {}; } };
const css = readFileSync(path.join(HIER, 'style.css'));
const neuerNutzer = (name, pw) => { const salz = randomBytes(16).toString('hex'); db.prepare('INSERT INTO nutzer (name, salz, hash) VALUES (?, ?, ?)').all(name, salz, hash(pw, salz)); };
const passt = (n, pw) => timingSafeEqual(Buffer.from(hash(pw || '', n.salz), 'hex'), Buffer.from(n.hash, 'hex'));

const seite = (titel, inhalt, s) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(titel)} · ${esc(E.titel)}</title><link rel="stylesheet" href="/style.css"></head><body>
<a class="sprung" href="#inhalt">Zum Inhalt</a>
<header class="kopf"><div class="rahmen kopf__innen"><a class="kopf__name" href="/">${esc(E.titel)}</a>${s ? `<nav class="kopf__wege" aria-label="Bereiche"><a href="/">${esc(E.mehrzahl)}</a><a href="/wiedervorlagen">Wiedervorlagen</a><a href="/verwalten">Verwalten</a></nav><form method="post" action="/abmelden"><input type="hidden" name="token" value="${esc(s.token)}"><button class="knopf knopf--zweit" type="submit">Abmelden</button></form>` : ''}</div></header>
<main id="inhalt" class="rahmen">${inhalt}</main></body></html>`;
const feld = (name, label, o = {}) => {
  const a = 'name="' + name + '"' + (o.pflicht ? ' required' : '') + (o.auto ? ' autocomplete="' + o.auto + '"' : '');
  if (o.typ === 'lang') return `<label class="feld"><span>${esc(label)}</span><textarea rows="${o.zeilen || 3}" ${a}>${esc(o.wert || '')}</textarea></label>`;
  if (o.typ === 'auswahl') return `<label class="feld"><span>${esc(label)}</span><select ${a}><option value="">(keine Angabe)</option>${o.auswahl.map(w => `<option${w === o.wert ? ' selected' : ''}>${esc(w)}</option>`).join('')}</select></label>`;
  return `<label class="feld"><span>${esc(label)}</span><input type="${o.typ || 'text'}" ${o.typ === 'zahl' ? 'inputmode="decimal"' : ''} ${a} value="${esc(o.wert || '')}"></label>`;
};
const eigenesFeld = (d, wert) => feld('m_' + d.id, d.name, {wert, typ: {text: 'text', lang: 'lang', datum: 'date', zahl: 'text', auswahl: 'auswahl'}[d.art], auswahl: d.auswahl});
const formular = (k, aktion, tok, abbruch) => { const m = mehrVon(k); return `<form method="post" action="${aktion}" class="stapel">${tok}${feld('name', 'Name', {pflicht: true, wert: k.name})}${feld('firma', 'Firma', {wert: k.firma})}${feld('telefon', 'Telefon', {typ: 'tel', wert: k.telefon})}${feld('email', 'E-Mail', {typ: 'email', wert: k.email})}${E.stufen.length ? feld('stufe', 'Stufe', {typ: 'auswahl', auswahl: E.stufen, wert: k.stufe}) : ''}${E.felder.map(d => eigenesFeld(d, m[d.id])).join('')}<div class="reihe"><button class="knopf" type="submit">Speichern</button><a class="knopf knopf--zweit" href="${abbruch}">Abbrechen</a></div></form>`; };
// Prüft ein eigenes Feld. Gibt den gespeicherten Wert zurück oder '' (leer oder unpassend).
const pruefeWert = (d, roh) => {
  let w = String(roh || '').trim().slice(0, 2000);
  if (d.art === 'datum') { const de = w.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/); if (de) w = de[3] + '-' + de[2].padStart(2, '0') + '-' + de[1].padStart(2, '0'); if (!ISO.test(w)) w = ''; }
  if (d.art === 'zahl' && !/^-?\d+([.,]\d+)?$/.test(w)) w = '';
  if (d.art === 'auswahl' && !d.auswahl.includes(w)) w = '';
  return w;
};
const ausFormular = f => {
  const mehr = {};
  for (const d of E.felder) { const w = pruefeWert(d, f['m_' + d.id]); if (w) mehr[d.id] = w; }
  return {name: kurz(f.name), firma: kurz(f.firma), telefon: kurz(f.telefon), email: kurz(f.email), stufe: E.stufen.includes(f.stufe) ? f.stufe : '', mehr: JSON.stringify(mehr)};
};
const zeige = (d, w) => d.art === 'datum' ? datum(w) : w;

// ---------- Liste einlesen (aus Excel kopiert oder als CSV-Text) ----------
const zerlege = text => {
  const t = text.replace(/\r\n?/g, '\n'), erste = t.split('\n', 1)[0], tr = erste.includes('\t') ? '\t' : erste.includes(';') ? ';' : ',';
  const zeilen = []; let z = [], w = '', inAnf = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inAnf) { if (c === '"') { if (t[i + 1] === '"') { w += '"'; i++; } else inAnf = false; } else w += c; }
    else if (c === '"' && w === '') inAnf = true;
    else if (c === tr) { z.push(w); w = ''; }
    else if (c === '\n') { z.push(w); zeilen.push(z); z = []; w = ''; }
    else w += c;
  }
  if (w !== '' || z.length) { z.push(w); zeilen.push(z); }
  return zeilen.map(r => r.map(x => x.trim())).filter(r => r.some(Boolean));
};
const norm = s => String(s).toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
const SPALTEN = {name: ['name', 'kunde', 'kundin', 'kontakt', 'ansprechpartner', 'ansprechperson'], vorname: ['vorname'], nachname: ['nachname', 'familienname'], firma: ['firma', 'unternehmen', 'betrieb', 'firmenname'], telefon: ['telefon', 'tel', 'telefonnummer', 'mobil', 'handy'], email: ['email', 'mail', 'emailadresse'], stufe: ['stufe', 'status']};
const NAMEN = {name: 'Name', vorname: 'Name (Vorname)', nachname: 'Name (Nachname)', firma: 'Firma', telefon: 'Telefon', email: 'E-Mail', stufe: 'Stufe'};
const deute = text => {
  const zeilen = zerlege(text); if (zeilen.length < 2) return null;
  const kopf = zeilen[0], ziel = kopf.map(h => { const n = norm(h); if (n === norm(E.einzahl)) return 'name'; for (const [k, liste] of Object.entries(SPALTEN)) if (liste.includes(n)) return k; const d = E.felder.find(d => norm(d.name) === n || d.id === n); return d ? 'm_' + d.id : null; });
  const kontakte = []; let ohneName = 0;
  for (const r of zeilen.slice(1)) {
    const k = {name: '', firma: '', telefon: '', email: '', stufe: ''}, mehr = {}, rest = []; let vor = '', nach = '';
    r.forEach((w, i) => {
      if (!w || i >= kopf.length) return; const z = ziel[i];
      if (z === 'vorname') vor = w; else if (z === 'nachname') nach = w;
      else if (z === 'stufe') { if (E.stufen.includes(w)) k.stufe = w; else rest.push(kopf[i] + ': ' + w); }
      else if (z && z.startsWith('m_')) { const d = E.felder.find(d => 'm_' + d.id === z), p = pruefeWert(d, w); if (p) mehr[d.id] = p; else rest.push(kopf[i] + ': ' + w); }
      else if (z) k[z] = kurz(w);
      else rest.push(kopf[i] + ': ' + w);
    });
    if (!k.name) k.name = kurz(`${vor} ${nach}`);
    if (!k.name) { ohneName++; continue; }
    kontakte.push({...k, mehr: JSON.stringify(mehr), rest: rest.join('\n').slice(0, 4000)});
  }
  return {kontakte, ohneName, zugeordnet: kopf.map((h, i) => [h, ziel[i]]).filter(x => x[1]).map(([h, z]) => [h, NAMEN[z] || E.felder.find(d => 'm_' + d.id === z).name]), unbekannt: kopf.filter((h, i) => h && !ziel[i])};
};
const csvZelle = w => { let s = String(w ?? ''); if (/^[=+\-@\t]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };   // Hochkomma: Tabellenprogramme sollen Inhalte nicht als Formel ausführen

// ---------- Anfragen ----------
const lies = async (req, max) => { let b = ''; for await (const c of req) { b += c; if (b.length > max) { req.destroy(); throw new Error('zu groß'); } } return Object.fromEntries(new URLSearchParams(b)); };
const sitzung = req => { const id = (req.headers.cookie || '').match(/(?:^|; )crm=([a-f0-9]{48})/)?.[1], s = sitzungen.get(id); if (s && s.bis < Date.now()) { sitzungen.delete(id); return undefined; } return s; };
const weiter = (res, ziel, cookie) => { res.writeHead(303, {Location: ziel, ...(cookie ? {'Set-Cookie': cookie} : {})}); res.end(); };
const KOPF = {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'self'; frame-ancestors 'none'; form-action 'self'"};
const html = (res, text, status = 200) => { res.writeHead(status, {'Content-Type': 'text/html; charset=utf-8', ...KOPF}); res.end(text); };
const datei = (res, name, art, text) => { res.writeHead(200, {'Content-Type': `${art}; charset=utf-8`, 'Content-Disposition': `attachment; filename="${name}"`, ...KOPF}); res.end(text); };

// Die Behandlung steht als eigene Funktion, nicht als Argument von createServer (so kann der Sicherheitsscan die Datei vollständig lesen).
const behandle = async (req, res) => {
  try {
    if (![`127.0.0.1:${PORT}`, `localhost:${PORT}`].includes(req.headers.host)) { res.writeHead(400); return res.end('Diese Adresse wird nicht bedient.'); }
    const url = new URL(req.url, 'http://x'), weg = url.pathname, post = req.method === 'POST';
    if (weg === '/style.css') { res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'}); return res.end(css); }
    const s = sitzung(req), gibtNutzer = db.prepare('SELECT count(*) AS n FROM nutzer').get().n > 0;
    const f = post ? await lies(req, weg === '/einlesen' ? 2_000_000 : 50_000) : {};

    // Erster Start: Zugang anlegen. Danach: anmelden.
    if (!gibtNutzer) {
      if (post && weg === '/einrichten' && kurz(f.name) && (f.passwort || '').length >= 10) { neuerNutzer(kurz(f.name), f.passwort); return weiter(res, '/anmelden'); }
      return html(res, seite('Einrichten', `<section class="schmal"><h1>Willkommen</h1><p class="gross">Zuerst entsteht der eigene Zugang. Das Passwort braucht mindestens zehn Zeichen.</p>${post ? '<p class="hinweis" role="alert">Bitte einen Benutzernamen und ein Passwort mit mindestens zehn Zeichen eingeben.</p>' : ''}<form method="post" action="/einrichten" class="stapel">${feld('name', 'Benutzername', {pflicht: true, auto: 'username'})}${feld('passwort', 'Passwort', {typ: 'password', pflicht: true, auto: 'new-password'})}<button class="knopf" type="submit">Zugang anlegen</button></form></section>`));
    }
    if (weg === '/anmelden') {
      let hinweis = '';
      if (post) {
        const name = kurz(f.name), v = fehlversuche.get(name);
        if (v && v.n >= 5 && v.bis > Date.now()) hinweis = '<p class="hinweis" role="alert">Zu viele Versuche. Bitte eine Minute warten.</p>';
        else {
          const n = db.prepare('SELECT * FROM nutzer WHERE name = ?').get(name);
          if (n && passt(n, f.passwort)) { fehlversuche.delete(name); const id = randomBytes(24).toString('hex'); sitzungen.set(id, {nutzer: n.name, nutzerId: n.id, token: randomBytes(16).toString('hex'), bis: Date.now() + 12 * 3600_000}); return weiter(res, '/', `crm=${id}; HttpOnly; SameSite=Strict; Path=/`); }
          fehlversuche.set(name, {n: (v && v.bis > Date.now() ? v.n : 0) + 1, bis: Date.now() + 60_000});
          hinweis = '<p class="hinweis" role="alert">Benutzername oder Passwort stimmen nicht.</p>';
        }
      }
      return html(res, seite('Anmelden', `<section class="schmal"><h1>Anmelden</h1>${hinweis}<form method="post" action="/anmelden" class="stapel">${feld('name', 'Benutzername', {pflicht: true, auto: 'username'})}${feld('passwort', 'Passwort', {typ: 'password', pflicht: true, auto: 'current-password'})}<button class="knopf" type="submit">Anmelden</button></form></section>`), post ? 401 : 200);
    }
    if (!s) return weiter(res, '/anmelden');
    if (post && f.token !== s.token) return html(res, seite('Fehler', '<h1>Das hat nicht geklappt</h1><p>Bitte die Seite neu laden und es noch einmal versuchen.</p>', s), 403);
    if (post && weg === '/abmelden') { sitzungen.delete((req.headers.cookie || '').match(/crm=([a-f0-9]{48})/)?.[1]); return weiter(res, '/anmelden', 'crm=; Max-Age=0; Path=/'); }
    const tok = `<input type="hidden" name="token" value="${esc(s.token)}">`;

    // Liste mit Suche und Stufen
    if (weg === '/') {
      const q = (url.searchParams.get('q') || '').trim(), wie = `%${q}%`, stufe = E.stufen.includes(url.searchParams.get('stufe')) ? url.searchParams.get('stufe') : '';
      const liste = db.prepare(`SELECT k.*, (SELECT count(*) FROM notiz n WHERE n.kontakt_id = k.id AND n.faellig IS NOT NULL AND n.erledigt = 0) AS offen FROM kontakt k WHERE (? = '' OR k.name LIKE ? OR k.firma LIKE ? OR k.email LIKE ? OR k.telefon LIKE ? OR k.mehr LIKE ?) AND (? = '' OR k.stufe = ?) ORDER BY k.name COLLATE NOCASE`).all(q, wie, wie, wie, wie, wie, stufe, stufe);
      const filter = E.stufen.length ? `<nav class="filter" aria-label="Nach Stufe zeigen"><a href="/"${stufe ? '' : ' aria-current="true"'}>Alle</a>${E.stufen.map(x => `<a href="/?stufe=${encodeURIComponent(x)}"${x === stufe ? ' aria-current="true"' : ''}>${esc(x)}</a>`).join('')}</nav>` : '';
      return html(res, seite(E.mehrzahl, `<div class="titelzeile"><h1>${esc(E.mehrzahl)}</h1><a class="knopf" href="/neu">${esc(E.einzahl)} anlegen</a></div>
<form class="suche" method="get" action="/" role="search"><label class="nur-vorlesen" for="q">${esc(E.mehrzahl)} durchsuchen</label><input id="q" type="search" name="q" value="${esc(q)}" placeholder="Name, Firma, Telefon oder E-Mail"><button class="knopf knopf--zweit" type="submit">Suchen</button></form>${filter}
${liste.length ? `<ul class="liste" role="list">${liste.map(k => `<li><a href="/kontakt/${k.id}"><span class="liste__name">${esc(k.name)}</span><span class="liste__neben">${esc([k.firma, k.stufe].filter(Boolean).join(' · ') || k.telefon || k.email)}</span>${k.offen ? `<span class="marke">${k.offen} offen</span>` : ''}</a></li>`).join('')}</ul>` : `<p class="leer">${q || stufe ? 'Dazu passt kein Eintrag.' : `Noch nichts eingetragen. Über „${esc(E.einzahl)} anlegen“ entsteht der erste Eintrag; eine vorhandene Liste lässt sich unter „Verwalten“ einlesen.`}</p>`}`, s));
    }
    if (weg === '/neu') {
      if (post) { const k = ausFormular(f); if (k.name) { const r = db.prepare('INSERT INTO kontakt (name, firma, telefon, email, stufe, mehr) VALUES (?, ?, ?, ?, ?, ?) RETURNING id').get(k.name, k.firma, k.telefon, k.email, k.stufe, k.mehr); return weiter(res, `/kontakt/${r.id}`); } }
      return html(res, seite(`${E.einzahl} anlegen`, `<section class="schmal"><h1>${esc(E.einzahl)} anlegen</h1>${formular({}, '/neu', tok, '/')}</section>`, s));
    }
    const m = weg.match(/^\/kontakt\/(\d+)(\/aendern|\/notiz|\/loeschen|\/auskunft|\/erledigt\/(\d+))?$/);
    if (m) {
      const k = db.prepare('SELECT * FROM kontakt WHERE id = ?').get(Number(m[1]));
      if (!k) return html(res, seite('Nicht gefunden', '<h1>Diesen Eintrag gibt es nicht</h1><p><a href="/">Zur Liste</a></p>', s), 404);
      const mehr = mehrVon(k);
      if (m[2] === '/aendern') {
        if (post) { const n = ausFormular(f); if (n.name) { db.prepare('UPDATE kontakt SET name = ?, firma = ?, telefon = ?, email = ?, stufe = ?, mehr = ? WHERE id = ?').all(n.name, n.firma, n.telefon, n.email, n.stufe, n.mehr, k.id); return weiter(res, `/kontakt/${k.id}`); } }
        return html(res, seite(`${k.name} ändern`, `<section class="schmal"><h1>${esc(k.name)} ändern</h1>${formular(k, `/kontakt/${k.id}/aendern`, tok, `/kontakt/${k.id}`)}</section>`, s));
      }
      if (post && m[2] === '/notiz' && f.text?.trim()) { db.prepare('INSERT INTO notiz (kontakt_id, text, von, faellig) VALUES (?, ?, ?, ?)').all(k.id, f.text.trim().slice(0, 4000), s.nutzer, ISO.test(f.faellig || '') ? f.faellig : null); return weiter(res, `/kontakt/${k.id}`); }
      if (post && m[3]) { db.prepare('UPDATE notiz SET erledigt = 1 WHERE id = ? AND kontakt_id = ?').all(Number(m[3]), k.id); return weiter(res, f.zurueck === 'wv' ? '/wiedervorlagen' : `/kontakt/${k.id}`); }
      if (m[2] === '/loeschen') {
        if (post) { db.prepare('DELETE FROM kontakt WHERE id = ?').all(k.id); return weiter(res, '/'); }
        return html(res, seite('Löschen', `<section class="schmal"><h1>${esc(k.name)} löschen?</h1><p class="gross">Der Eintrag und alle Notizen dazu werden endgültig gelöscht. In älteren Sicherungen bleibt er enthalten, bis diese gelöscht werden.</p><form method="post" action="/kontakt/${k.id}/loeschen" class="reihe">${tok}<button class="knopf knopf--gefahr" type="submit">Endgültig löschen</button><a class="knopf knopf--zweit" href="/kontakt/${k.id}">Abbrechen</a></form></section>`, s));
      }
      const notizen = db.prepare('SELECT * FROM notiz WHERE kontakt_id = ? ORDER BY id DESC').all(k.id);
      if (m[2] === '/auskunft') {   // alles, was zu dieser Person gespeichert ist, als Textdatei
        const zeilen = [`Gespeicherte Angaben · ${E.titel} · Stand ${datum(heute())}`, '', `Name: ${k.name}`, `Firma: ${k.firma}`, `Telefon: ${k.telefon}`, `E-Mail: ${k.email}`, ...(E.stufen.length ? [`Stufe: ${k.stufe}`] : []), ...E.felder.map(d => `${d.name}: ${zeige(d, mehr[d.id] || '')}`), `Angelegt am: ${datum(k.angelegt)}`, '', `Notizen (${notizen.length}):`, ...notizen.map(n => `- ${datum(n.am)}${n.von ? ` (${n.von})` : ''}${n.faellig ? `, Wiedervorlage ${datum(n.faellig)}${n.erledigt ? ' (erledigt)' : ''}` : ''}: ${n.text}`)];
        return datei(res, `auskunft-${k.id}.txt`, 'text/plain', zeilen.join('\n') + '\n');
      }
      return html(res, seite(k.name, `<p class="zurueck"><a href="/">Alle ${esc(E.mehrzahl)}</a></p><div class="titelzeile"><div><h1>${esc(k.name)}</h1>${k.firma ? `<p class="gross">${esc(k.firma)}</p>` : ''}</div><a class="knopf knopf--zweit" href="/kontakt/${k.id}/aendern">Ändern</a></div>
<dl class="angaben">${k.telefon ? `<div><dt>Telefon</dt><dd><a href="tel:${esc(k.telefon.replace(/[^+\d]/g, ''))}">${esc(k.telefon)}</a></dd></div>` : ''}${k.email ? `<div><dt>E-Mail</dt><dd><a href="mailto:${esc(k.email)}">${esc(k.email)}</a></dd></div>` : ''}${k.stufe ? `<div><dt>Stufe</dt><dd>${esc(k.stufe)}</dd></div>` : ''}${E.felder.filter(d => mehr[d.id]).map(d => `<div${d.art === 'lang' ? ' class="angaben__breit"' : ''}><dt>${esc(d.name)}</dt><dd>${esc(zeige(d, mehr[d.id]))}</dd></div>`).join('')}<div><dt>Angelegt</dt><dd>${datum(k.angelegt)}</dd></div></dl>
<section class="zweispalt"><div><h2>Notiz schreiben</h2><form method="post" action="/kontakt/${k.id}/notiz" class="stapel">${tok}${feld('text', 'Was war?', {typ: 'lang', pflicht: true})}${feld('faellig', 'Wiedervorlage am (freiwillig)', {typ: 'date'})}<button class="knopf" type="submit">Notiz speichern</button></form></div>
<div><h2>Verlauf</h2>${notizen.length ? `<ol class="verlauf" role="list">${notizen.map(n => `<li class="${n.faellig && !n.erledigt ? 'ist-offen' : ''}"><p class="verlauf__am">${datum(n.am)}${n.von ? ` · ${esc(n.von)}` : ''}${n.faellig ? ` · Wiedervorlage ${datum(n.faellig)}${n.erledigt ? ' (erledigt)' : ''}` : ''}</p><p class="verlauf__text">${esc(n.text)}</p>${n.faellig && !n.erledigt ? `<form method="post" action="/kontakt/${k.id}/erledigt/${n.id}">${tok}<button class="knopf knopf--klein" type="submit">Erledigt</button></form>` : ''}</li>`).join('')}</ol>` : '<p class="leer">Noch keine Notizen.</p>'}</div></section>
<p class="fuss-wege"><a href="/kontakt/${k.id}/auskunft">Alle gespeicherten Angaben als Datei</a><a href="/kontakt/${k.id}/loeschen">Eintrag löschen</a></p>`, s));
    }
    if (weg === '/wiedervorlagen') {
      const offen = db.prepare('SELECT n.*, k.name FROM notiz n JOIN kontakt k ON k.id = n.kontakt_id WHERE n.faellig IS NOT NULL AND n.erledigt = 0 ORDER BY n.faellig').all(), h = heute();
      return html(res, seite('Wiedervorlagen', `<h1>Wiedervorlagen</h1>${offen.length ? `<ol class="verlauf verlauf--breit" role="list">${offen.map(n => `<li class="ist-offen"><p class="verlauf__am">${n.faellig < h ? '<strong>überfällig</strong> · ' : n.faellig === h ? '<strong>heute</strong> · ' : ''}${datum(n.faellig)} · <a href="/kontakt/${n.kontakt_id}">${esc(n.name)}</a></p><p class="verlauf__text">${esc(n.text)}</p><form method="post" action="/kontakt/${n.kontakt_id}/erledigt/${n.id}">${tok}<input type="hidden" name="zurueck" value="wv"><button class="knopf knopf--klein" type="submit">Erledigt</button></form></li>`).join('')}</ol>` : '<p class="leer">Nichts offen. Eine Wiedervorlage entsteht beim Schreiben einer Notiz.</p>'}`, s));
    }

    // Verwalten: Zugänge, Passwort, Liste einlesen, alles herunterladen
    if (weg === '/export.csv') {   // enthält alle gespeicherten Angaben aller Einträge; der Hinweis dazu steht unter „Verwalten“ direkt beim Knopf
      const alle = db.prepare('SELECT * FROM kontakt ORDER BY name COLLATE NOCASE').all(), kopf = ['Name', 'Firma', 'Telefon', 'E-Mail', ...(E.stufen.length ? ['Stufe'] : []), ...E.felder.map(d => d.name), 'Angelegt'];
      const zeilen = alle.map(k => { const mm = mehrVon(k); return [k.name, k.firma, k.telefon, k.email, ...(E.stufen.length ? [k.stufe] : []), ...E.felder.map(d => zeige(d, mm[d.id] || '')), datum(k.angelegt)]; });
      return datei(res, 'kontakte.csv', 'text/csv', '﻿' + [kopf, ...zeilen].map(z => z.map(csvZelle).join(';')).join('\r\n') + '\r\n');
    }
    if (weg === '/einlesen') {
      let inhalt = `<p class="gross">In der Tabelle (zum Beispiel Excel) die Zeilen samt Überschriften markieren, kopieren und hier einfügen. Die erste Zeile muss die Spaltennamen enthalten, eine Spalte den Namen.</p><form method="post" action="/einlesen" class="stapel">${tok}${feld('liste', 'Liste', {typ: 'lang', zeilen: 10, pflicht: true})}<div class="reihe"><button class="knopf" type="submit">Prüfen</button><a class="knopf knopf--zweit" href="/verwalten">Abbrechen</a></div></form>`;
      if (post && f.liste) {
        const d = deute(f.liste);
        if (!d || !d.kontakte.length) inhalt = `<p class="hinweis" role="alert">In der Liste wurde keine Spalte mit Namen gefunden. Die erste Zeile muss Überschriften enthalten, zum Beispiel „Name“, „Firma“, „Telefon“.</p>` + inhalt;
        else if (f.bestaetigt === '1') {
          let neu = 0, doppelt = 0;
          const gibt = db.prepare('SELECT 1 AS da FROM kontakt WHERE name = ? AND firma = ? AND email = ?'), rein = db.prepare('INSERT INTO kontakt (name, firma, telefon, email, stufe, mehr) VALUES (?, ?, ?, ?, ?, ?) RETURNING id'), notiz = db.prepare('INSERT INTO notiz (kontakt_id, text, von) VALUES (?, ?, ?)');
          db.prepare('BEGIN').all();
          try { for (const k of d.kontakte) { if (gibt.get(k.name, k.firma, k.email)) { doppelt++; continue; } const r = rein.get(k.name, k.firma, k.telefon, k.email, k.stufe, k.mehr); if (k.rest) notiz.all(r.id, `Aus der Liste übernommen:\n${k.rest}`, s.nutzer); neu++; } db.prepare('COMMIT').all(); } catch (e) { db.prepare('ROLLBACK').all(); throw e; }
          return html(res, seite('Eingelesen', `<section class="schmal"><h1>Eingelesen</h1><p class="gross">${neu} neu angelegt${doppelt ? `, ${doppelt} schon vorhanden und übersprungen` : ''}${d.ohneName ? `, ${d.ohneName} Zeilen ohne Namen ausgelassen` : ''}.</p><p><a class="knopf" href="/">Zur Liste</a></p></section>`, s));
        } else inhalt = `<p class="gross">${d.kontakte.length} Einträge erkannt${d.ohneName ? `, ${d.ohneName} Zeilen ohne Namen werden ausgelassen` : ''}. Noch ist nichts gespeichert.</p>
<dl class="angaben">${d.zugeordnet.map(([h, z]) => `<div><dt>Spalte „${esc(h)}“</dt><dd>${esc(z)}</dd></div>`).join('')}${d.unbekannt.map(h => `<div><dt>Spalte „${esc(h)}“</dt><dd>als Notiz</dd></div>`).join('')}</dl>
<p>Erster Eintrag: <strong>${esc(d.kontakte[0].name)}</strong>${d.kontakte[0].firma ? `, ${esc(d.kontakte[0].firma)}` : ''}. Wer mit gleichem Namen, gleicher Firma und gleicher E-Mail schon vorhanden ist, wird übersprungen.</p>
<form method="post" action="/einlesen" class="reihe">${tok}<input type="hidden" name="bestaetigt" value="1"><textarea name="liste" hidden>${esc(f.liste)}</textarea><button class="knopf" type="submit">${d.kontakte.length} Einträge übernehmen</button><a class="knopf knopf--zweit" href="/einlesen">Verwerfen</a></form>`;
      }
      return html(res, seite('Liste einlesen', `<section class="mittel stapel"><h1>Liste einlesen</h1>${inhalt}</section>`, s));
    }
    const mv = weg.match(/^\/verwalten(\/zugang|\/passwort|\/zugang\/(\d+)\/entfernen)?$/);
    if (mv) {
      let hinweis = '';
      if (post && mv[1] === '/zugang') { const name = kurz(f.name); if (!name || (f.passwort || '').length < 10) hinweis = 'Der neue Zugang braucht einen Benutzernamen und ein Passwort mit mindestens zehn Zeichen.'; else if (db.prepare('SELECT 1 AS da FROM nutzer WHERE name = ?').get(name)) hinweis = 'Diesen Benutzernamen gibt es schon.'; else { neuerNutzer(name, f.passwort); return weiter(res, '/verwalten'); } }
      if (post && mv[1] === '/passwort') { const ich = db.prepare('SELECT * FROM nutzer WHERE id = ?').get(s.nutzerId); if (!ich || !passt(ich, f.alt)) hinweis = 'Das bisherige Passwort stimmt nicht.'; else if ((f.neu || '').length < 10) hinweis = 'Das neue Passwort braucht mindestens zehn Zeichen.'; else { const salz = randomBytes(16).toString('hex'); db.prepare('UPDATE nutzer SET salz = ?, hash = ? WHERE id = ?').all(salz, hash(f.neu, salz), ich.id); hinweis = 'Das Passwort ist geändert.'; } }
      if (post && mv[2]) { const id = Number(mv[2]); if (id !== s.nutzerId) { const weg2 = db.prepare('SELECT name FROM nutzer WHERE id = ?').get(id); db.prepare('DELETE FROM nutzer WHERE id = ?').all(id); if (weg2) for (const [sid, x] of sitzungen) if (x.nutzerId === id) sitzungen.delete(sid); } return weiter(res, '/verwalten'); }
      const nutzer = db.prepare('SELECT id, name FROM nutzer ORDER BY name COLLATE NOCASE').all(), zahl = db.prepare('SELECT count(*) AS n FROM kontakt').get().n;
      return html(res, seite('Verwalten', `<h1>Verwalten</h1>${hinweis ? `<p class="hinweis" role="alert">${esc(hinweis)}</p>` : ''}
<section class="zweispalt"><div class="stapel"><h2>Zugänge</h2><p>Alle Zugänge dürfen dasselbe: lesen, ändern, löschen.</p><ul class="zugaenge" role="list">${nutzer.map(n => `<li><span>${esc(n.name)}${n.id === s.nutzerId ? ' (angemeldet)' : ''}</span>${n.id === s.nutzerId ? '' : `<form method="post" action="/verwalten/zugang/${n.id}/entfernen">${tok}<button class="knopf knopf--klein" type="submit">Entfernen</button></form>`}</li>`).join('')}</ul>
<form method="post" action="/verwalten/zugang" class="stapel">${tok}${feld('name', 'Neuer Benutzername', {pflicht: true, auto: 'off'})}${feld('passwort', 'Passwort (mindestens zehn Zeichen)', {typ: 'password', pflicht: true, auto: 'new-password'})}<button class="knopf knopf--zweit" type="submit">Zugang anlegen</button></form></div>
<div class="stapel"><h2>Eigenes Passwort</h2><form method="post" action="/verwalten/passwort" class="stapel">${tok}${feld('alt', 'Bisheriges Passwort', {typ: 'password', pflicht: true, auto: 'current-password'})}${feld('neu', 'Neues Passwort', {typ: 'password', pflicht: true, auto: 'new-password'})}<button class="knopf knopf--zweit" type="submit">Passwort ändern</button></form>
<h2>Daten</h2><p>${zahl} ${esc(zahl === 1 ? E.einzahl : E.mehrzahl)} gespeichert.</p><div class="reihe"><a class="knopf knopf--zweit" href="/einlesen">Liste einlesen</a><a class="knopf knopf--zweit" href="/export.csv">Alles als Tabelle herunterladen</a></div><p class="klein">Die Tabelle enthält alle gespeicherten Angaben zu allen Einträgen. Sie gehört so sorgfältig aufbewahrt wie die Kundenverwaltung selbst und nur in Hände, die diese Angaben sehen dürfen.</p></div></section>`, s));
    }
    html(res, seite('Nicht gefunden', '<h1>Diese Seite gibt es nicht</h1><p><a href="/">Zur Liste</a></p>', s), 404);
  } catch (e) { console.error(e); html(res, '<!doctype html><title>Fehler</title><p>Da ist etwas schiefgegangen.</p>', 500); }
};
const meldung = E.titel + ' läuft: http://127.0.0.1:' + PORT;
// Das Prüfskript lädt diese Datei mit CRM_OHNE_START=1 und ruft „behandle“ direkt auf, ohne einen Anschluss zu öffnen.
export {behandle};
if (process.env.CRM_OHNE_START !== '1') {
  const dienst = http.createServer(behandle);
  dienst.on('error', e => { console.error(e.code === 'EADDRINUSE' ? 'Die Kundenverwaltung läuft schon, oder die Adresse ist belegt. Bitte das andere Fenster benutzen oder schließen.' : 'Start nicht möglich: ' + e.message); process.exit(1); });
  dienst.listen(PORT, '127.0.0.1', () => console.log(meldung));
}
