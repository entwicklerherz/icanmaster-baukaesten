---
name: website-bauen
description: Vierter Schritt des Baukastens „Website ohne Backend“. Setzt den Gestaltungsplan mit dem Muster der gewählten Komposition in eine kleine, schnelle Website aus reinem HTML und CSS im Ordner website/ um. Nach website-gestalten verwenden.
---

# Bauen

Du baust mit dem Muster der gewählten Komposition. Jedes Muster ist von Hand gestaltet und auf fünf Bildschirmbreiten geprüft. Je genauer du dich daran hältst, desto besser sieht die Seite aus.

## Dateien

- `website/index.html`: aus `baukasten/muster-<komposition>.html`. Ersetze jedes `{{…}}` durch Angaben des Nutzers, lösche Zeilen und Abschnitte, für die es keine Angabe gibt, und lösche alle Kommentare. Reihenfolge, Verschachtelung und Klassen bleiben.
- `website/impressum.html` und `website/datenschutz.html`: siehe Skill `website-datenschutz`. Dieselbe Kopf- und Fußzeile wie die Startseite (die Sprungmarken zeigen auf `index.html#…`), der Inhalt in `<main id="inhalt"><div class="rahmen abschnitt"><div class="lesen">…</div></div></main>`.
- `website/assets/style.css`: das einzige Stylesheet. Reihenfolge darin: (1) Kommentar `GESTALTUNGSPLAN`, (2) `@font-face` für die gewählten Schriften, (3) der vollständige Inhalt von `baukasten/grundlage.css` mit deinen Werten im Block „Gestaltungsplan“. Eigene Regeln brauchst du in der Regel nicht.
- `website/assets/seite.js`: Kopie von `baukasten/seite.js` (zeigt „heute geöffnet“ und markiert den heutigen Tag; sendet und speichert nichts).
- `website/assets/schriften/` und `website/assets/bilder/`: die gewählten Dateien, mit `cp` kopiert, samt Lizenztexten der Schriften.
- Kein `<style>` im HTML, kein Inline-Stil.

## Bausteine richtig benutzen

- **Grundlage nicht umgehen:** keine festen Pixelgrößen für Schrift, keine Farbwerte außerhalb des Plans, keine eigenen Abstände, wo es `--raum-…` gibt. Die Bausteine werden nicht überschrieben.
- **Überschrift:** `<h1 class="titel">` mit einem `<span>` je Zeile, höchstens 16 Zeichen je Zeile; `--titel-zeichen` ist die Länge der längsten.
- **Bilder:** Dateiname, `alt`, `width` und `height` aus `baukasten/szenen/verzeichnis.json` und `baukasten/illustrationen/verzeichnis.json`. Das Szenenbild behält `srcset` und `sizes` aus dem Muster.
- **Zeiten:** je genannter Zeitangabe eine Zeile mit `data-tage` (1 = Montag … 7 = Sonntag, Bereich als `2-7`) und an offenen Tagen `data-von` und `data-bis` (`9`, `17.30`). Daraus entstehen die Statuszeile („Heute bis 18 Uhr geöffnet“) und die Markierung „heute“. Der Text im Element mit `data-status` ist die Fassung ohne Skript: die Zeiten in einer Zeile. Die Zeiten stehen im Schlussabschnitt neben Kontakt und Adresse. Gibt es keine festen Zeiten, entfallen die Statuszeile und die Zeitenliste.
- **Auskunftsleiste (nur `buehne`):** zwei oder drei kurze Angaben, je höchstens zwei Zeilen: Zeiten, Adresse und, wenn genannt, eine Besonderheit (zum Beispiel „Reservierung nur am Telefon“). Keine E-Mail-Adresse, keine langen Wörter; fehlt eine dritte Angabe, bleiben es zwei Spalten.
- **Statuszeile:** Sie behauptet nie mehr als die genannten Zeiten. Schreibe nirgends „geschlossen“, wenn der Nutzer es nicht gesagt hat.
- **Einleitung:** ein Satz, höchstens 110 Zeichen in `buehne` und 140 in den anderen Kompositionen. Was in der Liste darunter steht, wird hier nicht aufgezählt. Kein Füllsatz („Wir nehmen uns Zeit für Sie“), wenn der Nutzer ihn nicht gesagt hat.
- **Listen (Tafel, Werkliste, Behandlungen):** drei bis sechs Einträge, je ein Name und wenige Worte oder ein Satz. Keine Nummern, keine Symbole. Bei nur einem oder zwei Einträgen stehen sie stattdessen im Einleitungssatz, und der Abschnitt entfällt.
- **Fotos (Galerie):** nur mit eigenen Fotos des Nutzers aus dem Ordner `fotos/` (prüfe mit `ls fotos`, ob es ihn gibt). Zwei bis sechs Bilder, mit `cp` nach `website/assets/bilder/` kopiert, das beste zuerst. Passt eines als breites Bild, ersetzt es zusätzlich das Szenenbild im Einstieg. Gibt es keine Fotos, entfällt der Abschnitt; Bilder des Baukastens stehen nie in der Galerie.
- **Gut zu wissen:** zwei bis vier Stichworte mit je einem kurzen Satz, ausschließlich aus dem, was der Nutzer dazu gesagt hat (Rezept, Preise, Anfahrt, Hausbesuche, Einzugsgebiet). Hat er nur eine Sache genannt, steht sie als Notiz oder in der Einleitung, und der Abschnitt entfällt.
- **Aussage (nur `werkbank`) und Notiz (nur `ruhe`):** nur mit einer Angabe des Nutzers; sonst löschen.
- **Schluss (`band`):** Kontakt, Zeiten und Weg stehen zusammen in einem dunklen Abschnitt, damit keine Angabe mehrfach über die Seite verteilt ist. Die Telefonnummer steht als `band__nummer`. Gibt es kein Telefon, steht dort die E-Mail-Adresse, und alle Anruf-Schaltflächen werden zu E-Mail-Schaltflächen.
- **Logo:** Hat der Nutzer ein Logo, steht es als `<img>` mit `alt` im `kopf__name`.

## Inhalt

- Nur, was der Nutzer gesagt hat, in klaren, kurzen Sätzen. Keine Werbefloskeln, keine erfundenen Zahlen, Stimmen, Abläufe oder Auszeichnungen, kein Blindtext.
- **Nichts folgern, was nicht gesagt wurde.** Nennt der Nutzer Zeiten für Montag bis Freitag, steht auf der Seite nichts über Samstag und Sonntag (keine Zeile „geschlossen“). Keine Angaben zu Parkplätzen, Barrierefreiheit, Kassen, Preisen, Wartezeiten oder Erfahrung, wenn sie nicht genannt wurden.
- **Leistungen beschreiben, nicht versprechen.** Ein Halbsatz, der erklärt, was die Leistung ist, ist erlaubt; Aussagen über Wirkung oder Erfolg nicht („lindert Schmerzen“, „schnell“, „garantiert“, „Top-Qualität“). Bei Gesundheit, Recht und Geld gilt das besonders streng. Im Zweifel steht nur der Name der Leistung.
- Telefon als `tel:`-Link im Format `+49…`, E-Mail als `mailto:`-Link. Der Kartenlink ist ein normaler Link zur Kartensuche mit der Adresse, keine eingebettete Karte.

## Handwerk

- `<html lang="de">`, je Seite ein eigener `<title>` und eine `meta description`, `viewport` wie im Muster.
- Genau eine `h1` je Seite, danach `h2`, `h3` ohne Sprünge. Jedes Bild mit kurzem beschreibendem `alt`.
- Alle Verweise zwischen den Seiten relativ, damit die Seite auch per Doppelklick aus dem Ordner funktioniert.
