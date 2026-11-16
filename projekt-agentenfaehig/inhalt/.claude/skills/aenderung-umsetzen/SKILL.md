---
name: aenderung-umsetzen
description: Setzt in diesem Projekt eine kleine, klar umrissene Änderung um: erst lesen, dann ein fehlschlagender Test, dann der Code, innerhalb der Grenzen aus AGENTS.md.
---

# Änderung umsetzen

1. **Auftrag in einem Satz wiederholen.** Ist er mehrdeutig oder berührt er einen Bereich aus „Grenzen“ in `AGENTS.md`, stell eine Frage und warte.
2. **Lesen:** den betroffenen Code, seine Tests und die Aufrufer. Such nach vorhandenen Mustern und halte dich daran.
3. **Test zuerst:** Schreib einen Test, der das gewünschte Verhalten verlangt, und führ ihn aus. Er muss aus dem richtigen Grund fehlschlagen (das Verhalten fehlt, kein Tippfehler). Besteht er sofort, prüft er nichts Neues: anpassen. Gibt es im Projekt keine Tests, sag das und frag, ob du einen anlegen oder ohne Test arbeiten sollst.
4. **Kleinste Änderung,** die den Test bestehen lässt. Kein Umbau nebenbei, keine neuen Abhängigkeiten, keine Änderungen außerhalb des Auftrags. Fällt dir dabei etwas auf, notier es für die Übergabe.
5. **Tests nicht verbiegen:** Bestehende Tests werden nicht gelöscht, übersprungen oder abgeschwächt, damit etwas grün wird. Ist ein Test falsch, sag es und frag.
6. Weiter mit `selbstpruefung`.
