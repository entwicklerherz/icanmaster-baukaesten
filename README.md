# Baukästen für KI-Agenten · I Can Master AI

Ein Baukasten ist ein Ordner mit Skills, Regeln und Material für ein bestimmtes Vorhaben. Du legst ihn in einen leeren Ordner, startest deinen KI-Agenten (Claude Code oder Codex) und schreibst einen Satz. Der Agent fragt nach, was er wissen muss, baut, prüft sein Ergebnis und erklärt dir, wie es weitergeht.

Alle Baukästen sind kostenlos, in einem Prüfstand getestet und mit NVIDIA SkillSpector gescannt. Was dabei herauskam und was schiefging, steht im jeweiligen `PRUEFBERICHT.md`.

| Baukasten | Version | Dein Satz | Getestet mit | Sicherheitsscan |
|---|---|---|---|---|
| [Website ohne Backend und Datenbank](website-ohne-backend/) | 0.5.1 | „Bau mir eine Website.“ | Claude Code und Codex | 15 von 100 Risikopunkten, Empfehlung „SAFE“ |
| [Kleine Kundenverwaltung auf dem eigenen Rechner](kundenverwaltung/) | 0.1.0 | „Bau mir eine Kundenverwaltung.“ | Claude Code und Codex | 17 von 100 Risikopunkten, Empfehlung „SAFE“ |
| [Online-Terminbuchung](terminbuchung/) | 0.1.0 | „Bau mir eine Terminbuchung.“ | Claude Code und Codex | schwankt: 23, 14, 24, 14, 16, 22 von 100 Punkten (dreimal „SAFE“, dreimal „CAUTION“), nie „hoch“ oder „kritisch“ |
| [Kundenportal](kundenportal/) | 0.1.0 | „Bau mir ein Kundenportal.“ | Claude Code und Codex | schwankt: 21, 13, 4 von 100 Punkten (einmal „CAUTION“, zweimal „SAFE“), nie „hoch“ oder „kritisch“ |
| [Bestehendes Projekt agentenfähig machen](projekt-agentenfaehig/) (für Entwickler) | 0.1.0 | „Lies agentenfaehig/EINRICHTEN.md und mach dieses Projekt agentenfähig.“ | Claude Code und Codex | Inhalt 0 Punkte, „SAFE“; Paket schwankt: 9, 17, 31 (zweimal „SAFE“, einmal „CAUTION“), nie „hoch“ oder „kritisch“ |

Stand: 16. November 2026. Bei den drei Baukästen vom 16. November stuft der Scanner mit Sprachmodell dasselbe Paket von Durchgang zu Durchgang verschieden ein; die Hinweise betreffen fast nur die deutsche Sprache ohne Sprachwahl. Alle Ergebnisse stehen im jeweiligen Prüfbericht. Beispiele, Bildschirmfotos und die Zahlen aus den Testläufen: <https://icanmaster.ai/baukaesten/>

## So benutzt du einen Baukasten

1. Lade dieses Repository herunter („Code“ → „Download ZIP“) oder klone es.
2. Kopiere den **Inhalt** des Ordners `inhalt` aus dem gewünschten Baukasten in einen neuen, leeren Ordner. Darin liegt auch der versteckte Ordner `.claude` mit den Skills; er muss mit.
3. Starte in diesem Ordner deinen KI-Agenten und schreib den Satz aus der Tabelle.

Ausnahme: Beim Baukasten für Entwickler kopierst du den Inhalt von `inhalt` in das Wurzelverzeichnis deines bestehenden Projekts, nicht in einen leeren Ordner. Terminbuchung und Kundenportal brauchen außerdem Node.js und ein kostenloses Konto beim Anbieter Cloudflare; der Agent führt dich dorthin.

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
