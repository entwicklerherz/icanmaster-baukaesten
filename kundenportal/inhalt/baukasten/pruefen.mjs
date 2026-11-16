// Startet die Prüfung der des eingerichteten Kundenportals. Aufruf im Hauptordner: node baukasten/pruefen.mjs
import { existsSync } from 'node:fs';

const [haupt, neben] = process.versions.node.split('.').map(Number);
if (haupt < 22 || (haupt === 22 && neben < 13)) {
  console.log('NICHT GEPRÜFT: Node.js ist zu alt (' + process.versions.node + '). Gebraucht wird Version 22.13 oder neuer.');
  process.exitCode = 2;
} else if (!existsSync(new URL('../kundenportal/src/app.mjs', import.meta.url))) {
  console.log('NICHT GEPRÜFT: Der Ordner kundenportal/ fehlt noch. Erst einrichten, dann prüfen.');
  process.exitCode = 2;
} else {
  await import('./pruefen-ablauf.mjs');
}
