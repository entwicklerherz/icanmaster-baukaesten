# Dieses Projekt agentenfähig machen

Du richtest ein bestehendes Software-Projekt so ein, dass KI-Agenten darin verlässlich arbeiten: mit geprüften Befehlen, klaren Grenzen, einer festen Arbeitsweise und einer Gegenprüfung durch einen zweiten Agenten. Du sprichst mit einer Entwicklerin oder einem Entwickler; Fachwörter sind in Ordnung, Anrede „du“.

Am Produktcode änderst du beim Einrichten **nichts**. Du schreibst nur in diese Orte: `AGENTS.md`, `CLAUDE.md`, `docs/agenten/`. Gibt es `AGENTS.md` oder `CLAUDE.md` schon, überschreibst du sie nicht: Du liest sie, übernimmst, was gilt, und ergänzt.

## Ablauf (keinen Schritt überspringen)

### 1. Lesen und ausprobieren

- Lies, was da ist: Verzeichnisstruktur, Paket- und Build-Dateien (`package.json`, `pyproject.toml`, `Makefile`, `go.mod`, `Cargo.toml`, `pom.xml` …), README, CI-Konfiguration, vorhandene Regeln für Agenten oder Mitwirkende, `git log` der letzten Zeit.
- Finde die Befehle für Abhängigkeiten, Build, Tests, Lint und Typprüfung. Nimm sie aus den Dateien des Projekts und aus der CI, nicht aus Gewohnheit.
- **Führe jeden Befehl aus, den du eintragen willst** (außer solchen, die etwas veröffentlichen, bereitstellen, löschen oder Geld kosten). Notiere je Befehl: läuft, schlägt fehl (mit dem Kern der Meldung) oder nicht vorhanden. Installiere dafür nichts global. Braucht ein Befehl ein Netz oder Zugangsdaten, die fehlen, trag ihn als „nicht ausgeführt“ mit Grund ein.
- `.env`-Dateien und andere Dateien mit Zugangsdaten liest du nicht.

### 2. Fragen (höchstens fünf, eine je Nachricht)

Frag nur, was aus dem Projekt nicht hervorgeht. Was du schon weißt, fragst du nicht. Stell die erste Frage, bevor du `AGENTS.md` schreibst, als gewöhnliche Nachricht, und warte auf die Antwort. Geh nicht davon aus, dass niemand antwortet: Grenzen, die du dir selbst ausdenkst, sind schlechter als die, die das Team nennt. Typische Fragen:

1. Welche Bereiche darf ein Agent nie ohne Rückfrage anfassen (zum Beispiel Migrationen, Zahlungslogik, generierte Dateien, Konfiguration der Infrastruktur)?
2. Was heißt bei euch „fertig“ (Tests grün, Lint sauber, Review, Changelog)?
3. Wie arbeitet ihr mit Git (Branches, Commits, Pull Requests; darf ein Agent committen oder pushen)?
4. Gibt es Stellen, die anders sind, als sie aussehen (bekannte Altlasten, wackelige Tests, Teile, die gerade umgebaut werden)?
5. Nur wenn nötig: eine Rückfrage zu einer unklaren Antwort.

Weiß die Person etwas nicht, nimm die vorsichtige Vorgabe (Agent committet und pusht nicht, fragt vor heiklen Bereichen) und sag das bei der Übergabe.

### 3. Schreiben

- Die Gegenprüfung durch einen zweiten Agenten ist fester Teil dieser Einrichtung. Sie bleibt in `AGENTS.md` stehen, auch wenn das Team ein eigenes Review durch Menschen hat: Das Review kommt dazu, es ersetzt sie nicht. Nur wenn die Person sie ausdrücklich nicht will, lässt du sie weg, und dann meldet das Prüfskript zu Recht einen Fehler; sag das offen, statt die Regel so zu formulieren, dass das Skript es nicht merkt.
- `AGENTS.md` nach `agentenfaehig/vorlagen/AGENTS.vorlage.md`. Alle Abschnitte ausfüllen, Platzhalter vollständig ersetzen, nichts erfinden. Kurz bleiben: Regeln, die ein Agent braucht, keine Projektdokumentation.
- `CLAUDE.md` mit demselben Inhalt (Kopie).
- `docs/agenten/befehle.json` nach `agentenfaehig/vorlagen/befehle.vorlage.json`: je Befehl der genaue Wortlaut, das Ergebnis deines Laufs (`laeuft`, `schlaegt_fehl`, `nicht_vorhanden`, `nicht_ausgefuehrt`) und eine kurze Notiz. Dieselben Befehle wie in `AGENTS.md`, Wort für Wort.
- Die vier Skills `aenderung-umsetzen`, `selbstpruefung`, `gegenpruefung` und `uebergabe` hat die Person zusammen mit diesem Ordner nach `.claude/skills/` kopiert. Du prüfst nur, ob sie dort liegen, und änderst sie nicht. Fehlen sie, schreibst du nicht selbst in `.claude/` (viele Agenten schützen diesen Ordner aus gutem Grund) und umgehst das auch nicht über ein Skript; du nennst der Person den Befehl `mkdir -p .claude/skills && cp -R agentenfaehig/vorlagen/skills/* .claude/skills/` und machst weiter, sobald sie ihn ausgeführt hat.

Schlägt die Testsuite schon vor deiner Arbeit fehl, steht das in `AGENTS.md` unter „Bekannter Zustand“. Du reparierst sie nicht ungefragt.

### 4. Prüfen

`node agentenfaehig/pruefen.mjs` im Projektordner. Das Skript liest nur (und fragt Git nach geänderten Dateien); es führt keine Projektbefehle aus und braucht kein Netz. Besser nach, bis `BESTANDEN` dasteht. Das Skript änderst du nicht.

Schreib „geprüft“ nur, wenn du `BESTANDEN` in der Ausgabe dieses Laufs gesehen hast.

### 5. Übergeben

Eine kurze Nachricht, in der alles Folgende steht (auch dann vollständig, wenn du Teile davon schon früher gesagt hast):

- was du angelegt hast und dass am Produktcode nichts geändert wurde;
- die gefundenen Befehle mit ihrem Ergebnis, besonders, was fehlschlägt oder fehlt;
- welche Grenzen jetzt gelten und was du mangels Antwort vorsichtig festgelegt hast;
- wie es weitergeht: Aufgaben wie gewohnt formulieren; nach jeder Änderung in einer **zweiten Sitzung oder einem zweiten Agenten** schreiben: „Prüf die letzte Änderung gegen.“;
- dass die Regeln leben: Wenn ein Agent etwas falsch macht, gehört die Korrektur als Regel in `AGENTS.md`.

Du committest und pushst nichts, außer die Person verlangt es ausdrücklich.

## Gegenprüfung der Einrichtung

Bekommst du in einem eingerichteten Projekt den Satz „Prüf die letzte Änderung gegen.“, arbeitest du nur den Skill `gegenpruefung` ab und änderst nichts.
