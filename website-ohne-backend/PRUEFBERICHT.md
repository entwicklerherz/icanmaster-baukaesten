# Prüfbericht · Baukasten „Website ohne Backend und Datenbank“ · Version 0.5.1

Stand: 15. November 2026. Jede Zahl in diesem Bericht ist aus den Protokollen und Messberichten der Läufe abgelesen.

## Was geprüft wurde

Ein Agent (Claude Code 2.1.322 mit Opus 5.5 oder Codex 0.167.1) bekommt einen leeren Ordner mit dem Inhalt des Baukastens und einen Satz eines gespielten Kunden. Der Kunde (ein zweites Modell mit festem Wissen) beantwortet Fragen nur aus diesem Wissen. Danach wird das Ergebnis im Browser gemessen: Gespräch, Technik, Barrierefreiheit (axe-core), Darstellung auf 320, 390, 768, 1280 und 1920 Pixel Breite, Datenschutz (technisch), Inhalt und Übernahme einer alten Seite. Je Lauf bis zu 41 Kriterien, davon bis zu 21 „hart“: Ein hartes Kriterium verfehlt heißt nicht bestanden.

## Ergebnis der Abschlussrunde (Version 0.5.1, 15. November 2026, ein gewerteter Lauf je Kunde und Agent)

| Auftrag | Agent | Dauer | Rückfragen | harte Kriterien | weiche Kriterien | Ergebnis |
|---|---|---|---|---|---|---|
| Praxis, keine alte Seite | Claude Code 2.1.322, Opus 5.5 | 240 s | 5 Nachrichten mit Rückfrage | 19/19 | 20/20 | bestanden |
| Tischlerei, Inhalte übernehmen | Claude Code 2.1.322, Opus 5.5 | 265 s | 3 | 19/19 | 20/20 | bestanden (dritter Anlauf, siehe unten) |
| Café, Aussehen behalten | Claude Code 2.1.322, Opus 5.5 | 235 s | 2 | 21/21 | 20/20 | bestanden |
| Praxis, keine alte Seite | Codex 0.167.1 | 236 s | 5 | 19/19 | 20/20 | bestanden |
| Tischlerei, Inhalte übernehmen | Codex 0.167.1 | 238 s | 3 | 19/19 | 20/20 | bestanden |
| Café, Aussehen behalten | Codex 0.167.1 | 204 s | 2 | 21/21 | 20/20 | bestanden |

Zum dritten Anlauf bei der Tischlerei mit Claude Code: In zwei Läufen davor stellte der Agent die vorgesehene Nachfrage, der gespielte Kunde beantwortete sie aber nicht („Steht alles auf der alten Seite.“, „Bitte machen Sie weiter.“); dadurch fehlte eine Angabe, die nur er kennt (18/19). Das war ein Fehler des Prüfstands, nicht des Baukastens: Die Anweisung an den gespielten Kunden wurde klargestellt, der Lauf wiederholt.

## Gestaltungsprüfung durch einen getrennten Prüfer

Zusätzlich bewertet ein eigener, streng eingestellter Prüfer (Opus 5.5) nur die Bildschirmfotos, mit 1 bis 10 Punkten je Kriterium. Seine Schwelle (Gestaltung 7, Passung 7, Handwerk 8, Funktion 8) erreicht weiterhin keine der sechs Seiten; die Noten liegen einen Punkt über denen von 0.5.0 oder gleichauf:

| Auftrag | Agent | Gestaltung | Passung | Handwerk | Funktion |
|---|---|---|---|---|---|
| Praxis, keine alte Seite | Claude Code | 7 | 6 | 7 | 7 |
| Tischlerei, Inhalte übernehmen | Claude Code | 7 | 7 | 7 | 8 |
| Café, Aussehen behalten | Claude Code | 7 | 7 | 7 | 8 |
| Praxis, keine alte Seite | Codex | 7 | 6 | 7 | 7 |
| Tischlerei, Inhalte übernehmen | Codex | 7 | 6 | 7 | 8 |
| Café, Aussehen behalten | Codex | 7 | 7 | 7 | 8 |

Hauptgründe laut Prüfer: Die gemalten Bilder zeigen nicht den wirklichen Ort, eigene Fotos des Betriebs fehlen (beim Handwerk: fertige Arbeiten), Angaben stehen teils doppelt, das Logo ist klein. Der Baukasten wird trotzdem veröffentlicht, weil der Auftraggeber die Qualität von 0.5.0 am 14. November 2026 angenommen hat und 0.5.1 in dieser Prüfung nicht schlechter abschneidet.

## Was auf dem Weg schiefging

- **Fassungen bis 0.4.2:** ein Aufbau für alle Vorhaben, freigestellte Stillleben als Bild, Zeiten bis zu viermal auf der Seite. Vom Auftraggeber abgelehnt. Seit 0.5 gibt es drei Kompositionen je nach Aufgabe der Besucher und gemalte Räume als Bild.
- **Runde 1 von 0.5:** Die Statuszeile behauptete an Tagen ohne Zeitangabe „Heute geschlossen“. Das hatte kein Kunde gesagt. Jetzt sagt sie nur, was aus den genannten Zeiten sicher folgt.
- **Runde 1 von 0.5:** Einleitung zu lang, die Anruf-Schaltfläche rutschte aus dem ersten Bildschirm; eine E-Mail-Adresse brach in der Auskunftsleiste um. Beides ist begrenzt, das Prüfskript lehnt zu lange Einleitungen ab.
- **Runde 3 von 0.5:** Der Agent schlug eine erfundene Angabe zum Abnicken vor („in Kiel und rund 30 Kilometer drumherum“), der gespielte Kunde sagte „passt“. Seitdem schlägt der Agent Tatsachen nie zum Abnicken vor, und jeder Lauf wird auf solche Entfernungsangaben geprüft.
- **0.5.0 mit Codex (15. November 2026):** Praxis bestanden; Tischlerei 18/19 und Café 19/21 nicht bestanden. Codex übernahm die alte Seite und fragte nicht nach, was sich geändert hat; so fehlten Angaben, die nur der Kunde kennt (Aufmaß im Umland, Preise). Beim Café ersetzte Codex außerdem die E-Mail-Adresse der alten Seite durch eine Lücke, und in einem Lauf duzte es den Kunden. Seit 0.5.1 ist die Nachfrage nach der Übernahme Pflicht, Angaben der alten Seite werden übernommen, die Anrede ist „Sie“, solange der Nutzer nicht duzt.
- **Früher behoben und weiter geprüft:** erfundene Schließtage und Wirkversprechen („lindert Schmerzen“); kurze Wörter in Überschriften getrennt; Wochenplan sieben Pixel zu breit.

## Sicherheitsscan

- Erster Scan (Version 0.3.0): 32 von 100 Risikopunkten, ein Befund der Stufe „hoch“ (ausführbare Datei in verstecktem Ordner: das Prüfskript unter `.baukasten/`). Seit Version 0.3.1 liegt der Ordner sichtbar unter `baukasten/`.
- Scan von 0.5.0 mit NVIDIA SkillSpector: 0 von 100 Risikopunkten, Empfehlung SAFE, keine Befunde. Drei Scans davor ergaben ebenfalls keine Befunde, aber die Einstufung CAUTION: Der Scanner konnte den Browser-Aufruf in `baukasten/ansehen.mjs` nicht vollständig nachvollziehen. Seitdem steht dort jeder Aufruf vollständig und fest im Code.
- Scan von 0.5.1 (SkillSpector 2.12.0, mit Sprachmodell, 15. November 2026): 15 von 100 Risikopunkten, Empfehlung SAFE, 30 Textdateien vollständig untersucht, kein Befund der Stufen „hoch“ oder „kritisch“. Fünf Hinweise, alle zum selben Punkt: Die Seite ist fest auf Deutsch eingestellt (vier Hinweise der Stufe „mittel“ zu Leitdatei, zwei Mustern und Prüfskript, einer der Stufe „niedrig“ zur Silbentrennung). Das ist Absicht; schreibt der Nutzer in einer anderen Sprache, baut der Agent die Seite in dieser Sprache. Der Scan mit Sprachmodell fällt von Lauf zu Lauf etwas anders aus; ein Scan des Ordners `inhalt` allein ergab 20 von 100, SAFE, sechs Hinweise. Schrift- und Bilddateien kann der Scanner nicht lesen.
- Neu in 0.5: `baukasten/ansehen.mjs` startet einen bereits installierten Browser unsichtbar und mit leerem Wegwerf-Profil, um drei Bildschirmfotos der fertigen Seite zu speichern. Es lädt nichts aus dem Netz und liest keine Browserdaten. Für den Scan wurde das Programm nach der Abschlussrunde umgeschrieben; es erzeugt dieselben Bilder (von Hand an einer Testseite geprüft), in den Läufen lief die Vorfassung.

## Grenzen

- Geprüft mit Claude Code (Opus 5.5) und Codex 0.167.1. Mit anderen Agenten ist der Baukasten nicht getestet.
- Drei erfundene Betriebe, ein gewerteter Lauf je Betrieb und Agent in der Abschlussrunde; Agenten arbeiten nicht jedes Mal gleich.
- Die Datenschutz-Kriterien sind technische Messungen (keine fremden Server, keine Cookies, kein Formular, Rechtsseiten vorhanden und verlinkt), keine Rechtsprüfung.
- Im Vergleichslauf ohne Baukasten (Version 0.1, 14. November 2026) baute der Agent sofort mit Platzhaltern, brauchte zwölf Gesprächsrunden (drei mit Rückfrage) und bestand 13 von 15 harten Kriterien der damaligen Messung.
