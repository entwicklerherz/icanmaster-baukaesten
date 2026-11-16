# Kundenportal · Baukasten für KI-Agenten

Version 0.1.0 · I Can Master AI · https://icanmaster.ai/baukaesten/

Ein Kundenportal im Internet: Du legst in einem geschützten Bereich deine Kunden an und pflegst je Kunde den Stand, Mitteilungen, Termine und Unterlagen. Jeder Kunde bekommt einen persönlichen Link und sieht damit nur seine eigene Seite. Der Agent schneidet die fertige Grundlage auf deinen Betrieb zu und stellt sie ins Netz; ein zweiter Agent prüft gegen.

## Voraussetzung

- Ein KI-Agent, zum Beispiel Claude Code oder Codex.
- Node.js ab Version 22.13 (kostenlos, nodejs.org, die Fassung „LTS“).
- Ein kostenloses Konto beim Anbieter Cloudflare. Hast du noch keines, führt dich der Agent Schritt für Schritt dorthin. Dein Passwort bleibt bei dir; der Agent fragt nicht danach.

## In vier Schritten

1. Kopiere den **Inhalt** des Ordners `inhalt` in einen neuen, leeren Ordner. Achtung: Darin liegt auch ein versteckter Ordner `.claude` mit den Skills. Er muss mit (im Finder zeigt Befehl + Umschalt + Punkt versteckte Ordner; unter Windows „Ausgeblendete Elemente“ einschalten).
2. Starte in diesem neuen Ordner deinen KI-Agenten.
3. Schreib dem Agenten in diesem Ordner, was du möchtest, in deinen Worten und in deiner Sprache, zum Beispiel: **„Bau mir ein Kundenportal.“** Der Satz ist ein Beispiel, kein Befehlswort; er gilt nur in dem Ordner, in den du den Baukasten kopiert hast. Der Agent stellt dir höchstens fünf kurze Fragen (wer du bist, wen du informierst, welche Schritte ein Auftrag durchläuft, wie man dich erreicht, wer verantwortlich ist), richtet ein, prüft, hilft dir beim Konto und stellt die Seite ins Netz. Zwischendurch bittet er dich, im Browser etwas zu bestätigen. **Bevor du zustimmst, sollst du wissen:** Die Seite und alles, was du über deine Kunden einträgst (Namen, Mitteilungen, Termine, Unterlagen), liegen danach in deinem Konto beim Anbieter Cloudflare, einem Unternehmen aus den USA; die Datenbank wird auf Rechenzentren in der Europäischen Union festgelegt. Passt das für dich nicht, ist dieser Baukasten nicht der richtige.
4. **Gegenprüfung:** Öffne denselben Ordner in einem zweiten Agenten (oder in einer neuen Sitzung desselben) und schreib: **„Prüf das Kundenportal gegen.“** Der zweite Agent baut nichts, sondern sucht Fehler und schreibt sein Urteil auf. Erst danach legst du den ersten echten Kunden an.

## Was im Paket liegt

- `inhalt/AGENTS.md`, `inhalt/CLAUDE.md`: die Leitdatei für den Agenten
- `inhalt/.claude/skills/`: sieben Skills (Gespräch, Einrichten, Prüfen, Konto, Bereitstellen, Übergabe, Gegenprüfung)
- `inhalt/baukasten/grundlage/`: das fertige Kundenportal (`src/app.mjs`, `src/stil.mjs`), die Tabellen (`schema.sql`), die Einstellungen (`einstellungen.json`) und die Vorlage für den Anbieter (`wrangler.jsonc`)
- `inhalt/baukasten/pruefen.mjs` und `pruefen-ablauf.mjs`: das Prüfskript. Es ruft das Portal direkt auf, mit einer leeren Wegwerf-Datenbank im Arbeitsspeicher, legt Probekunden an und versucht, mit dem Zugang des einen an die Seite und die Unterlagen des anderen zu kommen. Es braucht kein Internet und öffnet keinen Anschluss.
- `inhalt/baukasten/schluessel.mjs`: erzeugt deinen Zugangsschlüssel für die Verwaltung in eine Datei, die nur du öffnest
- `PRUEFBERICHT.md`: wie getestet und gescannt wurde, mit Ergebnissen und Grenzen
- `LIZENZ.md`: was du mit dem Baukasten tun darfst

## Gut zu wissen

- Sprache: Mit dem Agenten sprichst du, wie du möchtest. Das Portal für deine Kunden gibt es in dieser Fassung auf Deutsch; mit der Wahl dieses Baukastens entscheidest du dich dafür. Der Agent sagt es dir vor dem Einrichten noch einmal, wenn du nicht deutsch schreibst.

- Deine Kunden melden sich nicht mit einem Passwort an, sondern öffnen einen langen persönlichen Link. Die Verwaltung zeigt ihn einmal beim Anlegen. Wer den Link kennt, sieht die Seite dieser Person; gib ihn deshalb nur ihr. Geht er verloren, stellst du einen neuen aus, der alte gilt dann nicht mehr.
- Kunden können nur lesen und Unterlagen herunterladen. Sie können nichts hochladen und nicht zurückschreiben. Das Portal verschickt keine E-Mails.
- Unterlagen: PDF, JPG und PNG bis 4 MB je Datei, höchstens 20 je Person. Für Fotosammlungen und Videos ist das Portal nicht gedacht. Das Portal prüft nur, ob eine Datei nach Anfang und Ende zu einem dieser Formate passt; den Inhalt prüft es nicht, auch nicht auf Schadsoftware. Lade nur Dateien hoch, die du selbst kennst.
- Für besonders geschützte Angaben, etwa zur Gesundheit, ist das Portal nicht gedacht. Der Agent weist darauf hin, wenn so ein Zweck zur Sprache kommt.
- Die Seite läuft im kostenlosen Tarif von Cloudflare, einem Unternehmen aus den USA. Die Datenbank wird auf Rechenzentren in der Europäischen Union festgelegt. Der Anbieter kann kostenlose Dienste ändern oder einstellen.
- In die Verwaltung kommst du mit einem langen Zugangsschlüssel statt eines Passworts. Er gehört in deinen Passwortmanager. Der Agent sieht ihn nicht. Es gibt einen Zugang für den Betrieb, nicht mehrere mit unterschiedlichen Rechten.
- Abgeschlossene Vorgänge werden nach einer Frist (Vorgabe 90 Tage) mit allen Unterlagen gelöscht. Zu jeder Person kannst du eine Auskunft über alles Gespeicherte herunterladen (die Unterlagen selbst einzeln) und sie sofort endgültig löschen.
- Du speicherst Angaben über andere Menschen. Der Baukasten hilft dabei, ersetzt aber keine Rechtsberatung.
- Wenn du nicht weiterkommst: kontakt@entwicklerherz.de oder live im Workshop, https://icanmaster.ai/seminare/
