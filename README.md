# Baukästen für KI-Agenten · I Can Master AI

Ein Baukasten ist ein Ordner mit Skills, Regeln und Material für ein bestimmtes Vorhaben. Du legst ihn in einen leeren Ordner, startest deinen KI-Agenten (Claude Code oder Codex) und schreibst einen Satz. Der Agent fragt nach, was er wissen muss, baut, prüft sein Ergebnis und erklärt dir, wie es weitergeht.

Alle Baukästen sind kostenlos, in einem Prüfstand getestet und mit NVIDIA SkillSpector gescannt. Was dabei herauskam und was schiefging, steht im jeweiligen `PRUEFBERICHT.md`.

| Baukasten | Version | Dein Satz | Getestet mit | Sicherheitsscan |
|---|---|---|---|---|
| [Website ohne Backend und Datenbank](website-ohne-backend/) | 0.5.1 | „Bau mir eine Website.“ | Claude Code und Codex | 15 von 100 Risikopunkten, Empfehlung „SAFE“ |
| [Kleine Kundenverwaltung auf dem eigenen Rechner](kundenverwaltung/) | 0.1.0 | „Bau mir eine Kundenverwaltung.“ | Claude Code und Codex | 17 von 100 Risikopunkten, Empfehlung „SAFE“ |

Stand: 15. November 2026. Beispiele, Bildschirmfotos und die Zahlen aus den Testläufen: <https://icanmaster.ai/baukaesten/>

## So benutzt du einen Baukasten

1. Lade dieses Repository herunter („Code“ → „Download ZIP“) oder klone es.
2. Kopiere den **Inhalt** des Ordners `inhalt` aus dem gewünschten Baukasten in einen neuen, leeren Ordner. Darin liegt auch der versteckte Ordner `.claude` mit den Skills; er muss mit.
3. Starte in diesem Ordner deinen KI-Agenten und schreib den Satz aus der Tabelle.

Die ausführliche Anleitung steht in `LIES-MICH-ZUERST.md` des Baukastens.

## Was du wissen solltest

- KI-Agenten arbeiten nicht jedes Mal gleich. Prüfe das Ergebnis, bevor du es benutzt oder veröffentlichst.
- Impressum und Datenschutzseite, die ein Agent anlegt, sind Entwürfe aus deinen Angaben und keine Rechtsberatung.
- Der Sicherheitsscan liest Anleitungen, Regeln und Programme. Er ersetzt keine Sicherheitsprüfung durch Fachleute.

## Lizenz

Kostenlos für eigene Vorhaben und Kundenvorhaben, privat wie geschäftlich; anpassen ist erlaubt. Nicht erlaubt ist, die Baukästen selbst zu verkaufen oder als eigenes Produkt zu veröffentlichen. Die genauen Bedingungen stehen in `LIZENZ.md` des jeweiligen Baukastens. Das ist keine Open-Source-Lizenz.

## Mehr lernen

Im Workshop „Deine App. Heute live.“ führst du einen Agenten selbst: Aufträge geben, Ergebnisse prüfen, nachbessern. Termine: <https://icanmaster.ai/seminare/>

Neue Baukästen per E-Mail: <https://icanmaster.ai/erinnerung/>

Fragen: kontakt@entwicklerherz.de · Entwicklerherz GmbH, Am Hauptbahnhof 16, 60329 Frankfurt am Main
