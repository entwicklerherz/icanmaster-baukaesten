---
name: crm-pruefen
description: Prüfschritt des Baukastens „Kleine Kundenverwaltung“. Spielt die eingerichtete Kundenverwaltung mit dem mitgelieferten Prüfskript durch (Anmeldung, Schutz, Anlegen, Ändern, Suchen, Notizen, Einlesen, Löschen) und bessert nach, bis sie besteht. Immer vor der Übergabe verwenden.
---

# Selbst prüfen

1. Führe im Projektordner aus: `node baukasten/pruefen.mjs`
   Das Skript startet die Kundenverwaltung mit einer leeren Wegwerf-Datenbank, spielt alles durch und räumt wieder auf. Die echten Daten fasst es nicht an.
2. Lies jede Zeile mit `FEHLER`, behebe die Ursache unter `kundenverwaltung/` und führe das Skript erneut aus.
   - Fehler bei „Einstellungen“ oder „startet“: fast immer ein Tippfehler in `einstellungen.json` (fehlendes Komma, ungültige `id`, `auswahl` ohne Liste).
   - Fehler bei einem eigenen Feld: Art und Name des Feldes prüfen.
   - Fehler bei Schutz oder Anmeldung: Du hast am Code etwas geändert, das einen Schutz aushebelt. Nimm die Änderung zurück und löse den Wunsch anders (siehe `crm-erweitern`).
3. Wiederhole das, bis die letzte Zeile `BESTANDEN` lautet. Gib nicht vorher ab und ändere das Prüfskript nicht.
   - Das Skript öffnet keinen Anschluss und läuft deshalb auch in abgeschotteten Umgebungen. Bricht es trotzdem ab, ohne `BESTANDEN` oder `NICHT BESTANDEN` auszugeben, ist die Prüfung **nicht gelaufen**.
   - Sag „bestanden“ nur, wenn du die Zeile `BESTANDEN` in der Ausgabe selbst gesehen hast. Sonst sagst du dem Nutzer, dass die Prüfung bei dir nicht lief, warum, und dass er sie nachholen soll (im Ordner: `node baukasten/pruefen.mjs`), bevor echte Daten hineinkommen.
4. Lies `einstellungen.json` noch einmal als Nutzer: Stehen dort nur Bezeichnungen, Stufen und Felder, die der Nutzer genannt hat, in seinen Worten?

Lässt sich `node` nicht ausführen, sag das in der Übergabe deutlich: Die Kundenverwaltung ist eingerichtet, aber ungeprüft, bis Node.js installiert ist und die Prüfung einmal gelaufen ist.
