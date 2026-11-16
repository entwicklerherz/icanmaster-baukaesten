# Online-Terminbuchung · Baukasten für KI-Agenten

Version 0.1.0 · I Can Master AI · https://icanmaster.ai/baukaesten/

Eine Terminbuchung im Internet: Deine Kunden wählen auf einer öffentlichen Seite einen freien Termin und können ihn über einen eigenen Link wieder absagen. Du siehst und verwaltest die Buchungen in einem geschützten Bereich. Der Agent schneidet die fertige Grundlage auf deinen Betrieb zu und stellt sie ins Netz; ein zweiter Agent prüft gegen.

## Voraussetzung

- Ein KI-Agent, zum Beispiel Claude Code oder Codex.
- Node.js ab Version 22.13 (kostenlos, nodejs.org, die Fassung „LTS“).
- Ein kostenloses Konto beim Anbieter Cloudflare. Hast du noch keines, führt dich der Agent Schritt für Schritt dorthin. Dein Passwort bleibt bei dir; der Agent fragt nicht danach.

## In vier Schritten

1. Kopiere den **Inhalt** des Ordners `inhalt` in einen neuen, leeren Ordner. Achtung: Darin liegt auch ein versteckter Ordner `.claude` mit den Skills. Er muss mit (im Finder zeigt Befehl + Umschalt + Punkt versteckte Ordner; unter Windows „Ausgeblendete Elemente“ einschalten).
2. Starte in diesem neuen Ordner deinen KI-Agenten.
3. Schreib dem Agenten in diesem Ordner, was du möchtest, in deinen Worten und in deiner Sprache, zum Beispiel: **„Bau mir eine Terminbuchung.“** Der Satz ist ein Beispiel, kein Befehlswort; er gilt nur in dem Ordner, in den du den Baukasten kopiert hast. Der Agent stellt dir höchstens fünf kurze Fragen (wofür Termine gebucht werden, wann, wie lange, wer verantwortlich ist), richtet ein, prüft, hilft dir beim Konto und stellt die Seite ins Netz. Zwischendurch bittet er dich, im Browser etwas zu bestätigen. **Bevor du zustimmst, sollst du wissen:** Die Seite und die Buchungen deiner Kunden (Name, Telefon oder E-Mail, Termin) liegen danach in deinem Konto beim Anbieter Cloudflare, einem Unternehmen aus den USA; die Datenbank wird auf Rechenzentren in der Europäischen Union festgelegt. Passt das für dich nicht, ist dieser Baukasten nicht der richtige.
4. **Gegenprüfung:** Öffne denselben Ordner in einem zweiten Agenten (oder in einer neuen Sitzung desselben) und schreib: **„Prüf die Terminbuchung gegen.“** Der zweite Agent baut nichts, sondern sucht Fehler und schreibt sein Urteil auf. Erst danach gibst du die Adresse weiter.

## Was im Paket liegt

- `inhalt/AGENTS.md`, `inhalt/CLAUDE.md`: die Leitdatei für den Agenten
- `inhalt/.claude/skills/`: sieben Skills (Gespräch, Einrichten, Prüfen, Konto, Bereitstellen, Übergabe, Gegenprüfung)
- `inhalt/baukasten/grundlage/`: die fertige Terminbuchung (`src/app.mjs`, `src/stil.mjs`), die Tabellen (`schema.sql`), die Einstellungen (`einstellungen.json`) und die Vorlage für den Anbieter (`wrangler.jsonc`)
- `inhalt/baukasten/pruefen.mjs` und `pruefen-ablauf.mjs`: das Prüfskript. Es ruft die Terminbuchung direkt auf, mit einer leeren Wegwerf-Datenbank im Arbeitsspeicher, und spielt Buchen, Doppelbuchung, Absagen, Anmeldung, Schutz und Löschfrist durch. Es braucht kein Internet und öffnet keinen Anschluss.
- `inhalt/baukasten/schluessel.mjs`: erzeugt deinen Zugangsschlüssel für die Verwaltung in eine Datei, die nur du öffnest
- `PRUEFBERICHT.md`: wie getestet und gescannt wurde, mit Ergebnissen und Grenzen
- `LIZENZ.md`: was du mit dem Baukasten tun darfst

## Gut zu wissen

- Sprache: Mit dem Agenten sprichst du, wie du möchtest. Die Buchungsseite für deine Kunden gibt es in dieser Fassung auf Deutsch; mit der Wahl dieses Baukastens entscheidest du dich dafür. Der Agent sagt es dir vor dem Einrichten noch einmal, wenn du nicht deutsch schreibst.

- Die Seite läuft im kostenlosen Tarif von Cloudflare, einem Unternehmen aus den USA. Die Datenbank wird auf Rechenzentren in der Europäischen Union festgelegt. Der Anbieter kann kostenlose Dienste ändern oder einstellen.
- In die Verwaltung kommst du mit einem langen Zugangsschlüssel statt eines Passworts. Er gehört in deinen Passwortmanager. Der Agent sieht ihn nicht.
- Es werden keine E-Mails verschickt und keine Zahlungen angenommen. Kunden merken sich ihren Termin über die Adresse ihrer Terminseite.
- Alle Termine sind gleich lang; mehrere Mitarbeiter mit eigenen Kalendern kennt diese Fassung nicht.
- Du speicherst Angaben über andere Menschen. Der Baukasten hilft dabei (Löschfrist, Löschen einzelner Buchungen, Entwürfe für Impressum und Datenschutz), ersetzt aber keine Rechtsberatung.
- Wenn du nicht weiterkommst: kontakt@entwicklerherz.de oder live im Workshop, https://icanmaster.ai/seminare/
