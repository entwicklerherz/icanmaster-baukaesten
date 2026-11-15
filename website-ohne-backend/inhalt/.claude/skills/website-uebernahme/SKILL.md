---
name: website-uebernahme
description: Teil des Baukastens „Website ohne Backend“. Übernimmt die Inhalte einer bestehenden Internetseite des Nutzers in die neue Seite, wahlweise mit oder ohne das bisherige Aussehen. Verwenden, sobald der Nutzer im Gespräch die Adresse seiner bisherigen Seite nennt.
---

# Bestehende Seite übernehmen

Es geht um die **eigene** Seite des Nutzers. Von fremden Seiten übernimmst du nichts.

## 1. Lesen

- Rufe die genannte Adresse ab (mit dem Werkzeug zum Abrufen von Seiten oder mit `curl -sL <Adresse>`), dazu die Unterseiten, die dort verlinkt sind und zum selben Auftritt gehören (höchstens zehn, vor allem Leistungen, Über uns, Kontakt, Impressum).
- Kommst du nicht an die Seite, bitte den Nutzer einmal, die Seiten im Browser zu speichern und in einen Ordner `alte-seite` zu legen, und lies sie von dort.

## 2. Inhalte herausziehen

Sammle als Tatsachen, was dort steht: Name, Angebot und Leistungen mit ihren Beschreibungen, Zeiten, Adresse, Telefon, E-Mail, verantwortliche Person und alle Impressumsangaben, dazu Texte über den Betrieb. Diese Angaben gelten als vom Nutzer gesagt.

- Übernimm Texte sinngemäß und gestrafft, nicht jeden alten Satz. Was erkennbar veraltet ist (Jahreszahlen, „Neu ab …“, Aktionen), lässt du weg und merkst es für die Übergabe vor.
- Widersprechen sich Angaben (zwei Telefonnummern, verschiedene Zeiten), frag einmal nach.
- Aussagen über Wirkung oder Erfolg übernimmst du nicht, auch wenn sie auf der alten Seite standen (siehe `website-bauen`).

## 3. Was nicht mitkommt

Formulare, eingebettete Karten und Videos, Besucherzähler, Schriften und Skripte von fremden Servern, Cookie-Banner. Die neue Seite braucht das nicht (siehe `website-datenschutz`). Aus einem Kontaktformular wird ein Telefon- und E-Mail-Link, aus einer eingebetteten Karte ein normaler Link.

## 4. Aussehen: nur wenn der Nutzer es behalten will

**„Neu“ (oder keine Angabe):** Du übernimmst nur die Inhalte. Das Aussehen entsteht neu mit `website-gestalten`.

**„Behalten“:** Die neue Seite soll wiedererkennbar sein, aber aufgeräumt.

- Lies aus der alten Seite: die prägenden Farben (Hintergrund, Text, Auszeichnung), die Art der Schrift (mit oder ohne Serifen, kräftig oder leicht), das Logo und eigene Bilder.
- Trage die Farben in den Gestaltungsplan ein: der helle Hintergrund der alten Seite wird `--grund`, ihre prägende Farbe `--akzent` und, weiter abgedunkelt, `--tief`; eine zweite Schmuckfarbe wird `--gegen`. Reicht ein Kontrast nicht (Text 7:1, Akzent 4,5:1), dunkle oder helle den Ton ab, bis er reicht, und sag das in der Übergabe.
- Wähle aus `baukasten/schriften/` die Schrift, die der alten am nächsten kommt. Schriften von fremden Servern bindest du nicht ein.
- Logo und eigene Bilder des Nutzers lädst du herunter und legst sie unter `website/assets/bilder/` ab (nie von der alten Adresse einbinden). Merke für die Übergabe vor: Der Nutzer soll prüfen, dass er die Rechte an diesen Bildern hat.
- Aufbau und Bausteine kommen trotzdem aus dem Baukasten. Das Logo steht in der Kopfzeile. Hat die alte Seite kein eigenes Bild für den Einstieg, nimmst du das passende Szenenbild aus dem Baukasten dazu; eigene Fotos des Nutzers haben Vorrang.

## 5. Dem Nutzer sagen, was du gefunden hast

Zwei, drei Sätze, ohne Fachwörter: was du übernommen hast und was bewusst nicht mitkommt (zum Beispiel „Das Kontaktformular ersetze ich durch Ihre Telefonnummer und E-Mail-Adresse“). Danach stellst du **immer** diese eine Frage, auch wenn die alte Seite vollständig wirkt, und bevor du gestaltest oder baust: „Was hat sich seit der alten Seite geändert, und was sollte jemand wissen, bevor er kommt oder anruft?“ mit einem Beispiel, das zum Vorhaben passt. Eine alte Seite ist fast nie auf dem Stand von heute; ohne diese Frage fehlen der neuen Seite Preise, Hinweise oder Änderungen, die nur der Nutzer kennt. Erst danach folgen die Fragen aus `website-gespraech`, deren Antwort noch fehlt (zum Beispiel die Wirkung, wenn das Aussehen neu werden soll).

Angaben von der alten Seite (Name, Adresse, Telefon, E-Mail) übernimmst du so, wie sie dort stehen. Du ersetzt sie nicht durch eine markierte Lücke, weil sie dir ungewöhnlich vorkommen; hast du Zweifel, übernimm die Angabe und bitte in der Übergabe, sie zu prüfen.
