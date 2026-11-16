# Regeln für KI-Agenten in diesem Projekt

Stand: {{DATUM}} · eingerichtet mit dem Baukasten „Projekt agentenfähig“ von I Can Master AI. Diese Datei gehört dem Team: Wenn ein Agent etwas falsch macht, ergänzt hier die Regel, die es beim nächsten Mal verhindert.

## Das Projekt in drei Sätzen

{{WAS_IST_DAS}}

## Befehle (im Lauf vom {{DATUM}} ausgeführt)

| Zweck | Befehl | Ergebnis |
|---|---|---|
| Abhängigkeiten | `{{BEFEHL}}` | {{läuft / schlägt fehl: … / nicht vorhanden / nicht ausgeführt: …}} |
| Build | `{{BEFEHL}}` | {{…}} |
| Tests | `{{BEFEHL}}` | {{…}} |
| Einzelner Test | `{{BEFEHL}}` | {{…}} |
| Lint | `{{BEFEHL}}` | {{…}} |
| Typprüfung | `{{BEFEHL}}` | {{…}} |

Zeilen ohne passenden Befehl bleiben stehen, mit „nicht vorhanden“. Die maschinenlesbare Fassung liegt in `docs/agenten/befehle.json`.

## Bekannter Zustand

{{Was schon vor der Einrichtung fehlschlug oder wackelt. „Nichts bekannt“, wenn alles lief.}}

## Aufbau

{{Die fünf bis zehn Orte, die ein Agent kennen muss: wo liegt was, was ist generiert, wo sind die Tests.}}

## Grenzen

- Nie ohne ausdrückliche Rückfrage ändern: {{BEREICHE}}
- Nie lesen oder ausgeben: `.env`-Dateien, Schlüssel, Zugangsdaten.
- Git: {{Darf der Agent committen? pushen? Branch-Regeln.}}
- Keine neuen Abhängigkeiten ohne Rückfrage.
- Nichts veröffentlichen, bereitstellen oder löschen.

## Arbeitsweise

1. Vor einer Änderung: betroffenen Code und seine Tests lesen. Bei Unklarheit eine Frage stellen statt raten.
2. Klein bleiben: eine Aufgabe, ein zusammenhängender Diff. Kein Umbau nebenbei.
3. Verhalten ändern heißt: erst ein Test, der das neue Verhalten verlangt und fehlschlägt, dann der Code. Skill `aenderung-umsetzen`.
4. Vor „fertig“: Skill `selbstpruefung`.
5. Nach jeder Änderung prüft ein zweiter Agent in eigener Sitzung gegen: Skill `gegenpruefung`, ausgelöst mit dem Satz „Prüf die letzte Änderung gegen.“ Wer geändert hat, prüft nicht selbst gegen. Das gilt zusätzlich zu jedem Review durch Menschen und kommt davor; es wird nicht dadurch ersetzt.
6. Abschluss: Skill `uebergabe`. Nur behaupten, was in dieser Sitzung ausgeführt wurde.

## Fertig heißt

{{Die Kriterien des Teams, als Liste.}}
