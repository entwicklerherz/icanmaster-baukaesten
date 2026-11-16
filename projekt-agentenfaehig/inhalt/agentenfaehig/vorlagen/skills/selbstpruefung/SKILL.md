---
name: selbstpruefung
description: Prüft die eigene Änderung, bevor sie als fertig gilt: Tests, Lint und Typprüfung mit den Befehlen aus AGENTS.md ausführen und den eigenen Diff kritisch lesen.
---

# Selbstprüfung

1. **Befehle ausführen,** genau wie in `AGENTS.md` unter „Befehle“: die ganze Testsuite, Lint und Typprüfung, soweit vorhanden. Lies die Ausgabe ganz. Ein Fehlschlag, den du nicht verursacht hast und der unter „Bekannter Zustand“ steht, wird genannt, nicht versteckt.
2. **Eigenen Diff lesen** (`git diff`), Zeile für Zeile, als wäre er von jemand anderem:
   - Tut er nur, was beauftragt war?
   - Wurden Tests gelöscht, übersprungen oder abgeschwächt?
   - Sind Reste drin (Debug-Ausgaben, auskommentierter Code, TODOs ohne Zusammenhang)?
   - Wurde eine Grenze aus `AGENTS.md` berührt?
   - Stehen Zugangsdaten oder persönliche Angaben im Diff?
3. **Fehlerfälle:** Was passiert bei leerer, falscher, sehr großer Eingabe? Gibt es dafür einen Test?
4. Etwas gefunden: beheben und Schritt 1 wiederholen.
5. Weiter mit `uebergabe`. Schreib nie „Tests bestehen“, wenn du sie in dieser Sitzung nach der letzten Änderung nicht ausgeführt hast.
