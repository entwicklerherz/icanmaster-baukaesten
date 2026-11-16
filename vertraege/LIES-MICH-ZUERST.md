# Verträge und Fristen: Überblick, Kündigungstermine, Schreiben vorbereiten · Helfer für KI-Agenten

Version 0.1.0 · I Can Master AI · https://icanmaster.ai/

Handy, Strom, Versicherung, Fitnessstudio, Streaming, Zeitschrift: Dieser Helfer macht aus dem Stapel deiner Verträge und Rechnungen eine Übersicht. Dein Agent liest die Dokumente, hält zu jedem Vertrag fest, was er kostet und was zu Laufzeit und Kündigung darin steht, und ein Skript rechnet daraus, bis wann du spätestens kündigen musst. Dazu gibt es eine Kalenderdatei mit Erinnerungen und, wenn du kündigen willst, ein fertiges Schreiben zum Unterschreiben.

## Voraussetzung

- Ein KI-Agent, zum Beispiel Claude Code oder Codex.
- Node.js ab Version 22 (kostenlos, nodejs.org, die Fassung „LTS“). Das ist das Programm, mit dem der Helfer rechnet und die Übersicht baut.

## In vier Schritten

1. Kopiere den **Inhalt** des Ordners `inhalt` in einen neuen, leeren Ordner, zum Beispiel „Verträge“. Achtung: Darin liegt auch ein versteckter Ordner `.claude` mit den Skills. Er muss mit (im Finder zeigt Befehl + Umschalt + Punkt versteckte Ordner; unter Windows „Ausgeblendete Elemente“ einschalten).
2. Leg in den Ordner `eingang`, was du hast: Verträge, Vertragsbestätigungen, Rechnungen, Beitragsschreiben. Als gespeicherte E-Mail, Text oder PDF; Papier fotografierst oder scannst du. Kontoauszüge und Zugangsdaten gehören nicht hinein.
3. Starte in diesem Ordner deinen KI-Agenten und schreib einen Satz: **„Verschaff mir einen Überblick über meine Verträge.“**
4. Öffne die Datei `uebersicht.html` mit einem Doppelklick im Browser. Die Datei `fristen.ics` trägt die Termine mit Erinnerung in deinen Kalender ein (Doppelklick, oder aufs Handy schicken und antippen).

So geht es weiter: „Bereite die Kündigung für die Kfz-Versicherung vor“, „Gekündigt“, „Die Bestätigung ist da“, „Neue Unterlagen“, „Aktualisiere die Übersicht“.

## Was der Helfer bewusst nicht tut

- **Er gibt keine Rechtsauskunft zu deinem Vertrag.** Er rechnet mit dem, was im Vertrag steht. Ob eine Klausel gilt oder ob du früher herauskommst, klärt die Verbraucherzentrale oder eine Rechtsberatung. Wo eine allgemeine gesetzliche Regel naheliegt, steht in der Übersicht ein Hinweis mit Verweis auf den Gesetzestext und dem Tag, an dem wir ihn geprüft haben.
- **Er kündigt nichts und schickt nichts ab.** Schreiben sind Entwürfe mit festem Wortlaut; unterschreiben und abschicken tust du.
- **Er öffnet keine Kundenportale und fragt nie nach Passwörtern oder Kontodaten.**
- **Er empfiehlt keinen Anbieter und beurteilt keinen Preis.**
- **Er übernimmt nur, was in deinen Dokumenten steht.** Jede Angabe trägt den Wortlaut des Dokuments als Zitat; ein Skript vergleicht beides. Was fehlt, steht als offen in der Übersicht.

## Was im Paket liegt

- `inhalt/AGENTS.md`, `inhalt/CLAUDE.md`: die Leitdatei für den Agenten
- `inhalt/.claude/skills/`: fünf Skills (Unterlagen erfassen, Kündigung vorbereiten, Stand festhalten, Fragen an der Grenze zum Recht, Erinnerungen)
- `inhalt/baukasten/vertraege.mjs`, `lesen.mjs`, `seiten.mjs`: das Skript, das Dokumente lesbar macht, Zitate prüft, Kosten und Termine rechnet und Übersicht, Kalenderdatei und Schreiben baut. Es lädt nichts aus dem Netz und schickt nichts hinaus.
- `inhalt/baukasten/grundlage/hinweise.json`: die allgemeinen Hinweise auf gesetzliche Regeln, mit Quelle und Prüfdatum
- `inhalt/eingang/`: hier hinein kommen deine Dokumente
- `PRUEFBERICHT.md`: wie getestet und gescannt wurde, mit Ergebnissen und Grenzen
- `LIZENZ.md`: was du mit dem Helfer tun darfst

## Gut zu wissen

- Die Termine sind gerechnet, nicht geprüft: aus Beginn, Laufzeit, Verlängerung und Frist, so wie sie im Dokument stehen. Liest der Agent eine Angabe falsch ab, stimmt der Termin nicht. In der Übersicht steht zu jedem Vertrag der Wortlaut zum Gegenlesen. Bei knappen Fristen kündige früh.
- Die Übersicht gilt für den Tag, an dem sie entstand. Sag „Aktualisiere die Übersicht“, bevor du dich auf einen Termin verlässt.
- Alles bleibt in deinem Ordner auf deinem Rechner. Der Agent selbst arbeitet bei seinem Anbieter (Anthropic, OpenAI); was er liest, geht dorthin. Leg nur hinein, was du ihm zeigen willst.
- Wenn du nicht weiterkommst: kontakt@entwicklerherz.de
