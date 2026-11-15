// Prüft die gebaute Kundenverwaltung im Ordner kundenverwaltung/. Aufruf im Projektordner: node baukasten/pruefen.mjs
// Was dieses Skript tut: Es lädt die Kundenverwaltung in diesen Vorgang und lässt sie mit einer leeren Wegwerf-Datenbank in einem eigenen
// Ordner (pruefung-daten/), spielt Einrichten, Anmelden, Anlegen, Ändern, Suchen, Notizen, Wiedervorlagen, Einlesen, Herunterladen
// und Löschen durch und beendet sich danach. Die echten Daten unter kundenverwaltung/daten/ fasst es nicht an.
// Was es nicht tut: Es lädt nichts aus dem Netz, installiert nichts und öffnet keinen Anschluss.
import {existsSync, mkdirSync, rmSync} from 'node:fs';

for (const d of ['kundenverwaltung/server.mjs', 'kundenverwaltung/style.css', 'kundenverwaltung/einstellungen.json']) if (!existsSync(d)) { console.log('FEHLER Datei ' + d + ' fehlt\n\nNICHT BESTANDEN'); process.exit(1); }
// Eigene Wegwerf-Datenbank; die Kundenverwaltung wird geladen, ohne einen Anschluss zu öffnen (CRM_OHNE_START).
rmSync('pruefung-daten', {recursive: true, force: true}); mkdirSync('pruefung-daten', {recursive: true});
process.env.PORT = '4391'; process.env.CRM_DB = 'pruefung-daten/probe.db'; process.env.CRM_OHNE_START = '1';
try { await import('./pruefen-ablauf.mjs'); }
catch (e) { rmSync('pruefung-daten', {recursive: true, force: true}); console.log('FEHLER Die Kundenverwaltung lässt sich nicht laden (' + String(e && e.message || e) + '). Läuft Node.js ab Version 22.13? Stimmt einstellungen.json?\n\nNICHT BESTANDEN'); process.exit(1); }
