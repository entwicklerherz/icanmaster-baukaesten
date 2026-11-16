// Prüft das eingerichtete Kundenportal (Ordner kundenportal/) ohne Netz und ohne Anschluss: Das Programm wird direkt aufgerufen.
// Die Prüfung legt dabei Probekunden an, schreibt Mitteilungen und Termine, lädt Probedateien hoch, löscht und meldet sich an und ab.
// All das geschieht ausschließlich in einer Nachbildung der Datenbank im Arbeitsspeicher (d1-nachbildung.mjs), die mit dem Ende der
// Prüfung verschwindet. Die Datenbank beim Anbieter und echte Kunden werden nicht angesprochen; die Prüfung stellt keine Verbindung ins Netz her.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import programm, { behandle, aufraeumen } from '../kundenportal/src/app.mjs';
import { neueUmgebung } from './d1-nachbildung.mjs';

const hier = new URL('../kundenportal/', import.meta.url);
const grundlage = new URL('./grundlage/', import.meta.url);
const cfg = JSON.parse(readFileSync(new URL('einstellungen.json', hier), 'utf8'));
const schema = readFileSync(new URL('schema.sql', hier), 'utf8');
const sha = text => createHash('sha256').update(text).digest('hex');

// Prüfschlüssel: gilt nur in der Wegwerf-Datenbank dieser Prüfung und öffnet keine echte Verwaltung. Der echte Zugangsschlüssel
// des Betriebs wird von dieser Prüfung weder gelesen noch gebraucht.
const SCHLUESSEL = 'pruef-zugang-nur-fuer-diesen-test-0123456789';
const basis = 'https://portal.example';
const ergebnisse = [];
const pruefe = (name, gut, detail = '') => { ergebnisse.push({ name, gut: Boolean(gut), detail }); };
let uhr = new Date('2026-02-02T07:00:00Z');
const jetzt = () => uhr;
const umgebung = () => neueUmgebung(schema, sha(SCHLUESSEL));
const zahl = (env, sql, ...werte) => Number(env.DB.roh.prepare(sql).get(...werte).n);

async function ruf(env, pfad, { form, datei, cookie, origin = basis, ip = '203.0.113.5', browser = '' } = {}) {
  const kopf = { 'cf-connecting-ip': ip };
  if (browser) kopf['sec-fetch-site'] = browser;
  if (cookie) kopf.cookie = cookie;
  let init = { method: 'GET', headers: kopf, redirect: 'manual' };
  if (form && datei) { const f = new FormData(); for (const [k, v] of Object.entries(form)) f.set(k, v); f.set('datei', new File([datei.inhalt], datei.name, { type: datei.typ || 'application/pdf' })); if (origin) kopf.origin = origin; init = { method: 'POST', headers: kopf, body: f, redirect: 'manual' }; }
  else if (form) { kopf['content-type'] = 'application/x-www-form-urlencoded'; if (origin) kopf.origin = origin; init = { method: 'POST', headers: kopf, body: new URLSearchParams(form).toString(), redirect: 'manual' }; }
  const antwort = await behandle(new Request(basis + pfad, init), env, jetzt);
  const art = antwort.headers.get('content-type') || '';
  const roh = new Uint8Array(await antwort.arrayBuffer());
  return { status: antwort.status, kopf: antwort.headers, roh, text: /^text|json/.test(art) ? new TextDecoder().decode(roh) : '' };
}
async function anmelden(env) {
  const an = await ruf(env, '/verwaltung/anmelden', { form: { schluessel: SCHLUESSEL } }), keks = (an.kopf.get('set-cookie') || '').split(';')[0];
  const innen = await ruf(env, '/verwaltung', { cookie: keks });
  return { an, keks, marke: (innen.text.match(/name="marke" value="([\w-]+)"/) || [])[1] || '' };
}
// Legt einen Probekunden an und gibt Nummer und Zugang zurück.
async function neuerKunde(env, s, name, vorgang) {
  const r = await ruf(env, '/verwaltung/neu', { form: { marke: s.marke, name, vorgang, kontakt: '0561 5550199' }, cookie: s.keks });
  return { antwort: r, id: Number((r.text.match(/\/verwaltung\/kunde\/(\d+)/) || [])[1]), zugang: (r.text.match(/\/k\/([\w-]{40,50})/) || [])[1] || '' };
}
const pdf = (bytes, saat = 7) => { const b = new Uint8Array(bytes); for (let i = 5; i < bytes; i++) b[i] = (i * saat) % 251; b.set([0x25, 0x50, 0x44, 0x46, 0x2d]); b.set([0x25, 0x25, 0x45, 0x4f, 0x46, 0x0a], bytes - 6); return b; };
const gleich = (a, b) => a.length === b.length && a.every((wert, i) => wert === b[i]);

// ---- 0. Das Programm ist die geprüfte Grundlage, die Einstellungen sind brauchbar
{
  for (const datei of ['src/app.mjs', 'src/stil.mjs', 'schema.sql']) pruefe(`Datei ${datei} entspricht der mitgelieferten Grundlage`, readFileSync(new URL(datei, hier), 'utf8') === readFileSync(new URL(datei, grundlage), 'utf8'));
  const passt = (wert, min, max) => typeof wert === 'string' && wert.trim().length >= min && wert.length <= max;
  pruefe('Einstellungen nennen den Betrieb und eine Begrüßung', passt(cfg.name, 2, 80) && passt(cfg.begruessung, 10, 300) && passt(cfg.erreichbar, 5, 300));
  pruefe('Einstellungen nennen die Bezeichnungen (eine Person, mehrere, Vorgang)', passt(cfg.wort_kunde, 2, 30) && passt(cfg.wort_kunden, 2, 30) && passt(cfg.wort_vorgang, 2, 30));
  pruefe('Es gibt zwei bis sieben Stufen mit verschiedenen Namen', Array.isArray(cfg.stufen) && cfg.stufen.length >= 2 && cfg.stufen.length <= 7 && cfg.stufen.every(s => passt(s, 2, 40)) && new Set(cfg.stufen).size === cfg.stufen.length, String((cfg.stufen || []).length));
  pruefe('Die Löschfrist nach dem Abschluss liegt zwischen 1 und 730 Tagen', Number.isInteger(cfg.aufbewahrung_tage) && cfg.aufbewahrung_tage >= 1 && cfg.aufbewahrung_tage <= 730, String(cfg.aufbewahrung_tage));
  const r = cfg.rechtliches || {};
  pruefe('Angaben für Impressum und Datenschutz sind vollständig', ['verantwortlich', 'anschrift', 'telefon', 'email'].every(k => String(r[k] || '').trim().length > 3));
}

// ---- 1. Öffentliche Seiten verraten nichts
{
  const env = umgebung(), s = await anmelden(env);
  await neuerKunde(env, s, 'Erika Beispiel', 'Probevorgang Eins');
  const start = await ruf(env, '/');
  pruefe('Startseite antwortet, nennt den Betrieb und zeigt keine Kundendaten', start.status === 200 && start.text.includes(cfg.name) && !start.text.includes('Erika Beispiel'));
  pruefe('Seiten verbieten fremde Skripte (Schutzkopf gesetzt)', /default-src 'none'/.test(start.kopf.get('content-security-policy') || ''));
  for (const seite of ['/impressum', '/datenschutz']) { const r = await ruf(env, seite); pruefe(`Seite ${seite} ist vorhanden und ausgefüllt`, r.status === 200 && !/ANGABE FEHLT/.test(r.text) && r.text.length > 600, r.status + ''); }
  pruefe('Unbekannte Adresse wird mit 404 beantwortet', (await ruf(env, '/gibt-es-nicht')).status === 404);
  pruefe('Kundenseiten lassen sich nicht über eine Nummer aufrufen', (await ruf(env, '/k/1')).status === 404 && (await ruf(env, '/kunde/1')).status === 404);
}

// ---- 2. Verwaltung: Anmeldung und Schutz
{
  const env = umgebung();
  const ohne = await ruf(env, '/verwaltung');
  pruefe('Verwaltung ohne Anmeldung zeigt nur die Anmeldung', ohne.status === 200 && /Zugangsschlüssel/.test(ohne.text));
  pruefe('Falscher Zugangsschlüssel wird abgelehnt', (await ruf(env, '/verwaltung/anmelden', { form: { schluessel: 'falsch-falsch-falsch-falsch-falsch' } })).status === 401);
  const s = await anmelden(env);
  pruefe('Richtiger Zugangsschlüssel meldet an', s.an.status === 303 && /^sitzung=[\w-]{30,}$/.test(s.keks), s.an.status + '');
  pruefe('Anmeldekeks ist nur für den Server lesbar, nur verschlüsselt und nur für diese Seite', /HttpOnly/i.test(s.an.kopf.get('set-cookie')) && /Secure/i.test(s.an.kopf.get('set-cookie')) && /SameSite=Strict/i.test(s.an.kopf.get('set-cookie')));
  const k = await neuerKunde(env, s, 'Erika Beispiel', 'Probevorgang Eins');
  pruefe('Ein Eintrag lässt sich anlegen, und der Zugangslink wird einmal angezeigt', k.antwort.status === 200 && k.id > 0 && k.zugang.length >= 40);
  const hash = env.DB.roh.prepare('SELECT token_hash FROM kunde WHERE id = ?').get(k.id).token_hash;
  pruefe('Der Zugangslink steht nicht im Klartext in der Datenbank', hash.length === 64 && hash !== k.zugang && hash === sha(k.zugang));
  const detail = await ruf(env, '/verwaltung/kunde/' + k.id, { cookie: s.keks });
  pruefe('Die Verwaltung zeigt den Zugangslink später nicht mehr an', detail.status === 200 && !detail.text.includes(k.zugang));
  pruefe('Detailseite ohne Anmeldung ist nicht abrufbar', [302, 303, 401, 403].includes((await ruf(env, '/verwaltung/kunde/' + k.id)).status));
  pruefe('Auskunft ohne Anmeldung ist nicht abrufbar', [302, 303, 401, 403].includes((await ruf(env, '/verwaltung/kunde/' + k.id + '/auskunft.json')).status));
  pruefe('Ändern ohne Formularschutzwert wird abgelehnt', (await ruf(env, '/verwaltung/kunde/' + k.id + '/mitteilung', { form: { text: 'ohne Schutzwert' }, cookie: s.keks })).status === 403);
  pruefe('Ändern von einer fremden Seite aus wird abgelehnt', (await ruf(env, '/verwaltung/kunde/' + k.id + '/mitteilung', { form: { text: 'fremd', marke: s.marke }, cookie: s.keks, origin: 'https://boese.example' })).status === 403);
  pruefe('Löschen über einen bloßen Seitenaufruf ist nicht möglich', (await ruf(env, '/verwaltung/kunde/' + k.id + '/loeschen?sicher=ja', { cookie: s.keks })).status === 404 && zahl(env, 'SELECT COUNT(*) AS n FROM kunde') === 1);
  pruefe('Nach den abgelehnten Versuchen ist keine Mitteilung gespeichert', zahl(env, 'SELECT COUNT(*) AS n FROM mitteilung') === 0);
  const ab = await ruf(env, '/verwaltung/abmelden', { form: { marke: s.marke }, cookie: s.keks });
  pruefe('Nach dem Abmelden gilt der Keks nicht mehr', [200, 303].includes(ab.status) && !(await ruf(env, '/verwaltung', { cookie: s.keks })).text.includes('Erika Beispiel'));
  let gesperrt = false;
  for (let n = 0; n < 14 && !gesperrt; n++) gesperrt = (await ruf(env, '/verwaltung/anmelden', { form: { schluessel: 'raten-raten-raten-raten-raten-' + n }, ip: '203.0.113.77' })).status === 429;
  pruefe('Raten des Zugangsschlüssels wird gebremst', gesperrt);
}

// ---- 3. Kundenseite: Inhalt
{
  const env = umgebung(), s = await anmelden(env);
  const k = await neuerKunde(env, s, 'Erika Beispiel', 'Probevorgang Eins'), pfad = '/verwaltung/kunde/' + k.id, auf = { cookie: s.keks };
  await ruf(env, pfad + '/mitteilung', { form: { marke: s.marke, text: 'Die Probe-Mitteilung Nummer eins.' }, ...auf });
  await ruf(env, pfad + '/termin', { form: { marke: s.marke, tag: '2026-02-10', zeit: '08:30', text: 'Probetermin vor Ort' }, ...auf });
  await ruf(env, pfad + '/termin', { form: { marke: s.marke, tag: '2026-01-10', zeit: '', text: 'Vergangener Probetermin' }, ...auf });
  const stufe = Math.min(1, cfg.stufen.length - 2);
  await ruf(env, pfad + '/stufe', { form: { marke: s.marke, stufe: String(stufe) }, ...auf });
  const seite = await ruf(env, '/k/' + k.zugang);
  pruefe('Die Kundenseite zeigt Namen, Vorgang und Begrüßung', seite.status === 200 && seite.text.includes('Erika Beispiel') && seite.text.includes('Probevorgang Eins') && seite.text.includes(cfg.begruessung.slice(0, 20).replace(/&/g, '&amp;')));
  pruefe('Die Kundenseite zeigt alle Stufen und markiert den aktuellen Stand', cfg.stufen.every(n => seite.text.includes('>' + n.replace(/&/g, '&amp;') + '<')) && new RegExp('aria-current="step"><span>' + cfg.stufen[stufe].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(seite.text));
  pruefe('Die Kundenseite zeigt Mitteilung und kommenden Termin, den vergangenen nicht', seite.text.includes('Probe-Mitteilung Nummer eins') && seite.text.includes('Probetermin vor Ort') && seite.text.includes('08:30') && !seite.text.includes('Vergangener Probetermin'));
  pruefe('Die Kundenseite wird nicht zwischengespeichert und nicht in Suchmaschinen aufgenommen', /no-store/.test(seite.kopf.get('cache-control') || '') && /noindex/.test(seite.kopf.get('x-robots-tag') || '') && /same-origin/.test(seite.kopf.get('referrer-policy') || ''));
  pruefe('Die Kundenseite enthält kein Formular und keinen Weg in die Verwaltung', !/<form/i.test(seite.text) && !/\/verwaltung/.test(seite.text));
  pruefe('Die Kontaktangabe des Betriebs zur Person erscheint nicht auf der Kundenseite', !seite.text.includes('0561 5550199'));
  pruefe('Ein Stand außerhalb der Stufen wird abgelehnt', (await ruf(env, pfad + '/stufe', { form: { marke: s.marke, stufe: String(cfg.stufen.length) }, ...auf })).status === 400);
  const boese = await neuerKunde(env, s, '<img src=x onerror=alert(1)>', '<script>alert(2)</script>');
  await ruf(env, '/verwaltung/kunde/' + boese.id + '/mitteilung', { form: { marke: s.marke, text: '<b onmouseover=alert(3)>Text</b>' }, ...auf });
  const b = await ruf(env, '/k/' + boese.zugang), innen = await ruf(env, '/verwaltung/kunde/' + boese.id, auf);
  pruefe('Eingaben mit Seitenelementen werden nur als Text angezeigt', b.status === 200 && ![b.text, innen.text].some(t => t.includes('<img src=x') || t.includes('<script>alert') || t.includes('<b onmouseover')) && b.text.includes('&lt;img'));
}

// ---- 4. Trennung der Kunden: niemand sieht einen anderen
{
  const env = umgebung(), s = await anmelden(env), auf = { cookie: s.keks };
  const a = await neuerKunde(env, s, 'Anna Erste', 'Vorgang Alpha'), b = await neuerKunde(env, s, 'Bernd Zweiter', 'Vorgang Beta');
  const inhaltA = pdf(30000, 7), inhaltB = pdf(30000, 11);
  await ruf(env, '/verwaltung/kunde/' + a.id + '/mitteilung', { form: { marke: s.marke, text: 'Nur für Alpha bestimmt.' }, ...auf });
  await ruf(env, '/verwaltung/kunde/' + b.id + '/mitteilung', { form: { marke: s.marke, text: 'Nur für Beta bestimmt.' }, ...auf });
  await ruf(env, '/verwaltung/kunde/' + a.id + '/termin', { form: { marke: s.marke, tag: '2026-03-03', zeit: '', text: 'Alpha-Termin' }, ...auf });
  await ruf(env, '/verwaltung/kunde/' + a.id + '/datei', { form: { marke: s.marke }, datei: { inhalt: inhaltA, name: 'alpha.pdf' }, ...auf });
  await ruf(env, '/verwaltung/kunde/' + b.id + '/datei', { form: { marke: s.marke }, datei: { inhalt: inhaltB, name: 'beta.pdf' }, ...auf });
  const idA = env.DB.roh.prepare('SELECT id FROM datei WHERE kunde_id = ?').get(a.id).id, idB = env.DB.roh.prepare('SELECT id FROM datei WHERE kunde_id = ?').get(b.id).id;
  const seiteA = await ruf(env, '/k/' + a.zugang), seiteB = await ruf(env, '/k/' + b.zugang);
  pruefe('Jede Kundenseite zeigt nur die eigenen Mitteilungen, Termine und Unterlagen', seiteA.text.includes('Nur für Alpha') && seiteA.text.includes('alpha.pdf') && !/Beta|Bernd|beta\.pdf/.test(seiteA.text) && seiteB.text.includes('Nur für Beta') && !/Alpha|Anna|alpha\.pdf/.test(seiteB.text));
  const eigene = await ruf(env, '/k/' + a.zugang + '/datei/' + idA);
  pruefe('Die eigene Unterlage lässt sich herunterladen und ist unverändert', eigene.status === 200 && gleich(eigene.roh, inhaltA) && /attachment/.test(eigene.kopf.get('content-disposition') || '') && eigene.kopf.get('content-type') === 'application/pdf');
  const fremde = await ruf(env, '/k/' + a.zugang + '/datei/' + idB);
  pruefe('Die Unterlage eines anderen Kunden lässt sich mit dem eigenen Zugang nicht abrufen', fremde.status === 404 && !gleich(fremde.roh, inhaltB), fremde.status + '');
  pruefe('Unterlagen lassen sich nicht ohne Zugang über ihre Nummer abrufen', (await ruf(env, '/datei/' + idA)).status === 404 && (await ruf(env, '/k/datei/' + idA)).status === 404);
  pruefe('Ein geratener Zugang zeigt nichts', (await ruf(env, '/k/' + 'x'.repeat(43))).status === 404 && (await ruf(env, '/k/' + a.zugang.slice(0, 42) + (a.zugang.endsWith('A') ? 'B' : 'A'))).status === 404);
  pruefe('Ein gekürzter Zugang zeigt nichts', (await ruf(env, '/k/' + a.zugang.slice(0, 20))).status === 404);
  // In der Verwaltung: Einträge lassen sich nur über den Kunden löschen, zu dem sie gehören.
  const mitteilungB = env.DB.roh.prepare('SELECT id FROM mitteilung WHERE kunde_id = ?').get(b.id).id;
  await ruf(env, '/verwaltung/kunde/' + a.id + '/mitteilung-loeschen', { form: { marke: s.marke, eintrag: String(mitteilungB) }, ...auf });
  await ruf(env, '/verwaltung/kunde/' + a.id + '/datei-loeschen', { form: { marke: s.marke, eintrag: String(idB) }, ...auf });
  pruefe('Über die Seite eines Kunden lässt sich nichts von einem anderen löschen', zahl(env, 'SELECT COUNT(*) AS n FROM mitteilung WHERE kunde_id = ?', b.id) === 1 && zahl(env, 'SELECT COUNT(*) AS n FROM datei WHERE kunde_id = ?', b.id) === 1 && zahl(env, 'SELECT COUNT(*) AS n FROM dateiteil WHERE datei_id = ?', idB) >= 1);
  pruefe('In der Verwaltung führt die Unterlage eines anderen Kunden unter falscher Nummer ins Leere', (await ruf(env, '/verwaltung/kunde/' + a.id + '/datei/' + idB, auf)).status === 404);
  // Neuer Zugangslink: der alte gilt nicht mehr.
  const neu = await ruf(env, '/verwaltung/kunde/' + a.id + '/zugang-neu', { form: { marke: s.marke }, ...auf }), zugangNeu = (neu.text.match(/\/k\/([\w-]{40,50})/) || [])[1] || '';
  pruefe('Nach einem neuen Zugangslink gilt der alte nicht mehr, der neue schon', zugangNeu.length >= 40 && zugangNeu !== a.zugang && (await ruf(env, '/k/' + a.zugang)).status === 404 && (await ruf(env, '/k/' + zugangNeu)).status === 200);
  let gebremst = false;
  for (let n = 0; n < 30 && !gebremst; n++) gebremst = (await ruf(env, '/k/' + 'y'.repeat(42) + String.fromCharCode(97 + (n % 26)), { ip: '203.0.113.88' })).status === 429;
  pruefe('Das Durchprobieren von Zugangslinks wird gebremst', gebremst);
  pruefe('Ein richtiger Zugang von einem anderen Anschluss bleibt dabei erreichbar', (await ruf(env, '/k/' + b.zugang, { ip: '203.0.113.99' })).status === 200);
}

// ---- 5. Unterlagen
{
  const env = umgebung(), s = await anmelden(env), auf = { cookie: s.keks };
  const k = await neuerKunde(env, s, 'Erika Beispiel', 'Probevorgang Eins'), pfad = '/verwaltung/kunde/' + k.id;
  const gross = pdf(2600000, 13);
  const hoch = await ruf(env, pfad + '/datei', { form: { marke: s.marke }, datei: { inhalt: gross, name: 'Angebot <Bad> "eins".pdf' }, ...auf });
  const d = env.DB.roh.prepare('SELECT id, name, groesse FROM datei WHERE kunde_id = ?').get(k.id);
  pruefe('Eine größere Datei wird in Stücken gespeichert', hoch.status === 303 && d && Number(d.groesse) === gross.length && zahl(env, 'SELECT COUNT(*) AS n FROM dateiteil WHERE datei_id = ?', d.id) === 3);
  pruefe('Der Dateiname wird von Sonderzeichen befreit', d && !/[<>"\/\\]/.test(d.name) && d.name.endsWith('.pdf'), d ? d.name : '');
  pruefe('Die größere Datei kommt unverändert zurück', gleich((await ruf(env, '/k/' + k.zugang + '/datei/' + d.id)).roh, gross));
  const html = new TextEncoder().encode('<html><script>alert(1)</script></html>');
  await ruf(env, pfad + '/datei', { form: { marke: s.marke }, datei: { inhalt: html, name: 'harmlos.pdf', typ: 'application/pdf' }, ...auf });
  pruefe('Eine Datei, die nur so heißt wie ein PDF, wird abgelehnt', zahl(env, 'SELECT COUNT(*) AS n FROM datei WHERE kunde_id = ?', k.id) === 1);
  await ruf(env, pfad + '/datei', { form: { marke: s.marke }, datei: { inhalt: pdf(4300000), name: 'zu-gross.pdf' }, ...auf });
  pruefe('Eine Datei über 4 MB wird abgelehnt', zahl(env, 'SELECT COUNT(*) AS n FROM datei WHERE kunde_id = ?', k.id) === 1);
  pruefe('Hochladen ohne Formularschutzwert wird abgelehnt', (await ruf(env, pfad + '/datei', { form: { marke: 'falsch' }, datei: { inhalt: pdf(2000), name: 'x.pdf' }, ...auf })).status === 403 && zahl(env, 'SELECT COUNT(*) AS n FROM datei WHERE kunde_id = ?', k.id) === 1);
  await ruf(env, pfad + '/datei-loeschen', { form: { marke: s.marke, eintrag: String(d.id) }, ...auf });
  pruefe('Eine Unterlage lässt sich vollständig löschen', zahl(env, 'SELECT COUNT(*) AS n FROM datei') === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM dateiteil') === 0 && (await ruf(env, '/k/' + k.zugang + '/datei/' + d.id)).status === 404);
}

// ---- 6. Auskunft, Löschen, Löschfrist
{
  const env = umgebung(), s = await anmelden(env), auf = { cookie: s.keks };
  const k = await neuerKunde(env, s, 'Erika Beispiel', 'Probevorgang Eins'), bleibt = await neuerKunde(env, s, 'Bernd Zweiter', 'Vorgang Beta'), pfad = '/verwaltung/kunde/' + k.id;
  await ruf(env, pfad + '/mitteilung', { form: { marke: s.marke, text: 'Mitteilung für die Auskunft.' }, ...auf });
  await ruf(env, pfad + '/datei', { form: { marke: s.marke }, datei: { inhalt: pdf(5000), name: 'auskunft.pdf' }, ...auf });
  const auskunft = await ruf(env, pfad + '/auskunft.json', auf);
  pruefe('Die Auskunft enthält alles Gespeicherte zur Person und nichts von anderen', auskunft.status === 200 && auskunft.text.includes('Erika Beispiel') && auskunft.text.includes('Mitteilung für die Auskunft') && auskunft.text.includes('auskunft.pdf') && !auskunft.text.includes('Bernd'));
  pruefe('Löschen ohne Bestätigung wird abgelehnt', (await ruf(env, pfad + '/loeschen', { form: { marke: s.marke }, ...auf })).status === 400 && zahl(env, 'SELECT COUNT(*) AS n FROM kunde') === 2);
  await ruf(env, pfad + '/loeschen', { form: { marke: s.marke, sicher: 'ja' }, ...auf });
  pruefe('Eine Person lässt sich mit allem endgültig löschen', zahl(env, 'SELECT COUNT(*) AS n FROM kunde WHERE id = ?', k.id) === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM mitteilung') === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM datei') === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM dateiteil') === 0);
  pruefe('Der Zugangslink einer gelöschten Person zeigt nichts mehr', (await ruf(env, '/k/' + k.zugang)).status === 404 && (await ruf(env, '/k/' + bleibt.zugang)).status === 200);
  // Löschfrist: Der letzte Stand schließt ab, danach läuft die Frist.
  const letzte = String(cfg.stufen.length - 1);
  await ruf(env, '/verwaltung/kunde/' + bleibt.id + '/datei', { form: { marke: s.marke }, datei: { inhalt: pdf(5000), name: 'frist.pdf' }, ...auf });
  await ruf(env, '/verwaltung/kunde/' + bleibt.id + '/stufe', { form: { marke: s.marke, stufe: letzte }, ...auf });
  const offen = await neuerKunde(env, s, 'Clara Dritte', 'Vorgang Gamma');
  await aufraeumen(env.DB, new Date(uhr.getTime() + (cfg.aufbewahrung_tage - 1) * 86400000));
  pruefe('Vor Ablauf der Frist wird nichts gelöscht', zahl(env, 'SELECT COUNT(*) AS n FROM kunde') === 2);
  await aufraeumen(env.DB, new Date(uhr.getTime() + (cfg.aufbewahrung_tage + 2) * 86400000));
  pruefe('Abgeschlossene Vorgänge werden nach der Frist mit ihren Unterlagen gelöscht, auch ohne geöffnete Verwaltung', zahl(env, 'SELECT COUNT(*) AS n FROM kunde WHERE id = ?', bleibt.id) === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM dateiteil') === 0);
  pruefe('Offene Vorgänge bleiben über die Frist hinaus erhalten', zahl(env, 'SELECT COUNT(*) AS n FROM kunde WHERE id = ?', offen.id) === 1);
  await ruf(env, '/verwaltung/kunde/' + offen.id + '/stufe', { form: { marke: s.marke, stufe: letzte }, ...auf });
  await ruf(env, '/verwaltung/kunde/' + offen.id + '/stufe', { form: { marke: s.marke, stufe: '0' }, ...auf });
  pruefe('Wird ein Vorgang wieder geöffnet, läuft keine Löschfrist mehr', env.DB.roh.prepare('SELECT abgeschlossen_am FROM kunde WHERE id = ?').get(offen.id).abgeschlossen_am === null);
  uhr = new Date(uhr.getTime() + 2 * 86400000);
  pruefe('Eine alte Anmeldung gilt nach Ablauf nicht mehr', /Zugangsschlüssel/.test((await ruf(env, '/verwaltung', auf)).text));
  uhr = new Date('2026-02-02T07:00:00Z');
  pruefe('Das Programm bietet den zeitgesteuerten Aufruf an', typeof programm.scheduled === 'function' && typeof programm.fetch === 'function');
}

// Eine Umgebung, in der die Antwort auf das Zählen der Versuche kurz auf sich warten lässt. So haben alle gleichzeitigen Anfragen
// den alten Stand gelesen, bevor die erste weitermacht, wie es im echten Betrieb vorkommen kann.
// Die Atempause lässt die anderen Anfragen aufholen: einige belanglose Rechenschritte, die das Programm nicht berühren.
async function atempause() { for (let n = 0; n < 40; n++) await crypto.subtle.digest('SHA-256', new Uint8Array(8)); }
const traegeUmgebung = () => neueUmgebung(schema, sha(SCHLUESSEL), atempause);

// ---- 8. Formulare aus echten Browsern und gleichzeitige Anfragen
{
  // Manche Browser schicken bei Formularen den Absender „null“ und dazu die Angabe, dass die Anfrage von derselben Seite kommt.
  const env = umgebung(), falsch = { schluessel: 'falsch-falsch-falsch-falsch-falsch' };
  pruefe('Ein Formular von der eigenen Seite wird auch angenommen, wenn der Browser den Absender „null“ nennt', (await ruf(env, '/verwaltung/anmelden', { form: falsch, origin: 'null', browser: 'same-origin' })).status === 401);
  pruefe('Ein Formular ohne Absender wird angenommen, wenn der Browser „von derselben Seite“ meldet', (await ruf(env, '/verwaltung/anmelden', { form: falsch, origin: '', browser: 'same-origin' })).status === 401);
  pruefe('Absender „null“ von einer fremden Seite wird abgelehnt', (await ruf(env, '/verwaltung/anmelden', { form: { schluessel: SCHLUESSEL }, origin: 'null', browser: 'cross-site' })).status === 403);
  pruefe('Ein Formular ganz ohne Absenderangaben wird abgelehnt', (await ruf(env, '/verwaltung/anmelden', { form: { schluessel: SCHLUESSEL }, origin: '' })).status === 403);
  pruefe('Ein fremder Absender wird abgelehnt, auch wenn „von derselben Seite“ behauptet wird', (await ruf(env, '/verwaltung/anmelden', { form: { schluessel: SCHLUESSEL }, origin: 'https://boese.example', browser: 'same-origin' })).status === 403);
  pruefe('Seiten geben ihre Adresse nicht an fremde Seiten weiter', (await ruf(env, '/')).kopf.get('referrer-policy') === 'same-origin');
  // Zwölf falsche Anmeldungen zur selben Zeit: Die Begrenzung muss trotzdem greifen.
  const env2 = traegeUmgebung();
  const zugleich = await Promise.all(Array.from({ length: 12 }, (_, n) => ruf(env2, '/verwaltung/anmelden', { form: { schluessel: 'gleichzeitig-raten-raten-raten-' + n }, ip: '203.0.113.66' })));
  pruefe('Gleichzeitige Anmeldeversuche unterlaufen die Begrenzung nicht', zugleich.filter(a => a.status === 401).length <= 8 && zugleich.filter(a => a.status === 429).length >= 4, zugleich.map(a => a.status).join(' '));
  const env3 = traegeUmgebung();
  const raten = await Promise.all(Array.from({ length: 30 }, (_, n) => ruf(env3, '/k/' + 'z'.repeat(41) + String(n).padStart(2, '0'), { ip: '203.0.113.68' })));
  pruefe('Gleichzeitiges Durchprobieren von Zugangslinks unterläuft die Begrenzung nicht', raten.filter(a => a.status === 404).length <= 20 && raten.filter(a => a.status === 429).length >= 10, raten.filter(a => a.status === 404).length + ' ohne Bremse');
  const s3 = await anmelden(env3), k3 = await neuerKunde(env3, s3, 'Erika Beispiel', 'Probevorgang Eins');
  pruefe('Wer beim Durchprobieren gebremst ist, kommt auch mit einem richtigen Zugang nicht hinein', (await ruf(env3, '/k/' + k3.zugang, { ip: '203.0.113.68' })).status === 429 && (await ruf(env3, '/k/' + k3.zugang, { ip: '203.0.113.69' })).status === 200);
}

// ---- 9. Löschen hält, was es verspricht
{
  const env = umgebung(), s = await anmelden(env), auf = { cookie: s.keks }, letzte = String(cfg.stufen.length - 1);
  // Mehr als fünf Vorgänge werden am selben Tag fällig: Ein einziger Aufräumlauf muss alle löschen.
  for (let n = 1; n <= 7; n++) { const k = await neuerKunde(env, s, 'Fällig Nummer ' + n, 'Vorgang ' + n); await ruf(env, '/verwaltung/kunde/' + k.id + '/datei', { form: { marke: s.marke }, datei: { inhalt: pdf(3000), name: 'f.pdf' }, ...auf }); await ruf(env, '/verwaltung/kunde/' + k.id + '/stufe', { form: { marke: s.marke, stufe: letzte }, ...auf }); }
  await aufraeumen(env.DB, new Date(uhr.getTime() + (cfg.aufbewahrung_tage + 2) * 86400000));
  pruefe('Ein Aufräumlauf löscht alle fälligen Vorgänge, auch wenn es viele sind', zahl(env, 'SELECT COUNT(*) AS n FROM kunde') === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM datei') === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM dateiteil') === 0, zahl(env, 'SELECT COUNT(*) AS n FROM kunde') + ' übrig');
  // Wer einen abgeschlossenen Vorgang noch einmal speichert, verschiebt die Löschfrist nicht.
  const sb = await anmelden(env), k = await neuerKunde(env, sb, 'Erika Beispiel', 'Probevorgang Eins');
  await ruf(env, '/verwaltung/kunde/' + k.id + '/stufe', { form: { marke: sb.marke, stufe: letzte }, cookie: sb.keks });
  const erstes = env.DB.roh.prepare('SELECT abgeschlossen_am FROM kunde WHERE id = ?').get(k.id).abgeschlossen_am;
  uhr = new Date('2026-02-20T07:00:00Z');
  const s2 = await anmelden(env);
  await ruf(env, '/verwaltung/kunde/' + k.id + '/stufe', { form: { marke: s2.marke, stufe: letzte }, cookie: s2.keks });
  pruefe('Erneutes Speichern eines abgeschlossenen Vorgangs verschiebt die Löschfrist nicht', erstes === '2026-02-02' && env.DB.roh.prepare('SELECT abgeschlossen_am FROM kunde WHERE id = ?').get(k.id).abgeschlossen_am === erstes);
  uhr = new Date('2026-02-02T07:00:00Z');
  // Der Grenztag: genau am Tag, an dem die Frist abläuft, wird gelöscht, am Tag davor noch nicht.
  const envG = umgebung(), sg = await anmelden(envG), kg = await neuerKunde(envG, sg, 'Grenztag Person', 'Vorgang');
  await ruf(envG, '/verwaltung/kunde/' + kg.id + '/stufe', { form: { marke: sg.marke, stufe: letzte }, cookie: sg.keks });
  await aufraeumen(envG.DB, new Date(uhr.getTime() + (cfg.aufbewahrung_tage - 1) * 86400000));
  const amVortag = zahl(envG, 'SELECT COUNT(*) AS n FROM kunde');
  await aufraeumen(envG.DB, new Date(uhr.getTime() + cfg.aufbewahrung_tage * 86400000));
  pruefe('Genau am Tag, an dem die Frist abläuft, wird gelöscht, am Tag davor noch nicht', amVortag === 1 && zahl(envG, 'SELECT COUNT(*) AS n FROM kunde') === 0, amVortag + ' am Vortag, ' + zahl(envG, 'SELECT COUNT(*) AS n FROM kunde') + ' am Grenztag');
  // Mitteilung speichern und Person löschen überschneiden sich: Es darf keine Mitteilung übrig bleiben.
  const envM = neueUmgebung(schema, sha(SCHLUESSEL), null, atempause), sm = await anmelden(envM), km = await neuerKunde(envM, sm, 'Zeitgleich Gelöscht', 'Vorgang');
  await Promise.all([ruf(envM, '/verwaltung/kunde/' + km.id + '/mitteilung', { form: { marke: sm.marke, text: 'kommt zu spät' }, cookie: sm.keks }), ruf(envM, '/verwaltung/kunde/' + km.id + '/termin', { form: { marke: sm.marke, tag: '2026-03-03', zeit: '', text: 'kommt zu spät' }, cookie: sm.keks }), ruf(envM, '/verwaltung/kunde/' + km.id + '/loeschen', { form: { marke: sm.marke, sicher: 'ja' }, cookie: sm.keks })]);
  pruefe('Überschneiden sich das Speichern einer Mitteilung oder eines Termins und das Löschen der Person, bleibt nichts zurück', zahl(envM, 'SELECT COUNT(*) AS n FROM kunde') === 0 && zahl(envM, 'SELECT COUNT(*) AS n FROM mitteilung') === 0 && zahl(envM, 'SELECT COUNT(*) AS n FROM termin') === 0, zahl(envM, 'SELECT COUNT(*) AS n FROM mitteilung') + ' Mitteilungen, ' + zahl(envM, 'SELECT COUNT(*) AS n FROM termin') + ' Termine übrig');
  // Verwaiste Einträge (wie nach einem Hochladen, das sich mit dem Löschen überschnitten hat) räumt der Aufräumlauf weg.
  env.DB.roh.prepare("INSERT INTO datei (kunde_id, name, typ, groesse, angelegt) VALUES (9999, 'verwaist.pdf', 'application/pdf', 3, '2026-02-02T08:00')").all();
  const waise = env.DB.roh.prepare("SELECT id FROM datei WHERE kunde_id = 9999").get().id;
  env.DB.roh.prepare('INSERT INTO dateiteil (datei_id, nr, daten) VALUES (?, 0, ?)').all(waise, new Uint8Array([1, 2, 3]));
  env.DB.roh.prepare("INSERT INTO mitteilung (kunde_id, text, angelegt) VALUES (9999, 'verwaist', '2026-02-02T08:00')").all();
  await aufraeumen(env.DB, uhr);
  pruefe('Einträge ohne zugehörigen Kunden räumt der Aufräumlauf weg', zahl(env, 'SELECT COUNT(*) AS n FROM datei WHERE kunde_id = 9999') === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM dateiteil WHERE datei_id = ?', waise) === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM mitteilung WHERE kunde_id = 9999') === 0 && zahl(env, 'SELECT COUNT(*) AS n FROM kunde WHERE id = ?', k.id) === 1);
  // Hochladen und Löschen derselben Person überschneiden sich: Es darf keine Unterlage übrig bleiben.
  const env2 = neueUmgebung(schema, sha(SCHLUESSEL), null, atempause), sx = await anmelden(env2), kx = await neuerKunde(env2, sx, 'Zeitgleich Gelöscht', 'Vorgang');
  const beide = await Promise.all([ruf(env2, '/verwaltung/kunde/' + kx.id + '/datei', { form: { marke: sx.marke }, datei: { inhalt: pdf(2200000), name: 'spaet.pdf' }, cookie: sx.keks }), ruf(env2, '/verwaltung/kunde/' + kx.id + '/loeschen', { form: { marke: sx.marke, sicher: 'ja' }, cookie: sx.keks })]);
  pruefe('Überschneiden sich Hochladen und Löschen einer Person, bleibt keine Unterlage zurück', zahl(env2, 'SELECT COUNT(*) AS n FROM kunde') === 0 && zahl(env2, 'SELECT COUNT(*) AS n FROM datei') === 0 && zahl(env2, 'SELECT COUNT(*) AS n FROM dateiteil') === 0, beide.map(a => a.status).join(' ') + ', Dateien übrig: ' + zahl(env2, 'SELECT COUNT(*) AS n FROM datei'));
  // Dateien, die nur am Anfang wie ein PDF oder Bild aussehen, werden abgelehnt.
  const env3 = umgebung(), s3 = await anmelden(env3), k3 = await neuerKunde(env3, s3, 'Erika Beispiel', 'Probevorgang Eins'), nur = anfang => { const b = new TextEncoder().encode('xxxxxxxx nur Text, kein Dokument'); b.set(anfang); return b; };
  for (const [name, anfang] of [['a.pdf', [0x25, 0x50, 0x44, 0x46, 0x2d]], ['a.png', [0x89, 0x50, 0x4e, 0x47]], ['a.jpg', [0xff, 0xd8, 0xff]]]) await ruf(env3, '/verwaltung/kunde/' + k3.id + '/datei', { form: { marke: s3.marke }, datei: { inhalt: nur(anfang), name }, cookie: s3.keks });
  pruefe('Text mit bloß vorangestellter PDF-, PNG- oder JPG-Kennung wird abgelehnt', zahl(env3, 'SELECT COUNT(*) AS n FROM datei') === 0, zahl(env3, 'SELECT COUNT(*) AS n FROM datei') + ' angenommen');
}

console.log('Hinweis: Geprüft wurde mit Probekunden, Probedateien und einem eigenen Prüfschlüssel in einer Wegwerf-Datenbank im Arbeitsspeicher. Echte Kunden, echte Unterlagen und der echte Zugangsschlüssel wurden nicht berührt.');
const schlecht = ergebnisse.filter(e => !e.gut);
for (const e of ergebnisse) console.log((e.gut ? 'ok      ' : 'FEHLER  ') + e.name + (e.gut || !e.detail ? '' : ' (' + e.detail + ')'));
console.log(schlecht.length ? `\nNICHT BESTANDEN: ${schlecht.length} von ${ergebnisse.length} Prüfungen` : `\nBESTANDEN: ${ergebnisse.length} Prüfungen`);
process.exitCode = schlecht.length ? 1 : 0;
