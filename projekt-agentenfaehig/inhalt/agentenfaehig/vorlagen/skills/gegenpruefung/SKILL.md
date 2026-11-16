---
name: gegenpruefung
description: Schritt für einen zweiten Agenten in eigener Sitzung. Prüft die letzte Änderung in diesem Projekt unabhängig gegen, nur lesend, und schreibt ein Urteil mit Befunden.
---

# Gegenprüfung durch einen zweiten Agenten

Du hast diese Änderung nicht geschrieben. Deine Aufgabe ist zu finden, was übersehen wurde. Du änderst keine Datei außer dem Bericht.

## Was du prüfst

1. **Umfang:** `git status` und `git diff` (bei schon committeten Änderungen der letzte Commit gegenüber seinem Vorgänger). Welche Dateien, wie viel? Passt das zum beschriebenen Auftrag (Übergabe, Commit-Nachricht, Aufgabentext)?
2. **Grenzen aus `AGENTS.md`:** Wurde ein gesperrter Bereich berührt, eine Abhängigkeit hinzugefügt, etwas committet oder gepusht, obwohl es nicht erlaubt ist?
3. **Tests:** Führe die Testsuite mit dem Befehl aus `AGENTS.md` selbst aus. Gibt es für das neue Verhalten einen Test, der ohne die Änderung fehlschlagen würde? Wurden Tests gelöscht, übersprungen (`skip`, `only`, auskommentiert) oder Erwartungen gelockert?
4. **Der Code selbst:** Lies jede geänderte Stelle mit ihrer Umgebung. Fehlerfälle, Randwerte, Eingaben von außen, Nebenwirkungen, vergessene Aufrufer.
5. **Behauptungen:** Stimmt, was in der Übergabe steht („alle Tests grün“, „nichts anderes geändert“)? Prüf es nach, statt es zu glauben.
6. **Reste und Heikles:** Debug-Ausgaben, Zugangsdaten, persönliche Angaben, auskommentierter Code.

## Bericht

Schreib `docs/agenten/GEGENPRUEFUNG.md` (überschreibt den vorigen Bericht):

- Datum, was geprüft wurde (Commit oder Arbeitsstand), wer geprüft hat, Hinweis „unabhängige Sitzung“
- **Urteil**, genau eine dieser drei Formulierungen: „in Ordnung“, „in Ordnung mit Hinweisen“ oder „so nicht übernehmen“
- je Befund: Datei und Zeile, was falsch ist oder passieren kann, wie du es nachgewiesen hast, Vorschlag
- was du ausgeführt hast (Befehle mit Ergebnis) und was du nicht prüfen konntest

„So nicht übernehmen“ gilt, sobald Tests fehlschlagen, die vorher liefen, ein Test abgeschwächt wurde, eine Grenze aus `AGENTS.md` verletzt ist, Zugangsdaten im Diff stehen oder die Änderung nicht tut, was sie behauptet.

Sag das Urteil in zwei, drei Sätzen. Du reparierst nichts selbst; das macht die Sitzung, die geändert hat.
