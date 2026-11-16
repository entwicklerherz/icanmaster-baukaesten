---
name: termin-gegenpruefung
description: Schritt für einen zweiten Agenten im Baukasten Online-Terminbuchung. Prüft eine eingerichtete Terminbuchung unabhängig gegen, versucht gezielt, fremde Buchungen zu lesen, zu ändern oder doppelt zu buchen, und schreibt ein Urteil, ohne etwas zu verändern.
---

# Gegenprüfung: ein zweites Paar Augen

Du hast diese Terminbuchung nicht eingerichtet. Deine Aufgabe ist zu finden, was der erste Agent übersehen hat. Du baust nichts, änderst nichts und stellst nichts ins Netz.

## Was du nicht tust

- keine Datei unter `terminbuchung/` oder `baukasten/` ändern (außer dem Bericht, siehe unten)
- `baukasten/ZUGANGSSCHLUESSEL.txt` nicht öffnen
- keine echten Buchungen ansehen: keine Abfragen der Datenbank im Netz, keine Anmeldung in der Verwaltung, kein Herunterladen der Tabelle
- im Netz nichts buchen, absagen oder löschen

## Was du prüfst

1. **Programm unverändert?** Vergleiche `terminbuchung/src/` und `terminbuchung/schema.sql` Datei für Datei mit `baukasten/grundlage/`. Jede Abweichung ist ein Befund: Lies sie ganz und beurteile, was sie bewirkt.
2. **Mitgelieferte Prüfung:** `node baukasten/pruefen.mjs`. Notiere das Ergebnis mit der Zahl der Prüfungen. Lässt sie sich nicht ausführen, ist das ein offener Punkt, kein Bestehen.
3. **Eigene Angriffsversuche in einer Wegwerf-Kopie:** Kopiere `terminbuchung/` und `baukasten/` in einen temporären Ordner und schreib dort ein eigenes kleines Prüfskript nach dem Muster von `pruefen-ablauf.mjs` (das Programm direkt aufrufen, Datenbank im Arbeitsspeicher). Versuche mindestens:
   - eine fremde Terminseite zu erreichen (geratene, gekürzte, verlängerte Adresse)
   - einen Termin doppelt zu buchen, auch gleichzeitig
   - ohne Anmeldung oder mit abgelaufener Anmeldung in der Verwaltung etwas zu sehen oder auszulösen, auch über einen bloßen Seitenaufruf
   - Eingaben, die als Seitenelemente oder als Formel in der Tabelle wirken könnten
   - Termine außerhalb der Zeiten, in der Vergangenheit, an gesperrten Tagen
   Was die mitgelieferte Prüfung schon abdeckt, musst du nicht wiederholen; such nach dem, was sie nicht abdeckt.
4. **Einstellungen:** Sind die Zeiten plausibel (Fenster fassen mindestens einen Termin, keine Überschneidungen), die rechtlichen Angaben ausgefüllt und nicht erkennbar erfunden, die Löschfrist gesetzt?
5. **Bereitstellung, soweit ohne Eingriff sichtbar:** Steht in `wrangler.jsonc` eine Datenbank-Kennung? Bestätigt `npx wrangler@4.162.0 d1 info terminbuchung` die Datenbank? Antworten Startseite, `/impressum`, `/datenschutz` und `/verwaltung` unter der Adresse, falls sie in den Unterlagen steht? Liegt `ZUGANGSSCHLUESSEL.txt` noch im Ordner (dann den Nutzer erinnern, sie nach dem Sichern zu löschen)?

## Bericht

Schreib `terminbuchung/GEGENPRUEFUNG.md`:

- Datum, wer geprüft hat (Agent und Hinweis „unabhängige Sitzung, nicht an der Einrichtung beteiligt“)
- **Urteil**, genau eine dieser drei Formulierungen: „in Ordnung“, „in Ordnung mit Hinweisen“ oder „so nicht verwenden“
- je Befund: Stelle (Datei und Zeile), was passieren kann, wie du es nachgewiesen hast, was zu tun ist
- was du geprüft hast und was du nicht prüfen konntest

„So nicht verwenden“ gilt, sobald jemand ohne Berechtigung Buchungen lesen, ändern oder löschen könnte, ein Termin doppelt vergeben werden kann oder das Programm von der Grundlage abweicht, ohne dass die Abweichung erkennbar harmlos ist.

Sag dem Nutzer das Urteil in zwei, drei Sätzen ohne Fachwörter und was er als Nächstes tun soll. Behauptest du, etwas geprüft zu haben, musst du es in dieser Sitzung getan haben.
