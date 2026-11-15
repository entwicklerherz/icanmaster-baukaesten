# Kleine Kundenverwaltung auf dem eigenen Rechner · Baukasten für KI-Agenten

Version 0.1.0 · I Can Master AI · https://icanmaster.ai/baukaesten/

Eine Kundenverwaltung, die nur auf deinem Rechner läuft: Einträge mit eigenen Feldern, Notizen, Wiedervorlagen, Suche, Stufen, Anmeldung. Die Daten bleiben bei dir. Der Agent schneidet sie auf dein Vorhaben zu; ein zweiter Agent prüft gegen.

## Voraussetzung

- Ein KI-Agent, zum Beispiel Claude Code oder Codex.
- Node.js ab Version 22.13 (kostenlos, nodejs.org, die Fassung „LTS“). Das ist das Programm, das die Kundenverwaltung auf deinem Rechner laufen lässt.

## In vier Schritten

1. Kopiere den **Inhalt** des Ordners `inhalt` in einen neuen, leeren Ordner. Achtung: Darin liegt auch ein versteckter Ordner `.claude` mit den Skills. Er muss mit (im Finder zeigt Befehl + Umschalt + Punkt versteckte Ordner; unter Windows „Ausgeblendete Elemente“ einschalten).
2. Starte in diesem neuen Ordner deinen KI-Agenten.
3. Schreib einen Satz: **„Bau mir eine Kundenverwaltung.“** Der Agent stellt dir höchstens fünf kurze Fragen (wen du verwaltest, was du dir merken willst, welche Schritte es gibt, ob es schon eine Liste gibt, wer damit arbeitet), richtet ein, prüft und erklärt dir den Start.
4. **Gegenprüfung:** Öffne denselben Ordner in einem zweiten Agenten (oder in einer neuen Sitzung desselben) und schreib: **„Prüf die Kundenverwaltung gegen.“** Der zweite Agent baut nichts, sondern sucht Fehler und schreibt sein Urteil auf. Erst danach kommen echte Daten hinein.

## Was im Paket liegt

- `inhalt/AGENTS.md`, `inhalt/CLAUDE.md`: die Leitdatei für den Agenten
- `inhalt/.claude/skills/`: sechs Skills (Gespräch, Einrichten, Erweitern, Prüfen, Gegenprüfung, Übergabe)
- `inhalt/baukasten/grundlage/`: die fertige Kundenverwaltung (`server.mjs`, `style.css`), die Einstellungen (`einstellungen.json`) und zwei Startdateien für den Doppelklick
- `inhalt/baukasten/pruefen.mjs` und `pruefen-ablauf.mjs`: das Prüfskript. Es lädt die Kundenverwaltung mit einer leeren Wegwerf-Datenbank, spielt Anmeldung, Schutz, Anlegen, Ändern, Suchen, Einlesen und Löschen durch und räumt wieder auf. Es öffnet dabei keinen Anschluss und lädt nichts aus dem Netz.
- `PRUEFBERICHT.md`: wie getestet und gescannt wurde, mit Ergebnissen und Grenzen
- `LIZENZ.md`: was du mit dem Baukasten tun darfst

## Gut zu wissen

- Die Kundenverwaltung ist nur auf dem Rechner erreichbar, auf dem sie läuft, nicht vom Handy und nicht aus dem Internet. Das ist Absicht.
- Deinen Zugang legst du selbst im Browser an. Der Agent kennt dein Passwort nicht und sieht deine Daten nicht.
- Du speicherst Angaben über andere Menschen. Der Baukasten hilft dabei (Auskunft als Datei, Löschen, Sicherung), ersetzt aber keine Rechtsberatung.
- Wenn du nicht weiterkommst: kontakt@entwicklerherz.de oder live im Workshop, https://icanmaster.ai/seminare/
