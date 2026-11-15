---
name: crm-einrichten
description: Zweiter Schritt des Baukastens „Kleine Kundenverwaltung“. Legt die fertige Grundlage in den Ordner kundenverwaltung und schneidet sie über einstellungen.json auf das Vorhaben zu (Name, Bezeichnungen, Stufen, eigene Felder). Nach crm-gespraech verwenden.
---

# Einrichten

## 1. Voraussetzung prüfen

Führe `node --version` aus. Die Kundenverwaltung braucht Node.js ab Version 22.13.

- Fehlt Node.js oder ist es älter: Sag dem Nutzer in einem Satz, was das ist („das Programm, das die Kundenverwaltung auf Ihrem Rechner laufen lässt, kostenlos“), und dass er es von nodejs.org installiert (die Fassung mit dem Zusatz „LTS“). Installiere es nicht selbst. Richte trotzdem alles ein und sag in der Übergabe, dass die Prüfung noch aussteht.

## 2. Grundlage kopieren

Kopiere den Inhalt von `baukasten/grundlage/` nach `kundenverwaltung/` (`cp -R`). Gibt es `kundenverwaltung/` schon, überschreibst du nur `server.mjs`, `style.css` und die Startdateien, nie `einstellungen.json` und nie den Ordner `daten/`.

## 3. Zuschneiden: nur `kundenverwaltung/einstellungen.json`

```json
{
  "titel": "Tischlerei Brandt",
  "einzahl": "Kunde",
  "mehrzahl": "Kunden",
  "stufen": ["Anfrage", "Angebot", "Auftrag"],
  "felder": [
    {"id": "baustelle", "name": "Adresse der Baustelle", "art": "text"},
    {"id": "geburtstag", "name": "Geburtstag", "art": "datum"},
    {"id": "herkunft", "name": "Kam über", "art": "auswahl", "auswahl": ["Empfehlung", "Internet", "Schild am Wagen"]},
    {"id": "wuensche", "name": "Wünsche", "art": "lang"}
  ]
}
```

- `titel`: Name des Betriebs oder Vorhabens, so wie der Nutzer ihn nennt.
- `einzahl`, `mehrzahl`: die Bezeichnung aus dem Gespräch. Unsicher: „Kontakt“, „Kontakte“.
- `stufen`: höchstens acht, in der Reihenfolge, in der jemand sie durchläuft. Keine Stufen: leere Liste `[]`.
- `felder`: höchstens zwölf. `id` nur Kleinbuchstaben, Ziffern und Unterstrich, mit Buchstabe am Anfang, keine Umlaute. `name` ist das, was der Nutzer sieht.
- Arten: `text` (eine Zeile), `lang` (mehrere Zeilen), `datum`, `zahl`, `auswahl` (mit Liste `auswahl`). Nimm `auswahl` nur, wenn der Nutzer die Möglichkeiten genannt hat; sonst `text`. Erfinde keine Auswahlmöglichkeiten.
- Name, Firma, Telefon, E-Mail, Notizen und Wiedervorlagen gibt es immer. Lege dafür keine eigenen Felder an.
- **Gibt es eine Liste:** Nenne die eigenen Felder so wie die Spalten der Liste („Ort“, „Bemerkung“). Beim Einlesen werden Spalten über ihren Namen zugeordnet; Spalten ohne passendes Feld landen als Notiz beim Eintrag und gehen nicht verloren.

Mehr änderst du in diesem Schritt nicht. `server.mjs` und `style.css` bleiben, wie sie sind.

## 4. Reicht das?

Lässt sich jeder Wunsch aus dem Gespräch mit Titel, Bezeichnungen, Stufen und Feldern erfüllen, geht es weiter mit `crm-pruefen`. Nur wenn ein Wunsch innerhalb des Umfangs (Einträge, Notizen, Wiedervorlagen, Suche, Zugänge) damit nicht zu erfüllen ist, arbeitest du vorher `crm-erweitern` ab.

## 5. Daten später ändern

Kommt ein Feld später dazu, ergänzt du es in `einstellungen.json`; vorhandene Einträge bleiben erhalten. Entfernst du ein Feld, bleiben seine alten Angaben gespeichert, werden aber nicht mehr gezeigt. Eine `id` änderst du nie nachträglich, sonst sind die Angaben dieses Feldes nicht mehr sichtbar. Nach jeder Änderung muss die Kundenverwaltung neu gestartet werden.
