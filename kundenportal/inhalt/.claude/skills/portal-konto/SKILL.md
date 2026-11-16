---
name: portal-konto
description: Vierter Schritt des Baukastens Kundenportal. Führt den Nutzer Schritt für Schritt zu einem kostenlosen Konto beim Anbieter Cloudflare und meldet das Werkzeug an, ohne je nach einem Passwort zu fragen.
---

# Konto: den Nutzer an die Hand nehmen

Die Seite braucht einen Platz im Internet. Dafür hat der Nutzer ein eigenes, kostenloses Konto bei Cloudflare; Seite und Daten gehören dann ihm. Die meisten Nutzer haben so etwas noch nie gemacht. Führe sie ruhig, ein Schritt je Nachricht, und warte jeweils auf ihre Rückmeldung.

## 1. Erst nachsehen

Führe `npx wrangler@4.162.0 whoami` aus (beim ersten Mal lädt sich das Werkzeug; das dauert einen Moment und ist in Ordnung).

Besteht schon eine Anmeldung, nenne dem Nutzer die E-Mail-Adresse, unter der das Konto läuft, und frag: „Auf diesem Rechner ist schon ein Konto bei Cloudflare verbunden, es läuft unter … Ist das Ihres?“ (Diese Frage zählt nicht zu den fünf Fragen des Gesprächs.)

- Bei Ja: überspring den Rest dieses Skills.
- Bei Nein oder Unsicherheit: Lege in diesem Konto nichts an. Sonst lägen die Seite und die Unterlagen der Kunden bei jemand anderem. Frag, ob du die Verbindung auf diesem Rechner trennen darfst, und trenne sie erst nach seinem Ja (`npx wrangler@4.162.0 logout`). Dann weiter mit Schritt 2.

## 2. Fragen, ob es ein Konto gibt

„Für die Seite brauchen Sie ein kostenloses Konto bei Cloudflare, einem Anbieter, bei dem die Seite im Internet steht. Haben Sie dort schon ein Konto?“ (Diese Frage zählt nicht zu den fünf Fragen des Gesprächs.)

## 3. Wenn nein: Konto anlegen lassen

Öffne die Seite `https://dash.cloudflare.com/sign-up` im Browser des Nutzers (macOS: `open`, Windows: `start`, Linux: `xdg-open`). Gelingt das nicht, nenne ihm die Adresse zum Anklicken. Dann, je Nachricht ein Schritt:

- „Dort können Sie sich mit Ihrem Google-, Apple- oder GitHub-Konto anmelden (‚Continue with …‘) oder E-Mail-Adresse und ein eigenes Passwort eintragen. Wählen Sie, was Ihnen lieber ist. Das Passwort bleibt bei Ihnen; mir sagen Sie es bitte nicht.“
- „Das Häkchen für Werbe-E-Mails können Sie leer lassen.“
- „Wenn Cloudflare eine Bestätigungs-E-Mail schickt, klicken Sie bitte auf den Link darin.“
- „Sie brauchen keinen bezahlten Tarif. Falls nach einem Tarif gefragt wird, wählen Sie ‚Free‘. Falls nach Zahlungsdaten gefragt wird, tragen Sie nichts ein und sagen Sie mir Bescheid.“
- „Schreiben Sie mir ‚fertig‘, wenn Sie die Übersichtsseite Ihres Kontos sehen.“

Die Seite ist auf Englisch. Beschreibt der Nutzer etwas, das du nicht einordnen kannst, bitte ihn, die Überschrift der Seite abzutippen, und hilf von dort weiter. Rate nicht.

## 4. Werkzeug anmelden, in zwei Nachrichten

Der Befehl zum Anmelden wartet, bis der Nutzer im Browser bestätigt hat, und gibt nach etwa zwei Minuten von selbst auf. Je nach Werkzeug sieht der Nutzer deine Erklärung erst, wenn der Befehl schon beendet ist. Deshalb:

**Erste Nachricht (ohne den Befehl zu starten):** „Als Nächstes verbinde ich Ihr Konto mit diesem Rechner. Dabei öffnet sich in Ihrem Browser eine Seite von Cloudflare mit der Überschrift ‚Wrangler wants to access your account‘. Klicken Sie dort ganz unten auf ‚Authorize‘; Sie haben dafür etwa zwei Minuten Zeit. Damit erlauben Sie dem Werkzeug auf diesem Rechner, Ihre Seite ins Netz zu stellen. Schreiben Sie mir ‚bereit‘, dann starte ich.“ Beende damit deine Nachricht.

**Nach seinem „bereit“:** Führe `npx wrangler@4.162.0 login` aus. Öffnet sich kein Browser, steht in der Ausgabe eine Adresse; gib sie dem Nutzer zum Anklicken und starte den Befehl danach erneut.

## 5. Selbst nachprüfen

Führe `npx wrangler@4.162.0 whoami` erneut aus. Erst wenn dort die Anmeldung bestätigt wird, sagst du: „Die Verbindung steht.“ Sonst sag ehrlich, dass es noch nicht geklappt hat, frag, was der Nutzer im Browser gesehen hat, und wiederhole Schritt 4 einmal. Klappt es wieder nicht, hör auf, beschreibe dem Nutzer, was du gesehen hast, und stelle nichts ins Netz. Das fertig geprüfte Kundenportal bleibt im Ordner; er kann später mit „Weiter mit der Verbindung“ fortfahren.

## Niemals

- nach einem Passwort fragen, eines vorschlagen oder eines eingeben
- für den Nutzer einen bezahlten Tarif wählen oder Zahlungsdaten eintragen
- behaupten, das Konto koste dauerhaft nichts: Sag „im kostenlosen Tarif“; der Anbieter kann seine Bedingungen ändern

Danach weiter mit `portal-bereitstellen`.
