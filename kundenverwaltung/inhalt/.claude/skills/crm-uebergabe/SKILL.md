---
name: crm-uebergabe
description: Letzter Schritt des Baukastens „Kleine Kundenverwaltung“. Übergibt die geprüfte Kundenverwaltung in einfachen Worten, mit Start, erstem Zugang, Einlesen einer vorhandenen Liste, Sicherung, Auskunft, Löschen und dem Hinweis auf die Gegenprüfung. Nach crm-pruefen verwenden.
---

# Übergabe

Schreib dem Nutzer eine kurze Nachricht ohne Fachwörter und lege denselben Inhalt als `kundenverwaltung/LIES-MICH.md` ab. Kein Code, keine Dateilisten. Diese Punkte, in dieser Reihenfolge:

1. **Was es jetzt gibt.** Ein Satz: seine Kundenverwaltung mit seinen Bezeichnungen, seinen Feldern und Stufen (nenne sie beim Namen). Dazu das Ergebnis der Prüfung in einem Satz; ist sie nicht gelaufen, sag das zuerst.
2. **So starten Sie.** Im Ordner `kundenverwaltung` die Datei `starten.command` (Mac) oder `starten.bat` (Windows) doppelt anklicken. Es öffnet sich ein Fenster mit Text, das offen bleiben muss, und der Browser mit der Kundenverwaltung. Zum Beenden das Textfenster schließen. Beim ersten Start auf dem Mac: Rechtsklick auf die Datei, dann „Öffnen“.
3. **Beim ersten Mal.** Der Nutzer legt selbst seinen Zugang an und wählt ein Passwort mit mindestens zehn Zeichen. Niemand außer ihm kennt es; geht es verloren, lässt es sich nicht zurückholen. Weitere Personen bekommen unter „Verwalten“ einen eigenen Zugang.
4. **Vorhandene Liste (nur wenn es eine gibt).** Unter „Verwalten → Liste einlesen“: in der Tabelle die Zeilen samt Überschriften markieren, kopieren, einfügen, „Prüfen“. Erst die Vorschau ansehen, dann übernehmen. Sag, welche Spalten zu welchen Feldern werden und dass alle übrigen als Notiz beim Eintrag landen.
5. **Wo die Daten liegen.** Nur auf diesem Rechner, im Ordner `kundenverwaltung/daten`. Die Kundenverwaltung ist von anderen Geräten aus nicht erreichbar und schickt nichts ins Internet.
6. **Sicherung.** Beim ersten Start eines Tages entsteht von selbst eine Kopie im Ordner `daten/sicherungen`; die 14 jüngsten bleiben liegen. Das sind die 14 jüngsten Kopien, nicht „die letzten 14 Tage“: Wer die Kundenverwaltung selten startet, hat auch monatealte Kopien. Nenne keine Frist, nach der ein gelöschter Eintrag aus den Sicherungen verschwunden ist. Das schützt vor einem Versehen, nicht vor einem kaputten oder gestohlenen Rechner: Dafür den Ordner `kundenverwaltung/daten` regelmäßig auf einen zweiten Datenträger kopieren.
7. **Daten anderer Menschen.** Der Nutzer speichert Angaben über andere. Drei Dinge kann die Kundenverwaltung dafür: bei jedem Eintrag „Alle gespeicherten Angaben als Datei“ (wenn jemand wissen will, was über ihn gespeichert ist), „Eintrag löschen“ (endgültig; in älteren Sicherungen bleibt er, bis diese gelöscht oder überschrieben sind) und unter „Verwalten“ alles als Tabelle herunterladen. Empfiehl, den Rechner mit Passwort zu sperren. Hat der Nutzer besonders geschützte Angaben als Feld gewünscht, nenne das hier. Sag dazu: Das sind Hinweise, keine Rechtsberatung.
8. **Zweite Meinung.** Empfiehl die Gegenprüfung: den Ordner in einem zweiten Agenten (oder in einer neuen Sitzung) öffnen und schreiben „Prüf die Kundenverwaltung gegen.“ Hast du am Code etwas geändert (`crm-erweitern`), ist das nicht nur empfohlen, sondern nötig, bevor echte Daten hineinkommen. Sag in einem Satz, warum: Wer gebaut hat, übersieht die eigenen Fehler am leichtesten.
9. **Was offen ist.** Alles, was du selbst entschieden hast, weil der Nutzer es nicht wusste, und jeder Wunsch, den diese Kundenverwaltung nicht erfüllt (zum Beispiel Rechnungen, E-Mail-Versand, Zugriff vom Handy).
10. **Später ändern.** Ein Satz: Neue Felder oder Stufen richtest du auf Zuruf ein, die vorhandenen Einträge bleiben erhalten.

Behaupte nichts, was du nicht geprüft hast. Versprich keine Sicherheit („absolut sicher“, „DSGVO-konform“, „kann nicht verloren gehen“).
