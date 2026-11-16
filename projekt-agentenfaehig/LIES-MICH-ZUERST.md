# Bestehendes Projekt agentenfähig machen · Baukasten für KI-Agenten

Version 0.1.0 · für Entwicklerinnen und Entwickler · I Can Master AI · https://icanmaster.ai/baukaesten/

Du hast ein Projekt, das schon läuft, und willst, dass KI-Agenten darin verlässlich arbeiten. Der Agent liest das Projekt, probiert die Befehle für Tests, Lint und Build selbst aus, fragt dich nach euren Grenzen und schreibt daraus Regeln, die er und jeder spätere Agent befolgen. Dazu kommen vier Skills für die tägliche Arbeit, darunter die Gegenprüfung durch einen zweiten Agenten. Am Produktcode ändert das Einrichten nichts.

## Voraussetzung

- Ein Projekt in einem Git-Repository.
- Ein KI-Agent, zum Beispiel Claude Code oder Codex.
- Node.js ab Version 20 für das Prüfskript (dein Projekt selbst darf in jeder Sprache geschrieben sein).

## In drei Schritten

1. Kopiere den **Inhalt** des Ordners `inhalt` in das Wurzelverzeichnis deines Projekts: den Ordner `agentenfaehig` und den versteckten Ordner `.claude` mit den vier Skills (im Finder zeigt Befehl + Umschalt + Punkt versteckte Ordner). Gibt es bei dir schon einen Ordner `.claude`, kopierst du nur `skills` hinein. Im Terminal: `cp -R <paket>/inhalt/agentenfaehig . && mkdir -p .claude/skills && cp -R <paket>/inhalt/.claude/skills/* .claude/skills/`
2. Starte dort deinen Agenten und schreib: **„Lies agentenfaehig/EINRICHTEN.md und mach dieses Projekt agentenfähig.“** Er stellt höchstens fünf Fragen (gesperrte Bereiche, was „fertig“ heißt, Umgang mit Git, Altlasten), schreibt die Regeln und prüft alles mit `node agentenfaehig/pruefen.mjs`.
3. Lies `AGENTS.md` durch und korrigiere, was nicht stimmt. Die Regeln gehören dir. Committe sie, wenn sie passen.

## Was danach in deinem Projekt liegt

- `AGENTS.md` und `CLAUDE.md` (gleicher Inhalt): das Projekt in drei Sätzen, die Befehle, der bekannte Zustand, der Aufbau, die Grenzen, die Arbeitsweise und was „fertig“ heißt
- `docs/agenten/befehle.json`: jeder Befehl im Wortlaut mit dem Ergebnis des Probelaufs (läuft, schlägt fehl, nicht vorhanden, nicht ausgeführt)
- `.claude/skills/`: vier Skills (von dir kopiert; der Agent schreibt nicht in diesen Ordner)
  - `aenderung-umsetzen`: erst lesen, klein ändern, Test zuerst
  - `selbstpruefung`: Befehle ausführen und Ergebnis zeigen, bevor „fertig“ gesagt wird
  - `uebergabe`: was geändert wurde, was geprüft ist, was offen bleibt
  - `gegenpruefung`: ein zweiter Agent prüft die Änderung nur lesend und schreibt ein Urteil

## Die tägliche Arbeit

Aufgaben formulierst du wie gewohnt. Nach jeder Änderung öffnest du das Projekt in einem zweiten Agenten oder einer neuen Sitzung und schreibst: **„Prüf die letzte Änderung gegen.“** Der zweite Agent ändert nichts; er führt die Tests selbst aus, vergleicht die Änderung mit den Grenzen und der Übergabe und schreibt sein Urteil nach `docs/agenten/GEGENPRUEFUNG.md`.

Macht ein Agent etwas falsch, gehört die Korrektur als Regel in `AGENTS.md`. So werden die Regeln mit der Zeit besser.

## Gut zu wissen

- Der Agent führt beim Einrichten die Befehle deines Projekts aus (Tests, Lint, Build). Befehle, die veröffentlichen, bereitstellen, löschen oder Geld kosten, führt er nicht aus. `.env`-Dateien liest er nicht.
- Das Prüfskript liest nur Dateien und fragt Git nach geänderten Dateien. Es führt keine Befehle deines Projekts aus und braucht kein Netz.
- Den Ordner `agentenfaehig` kannst du nach dem Einrichten löschen oder für spätere Prüfläufe behalten.
- Regeln ersetzen kein Review. Sie senken die Zahl der Fehler; die Gegenprüfung findet einen Teil des Rests.
- `PRUEFBERICHT.md`: wie getestet und gescannt wurde, mit Ergebnissen und Grenzen. `LIZENZ.md`: was du mit dem Baukasten tun darfst.
- Wenn du nicht weiterkommst: kontakt@entwicklerherz.de oder live im Workshop, https://icanmaster.ai/seminare/
