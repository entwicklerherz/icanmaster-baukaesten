---
name: portal-uebergabe
description: Letzter Schritt des Baukastens Kundenportal. Übergibt das fertige Portal in einfachen Worten, mit Adresse der Verwaltung, Zugangsschlüssel, Umgang mit den persönlichen Links, Löschfrist, Grenzen und dem Hinweis auf die Gegenprüfung.
---

# Übergabe: was der Nutzer jetzt wissen muss

Schreib **eine** freundliche Nachricht ohne Fachwörter, in „Sie“-Form (solange der Nutzer dich nicht duzt). Sie enthält alle acht Punkte unten, in dieser Reihenfolge; keiner darf fehlen, auch wenn die Nachricht dadurch länger wird. Geh die Liste vor dem Absenden noch einmal durch.

1. **Die Verwaltung:** die Adresse mit `/verwaltung` am Ende. Dort legt der Nutzer seine Kunden an (mit seinen Bezeichnungen aus den Einstellungen), setzt den Stand, schreibt Mitteilungen, trägt Termine ein und lädt Unterlagen hoch (PDF, JPG, PNG bis 4 MB).
2. **Der Zugangsschlüssel (als eigene, deutlich abgesetzte Warnung):** „Wichtig: Ihr Zugangsschlüssel ist geheim. Er steht in der Datei `baukasten/ZUGANGSSCHLUESSEL.txt`. Öffnen Sie sie, speichern Sie den Schlüssel in Ihrem Passwortmanager und löschen Sie die Datei danach. Ich habe den Schlüssel nicht gesehen. Wer ihn kennt, sieht alle Kunden und ihre Unterlagen.“ Geht der Schlüssel verloren, kannst du auf Wunsch einen neuen erzeugen (`node baukasten/schluessel.mjs --neu`, dann `zugang.sql` erneut einspielen); der alte gilt dann nicht mehr.
3. **Die persönlichen Links:** Beim Anlegen einer Person zeigt die Verwaltung einmal einen langen Link. Den gibt der Nutzer nur dieser einen Person, am besten persönlich oder über einen Weg, den nur sie liest. „Wer den Link kennt, sieht die Seite dieser Person.“ Das Portal verschickt keine E-Mails. Geht ein Link verloren oder in falsche Hände, stellt der Nutzer bei der Person einen neuen aus; der alte gilt dann sofort nicht mehr.
4. **Was Kunden sehen und können:** den Stand, Mitteilungen, kommende Termine und ihre Unterlagen zum Herunterladen. Sie können nichts hochladen und nicht zurückschreiben. Jede Person sieht nur die eigene Seite.
5. **Umgang mit den Angaben:** Der letzte Stand schließt einen Vorgang ab; danach wird die Person nach der eingestellten Zahl von Tagen mit allen Unterlagen gelöscht (nenne die Zahl aus `einstellungen.json`), einmal täglich von selbst und bei jedem Öffnen der Verwaltung. Auf Wunsch einer Person kann der Nutzer in der Verwaltung alles zu ihr Gespeicherte herunterladen und sie sofort endgültig löschen.
6. **Grenzen, ehrlich:**
   - Wörtlich sinngemäß: „Impressum und Datenschutzseite sind Entwürfe aus Ihren Angaben und keine Rechtsberatung. Lassen Sie sie prüfen.“ Das Wort „Rechtsberatung“ muss vorkommen.
   - Die Seite läuft im kostenlosen Tarif von Cloudflare, einem Unternehmen aus den USA. Die Datenbank ist auf die EU festgelegt. Der Anbieter kann kostenlose Dienste ändern oder einstellen.
   - Für besonders geschützte Angaben, etwa zur Gesundheit, ist das Portal nicht gedacht.
   - Das Portal prüft bei Unterlagen nur, ob die Datei nach Anfang und Ende ein PDF, JPG oder PNG ist. Den Inhalt prüft es nicht, auch nicht auf Schadsoftware. Der Nutzer lädt nur Dateien hoch, die er selbst kennt.
   - Was im Gespräch gewünscht wurde und diese Fassung nicht kann (aus deinen Vormerkungen).
   - Was du selbst entschieden hast, weil er es nicht wusste.
7. **Gegenprüfung:** „Bevor Sie den ersten echten Kunden anlegen, lassen Sie bitte einen zweiten Agenten gegenprüfen: Öffnen Sie diesen Ordner in einem anderen Agenten oder in einer neuen Sitzung und schreiben Sie: ‚Prüf das Kundenportal gegen.‘“
8. **Später ändern:** „Wenn sich Schritte oder Texte ändern, sagen Sie es mir; ich passe die Einstellungen an und stelle die Seite neu ins Netz. Ihre Kunden und Unterlagen bleiben dabei erhalten.“ Hinweis dazu: Werden Schritte gestrichen oder umsortiert, stimmt der gespeicherte Stand bei vorhandenen Kunden nicht mehr; der Nutzer muss ihn dann je Person neu setzen.

Nach der Übergabe änderst du am Programm nichts mehr. Hat der Nutzer danach noch eine Frage oder einen Wunsch, beantworte ihn kurz; kommt dabei etwas Neues heraus, das zu den acht Punkten gehört, sag es dazu.

Nenne, was die Prüfung ergeben hat, nur so, wie es war: Zahl der bestandenen Prüfungen aus der Ausgabe, und ob die Adresse im Netz geantwortet hat. Versprich keine Sicherheit; sag, was geprüft wurde.
