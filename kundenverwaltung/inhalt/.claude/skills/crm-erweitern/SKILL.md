---
name: crm-erweitern
description: Teil des Baukastens „Kleine Kundenverwaltung“. Nur verwenden, wenn ein Wunsch des Nutzers innerhalb des Umfangs mit einstellungen.json nicht zu erfüllen ist und der Code der Kundenverwaltung geändert werden muss. Enthält die festen Regeln für solche Änderungen.
---

# Erweitern (nur wenn nötig)

Die Grundlage ist geprüft. Jede Änderung am Code kann einen Schutz aushebeln, ohne dass man es der Oberfläche ansieht. Deshalb: so wenig wie möglich ändern, und nach festen Regeln.

## Vorher

- Prüfe noch einmal, ob der Wunsch nicht doch mit einem eigenen Feld, einer Stufe oder einer Notiz zu erfüllen ist. Meist ist er das.
- Liegt der Wunsch außerhalb des Umfangs (Rechnungen, E-Mail-Versand, Kalender, Erreichbarkeit von außen, Anbindung an andere Dienste), baust du ihn nicht und sagst das in der Übergabe.

## Regeln für jede Änderung an `kundenverwaltung/server.mjs`

1. **Datenbank:** Jede Abfrage nutzt Platzhalter (`?`) und übergibt die Werte getrennt. Kein Wert aus einer Anfrage wird in den Abfragetext eingesetzt, auch nicht für Sortierung oder Spaltennamen; dafür prüfst du gegen eine feste Liste.
2. **Ausgabe:** Alles, was aus der Datenbank oder aus einer Anfrage kommt, läuft durch `esc(…)`, bevor es in die Seite gesetzt wird.
3. **Anmeldung:** Jede neue Ansicht steht hinter der Zeile, die ohne Anmeldung zur Anmeldeseite schickt. Du legst keinen Weg davor an.
4. **Formulare:** Jedes Formular, das etwas ändert, wird mit `POST` gesendet und trägt das Token (`${tok}`). Ändern oder Löschen über einen bloßen Link gibt es nicht.
5. **Kein Kontakt nach außen:** keine Aufrufe fremder Adressen, keine eingebundenen Schriften oder Skripte, keine neuen Abhängigkeiten, kein Starten anderer Programme.
6. **Erreichbarkeit:** Die Adresse `127.0.0.1` und die Prüfung der angefragten Adresse bleiben unverändert.
7. **Passwörter und Sitzungen:** Den Code für Passwort, Sitzung und Anmeldebremse änderst du nicht.
8. **Tabellen:** Neue Spalten legst du nur mit `ALTER TABLE … ADD COLUMN` und Vorgabewert an, sodass vorhandene Daten erhalten bleiben. Du löschst keine Tabellen und keine Spalten.

Gestaltung: Neue Ansichten nutzen die vorhandenen Bausteine aus `style.css` (`.titelzeile`, `.stapel`, `.feld`, `.knopf`, `.liste`, `.angaben`, `.verlauf`, `.leer`). Keine neuen Farben, keine festen Pixelbreiten; Bedienflächen mindestens 44 Pixel hoch.

## Danach

- Schreib in `kundenverwaltung/AENDERUNGEN.md` in einfachen Sätzen, was du am Code geändert hast und warum (Datum, Wunsch, betroffene Ansicht).
- Weiter mit `crm-pruefen`. Das Prüfskript änderst du nicht.
- In der Übergabe sagst du, dass der Code geändert wurde und die Gegenprüfung durch einen zweiten Agenten deshalb nicht nur empfohlen, sondern nötig ist.
