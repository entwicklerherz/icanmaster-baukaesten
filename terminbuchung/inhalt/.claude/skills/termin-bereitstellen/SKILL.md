---
name: termin-bereitstellen
description: Fünfter Schritt des Baukastens Online-Terminbuchung. Legt die Datenbank in der EU an, erzeugt den Zugangsschlüssel, stellt die Terminbuchung ins Netz und prüft die Adresse selbst nach.
---

# Bereitstellen: ins Netz stellen und nachprüfen

Voraussetzung: `termin-pruefen` hat in diesem Lauf `BESTANDEN` gemeldet und `npx wrangler@4.162.0 whoami` bestätigt die Anmeldung. Sonst nicht beginnen.

Alle Befehle laufen im Ordner `terminbuchung/`. Die Vorlage `wrangler.jsonc` enthält schon den täglichen Aufräumlauf (`triggers`); lass ihn stehen.

## 1. Name festlegen

Bilde aus dem Namen des Betriebs einen Kurznamen: Kleinbuchstaben, Ziffern und Bindestriche, höchstens 40 Zeichen, zum Beispiel `termine-praxis-lindner`. Trage ihn in `wrangler.jsonc` bei `"name"` ein. Er wird Teil der Adresse.

## 2. Datenbank in der EU anlegen

`npx wrangler@4.162.0 d1 create terminbuchung --jurisdiction=eu`

Der Zusatz `--jurisdiction=eu` ist Pflicht und lässt sich später nicht nachholen. In der Ausgabe steht eine `database_id`; trage sie in `wrangler.jsonc` bei `"database_id"` ein. Gibt es die Datenbank schon (zweiter Anlauf), lies die Kennung mit `npx wrangler@4.162.0 d1 list` ab, statt eine zweite anzulegen.

## 3. Tabellen anlegen

`npx wrangler@4.162.0 d1 execute terminbuchung --remote --file=schema.sql --yes`

## 4. Zugangsschlüssel erzeugen

`node ../baukasten/schluessel.mjs`

Das Skript schreibt den Schlüssel in `baukasten/ZUGANGSSCHLUESSEL.txt` und die Anweisung für die Datenbank in `baukasten/zugang.sql`. Die Datei `ZUGANGSSCHLUESSEL.txt` öffnest du nicht und gibst sie nicht aus. Dann:

`npx wrangler@4.162.0 d1 execute terminbuchung --remote --file=../baukasten/zugang.sql --yes`

## 5. Ins Netz stellen

`npx wrangler@4.162.0 deploy`

- Am Ende der Ausgabe steht die Adresse (`https://….workers.dev`).
- **Erstes Mal bei diesem Konto:** Cloudflare braucht einmalig einen Namen für das Konto, der in allen Adressen vorkommt. Meldet das Werkzeug, dass dieser Name erst vergeben werden muss oder nicht frei ist, steht in der Meldung eine Adresse zum Dashboard. Öffne sie im Browser des Nutzers und bitte ihn: „Tragen Sie dort einen kurzen Namen für Ihr Konto ein, zum Beispiel den Ihres Betriebs, und bestätigen Sie. Schreiben Sie mir ‚fertig‘.“ Danach `npx wrangler@4.162.0 deploy` noch einmal.

## 6. Selbst nachprüfen

Die neue Adresse ist oft erst nach ein bis zwei Minuten erreichbar. Rufe sie ab; kommt keine Antwort, warte 30 Sekunden und versuch es wieder, bis zu sechsmal. Das ist normal und kein Fehler.

Prüfe dann, ohne etwas zu buchen:
- Die Startseite antwortet und nennt den Namen des Betriebs.
- `/impressum` und `/datenschutz` antworten und enthalten nicht „ANGABE FEHLT“.
- `/verwaltung` zeigt das Feld für den Zugangsschlüssel und keine Buchungen.

Du legst im Netz keine Probebuchung an und meldest dich nicht in der Verwaltung an.

## Wenn etwas nicht klappt

Sag dem Nutzer in eigenen Worten, welcher Schritt gescheitert ist und was die Meldung besagt. Schreib nicht „Ihre Seite ist online“, solange Schritt 6 nicht gelungen ist. Stelle nichts unter einem anderen Anbieter bereit und buche keinen Tarif.

Danach weiter mit `termin-uebergabe`.
