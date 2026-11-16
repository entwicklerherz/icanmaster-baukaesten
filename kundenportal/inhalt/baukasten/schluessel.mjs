// Erzeugt den Zugangsschlüssel für die Verwaltung.
// Der Schlüssel wird im Klartext in die Datei ZUGANGSSCHLUESSEL.txt neben diesem Skript geschrieben (nur für den Besitzer lesbar).
// Den Schlüssel selbst gibt dieses Skript nicht auf der Konsole aus. Ausgegeben wird nur die Meldung, dass ein Schlüssel erzeugt
// wurde (oder schon vorhanden ist) und in welcher Datei er steht; der Dateiname ist also im Verlauf des Agenten sichtbar, der Schlüssel nicht.
// Der Mensch öffnet die Datei, übernimmt den Schlüssel in seinen Passwortmanager und löscht die Datei.
// In die Datenbank kommt nur ein Kurzwert (SHA-256) des Schlüssels; die Anweisung dafür steht in zugang.sql.
import { randomBytes, createHash } from 'node:crypto';
import { writeFileSync, existsSync } from 'node:fs';

const hier = new URL('./', import.meta.url);
const ziel = new URL('ZUGANGSSCHLUESSEL.txt', hier);
if (existsSync(ziel) && !process.argv.includes('--neu')) {
  console.log('Es gibt schon einen Zugangsschlüssel (ZUGANGSSCHLUESSEL.txt). Für einen neuen: node baukasten/schluessel.mjs --neu');
} else {
  const schluessel = randomBytes(30).toString('base64url');
  const hash = createHash('sha256').update(schluessel).digest('hex');
  const salz = randomBytes(16).toString('hex');
  const erklaerung = 'Zugangsschlüssel für die Verwaltung Ihres Kundenportals\n\n' + schluessel + '\n\nSpeichern Sie ihn in Ihrem Passwortmanager und löschen Sie danach diese Datei.\nWer den Schlüssel kennt, sieht alle Kunden und ihre Unterlagen. Geben Sie ihn nicht weiter, auch nicht an einen KI-Agenten.\n';
  writeFileSync(ziel, erklaerung, { mode: 0o600 });
  const sql = "INSERT INTO einstellung (k, v) VALUES ('zugang_hash', '" + hash + "') ON CONFLICT (k) DO UPDATE SET v = excluded.v;\nINSERT INTO einstellung (k, v) VALUES ('salz', '" + salz + "') ON CONFLICT (k) DO NOTHING;\n";
  writeFileSync(new URL('zugang.sql', hier), sql);
  console.log('Zugangsschlüssel erzeugt. Er steht in baukasten/ZUGANGSSCHLUESSEL.txt (nicht anzeigen, nicht vorlesen). Die Anweisung für die Datenbank steht in baukasten/zugang.sql.');
}
