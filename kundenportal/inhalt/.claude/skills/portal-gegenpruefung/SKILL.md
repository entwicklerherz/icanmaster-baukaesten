---
name: portal-gegenpruefung
description: Schritt für einen zweiten Agenten im Baukasten Kundenportal. Prüft ein eingerichtetes Kundenportal unabhängig gegen, versucht gezielt, an die Seite oder die Unterlagen eines anderen Kunden zu kommen, und schreibt ein Urteil, ohne etwas zu verändern.
---

# Gegenprüfung: ein zweites Paar Augen

Du hast dieses Kundenportal nicht eingerichtet. Deine Aufgabe ist zu finden, was der erste Agent übersehen hat. Du baust nichts, änderst nichts und stellst nichts ins Netz.

## Was du nicht tust

- keine Datei unter `kundenportal/` oder `baukasten/` ändern (außer dem Bericht, siehe unten)
- `baukasten/ZUGANGSSCHLUESSEL.txt` nicht öffnen
- keine echten Kunden ansehen: keine Abfragen der Datenbank im Netz, keine Anmeldung in der Verwaltung, kein Aufruf einer Kundenseite, kein Herunterladen von Unterlagen
- im Netz nichts anlegen, ändern oder löschen

## Was du prüfst

1. **Programm unverändert?** Vergleiche `kundenportal/src/` und `kundenportal/schema.sql` Datei für Datei mit `baukasten/grundlage/`. Jede Abweichung ist ein Befund: Lies sie ganz und beurteile, was sie bewirkt.
2. **Mitgelieferte Prüfung:** `node baukasten/pruefen.mjs`. Notiere das Ergebnis mit der Zahl der Prüfungen. Lässt sie sich nicht ausführen, ist das ein offener Punkt, kein Bestehen.
3. **Das Programm selbst lesen, mit Blick auf die Trennung der Kunden:** Lies in `kundenportal/src/app.mjs` jede Stelle, an der ein Kunde, eine Mitteilung, ein Termin oder eine Datei aus der Datenbank geholt, geändert oder gelöscht wird. Stimmt die Grundlage mit `kundenportal/src/` überein, heißt das nur, dass beide gleich sind, nicht, dass sie richtig sind. Frag bei jeder Abfrage: Woran wird festgemacht, wessen Daten das sind? Wird der Zugang vollständig verglichen? Wird bei jeder Änderung der Formularschutzwert verlangt?
4. **Eigene Angriffsversuche in einer Wegwerf-Kopie:** Kopiere `kundenportal/` und `baukasten/` in einen temporären Ordner und schreib dort ein eigenes kleines Prüfskript nach dem Muster von `pruefen-ablauf.mjs` (das Programm direkt aufrufen, Datenbank im Arbeitsspeicher). Versuche mindestens:
   - mit dem Zugang von Kunde A die Seite, eine Mitteilung, einen Termin oder eine Unterlage von Kunde B zu erreichen (andere Nummern, geratene, gekürzte, verlängerte, leicht veränderte Zugänge)
   - Unterlagen ohne Zugang oder nur über ihre Nummer abzurufen
   - ohne Anmeldung oder mit abgelaufener Anmeldung in der Verwaltung etwas zu sehen oder auszulösen, auch über einen bloßen Seitenaufruf oder ohne Formularschutzwert
   - über die Verwaltungsseite eines Kunden etwas von einem anderen zu ändern oder zu löschen
   - Eingaben und Dateinamen, die als Seitenelemente wirken könnten; Dateien, die nur vorgeben, ein PDF oder Bild zu sein
   - ob nach einem neuen Zugangslink der alte wirklich nicht mehr gilt und nach dem Löschen wirklich alles weg ist
   Was die mitgelieferte Prüfung schon abdeckt, musst du nicht wiederholen; such nach dem, was sie nicht abdeckt.
5. **Einstellungen:** Sind die Stufen plausibel (zwei bis sieben, die letzte ein Abschluss), die rechtlichen Angaben ausgefüllt und nicht erkennbar erfunden, die Löschfrist gesetzt? Deuten Name, Bezeichnungen oder Texte auf besonders geschützte Angaben hin (Gesundheit, Befunde)? Dann ist das ein Hinweis im Bericht.
6. **Bereitstellung, soweit ohne Eingriff sichtbar:** Steht in `wrangler.jsonc` eine Datenbank-Kennung? Bestätigt `npx wrangler@4.162.0 d1 info kundenportal` die Datenbank? Antworten Startseite, `/impressum`, `/datenschutz` und `/verwaltung` unter der Adresse, falls sie in den Unterlagen steht? Liegt `ZUGANGSSCHLUESSEL.txt` noch im Ordner (dann den Nutzer erinnern, sie nach dem Sichern zu löschen)?

## Bericht

Schreib `kundenportal/GEGENPRUEFUNG.md`:

- Datum, wer geprüft hat (Agent und Hinweis „unabhängige Sitzung, nicht an der Einrichtung beteiligt“)
- **Urteil**, genau eine dieser drei Formulierungen: „in Ordnung“, „in Ordnung mit Hinweisen“ oder „so nicht verwenden“
- je Befund: Stelle (Datei und Zeile), was passieren kann, wie du es nachgewiesen hast, was zu tun ist
- was du geprüft hast und was du nicht prüfen konntest

„So nicht verwenden“ gilt, sobald jemand ohne Berechtigung die Seite, die Angaben oder die Unterlagen eines Kunden lesen, ändern oder löschen könnte oder das Programm von der Grundlage abweicht, ohne dass die Abweichung erkennbar harmlos ist.

Sag dem Nutzer das Urteil in zwei, drei Sätzen ohne Fachwörter und was er als Nächstes tun soll. Behauptest du, etwas geprüft zu haben, musst du es in dieser Sitzung getan haben.
