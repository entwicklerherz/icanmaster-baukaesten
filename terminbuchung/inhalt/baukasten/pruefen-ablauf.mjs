// Prüft die eingerichtete Terminbuchung (Ordner terminbuchung/) ohne Netz und ohne Anschluss: Das Programm wird direkt aufgerufen.
// Die Prüfung legt dabei Probebuchungen an, sagt sie ab, sperrt Tage, löscht und meldet sich an und ab. All das geschieht
// ausschließlich in einer Nachbildung der Datenbank im Arbeitsspeicher (d1-nachbildung.mjs), die mit dem Ende der Prüfung verschwindet.
// Die Datenbank beim Anbieter und echte Buchungen werden nicht angesprochen; die Prüfung stellt keine Verbindung ins Netz her.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import programm, { behandle, aufraeumen } from '../terminbuchung/src/app.mjs';
import { neueUmgebung } from './d1-nachbildung.mjs';

const hier = new URL('../terminbuchung/', import.meta.url);
const grundlage = new URL('./grundlage/', import.meta.url);
const cfg = JSON.parse(readFileSync(new URL('einstellungen.json', hier), 'utf8'));
const schema = readFileSync(new URL('schema.sql', hier), 'utf8');
const sha = text => createHash('sha256').update(text).digest('hex');

// Prüfschlüssel: gilt nur in der Wegwerf-Datenbank dieser Prüfung und öffnet keine echte Verwaltung. Der echte Zugangsschlüssel
// des Betriebs wird von dieser Prüfung weder gelesen noch gebraucht.
const SCHLUESSEL = 'pruef-zugang-nur-fuer-diesen-test-0123456789';
const basis = 'https://termine.example';
const ergebnisse = [];
const pruefe = (name, gut, detail = '') => { ergebnisse.push({ name, gut: Boolean(gut), detail }); };

// Ein fester Zeitpunkt: Montag, 2. Februar 2026, 08:00 Uhr in Berlin (07:00 UTC).
let uhr = new Date('2026-02-02T07:00:00Z');
const jetzt = () => uhr;
const umgebung = () => neueUmgebung(schema, sha(SCHLUESSEL));

async function ruf(env, pfad, { form, cookie, origin = basis, ip = '203.0.113.5', browser = '' } = {}) {
  const kopf = { 'cf-connecting-ip': ip };
  if (browser) kopf['sec-fetch-site'] = browser;
  if (cookie) kopf.cookie = cookie;
  let init = { method: 'GET', headers: kopf, redirect: 'manual' };
  if (form) { kopf['content-type'] = 'application/x-www-form-urlencoded'; if (origin) kopf.origin = origin; init = { method: 'POST', headers: kopf, body: new URLSearchParams(form).toString(), redirect: 'manual' }; }
  const antwort = await behandle(new Request(basis + pfad, init), env, jetzt);
  return { status: antwort.status, kopf: antwort.headers, text: await antwort.text() };
}

// Erster freier Termin laut Einstellungen ab dem Prüftag.
const wochentage = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'];
function ersterTermin() {
  for (let n = 1; n <= 14; n++) {
    const d = new Date(Date.UTC(2026, 1, 2 + n)), tag = d.toISOString().slice(0, 10), fenster = cfg.zeiten[wochentage[d.getUTCDay()]] || [];
    if (fenster.length) return { tag, zeit: fenster[0][0] };
  }
  throw new Error('In den Einstellungen sind in den nächsten 14 Tagen keine Zeiten angegeben.');
}
const termin = ersterTermin(), start = termin.tag + 'T' + termin.zeit;
const angaben = extra => ({ start, leistung: cfg.leistungen[0], name: 'Erika Beispiel', kontakt: '0561 5550199', notiz: '', einverstanden: 'ja', ...extra });

// ---- 0. Das Programm ist die geprüfte Grundlage, die Einstellungen sind brauchbar
{
  for (const datei of ['src/app.mjs', 'src/stil.mjs', 'schema.sql']) pruefe(`Datei ${datei} entspricht der mitgelieferten Grundlage`, readFileSync(new URL(datei, hier), 'utf8') === readFileSync(new URL(datei, grundlage), 'utf8'));
  const zeit = /^([01]\d|2[0-3]):[0-5]\d$/, min = z => Number(z.slice(0, 2)) * 60 + Number(z.slice(3));
  const fenster = Object.values(cfg.zeiten || {}).flat();
  pruefe('Einstellungen nennen einen Namen und ein bis sechs Anliegen', typeof cfg.name === 'string' && cfg.name.trim().length > 1 && Array.isArray(cfg.leistungen) && cfg.leistungen.length >= 1 && cfg.leistungen.length <= 6);
  pruefe('Terminlänge liegt zwischen 15 und 240 Minuten', Number.isInteger(cfg.termin_minuten) && cfg.termin_minuten >= 15 && cfg.termin_minuten <= 240, String(cfg.termin_minuten));
  pruefe('Jedes Zeitfenster ist gültig und fasst mindestens einen Termin', fenster.length > 0 && fenster.every(f => Array.isArray(f) && zeit.test(f[0]) && zeit.test(f[1]) && min(f[1]) - min(f[0]) >= cfg.termin_minuten));
  pruefe('Vorlauf, Buchungszeitraum und Löschfrist sind gesetzt', cfg.vorlauf_stunden >= 0 && cfg.tage_im_voraus >= 1 && cfg.tage_im_voraus <= 365 && cfg.aufbewahrung_tage >= 1 && cfg.aufbewahrung_tage <= 365);
  const r = cfg.rechtliches || {};
  pruefe('Angaben für Impressum und Datenschutz sind vollständig', ['verantwortlich', 'anschrift', 'telefon', 'email'].every(k => String(r[k] || '').trim().length > 3));
}

// ---- 1. Öffentliche Seiten
{
  const env = umgebung();
  const startseite = await ruf(env, '/');
  pruefe('Startseite antwortet und nennt den Namen aus den Einstellungen', startseite.status === 200 && startseite.text.includes(cfg.name));
  pruefe('Startseite verbietet fremde Skripte (Schutzkopf gesetzt)', /default-src 'none'/.test(startseite.kopf.get('content-security-policy') || ''));
  const tagseite = await ruf(env, '/?tag=' + termin.tag);
  pruefe('Tagesansicht zeigt den ersten freien Termin', tagseite.status === 200 && tagseite.text.includes(`value="${start}"`));
  for (const seite of ['/impressum', '/datenschutz']) { const r = await ruf(env, seite); pruefe(`Seite ${seite} ist vorhanden und ausgefüllt`, r.status === 200 && !/ANGABE FEHLT/.test(r.text) && r.text.length > 600, r.status + ''); }
  pruefe('Unbekannte Adresse wird mit 404 beantwortet', (await ruf(env, '/gibt-es-nicht')).status === 404);
}

// ---- 2. Buchen, doppelt buchen, absagen
{
  const env = umgebung();
  const gebucht = await ruf(env, '/buchen', { form: angaben() });
  const ziel = gebucht.kopf.get('location') || '';
  pruefe('Buchung gelingt und führt auf eine eigene Terminseite', gebucht.status === 303 && /^\/termin\/[\w-]{30,}$/.test(ziel), gebucht.status + ' ' + ziel);
  const seite = await ruf(env, ziel);
  pruefe('Terminseite zeigt Tag, Uhrzeit und Namen', seite.status === 200 && seite.text.includes(termin.zeit) && seite.text.includes('Erika Beispiel'));
  pruefe('Terminseite wird nicht zwischengespeichert und nicht in Suchmaschinen aufgenommen', /no-store/.test(seite.kopf.get('cache-control') || '') && /noindex/.test(seite.kopf.get('x-robots-tag') || ''));
  const doppelt = await ruf(env, '/buchen', { form: angaben({ name: 'Zweite Person', kontakt: 'zwei@example.org' }), ip: '203.0.113.6' });
  pruefe('Derselbe Termin kann nicht zweimal gebucht werden', doppelt.status === 409, doppelt.status + '');
  const anzahl = env.DB.roh.prepare('SELECT COUNT(*) AS n FROM buchung WHERE abgesagt = 0').get().n;
  pruefe('In der Datenbank steht genau eine aktive Buchung', Number(anzahl) === 1, String(anzahl));
  pruefe('Der Termin erscheint danach nicht mehr als frei', !(await ruf(env, '/?tag=' + termin.tag)).text.includes(`value="${start}"`));
  pruefe('Eine geratene Terminadresse zeigt nichts', (await ruf(env, '/termin/' + 'x'.repeat(43))).status === 404);
  const roh = env.DB.roh.prepare('SELECT token_hash FROM buchung').get().token_hash;
  pruefe('Der Absage-Link steht nicht im Klartext in der Datenbank', !ziel.includes(roh) && roh.length === 64);
  const fremd = await ruf(env, ziel + '/absagen', { form: {}, origin: 'https://boese.example' });
  pruefe('Absage von einer fremden Seite aus wird abgelehnt', fremd.status === 403, fremd.status + '');
  const abgesagt = await ruf(env, ziel + '/absagen', { form: {} });
  pruefe('Absage über den eigenen Link gelingt', abgesagt.status === 200 && /abgesagt/i.test(abgesagt.text));
  pruefe('Nach der Absage ist der Termin wieder frei', (await ruf(env, '/?tag=' + termin.tag)).text.includes(`value="${start}"`));
}

// ---- 3. Ungültige Buchungen
{
  const env = umgebung();
  const faelle = [
    ['ohne Einverständnis', angaben({ einverstanden: '' })],
    ['mit Formularfalle', angaben({ website: 'https://werbung.example' })],
    ['außerhalb der Zeiten', angaben({ start: termin.tag + 'T03:00' })],
    ['in der Vergangenheit', angaben({ start: '2026-01-05T' + termin.zeit })],
    ['zu weit in der Zukunft', angaben({ start: '2027-06-07T' + termin.zeit })],
    ['mit unbekannter Leistung', angaben({ leistung: 'Gibt es nicht' })],
    ['ohne Namen', angaben({ name: ' ' })],
    ['mit unbrauchbarer Kontaktangabe', angaben({ kontakt: 'abc' })],
    ['mit zu langer Notiz', angaben({ notiz: 'x'.repeat(2000) })],
  ];
  for (const [name, form] of faelle) { const r = await ruf(env, '/buchen', { form }); pruefe(`Buchung ${name} wird abgelehnt`, r.status === 400, r.status + ''); }
  pruefe('Buchung von einer fremden Seite aus wird abgelehnt', (await ruf(env, '/buchen', { form: angaben(), origin: 'https://boese.example' })).status === 403);
  pruefe('Nach den abgelehnten Versuchen ist nichts gespeichert', Number(env.DB.roh.prepare('SELECT COUNT(*) AS n FROM buchung').get().n) === 0);
  const boese = await ruf(env, '/buchen', { form: angaben({ name: '<img src=x onerror=alert(1)>', notiz: '<script>alert(2)</script>' }) });
  const seite = await ruf(env, boese.kopf.get('location') || '/');
  pruefe('Eingaben mit Seitenelementen werden nur als Text angezeigt', boese.status === 303 && !seite.text.includes('<img src=x') && !seite.text.includes('<script>alert') && seite.text.includes('&lt;img'));
}

// ---- 4. Massenbuchungen eines Absenders
{
  const env = umgebung();
  const d = new Date(Date.UTC(2026, 1, 2)); let gelungen = 0, gebremst = 0;
  for (let n = 1; n <= 20 && gebremst === 0; n++) {
    d.setUTCDate(d.getUTCDate() + 1); const fenster = cfg.zeiten[wochentage[d.getUTCDay()]] || []; if (!fenster.length) continue;
    const r = await ruf(env, '/buchen', { form: angaben({ start: d.toISOString().slice(0, 10) + 'T' + fenster[0][0] }) });
    if (r.status === 303) gelungen++; else if (r.status === 429) gebremst++;
  }
  pruefe('Ein Absender wird nach wenigen Buchungen gebremst', gebremst === 1 && gelungen >= 1 && gelungen <= 6, `${gelungen} gelungen`);
}

// ---- 5. Geschützter Bereich
{
  const env = umgebung();
  await ruf(env, '/buchen', { form: angaben() });
  const ohne = await ruf(env, '/verwaltung');
  pruefe('Verwaltung ohne Anmeldung zeigt keine Buchungen', ohne.status === 200 && !ohne.text.includes('Erika Beispiel') && /Zugangsschlüssel/.test(ohne.text));
  pruefe('Tabelle ohne Anmeldung ist nicht abrufbar', [302, 303, 401, 403].includes((await ruf(env, '/verwaltung/tabelle.csv')).status));
  pruefe('Falscher Zugangsschlüssel wird abgelehnt', (await ruf(env, '/verwaltung/anmelden', { form: { schluessel: 'falsch-falsch-falsch-falsch-falsch' } })).status === 401);
  const an = await ruf(env, '/verwaltung/anmelden', { form: { schluessel: SCHLUESSEL } });
  const keks = (an.kopf.get('set-cookie') || '').split(';')[0];
  pruefe('Richtiger Zugangsschlüssel meldet an', an.status === 303 && /^sitzung=[\w-]{30,}$/.test(keks), an.status + '');
  pruefe('Anmeldekeks ist nur für den Server lesbar, nur verschlüsselt und nur für diese Seite', /HttpOnly/i.test(an.kopf.get('set-cookie')) && /Secure/i.test(an.kopf.get('set-cookie')) && /SameSite=Strict/i.test(an.kopf.get('set-cookie')));
  const innen = await ruf(env, '/verwaltung', { cookie: keks });
  pruefe('Verwaltung zeigt nach der Anmeldung die Buchung', innen.status === 200 && innen.text.includes('Erika Beispiel') && innen.text.includes('0561 5550199'));
  const marke = (innen.text.match(/name="marke" value="([\w-]+)"/) || [])[1] || '';
  const id = env.DB.roh.prepare('SELECT id FROM buchung').get().id;
  pruefe('Absagen ohne Formularschutzwert wird abgelehnt', (await ruf(env, '/verwaltung/absagen', { form: { id: String(id) }, cookie: keks })).status === 403);
  pruefe('Absagen über einen bloßen Seitenaufruf ist nicht möglich', (await ruf(env, '/verwaltung/absagen?id=' + id, { cookie: keks })).status !== 200 && Number(env.DB.roh.prepare('SELECT abgesagt FROM buchung').get().abgesagt) === 0);
  const csv = await ruf(env, '/verwaltung/tabelle.csv', { cookie: keks });
  pruefe('Tabelle lässt sich angemeldet herunterladen und enthält die Buchung', csv.status === 200 && csv.text.includes('Erika Beispiel'));
  await ruf(env, '/buchen', { form: angaben({ start: termin.tag + 'T' + (cfg.zeiten[wochentage[new Date(termin.tag + 'T00:00:00Z').getUTCDay()]][0][0] === termin.zeit ? naechsteZeit() : termin.zeit), name: '=SUMME(A1:A9)', kontakt: 'formel@example.org' }), ip: '203.0.113.9' });
  pruefe('Tabelle entschärft Einträge, die wie eine Formel beginnen', !/(^|[;\n])"?=SUMME/.test((await ruf(env, '/verwaltung/tabelle.csv', { cookie: keks })).text));
  const sperre = await ruf(env, '/verwaltung/sperren', { form: { tag: termin.tag, marke }, cookie: keks });
  pruefe('Ein Tag lässt sich sperren', [200, 303].includes(sperre.status) && !(await ruf(env, '/?tag=' + termin.tag)).text.includes('name="start"'));
  const weg = await ruf(env, '/verwaltung/loeschen', { form: { id: String(id), marke }, cookie: keks });
  pruefe('Eine Buchung lässt sich vollständig löschen', [200, 303].includes(weg.status) && Number(env.DB.roh.prepare('SELECT COUNT(*) AS n FROM buchung WHERE id = ?').get(id).n) === 0);
  const ab = await ruf(env, '/verwaltung/abmelden', { form: { marke }, cookie: keks });
  pruefe('Nach dem Abmelden gilt der Keks nicht mehr', [200, 303].includes(ab.status) && !(await ruf(env, '/verwaltung', { cookie: keks })).text.includes('formel@example.org'));
  let gesperrt = false;
  for (let n = 0; n < 14 && !gesperrt; n++) gesperrt = (await ruf(env, '/verwaltung/anmelden', { form: { schluessel: 'raten-raten-raten-raten-raten-' + n }, ip: '203.0.113.77' })).status === 429;
  pruefe('Raten des Zugangsschlüssels wird gebremst', gesperrt);
}
function naechsteZeit() { const [h, m] = termin.zeit.split(':').map(Number), t = h * 60 + m + cfg.termin_minuten; return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); }

// ---- 6. Aufbewahrung
{
  const env = umgebung();
  await ruf(env, '/buchen', { form: angaben() });
  const an = await ruf(env, '/verwaltung/anmelden', { form: { schluessel: SCHLUESSEL } }), keks = (an.kopf.get('set-cookie') || '').split(';')[0];
  uhr = new Date(uhr.getTime() + (cfg.aufbewahrung_tage + 20) * 86400000);
  const an2 = await ruf(env, '/verwaltung/anmelden', { form: { schluessel: SCHLUESSEL } }), keks2 = (an2.kopf.get('set-cookie') || '').split(';')[0];
  await ruf(env, '/verwaltung', { cookie: keks2 });
  pruefe('Abgelaufene Buchungen werden nach der eingestellten Frist gelöscht', Number(env.DB.roh.prepare('SELECT COUNT(*) AS n FROM buchung').get().n) === 0);
  pruefe('Eine alte Anmeldung gilt nach Ablauf nicht mehr', /Zugangsschlüssel/.test((await ruf(env, '/verwaltung', { cookie: keks })).text));
}

// ---- 7. Löschfrist ohne Zutun und vergangene Termine
{
  uhr = new Date('2026-02-02T07:00:00Z');
  const env = umgebung();
  await ruf(env, '/buchen', { form: angaben() });
  // Zwei Tage nach dem Termin: Er ist vergangen, aber noch innerhalb der Frist.
  uhr = new Date(Date.parse(termin.tag + 'T12:00:00Z') + 2 * 86400000);
  const an = await ruf(env, '/verwaltung/anmelden', { form: { schluessel: SCHLUESSEL } }), keks = (an.kopf.get('set-cookie') || '').split(';')[0];
  const innen = await ruf(env, '/verwaltung', { cookie: keks }), marke = (innen.text.match(/name="marke" value="([\w-]+)"/) || [])[1] || '';
  pruefe('Die Verwaltung zeigt auch vergangene Termine innerhalb der Löschfrist', /Vergangene Termine/.test(innen.text) && innen.text.includes('Erika Beispiel'));
  const id = env.DB.roh.prepare('SELECT id FROM buchung').get().id;
  await ruf(env, '/verwaltung/loeschen', { form: { id: String(id), marke }, cookie: keks });
  pruefe('Ein vergangener Termin lässt sich einzeln löschen', Number(env.DB.roh.prepare('SELECT COUNT(*) AS n FROM buchung').get().n) === 0);
  // Löschfrist ohne geöffnete Verwaltung: der zeitgesteuerte Aufruf räumt auf.
  uhr = new Date('2026-02-02T07:00:00Z');
  const env2 = umgebung();
  await ruf(env2, '/buchen', { form: angaben() });
  await aufraeumen(env2.DB, new Date(uhr.getTime() + (cfg.aufbewahrung_tage + 20) * 86400000));
  pruefe('Abgelaufene Buchungen werden auch ohne geöffnete Verwaltung gelöscht (zeitgesteuert)', Number(env2.DB.roh.prepare('SELECT COUNT(*) AS n FROM buchung').get().n) === 0);
  await ruf(env2, '/buchen', { form: angaben() });
  await aufraeumen(env2.DB, new Date(uhr.getTime() + 86400000));
  pruefe('Der zeitgesteuerte Aufruf löscht nichts, was noch nicht abgelaufen ist', Number(env2.DB.roh.prepare('SELECT COUNT(*) AS n FROM buchung').get().n) === 1);
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
  const env3 = traegeUmgebung(), tage = [];
  for (let n = 1; n <= 40 && tage.length < 12; n++) { const d = new Date(Date.UTC(2026, 1, 2 + n)), fenster = cfg.zeiten[wochentage[d.getUTCDay()]] || []; if (fenster.length && n <= cfg.tage_im_voraus) tage.push(d.toISOString().slice(0, 10) + 'T' + fenster[0][0]); }
  const buchungen = await Promise.all(tage.map(t => ruf(env3, '/buchen', { form: angaben({ start: t }), ip: '203.0.113.67' })));
  pruefe('Gleichzeitige Buchungen eines Absenders unterlaufen die Begrenzung nicht', tage.length < 7 || buchungen.filter(a => a.status === 303).length <= 5, buchungen.map(a => a.status).join(' '));
}

console.log('Hinweis: Geprüft wurde mit Probebuchungen und einem eigenen Prüfschlüssel in einer Wegwerf-Datenbank im Arbeitsspeicher. Echte Buchungen und der echte Zugangsschlüssel wurden nicht berührt.');
const schlecht = ergebnisse.filter(e => !e.gut);
for (const e of ergebnisse) console.log((e.gut ? 'ok      ' : 'FEHLER  ') + e.name + (e.gut || !e.detail ? '' : ' (' + e.detail + ')'));
console.log(schlecht.length ? `\nNICHT BESTANDEN: ${schlecht.length} von ${ergebnisse.length} Prüfungen` : `\nBESTANDEN: ${ergebnisse.length} Prüfungen`);
process.exitCode = schlecht.length ? 1 : 0;
