---
name: crm-gegenpruefung
description: Schritt für einen zweiten Agenten im Baukasten „Kleine Kundenverwaltung“. Prüft eine von einem anderen Agenten eingerichtete Kundenverwaltung gegen, ohne selbst zu bauen. Verwenden, wenn der Nutzer schreibt „Prüf die Kundenverwaltung gegen“ oder um eine zweite Meinung zu Sicherheit und Daten bittet.
---

# Gegenprüfen (zweiter Agent)

Du hast diese Kundenverwaltung nicht gebaut. Deine Aufgabe ist, Fehler zu finden, nicht, sie freundlich zu bestätigen. Du änderst nichts unter `kundenverwaltung/`. In `kundenverwaltung/daten/` schaust du nicht hinein.

## 1. Was wurde verändert?

- Vergleiche `kundenverwaltung/server.mjs` und `kundenverwaltung/style.css` mit `baukasten/grundlage/` (`diff`). Sind sie gleich, ist der Code die geprüfte Grundlage; weiter mit Punkt 3.
- Gibt es Unterschiede, lies jede geänderte Stelle und `kundenverwaltung/AENDERUNGEN.md`. Fehlt diese Datei trotz Änderungen, ist das der erste Befund.

## 2. Geänderten Code prüfen

Geh für jede geänderte oder neue Stelle diese Fragen durch und notiere die Zeile, wenn die Antwort „nein“ ist:

- Nutzt jede Datenbankabfrage Platzhalter, ohne Werte aus einer Anfrage im Abfragetext?
- Läuft jede Ausgabe von gespeicherten oder eingegebenen Werten durch `esc(…)`?
- Liegt jede neue Ansicht hinter der Anmeldung?
- Wird jede Änderung per `POST` mit Token gesendet?
- Bleibt alles auf `127.0.0.1`, ohne Aufrufe fremder Adressen, ohne neue Abhängigkeiten, ohne Starten anderer Programme?
- Sind Passwort, Sitzung und Anmeldebremse unverändert?
- Bleiben vorhandene Daten bei der Änderung erhalten?

## 3. Laufen lassen

- Führe `node baukasten/pruefen.mjs` aus und notiere das Ergebnis (letzte Zeile und jede Zeile mit `FEHLER`). Lief das Skript bei dir nicht durch, schreib das als offenen Punkt auf; ein abgebrochener Lauf ist kein bestandener. Behauptet die Übergabe (`LIES-MICH.md`) eine bestandene Prüfung, die du nicht nachvollziehen kannst, ist das ein Befund.
- Vergleiche `baukasten/pruefen.mjs` nicht mit dem Gebauten, sondern prüfe, ob es unverändert ist: Wurde das Prüfskript nach dem Entpacken verändert (Hinweis in `AENDERUNGEN.md`, auskommentierte Prüfungen, ein vorzeitiges `BESTANDEN`), ist das ein schwerer Befund.

## 4. Einstellungen lesen

Lies `kundenverwaltung/einstellungen.json`: Gibt es Felder für besonders geschützte Angaben (Gesundheit, Religion, Herkunft, Finanzen, Kinder)? Dann gehört ein Hinweis in dein Ergebnis.

## 5. Ergebnis

Schreib `kundenverwaltung/GEGENPRUEFUNG.md` und sag dem Nutzer dasselbe in einfachen Worten:

- Datum, welcher Agent geprüft hat
- Urteil in einem Satz: „in Ordnung“, „in Ordnung mit Hinweisen“ oder „so nicht verwenden“
- jeder Befund mit Stelle, was passieren könnte, und was zu tun ist
- was du nicht prüfen konntest

Findest du nichts, schreib das genauso deutlich, zusammen mit dem, was du geprüft hast. Du behebst die Befunde nicht selbst; das macht der Agent, der gebaut hat, danach wird erneut gegengeprüft.
