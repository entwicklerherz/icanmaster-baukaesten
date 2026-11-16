---
name: portal-pruefen
description: Dritter Schritt des Baukastens Kundenportal. Prüft das eingerichtete Kundenportal mit dem mitgelieferten Prüfskript, ohne Internet und ohne echte Daten, und bessert die Einstellungen nach, bis die Prüfung besteht.
---

# Prüfen: besteht das Kundenportal?

## Schritte

1. Führe im Hauptordner aus: `node baukasten/pruefen.mjs`. Das Skript ruft das Kundenportal direkt auf, mit einer leeren Wegwerf-Datenbank im Arbeitsspeicher. Es braucht kein Internet, öffnet keinen Anschluss und berührt keine echten Kunden und Unterlagen.
2. Lies die Ausgabe ganz. Jede Zeile beginnt mit `ok` oder `FEHLER`; am Ende steht `BESTANDEN` oder `NICHT BESTANDEN`.
3. Bei Fehlern: Behebe die Ursache in `kundenportal/einstellungen.json` (fehlende Angaben, unmögliche Zeiten) und prüfe erneut. Meldet die Prüfung, dass das Programm von der Grundlage abweicht, stelle die Dateien aus `baukasten/grundlage/src/` wieder her.
4. Das Prüfskript änderst du nicht, und du schwächst keine Prüfung ab.

## Ehrlichkeit

- Schreib „Prüfung bestanden“ nur, wenn du die Zeile `BESTANDEN` in der Ausgabe dieses Laufs gesehen hast. Nenne die Zahl der Prüfungen aus der Ausgabe.
- Lässt sich das Skript nicht ausführen (zum Beispiel weil Node.js fehlt oder älter als 22.13 ist), sag das dem Nutzer mit der Fehlermeldung in eigenen Worten und stelle nichts ins Netz, bevor die Prüfung gelaufen ist.

Danach weiter mit `portal-konto`.
