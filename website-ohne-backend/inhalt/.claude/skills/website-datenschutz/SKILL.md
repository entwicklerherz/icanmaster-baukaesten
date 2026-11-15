---
name: website-datenschutz
description: Fünfter Schritt des Baukastens „Website ohne Backend“. Legt Impressum und Datenschutzseite an und stellt sicher, dass die Seite keine Daten an fremde Server gibt. Nach website-bauen verwenden, auch wenn der Nutzer nicht danach fragt.
---

# Datenschutz und Pflichtangaben (Deutschland)

Du gibst keine Rechtsberatung. Du sorgst dafür, dass die Seite technisch datensparsam ist und die üblichen Pflichtseiten mit den Angaben des Nutzers enthält, und du sagst in der Übergabe klar, was der Nutzer selbst prüfen lassen muss.

## Technische Regeln (ohne Ausnahme)

- Keine Verbindung zu fremden Servern: keine Schriften, Skripte, Stylesheets, Bilder, Videos, Karten, Symbole oder Zähler von außen. Jede Datei liegt im Ordner `website/`.
- Keine Cookies, kein `localStorage`, kein `sessionStorage`, keine Besucherzählung. Dann braucht die Seite auch kein Cookie-Banner; baue keines ein.
- Kein Formular. Kontakt über `tel:` und `mailto:`.
- Links zu fremden Seiten sind erlaubt, als normale Links.

## Impressum (`impressum.html`)

Aus den Angaben des Nutzers, nichts erfinden:

- Name und Rechtsform des Anbieters, bei Einzelpersonen Vor- und Nachname
- Anschrift (keine Postfachadresse)
- Kontakt: Telefon und E-Mail
- falls genannt: Vertretungsberechtigte, Registergericht und Registernummer, Umsatzsteuer-Identifikationsnummer
- bei zulassungspflichtigen oder verkammerten Berufen: Berufsbezeichnung und Staat der Verleihung, zuständige Kammer oder Aufsichtsbehörde, soweit genannt
- inhaltlich verantwortliche Person, wenn die Seite redaktionelle Texte enthält

Fehlt eine Pflichtangabe, schreibe an die Stelle sichtbar `[Bitte ergänzen: …]` und nimm sie in die Liste der offenen Punkte der Übergabe auf.

## Datenschutzseite (`datenschutz.html`)

Kurz, in verständlichem Deutsch, passend zu dem, was die Seite wirklich tut:

1. **Verantwortlich:** Name, Anschrift, Kontakt (wie im Impressum).
2. **Beim Aufruf der Seite:** Der Anbieter, bei dem die Seite gespeichert ist, verarbeitet technisch nötige Daten wie IP-Adresse, Zeitpunkt und abgerufene Datei in Protokolldateien, um die Seite auszuliefern und abzusichern (Art. 6 Abs. 1 Buchst. f DSGVO). Name und Sitz dieses Anbieters: `[Bitte ergänzen: Anbieter, bei dem die Seite veröffentlicht wird]`, solange er nicht feststeht.
3. **Keine Cookies, keine Auswertung:** Die Seite setzt keine Cookies, bindet keine Inhalte fremder Anbieter ein und wertet Besuche nicht aus.
4. **Kontakt per E-Mail oder Telefon:** Angaben werden nur verwendet, um das Anliegen zu bearbeiten, und danach gelöscht, soweit keine Aufbewahrungspflicht besteht.
5. **Ihre Rechte:** Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit; Beschwerde bei einer Datenschutz-Aufsichtsbehörde.
6. **Stand:** Monat und Jahr.

Beschreibe nichts, was die Seite nicht tut (keine Abschnitte zu Newslettern, Analysewerkzeugen, sozialen Netzwerken, Formularen).

## Für die Übergabe vormerken

- Die Rechtstexte sind ein sorgfältiger Entwurf aus den eigenen Angaben, keine Rechtsberatung; bei besonderen Berufen oder Unsicherheit prüfen lassen.
- Der Name des Anbieters, bei dem die Seite veröffentlicht wird, muss auf der Datenschutzseite nachgetragen werden.
