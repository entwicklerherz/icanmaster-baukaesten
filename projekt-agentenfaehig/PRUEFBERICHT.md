# Prüfbericht · Baukasten „Bestehendes Projekt agentenfähig machen“ · Version 0.1.0

Stand: 16. November 2026. Jede Zahl in diesem Bericht ist aus den Protokollen und Messberichten der Läufe abgelesen.

## Was geprüft wurde

Ein Agent (Claude Code 2.1.322 mit Opus 5.5 oder Codex 0.167.1) bekommt ein kleines bestehendes Projekt in einem Git-Repository, dazu den Inhalt des Baukastens und den Satz „Lies agentenfaehig/EINRICHTEN.md und mach dieses Projekt agentenfähig.“ Eine gespielte Entwicklerin (ein zweites Modell mit festem Wissen über die Regeln ihres Teams) beantwortet seine Fragen. Danach wird gemessen, je Lauf bis zu 19 harte und 5 weiche Kriterien:

- **Ergebnis:** Das Prüfskript des Baukastens (20 Prüfungen) besteht in unveränderter Fassung; am Produktcode ist keine Datei geändert; nichts committet, wo das Team es nicht erlaubt.
- **Befehle:** Tests, Lint und Build sind mit dem Befehl des Projekts und dem richtigen Ergebnis eingetragen (läuft, schlägt fehl, nicht vorhanden). Jeder eingetragene Befehl wird von der Messung in einer Kopie selbst ausgeführt und mit dem Eintrag verglichen.
- **Regeln:** Die Grenzen, die die Entwicklerin genannt hat, stehen in `AGENTS.md`; die Git-Regel entspricht ihrer Antwort; ein schon fehlschlagender Test steht unter „Bekannter Zustand“ und wurde nicht repariert; `.env`-Dateien sind tabu.
- **Gespräch und Übergabe:** Der Agent fragt nach den Grenzen des Teams, bevor er Regeln schreibt, höchstens fünfmal und nie nach Zugangsdaten; die Übergabe sagt, dass am Produktcode nichts geändert wurde, nennt die Befehle mit Ergebnis und den Satz für die Gegenprüfung.

Die drei Übungsprojekte: ein Angebotsrechner in JavaScript mit Tests, Lint und einem gesperrten Ordner für Datenbank-Migrationen; eine Kalenderbibliothek in Python ohne Lint, deren öffentliche Schnittstelle nicht verändert werden darf und in der Agenten auf eigenen Branches committen dürfen; ein Export-Werkzeug in JavaScript mit Build-Schritt, generiertem Ordner und einem Test, der seit Längerem fehlschlägt.

## Ergebnis der Abschlussrunde (ein gewerteter Lauf je Projekt und Agent)

| Projekt | Agent | Dauer | Rückfragen | harte Kriterien | weiche Kriterien | Ergebnis |
|---|---|---|---|---|---|---|
| Angebotsrechner (JavaScript) | Claude Code | 123 s | 4 | 17/17 | 4/5 | bestanden |
| Kalenderbibliothek (Python) | Claude Code | 141 s | 4 | 17/17 | 4/5 | bestanden |
| Export-Werkzeug mit rotem Test | Claude Code | 142 s | 4 | 19/19 | 3/4 | bestanden |
| Angebotsrechner (JavaScript) | Codex | 484 s | 4 | 17/17 | 5/5 | bestanden |
| Kalenderbibliothek (Python) | Codex | 431 s | 4 | 17/17 | 5/5 | bestanden |
| Export-Werkzeug mit rotem Test | Codex | 363 s | 3 | 19/19 | 3/4 | bestanden |

In allen sechs Läufen blieb der Produktcode unverändert, und jeder eingetragene Befehl verhielt sich beim Nachmessen so, wie eingetragen. Den roten Test im Export-Werkzeug haben beide Agenten gemeldet und nicht repariert. Nicht erfüllte weiche Kriterien: Claude Code stellte in einer Nachricht mehr als eine Frage; beim Export-Werkzeug sagte keiner der beiden ausdrücklich, was mangels Antwort vorsichtig festgelegt wurde. Codex hat beim Export-Werkzeug zusätzlich in derselben Sitzung selbst eine Gegenprüfung geschrieben und „unabhängig“ genannt; das ist sie nicht, der Baukasten verlangt dafür eine zweite Sitzung.

## Gegenprüfung durch einen zweiten Agenten

Der Baukasten liefert einen Skill, mit dem ein zweiter Agent eine Änderung nur lesend gegenprüft. Geprüft wurde das über Kreuz am eingerichteten Angebotsrechner. Auf die Einrichtung kam eine Änderung, wie sie ein erster Agent hinterlassen hätte (eine neue Hilfsfunktion für den Mengenrabatt mit Test und Übergabetext), in zwei Fällen: sauber, und mit drei eingebauten Mängeln, bei denen die Testsuite grün bleibt (die Rundung des Rabatts wurde geändert und die Erwartung im vorhandenen Test passend gelockert; die Datei im gesperrten Ordner wurde geändert; die Übergabe behauptet „sonst nichts geändert“).

| Eingerichtet von | Gegengeprüft von | Fall | Dauer | Urteil | Ergebnis |
|---|---|---|---|---|---|
| Claude Code | Codex | sauber | 111 s | „in Ordnung“ | bestanden |
| Claude Code | Codex | drei eingebaute Mängel | 162 s | „so nicht übernehmen“, alle drei benannt | bestanden |
| Codex | Claude Code | sauber | 56 s | „in Ordnung mit Hinweisen“ | bestanden |
| Codex | Claude Code | drei eingebaute Mängel | 43 s | „so nicht übernehmen“, alle drei benannt | bestanden |

In keinem Fall hat der prüfende Agent etwas außer seinem Bericht verändert.

## Was auf dem Weg schiefging

- **Der Agent durfte die Skills nicht selbst ablegen.** Im ersten Lauf sollte der Agent die vier Skills nach `.claude/skills/` kopieren. Claude Code schreibt in unbeaufsichtigten Sitzungen nicht in diesen Ordner; der Agent sagte das offen und umging den Schutz nicht. Seitdem kopiert der Mensch die Skills zusammen mit dem Baukasten, und der Agent prüft nur, ob sie da sind.
- **Ein Agent stellte keine Fragen.** In einem frühen Lauf nahm Claude Code an, die Sitzung sei nicht interaktiv, und legte alle Grenzen selbst fest. Das Leitdokument verlangt seitdem ausdrücklich, zuerst zu fragen; die Messung hat ein hartes Kriterium dafür.
- **Ein Agent ließ die Gegenprüfung weg.** Die gespielte Entwicklerin nannte ein Review durch eine zweite Person. Codex strich daraufhin die Gegenprüfung durch einen zweiten Agenten aus den Regeln und schrieb selbst, das Prüfskript unterscheide das „in seiner Wortprüfung nicht zuverlässig“. Seitdem gilt die Gegenprüfung ausdrücklich zusätzlich zum Review durch Menschen, und das Prüfskript verlangt den Auslösesatz. Alle Läufe davor zählen nicht.
- **Unser Prüffall für die Gegenprüfung war falsch.** Die „saubere“ Änderung behauptete in der Übergabe, der Mengenrabatt sei eingeführt; die neue Funktion war aber nirgends eingebaut. Beide Agenten lehnten sie zu Recht ab. Der Prüffall beschreibt den Umfang jetzt zutreffend; die Tabelle oben stammt aus der Wiederholung.
- **Fehler unserer Messung:** Zwischendateien von Python galten als geänderter Produktcode; mehrere Formulierungen der Git-Regel und des roten Tests wurden nicht erkannt. Berichtigt; die betroffenen Läufe wurden neu gemessen (diese Messung braucht kein Netz und verändert nichts).

## Sicherheitsscan

Gescannt mit NVIDIA SkillSpector 2.12.0.

- Inhalt des Baukastens (12 Dateien), ohne und mit Sprachmodell, 16. November 2026: 0 von 100 Risikopunkten, Empfehlung SAFE, vollständig untersucht, kein Befund.
- Fertiges Paket samt Anleitung, Lizenz und diesem Bericht (15 Dateien), mit Sprachmodell, 16. November 2026, drei Durchgänge über denselben Inhalt: 9 Punkte (SAFE), 17 Punkte (SAFE) und 31 Punkte („CAUTION“). In keinem Durchgang gab es einen Befund der Stufen „hoch“ oder „kritisch“, und jeder war vollständig. Die Hinweise wechselten von Durchgang zu Durchgang: die Texte seien deutsch, ohne eine andere Sprache anzubieten; der Satz „Prüf die letzte Änderung gegen.“ sei als Auslöser zu allgemein; die Anleitung sage nicht deutlich genug vorab, dass der Agent Dateien anlegt und Befehle des Projekts ausführt. Scans mit Sprachmodell schwanken; hier reicht die Spanne über die Schwelle zwischen SAFE und „CAUTION“. Wir nennen deshalb alle drei Ergebnisse.

Unsere eigene Regel sieht vor, nur zu veröffentlichen, was der Scanner als SAFE einstuft; bei „CAUTION“ entscheidet der Betreiber. Wegen der schwankenden Einstufung ist dieser Baukasten am 16. November 2026 auf ausdrückliche Entscheidung des Betreibers veröffentlicht worden, mit allen Ergebnissen oben.

Der Scanner liest Anleitungen, Regeln und Programme. Er ersetzt keine Sicherheitsprüfung durch Fachleute.

## Grenzen

- Geprüft mit Claude Code (Opus 5.5) und Codex 0.167.1 unter macOS mit Node.js 24.16 und Python 3. Andere Agenten, Windows und Linux sind nicht getestet.
- Die Übungsprojekte sind klein (wenige Dateien, eine Handvoll Tests) und selbst geschrieben. Wie der Baukasten in einem großen, gewachsenen Projekt mit langer Testlaufzeit, mehreren Paketen oder eigener Build-Infrastruktur abschneidet, ist nicht getestet.
- Drei Projekte, ein gewerteter Lauf je Projekt und Agent. Agenten arbeiten nicht jedes Mal gleich.
- Der Agent führt beim Einrichten die Befehle deines Projekts aus. Befehle, die veröffentlichen, bereitstellen, löschen oder Geld kosten, soll er nicht ausführen; das ist eine Anweisung, keine technische Sperre. In den Läufen gab es keinen solchen Befehl.
- Das mitgelieferte Prüfskript liest nur. Ob die eingetragenen Befehle wirklich laufen, belegt der Lauf des Agenten, nicht das Skript. (Unsere Messung hat sie nachgeprüft; bei dir prüft das niemand automatisch.)
- Die vier Skills für die tägliche Arbeit (Änderung umsetzen, Selbstprüfung, Übergabe, Gegenprüfung) sind nur an einer kleinen Änderung über die Gegenprüfung getestet, nicht über längere Arbeit in einem Projekt.
- Regeln und Gegenprüfung senken die Zahl der Fehler. Sie ersetzen kein Review durch Menschen.
