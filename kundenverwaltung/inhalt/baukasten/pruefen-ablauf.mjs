// Ablauf der Prüfung. Wird von pruefen.mjs geladen, nachdem die Wegwerf-Datenbank und die Umgebung gesetzt sind; nicht einzeln aufrufen.
import {Readable} from 'node:stream';
import {behandle} from '../kundenverwaltung/server.mjs';
import {readFileSync, rmSync} from 'node:fs';

const erg = []; let fehler = 0;
const ok = (name, gut, detail = '') => { if (!gut) fehler++; erg.push(`${gut ? 'ok    ' : 'FEHLER'} ${name}${!gut && detail ? ` (${detail})` : ''}`); };
const ende = () => { console.log(erg.join('\n')); console.log(fehler ? `\n${fehler} Punkte nicht bestanden. Ursache beheben, dann erneut prüfen.\nNICHT BESTANDEN` : '\nBESTANDEN'); process.exit(fehler ? 1 : 0); };

// ---------- 1. Einstellungen ----------
let E; try { E = JSON.parse(readFileSync('kundenverwaltung/einstellungen.json', 'utf8')); } catch (e) { ok('einstellungen.json ist lesbar', false, e.message); ende(); }
const felder = E.felder || [], stufen = E.stufen || [];
ok('Einstellungen: Name und Bezeichnungen gesetzt', E.titel && E.einzahl && E.mehrzahl);
const quelle = readFileSync('kundenverwaltung/server.mjs', 'utf8');
ok('Server lauscht nur auf diesem Rechner (127.0.0.1)', /\.listen\(PORT, '127\.0\.0\.1'/.test(quelle));
ok('Keine Datenbankabfrage setzt Eingaben in den Abfragetext ein', !/(prepare|exec)\(`[^`]*\$\{/.test(quelle));
ok('Der Server ruft keine fremden Adressen auf und startet keine Programme', !/https?:\/\/(?!x['"/]|127\.0\.0\.1)/.test(quelle) && !/child_process|new Function/.test(quelle));
const stil = readFileSync('kundenverwaltung/style.css', 'utf8');
ok('Die Oberfläche lädt nichts von fremden Servern', !/https?:\/\/|@import/.test(stil));

// ---------- 2. Starten ----------
const PORT = 4391;
const aufraeumen = () => { rmSync('pruefung-daten', {recursive: true, force: true}); };

// Eine Anfrage an die Behandlungsfunktion. form: Formularfelder (dann POST). Gibt Status, Kopfzeilen und Text zurück.
const ruf = async (weg, {cookie, form, host} = {}) => {
  const body = form ? new URLSearchParams(form).toString() : '';
  const req = Readable.from(body ? [body] : []);
  req.method = body ? 'POST' : 'GET'; req.url = weg; req.headers = {host: host || '127.0.0.1:4391', ...(cookie ? {cookie} : {})};
  const antwort = {status: 0, kopf: {}, text: ''};
  const res = {
    writeHead(status, kopf = {}) { antwort.status = status; for (const [n, w] of Object.entries(kopf)) antwort.kopf[n.toLowerCase()] = n.toLowerCase() === 'set-cookie' ? [w] : w; },
    end(text = '') { antwort.text = String(text); }
  };
  try { await behandle(req, res); } catch (e) { antwort.text = String(e); }
  return antwort;
};
if (typeof behandle !== 'function') { ok('Die Kundenverwaltung lässt sich laden', false, 'server.mjs stellt die Funktion „behandle“ nicht bereit'); aufraeumen(); ende(); }
ok('Die Kundenverwaltung lässt sich laden', true);

try {
  // ---------- 3. Einrichten und Anmelden ----------
  let r = await ruf('/');
  ok('Erster Start bietet an, den Zugang anzulegen', r.text.includes('action="/einrichten"'));
  await ruf('/einrichten', {form: {name: 'pruefer', passwort: 'kurz'}});
  ok('Ein zu kurzes Passwort wird abgelehnt', (await ruf('/')).text.includes('action="/einrichten"'));
  await ruf('/einrichten', {form: {name: 'pruefer', passwort: 'pruef-passwort-1'}});
  r = await ruf('/');
  ok('Ohne Anmeldung gibt es keine Daten, nur die Anmeldung', r.status === 303 && r.kopf.location === '/anmelden');
  ok('Auch das Herunterladen verlangt eine Anmeldung', (await ruf('/export.csv')).status === 303);
  r = await ruf('/anmelden', {form: {name: 'pruefer', passwort: 'falsches-passwort'}});
  ok('Ein falsches Passwort wird abgelehnt', r.status === 401 && !r.kopf['set-cookie']);
  r = await ruf('/anmelden', {form: {name: 'pruefer', passwort: 'pruef-passwort-1'}});
  const gesetzt = (r.kopf['set-cookie'] || [''])[0], cookie = gesetzt.split(';')[0];
  ok('Die Anmeldung gelingt', r.status === 303 && cookie.startsWith('crm='));
  ok('Das Anmelde-Cookie ist für Skripte gesperrt und bleibt auf dieser Seite (HttpOnly, SameSite=Strict)', /HttpOnly/i.test(gesetzt) && /SameSite=Strict/i.test(gesetzt));
  r = await ruf('/neu', {cookie});
  const token = r.text.match(/name="token" value="([a-f0-9]+)"/)?.[1] || '';
  ok('Formulare tragen ein Sitzungs-Token', token.length >= 16);
  ok('Ein Formular ohne Token wird abgewiesen', (await ruf('/neu', {cookie, form: {name: 'Ohne Token'}})).status === 403);
  ok('Ein Formular mit falschem Token wird abgewiesen', (await ruf('/neu', {cookie, form: {name: 'Falsch', token: 'a'.repeat(32)}})).status === 403);
  ok('Anfragen an einen fremden Namen werden abgewiesen', (await ruf('/', {cookie, host: 'fremd.example'})).status === 400);
  ok('Die Seiten erlauben keine fremden Skripte (Content-Security-Policy)', /default-src 'self'/.test(r.kopf['content-security-policy'] || ''));

  // ---------- 4. Anlegen mit allen eigenen Feldern ----------
  const probe = {text: 'Probe-Angabe 4711', lang: 'Zeile eins\nZeile zwei', datum: '2001-03-09', zahl: '42', auswahl: null};
  const form = {token, name: '<b>Prüf</b> O\'Neil', firma: 'Prüf & Söhne', telefon: '0561 5550199', email: 'pruef@beispiel.example'};
  if (stufen.length) form.stufe = stufen[stufen.length - 1];
  for (const d of felder) form['m_' + d.id] = d.art === 'auswahl' ? d.auswahl[0] : probe[d.art];
  r = await ruf('/neu', {cookie, form});
  const kWeg = r.kopf.location || '';
  ok('Ein Eintrag lässt sich anlegen', r.status === 303 && /^\/kontakt\/\d+$/.test(kWeg));
  r = await ruf(kWeg, {cookie});
  ok('Sonderzeichen erscheinen als Text, nicht als Befehl', r.text.includes('&lt;b&gt;Prüf&lt;/b&gt; O&#39;Neil') && !r.text.includes('<b>Prüf</b>'));
  for (const d of felder) { const erwartet = d.art === 'auswahl' ? d.auswahl[0] : d.art === 'datum' ? '09.03.2001' : d.art === 'lang' ? 'Zeile eins' : probe[d.art]; ok(`Eigenes Feld „${d.name}“ wird gespeichert und gezeigt`, r.text.includes(d.name) && r.text.includes(erwartet)); }
  if (stufen.length) ok('Die Stufe wird gespeichert und gezeigt', r.text.includes(`<dd>${stufen[stufen.length - 1]}</dd>`));
  await ruf('/neu', {cookie, form: {token, name: 'Zweite Person', firma: 'Andere Firma'}});

  // ---------- 5. Ändern, Suchen, Stufen ----------
  r = await ruf(kWeg + '/aendern', {cookie});
  ok('Das Formular zum Ändern zeigt die bisherigen Angaben', r.text.includes('value="0561 5550199"'));
  await ruf(kWeg + '/aendern', {cookie, form: {...form, telefon: '0561 5550200'}});
  ok('Eine Änderung wird gespeichert', (await ruf(kWeg, {cookie})).text.includes('0561 5550200'));
  r = await ruf('/?q=' + encodeURIComponent('Söhne'), {cookie});
  ok('Die Suche findet den Eintrag und nur ihn', r.text.includes('O&#39;Neil') && !r.text.includes('Zweite Person'));
  ok('Die Suche übersteht Sonderzeichen', (await ruf('/?q=' + encodeURIComponent('\' OR 1=1 --'), {cookie})).status === 200 && !(await ruf('/?q=' + encodeURIComponent('\' OR 1=1 --'), {cookie})).text.includes('Zweite Person'));
  if (stufen.length) { r = await ruf('/?stufe=' + encodeURIComponent(stufen[stufen.length - 1]), {cookie}); ok('Der Stufenfilter zeigt nur die passende Stufe', r.text.includes('O&#39;Neil') && !r.text.includes('Zweite Person')); }

  // ---------- 6. Notizen und Wiedervorlagen ----------
  const heute = new Date().toLocaleDateString('sv-SE');
  await ruf(kWeg + '/notiz', {cookie, form: {token, text: 'Rückruf wegen <i>Angebot</i>', faellig: heute}});
  r = await ruf(kWeg, {cookie});
  ok('Eine Notiz steht im Verlauf, mit Verfasser', r.text.includes('Rückruf wegen &lt;i&gt;Angebot&lt;/i&gt;') && r.text.includes('pruefer'));
  r = await ruf('/wiedervorlagen', {cookie});
  ok('Die Wiedervorlage erscheint als heute fällig', r.text.includes('<strong>heute</strong>') && r.text.includes('Rückruf wegen'));
  const erledigt = r.text.match(/action="(\/kontakt\/\d+\/erledigt\/\d+)"/)?.[1] || '/fehlt';
  await ruf(erledigt, {cookie, form: {token, zurueck: 'wv'}});
  ok('Erledigte Wiedervorlagen verschwinden aus der Liste', !(await ruf('/wiedervorlagen', {cookie})).text.includes('Rückruf wegen'));

  // ---------- 7. Liste einlesen, herunterladen, Auskunft ----------
  const liste = 'Name\tFirma\tTelefon\tLieblingsfarbe\nErna Einlese\tEinlese GmbH\t030 5550111\tgrün\n=SUMME(A1)\tFormel AG\t\t\n\tOhne Namen GmbH\t\t\n';
  r = await ruf('/einlesen', {cookie, form: {token, liste}});
  ok('Einlesen zeigt erst eine Vorschau und speichert noch nichts', r.text.includes('2 Einträge erkannt') && !(await ruf('/?q=Einlese', {cookie})).text.includes('Erna Einlese'));
  r = await ruf('/einlesen', {cookie, form: {token, liste, bestaetigt: '1'}});
  ok('Einlesen legt die Einträge an und lässt Zeilen ohne Namen aus', r.text.includes('2 neu angelegt') && r.text.includes('1 Zeilen ohne Namen'));
  r = await ruf('/?q=Einlese', {cookie}); const eWeg = r.text.match(/href="(\/kontakt\/\d+)"/)?.[1] || '/fehlt';
  ok('Unbekannte Spalten gehen nicht verloren, sondern werden zur Notiz', (await ruf(eWeg, {cookie})).text.includes('Lieblingsfarbe: grün'));
  ok('Zweimal einlesen legt nichts doppelt an', (await ruf('/einlesen', {cookie, form: {token, liste, bestaetigt: '1'}})).text.includes('0 neu angelegt'));
  r = await ruf('/export.csv', {cookie});
  ok('Alles lässt sich als Tabelle herunterladen', r.status === 200 && /attachment/.test(r.kopf['content-disposition'] || '') && r.text.includes('Erna Einlese') && r.text.includes('Prüf & Söhne'));
  ok('Heruntergeladene Zellen können keine Formel auslösen', r.text.includes('"\'=SUMME(A1)"'));
  r = await ruf(kWeg + '/auskunft', {cookie});
  ok('Zu einer Person lässt sich alles Gespeicherte als Datei ausgeben', r.status === 200 && r.text.includes('0561 5550200') && r.text.includes('Rückruf wegen'));

  // ---------- 8. Zugänge ----------
  await ruf('/verwalten/zugang', {cookie, form: {token, name: 'kollegin', passwort: 'zweites-passwort-2'}});
  r = await ruf('/anmelden', {form: {name: 'kollegin', passwort: 'zweites-passwort-2'}});
  const cookie2 = ((r.kopf['set-cookie'] || [''])[0]).split(';')[0];
  ok('Ein zweiter Zugang lässt sich anlegen und kann sich anmelden', r.status === 303 && cookie2.startsWith('crm='));
  ok('Das Token eines anderen Zugangs gilt nicht', (await ruf('/neu', {cookie: cookie2, form: {token, name: 'Fremdes Token'}})).status === 403);
  r = await ruf('/verwalten', {cookie}); const entf = r.text.match(/action="(\/verwalten\/zugang\/\d+\/entfernen)"/)?.[1] || '/fehlt';
  await ruf(entf, {cookie, form: {token}});
  ok('Ein entfernter Zugang ist sofort abgemeldet', (await ruf('/', {cookie: cookie2})).status === 303);
  await ruf('/verwalten/passwort', {cookie, form: {token, alt: 'pruef-passwort-1', neu: 'neues-passwort-3'}});
  ok('Das eigene Passwort lässt sich ändern', (await ruf('/anmelden', {form: {name: 'pruefer', passwort: 'neues-passwort-3'}})).status === 303 && (await ruf('/anmelden', {form: {name: 'pruefer', passwort: 'pruef-passwort-1'}})).status === 401);
  for (let i = 0; i < 5; i++) await ruf('/anmelden', {form: {name: 'bremse', passwort: 'falsch-falsch-1'}});
  ok('Viele falsche Anmeldungen werden gebremst', (await ruf('/anmelden', {form: {name: 'bremse', passwort: 'falsch-falsch-1'}})).text.includes('Zu viele Versuche'));

  // ---------- 9. Löschen und Abmelden ----------
  await ruf(kWeg + '/loeschen', {cookie, form: {token}});
  ok('Löschen entfernt den Eintrag samt Notizen', (await ruf(kWeg, {cookie})).status === 404 && !(await ruf('/export.csv', {cookie})).text.includes('Prüf & Söhne'));
  await ruf('/abmelden', {cookie, form: {token}});
  ok('Nach dem Abmelden gilt die alte Sitzung nicht mehr', (await ruf('/', {cookie})).status === 303);
} catch (e) { ok('Die Prüfung läuft durch', false, e.message); }
aufraeumen(); ende();
