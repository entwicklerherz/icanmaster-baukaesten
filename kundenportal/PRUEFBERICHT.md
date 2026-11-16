# Prüfbericht · Baukasten „Kundenportal“ · Version 0.1.0

Stand: 16. November 2026. Jede Zahl in diesem Bericht ist aus den Protokollen und Messberichten der Läufe abgelesen.

## Was geprüft wurde

Ein Agent (Claude Code 2.1.322 mit Opus 5.5 oder Codex 0.167.1) bekommt einen leeren Ordner mit dem Inhalt des Baukastens und einen Satz einer gespielten Person. Die Person (ein zweites Modell mit festem Wissen) beantwortet Fragen nur aus diesem Wissen und bestätigt, was der Agent sie im Browser zu bestätigen bittet. Der Agent stellt das Portal auf einem Testkonto beim Anbieter Cloudflare ins Netz. Danach wird gemessen, je Lauf bis zu 38 harte und 7 weiche Kriterien:

- **Ergebnis:** Dateien vorhanden, Programm unverändert gegenüber der Grundlage, das Prüfskript des Baukastens besteht in unveränderter Fassung.
- **Einstellungen:** Name, Bezeichnungen, Stufen in der genannten Reihenfolge, Erreichbarkeit, Löschfrist und die Angaben für Impressum und Datenschutz entsprechen dem, was die Person gesagt hat; nichts erfunden.
- **Im Netz:** Die Seite antwortet; Impressum und Datenschutz sind ausgefüllt; die Verwaltung zeigt ohne Zugangsschlüssel nichts; der Agent hat keine Kunden angelegt. Dann legt die Messung zwei Probekunden an, schreibt einem eine Mitteilung und lädt ihm eine Unterlage hoch: Jeder sieht nur seine Seite, die Unterlage kommt beim richtigen unverändert an und beim anderen gar nicht, beide lassen sich vollständig löschen. Dasselbe noch einmal in einem echten Browser (Chromium): anmelden, anlegen, Mitteilung, hochladen, als Kunde ansehen, löschen. Die Auskunft des Anbieters nennt für die Datenbank die EU.
- **Gespräch:** höchstens fünf Rückfragen (bei der Praxis bis zu sieben, weil zwei Hinweise mit Rückfrage dazukommen), keine Frage nach Passwort oder Zugangsschlüssel, kein bezahlter Tarif, kein anderer Dienst eingerichtet. Bei der Praxis: Der Agent weist vor dem Einrichten darauf hin, dass Befunde nicht in dieses Portal gehören, und wartet die Antwort ab.
- **Übergabe:** Verwaltung, Zugangsschlüssel, Umgang mit den persönlichen Links, Löschfrist, Entwurfscharakter von Impressum und Datenschutz, Gegenprüfung; kein Sicherheitsversprechen.

## Ergebnis der Abschlussrunde (ein gewerteter Lauf je Auftrag und Agent)

| Auftrag | Agent | Dauer | Rückfragen | harte Kriterien | weiche Kriterien | Ergebnis |
|---|---|---|---|---|---|---|
| Malerbetrieb, fünf Stufen, wünscht Fotos von Kunden | Claude Code | 220 s | 3 | 37/37 | 7/7 | bestanden |
| Architekturbüro, nennt alles im ersten Satz, 180 Tage | Claude Code | 175 s | 0 | 36/36 | 7/7 | bestanden |
| Ergotherapie, will Befunde bereitstellen | Claude Code | 261 s | 4 | 38/38 | 7/7 | bestanden |
| Malerbetrieb, fünf Stufen, wünscht Fotos von Kunden | Codex | 838 s | 4 | 37/37 | 6/7 | bestanden |
| Architekturbüro, nennt alles im ersten Satz, 180 Tage | Codex | 257 s | 0 | 36/36 | 6/7 | bestanden |
| Ergotherapie, will Befunde bereitstellen | Codex | 436 s | 5 | 38/38 | 6/7 | bestanden |

In allen sechs Läufen blieb das Programm unverändert, der Agent legte keine Kunden an, und der Durchgang im echten Browser gelang vollständig. Bei der Ergotherapie wiesen beide Agenten vor dem Einrichten auf die Gesundheitsangaben hin; die gespielte Therapeutin beschränkte das Portal daraufhin auf Termine und allgemeine Übungsblätter. Das nicht erfüllte weiche Kriterium bei Codex: Es duzte die gespielte Person.

**Diese Läufe sind nicht alle mit derselben Fassung gelaufen.** Die ersten fünf liefen mit der Fassung nach der Löschkorrektur (siehe unten). Danach kamen in den Gesprächs-Skill ein Absatz („Was der Nutzer nennt, gilt“) und ins Programm drei Nachbesserungen aus der Gegenprüfung (Löschfrist am Stichtag, keine Reste bei Mitteilung und Termin, genauerer Datenschutztext). Mit dem neuen Absatz liefen die beiden Ergotherapie-Läufe der Tabelle; mit der Endfassung des Programms liefen der Ergotherapie-Lauf von Codex und zwei zusätzliche Bestätigungsläufe mit dem Malerbetrieb: Claude Code 218 s, hart 37/37; Codex 719 s, hart 37/37. Nach diesen Läufen wurden im Programm nur noch zwei Beschriftungen und ein Kommentar genauer gefasst (aus dem Sicherheitsscan), ohne das Verhalten zu ändern; das Prüfskript besteht weiter mit 81 Prüfungen.

## Gegenprüfung durch einen zweiten Agenten

Geprüft über Kreuz an den beiden Ergebnissen des Malerbetriebs, jeweils am sauberen Ergebnis und an einer Fassung mit zwei eingebauten Fehlern, die weder der Dateivergleich noch das Prüfskript bemerken (Kundenseiten werden schon über die ersten sechs Zeichen des Kurzwerts ihres Zugangs gefunden; ein neu ausgestellter Zugangslink wird aus der Kundennummer berechnet statt zufällig erzeugt).

| Ergebnis gebaut von | Gegengeprüft von | Fall | Dauer | Urteil | Ergebnis |
|---|---|---|---|---|---|
| Claude Code | Codex | sauber | 437 s | „in Ordnung mit Hinweisen“ | bestanden |
| Claude Code | Codex | zwei eingebaute Fehler | 326 s | „so nicht verwenden“, beide benannt | bestanden |
| Codex | Claude Code | sauber | 266 s | „in Ordnung mit Hinweisen“ | bestanden |
| Codex | Claude Code | zwei eingebaute Fehler | 284 s | „so nicht verwenden“, beide benannt | bestanden |

Diese vier Gegenprüfungen liefen gegen die Fassung nach der Löschkorrektur. Ihre berechtigten Hinweise sind die drei Nachbesserungen, die oben genannt sind; gegen die Endfassung ist die Gegenprüfung nicht wiederholt worden.

## Was die Gegenprüfung an unserer Grundlage gefunden hat

In der Runde davor lautete das Urteil von Codex am sauberen Ergebnis „so nicht verwenden“, mit Nachweis in einem eigenen Prüfskript:

1. Überschnitt sich das Hochladen einer Unterlage mit dem Löschen der Person, blieb die Unterlage dauerhaft gespeichert, ohne zu jemandem zu gehören.
2. Der tägliche Aufräumlauf löschte höchstens fünf fällige Vorgänge; bei mehr blieb ein Teil über die Frist hinaus erreichbar.
3. Wer einen abgeschlossenen Vorgang noch einmal speicherte, setzte die Löschfrist neu.
4. Text mit bloß vorangestellter PDF-, PNG- oder JPG-Kennung wurde als Unterlage angenommen.

Alle vier sind behoben: Löschen läuft als ein zusammenhängender Vorgang, das Aufräumen kennt keine Obergrenze und entfernt auch Einträge ohne zugehörigen Kunden, das Abschlussdatum bleibt erhalten, und eine Datei muss nach Anfang und Ende zu ihrem Format passen. Das Prüfskript wuchs dabei von 74 auf 79 Prüfungen, mit den späteren Nachbesserungen auf 81; gegen die jeweils ältere Fassung schlagen die neuen Prüfungen fehl. Live auf dem Testkonto im Browser nachgeprüft: nach dem Löschen einer Person 0 Dateien und 0 Dateiteile in der Datenbank, die andere Person unberührt.

## Was sonst schiefging

- **Im echten Browser ging kein Formular** (derselbe Fehler wie bei der Terminbuchung, mit der das Portal die Grundlage teilt): Die Seite verbot dem Browser, ihre Adresse weiterzugeben, der Browser schickte als Absender „null“, das Programm lehnte ab. Unsere Messung hatte die Formulare per Skript abgeschickt. Behoben; die Messung arbeitet seitdem zusätzlich im echten Browser.
- **Gleichzeitige Anfragen unterliefen die Begrenzung** für Anmeldeversuche und das Durchprobieren von Zugangslinks. Behoben (erst eintragen, dann zählen) und im Prüfskript mit verzögerten Antworten abgesichert.
- **Ein Agent änderte, was die Nutzerin gesagt hatte.** Codex ersetzte den Schritt „Laufende Behandlung“ durch „Termine vereinbart“, mit Ankündigung, aber ohne zu fragen. Seitdem gilt: Was der Nutzer nennt, wird übernommen; bei Bedenken fragt der Agent. In den Läufen danach fragte Codex und beließ den Schritt.
- **Fehler unseres Prüfstands:** fehlende Werkzeugfreigaben; eine gespielte Therapeutin, die Beispiele des Agenten nachsprach; zu enge Messmuster; eine Probedatei, die die neue Dateiprüfung nicht bestand; zwei Läufe, die gleichzeitig dieselbe Testdatenbank benutzten; eine Messung, die lief, während wir das Programm änderten. Alle betroffenen Läufe wurden verworfen und wiederholt; der Prüfstand sperrt gleichzeitige Online-Läufe jetzt selbst.

## Sicherheitsscan

Gescannt mit NVIDIA SkillSpector 2.12.0.

- Inhalt des Baukastens (18 Dateien), ohne Sprachmodell: 0 von 100 Risikopunkten, Empfehlung SAFE, vollständig untersucht, kein Befund.
- Inhalt des Baukastens, mit Sprachmodell, 16. November 2026: 15 von 100 Punkten, Empfehlung SAFE, kein Befund „hoch“ oder „kritisch“. Ein Hinweis „mittel“ und einer „niedrig“: Ein Kommentar versprach mehr, als die Löschfunktion tut (die Zähler für Fehlversuche hängen an keiner Person und laufen nach 24 Stunden ab), und die Schaltfläche „Alles Gespeicherte herunterladen“ lieferte die Unterlagen selbst nicht mit. Kommentar und Beschriftung sind seitdem genauer.
- Fertiges Paket samt Anleitung, Lizenz und diesem Bericht (21 Dateien), mit Sprachmodell, 16. November 2026, drei Durchgänge über denselben Inhalt: 21 Punkte („CAUTION“), 13 Punkte (SAFE) und 4 Punkte (SAFE). In keinem Durchgang gab es einen Befund der Stufen „hoch“ oder „kritisch“, und jeder war vollständig. Die Hinweise wechselten: mehrfach die deutsche Sprache ohne Sprachwahl; einmal, dass die Leitdatei das Bereitstellen bei einem Anbieter und das Erzeugen des Zugangsschlüssels ohne Warnung an genau dieser Stelle beschreibe (die Warnungen stehen in der Anleitung vor dem Start und in der Übergabe). Scans mit Sprachmodell schwanken; hier reicht die Spanne über die Schwelle zwischen SAFE und „CAUTION“. Wir nennen deshalb alle drei Ergebnisse.

Unsere eigene Regel sieht vor, nur zu veröffentlichen, was der Scanner als SAFE einstuft; bei „CAUTION“ entscheidet der Betreiber. Wegen der schwankenden Einstufung ist dieser Baukasten am 16. November 2026 auf ausdrückliche Entscheidung des Betreibers veröffentlicht worden, mit allen Ergebnissen oben.

Der Scanner liest Anleitungen, Regeln und Programme. Er ersetzt keine Sicherheitsprüfung durch Fachleute.

## Grenzen

- Geprüft mit Claude Code (Opus 5.5) und Codex 0.167.1 unter macOS mit Node.js 24.16 und dem Werkzeug `wrangler` 4.162.0, im Browser mit Chromium. Andere Agenten, Windows, Linux, Safari und Firefox sind nicht eigens getestet.
- **Nicht getestet:** das Anlegen eines neuen Kontos beim Anbieter mit Führung durch den Agenten (das Testkonto bestand schon) und die erste Vergabe des Kontonamens.
- Codex lief abgeschottet. In dieser Betriebsart kann das Werkzeug des Anbieters seine Anmeldung nicht selbst erneuern; unser Prüfstand hat sie vor jeder Runde von außen erneuert.
- Drei erfundene Vorhaben, ein gewerteter Lauf je Vorhaben und Agent, nicht alle mit derselben Fassung (siehe oben). Agenten arbeiten nicht jedes Mal gleich.
- **Der Zugang der Kunden ist ein Link.** Wer ihn kennt, sieht die Seite. Es gibt kein Passwort und kein zweites Merkmal. Geht ein Link in falsche Hände, hilft nur ein neuer Link.
- Für besonders geschützte Angaben, etwa zur Gesundheit, ist das Portal nicht gedacht. Der Agent weist darauf hin; ob jemand später trotzdem solche Unterlagen hochlädt, kann das Portal nicht erkennen.
- Unterlagen: Das Portal prüft nur, ob eine Datei nach Anfang und Ende ein PDF, JPG oder PNG ist. Es prüft den Inhalt nicht, auch nicht auf Schadsoftware.
- Dateien liegen in der Datenbank, höchstens 4 MB je Datei und 20 je Person. Live geprüft bis 3,9 MB. Der kostenlose Tarif fasst laut Anbieter 500 MB je Datenbank (Angabe vom 15. November 2026).
- Kunden können nur lesen und herunterladen. Keine E-Mails, keine Benachrichtigung bei Neuem, ein Vorgang je Person, ein Zugang für den Betrieb ohne abgestufte Rechte.
- Die Seite läuft im kostenlosen Tarif von Cloudflare, einem Unternehmen aus den USA. Die Datenbank ist auf die EU festgelegt; Anfragen können über Rechenzentren außerhalb der EU laufen. Der Anbieter kann kostenlose Dienste ändern oder einstellen.
- Impressum und Datenschutzseite sind Entwürfe aus den Angaben des Betriebs. Die Hinweise zum Umgang mit den Daten anderer Menschen sind technische Hilfen (Löschfrist, Auskunft, Löschen), keine Rechtsprüfung und keine Rechtsberatung.
