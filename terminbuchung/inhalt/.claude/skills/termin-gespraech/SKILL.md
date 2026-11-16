---
name: termin-gespraech
description: Erster Schritt des Baukastens Online-Terminbuchung. Klärt in höchstens fünf kurzen Fragen, wofür Termine gebucht werden, wann, wie lange und wer verantwortlich ist.
---

# Gespräch: Wofür werden Termine gebucht?

Ziel: Du weißt danach genug, um `einstellungen.json` auszufüllen. Du baust in diesem Schritt nichts.

## Regeln

- **Höchstens fünf Fragen insgesamt**, eine je Nachricht, kurz, ohne Fachwörter, jeweils mit einem Beispiel für die Art der Antwort.
- Lies zuerst, was der Nutzer schon gesagt hat. Was beantwortet ist, fragst du nicht noch einmal. Reicht die erste Nachricht für alles, stellst du gar keine Frage.
- Weiß der Nutzer etwas nicht, entscheidest du selbst sinnvoll und merkst es für die Übergabe vor.
- Du fragst nie nach einem Passwort, einem Zugangsschlüssel oder Zahlungsdaten.

## Die Fragen (nur die, deren Antwort noch fehlt, in dieser Reihenfolge)

1. **Wer und wofür?** „Wie heißt Ihr Betrieb, und wofür buchen Ihre Kunden einen Termin? Zum Beispiel: ‚Praxis Lindner, Erstgespräch und Folgetermin‘.“ Daraus werden Name und die Liste der Anliegen (ein bis sechs).
2. **Wann?** „An welchen Tagen und zu welchen Uhrzeiten sollen Termine möglich sein? Zum Beispiel: ‚Montag bis Donnerstag 9 bis 12 und 14 bis 17 Uhr, Freitag nur vormittags‘.“
3. **Wie lange?** „Wie lange dauert ein Termin? Zum Beispiel 30 Minuten.“ Es gibt eine Länge für alle Termine. Nennt der Nutzer verschiedene Längen, nimm die längste und sag bei der Übergabe, dass diese Fassung nur eine Länge kennt.
4. **Wer ist verantwortlich?** „Für das Impressum und die Datenschutzseite brauche ich Ihren Namen oder den der Firma, die Anschrift, eine Telefonnummer und eine E-Mail-Adresse. Diese Angaben stehen öffentlich auf der Seite.“ Ohne diese Angaben besteht die Prüfung nicht. Postfächer und erfundene Angaben trägst du nicht ein.
5. **Nur wenn nötig:** eine Rückfrage zu einer unklaren Antwort.

Nicht fragen, sondern festlegen: frühestens 12 Stunden im Voraus buchbar, höchstens 28 Tage im Voraus, Buchungen werden 30 Tage nach dem Termin gelöscht. Wünscht der Nutzer von sich aus andere Werte, übernimm sie.

## Was du gleich sagst, wenn es zur Sprache kommt

- Die Seite verschickt keine E-Mails und nimmt keine Zahlungen an. Kunden merken sich ihren Termin über die Adresse ihrer Terminseite.
- Die Seite läuft bei einem Anbieter im Internet; dafür braucht der Nutzer ein kostenloses Konto. Du führst ihn später Schritt für Schritt dorthin.

## Was du danach wissen musst

Name des Betriebs, Anliegen, Zeiten je Wochentag, Terminlänge, Angaben für Impressum und Datenschutz. Fasse das in drei, vier Sätzen zusammen und geh ohne weitere Rückfrage zu `termin-einrichten`.
