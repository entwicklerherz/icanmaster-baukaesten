---
name: termin-uebergabe
description: Letzter Schritt des Baukastens Online-Terminbuchung. Übergibt die fertige Terminbuchung in einfachen Worten, mit Adresse, Zugangsschlüssel, Löschfrist, Grenzen und dem Hinweis auf die Gegenprüfung.
---

# Übergabe: was der Nutzer jetzt wissen muss

Schreib **eine** freundliche Nachricht ohne Fachwörter, in „Sie“-Form (solange der Nutzer dich nicht duzt). Sie enthält alle acht Punkte unten, in dieser Reihenfolge; keiner darf fehlen, auch wenn die Nachricht dadurch länger wird. Geh die Liste vor dem Absenden noch einmal durch.

1. **Die Adresse** der Buchungsseite zum Weitergeben, und was Kunden dort tun: Tag wählen, Uhrzeit wählen, Namen und Telefon oder E-Mail eintragen.
2. **Die Verwaltung:** dieselbe Adresse mit `/verwaltung` am Ende. Dort sieht der Nutzer alle kommenden Termine, kann absagen, löschen, einzelne Tage sperren und alle Buchungen als Tabelle herunterladen.
3. **Der Zugangsschlüssel (als eigene, deutlich abgesetzte Warnung):** „Wichtig: Ihr Zugangsschlüssel ist geheim. Er steht in der Datei `baukasten/ZUGANGSSCHLUESSEL.txt`. Öffnen Sie sie, speichern Sie den Schlüssel in Ihrem Passwortmanager und löschen Sie die Datei danach. Ich habe den Schlüssel nicht gesehen. Wer ihn kennt, sieht alle Buchungen.“ Geht der Schlüssel verloren, kannst du auf Wunsch einen neuen erzeugen (`node baukasten/schluessel.mjs --neu`, dann `zugang.sql` erneut einspielen); der alte gilt dann nicht mehr.
4. **Was Kunden wissen müssen:** Es gibt keine Bestätigung per E-Mail. Nach der Buchung sehen Kunden ihre Terminseite; nur über deren Adresse können sie den Termin ansehen und absagen.
5. **Umgang mit den Angaben:** Buchungen werden nach der eingestellten Zahl von Tagen nach dem Termin gelöscht (nenne die Zahl aus `einstellungen.json`); das geschieht einmal täglich von selbst und bei jedem Öffnen der Verwaltung. Vergangene Termine stehen bis dahin in der Verwaltung unter „Vergangene Termine“ und lassen sich dort einzeln löschen. Auf Wunsch eines Kunden kann der Nutzer eine Buchung in der Verwaltung sofort löschen. Die heruntergeladene Tabelle enthält Namen und Kontaktangaben und gehört sicher aufbewahrt.
6. **Grenzen, ehrlich:**
   - Wörtlich sinngemäß: „Impressum und Datenschutzseite sind Entwürfe aus Ihren Angaben und keine Rechtsberatung. Lassen Sie sie prüfen.“ Das Wort „Rechtsberatung“ muss vorkommen.
   - Die Seite läuft im kostenlosen Tarif von Cloudflare, einem Unternehmen aus den USA. Die Datenbank ist auf die EU festgelegt. Der Anbieter kann kostenlose Dienste ändern oder einstellen.
   - Was im Gespräch gewünscht wurde und diese Fassung nicht kann (aus deinen Vormerkungen).
   - Was du selbst entschieden hast, weil er es nicht wusste.
7. **Gegenprüfung:** „Bevor Sie die Adresse weitergeben, lassen Sie bitte einen zweiten Agenten gegenprüfen: Öffnen Sie diesen Ordner in einem anderen Agenten oder in einer neuen Sitzung und schreiben Sie: ‚Prüf die Terminbuchung gegen.‘“
8. **Später ändern:** „Wenn sich Zeiten oder Anliegen ändern, sagen Sie es mir; ich passe die Einstellungen an und stelle die Seite neu ins Netz. Ihre Buchungen bleiben dabei erhalten.“

Nach der Übergabe änderst du am Programm nichts mehr. Hat der Nutzer danach noch eine Frage oder einen Wunsch, beantworte ihn kurz; kommt dabei etwas Neues heraus, das zu den acht Punkten gehört, sag es dazu.

Nenne, was die Prüfung ergeben hat, nur so, wie es war: Zahl der bestandenen Prüfungen aus der Ausgabe, und ob die Adresse im Netz geantwortet hat. Versprich keine Sicherheit; sag, was geprüft wurde.
