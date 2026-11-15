---
name: website-ansehen
description: Siebter Schritt des Baukastens „Website ohne Backend“. Sieht sich die gebaute Startseite als Bildschirmfoto auf Handy und Desktop an und bessert nach, was nicht fertig aussieht. Nach website-pruefen und vor website-uebergabe verwenden.
---

# Ansehen

Das Prüfskript liest nur den Code. Ob die Seite gut aussieht, sieht man erst im Browser. Deshalb schaust du sie dir an, bevor du übergibst: höchstens zwei Runden, nicht mehr.

## Ablauf

1. Führe im Projektordner aus: `node baukasten/ansehen.mjs`. Das Skript öffnet die Startseite unsichtbar in einem Browser, der auf dem Rechner schon installiert ist, und legt drei Bilder in den Ordner `ansicht/`: `desktop-oben.png` (erster Bildschirm), `desktop.png` und `handy.png` (ganze Seite; im Handybild ist die Seite der 390 Pixel breite Streifen links, die graue Fläche rechts gehört nicht dazu). Es lädt nichts aus dem Netz und installiert nichts.
2. Sieh dir alle drei Bilder an (Datei lesen). Sei streng: Du bist jetzt nicht der, der die Seite gebaut hat, sondern jemand, der sie zum ersten Mal sieht.
3. Geh die Liste unten durch und notiere alles, was nicht stimmt. Behebe **alles in einem Zug**, lass `node baukasten/pruefen.mjs` erneut laufen und danach einmal `node baukasten/ansehen.mjs` zur Bestätigung.
4. Nach der zweiten Runde ist Schluss. Was dann noch nicht stimmt, steht in der Übergabe.

Findet das Skript keinen Browser oder lässt es sich nicht ausführen, überspringst du den Schritt und sagst in der Übergabe in einem Satz, dass du die Seite nicht ansehen konntest.

## Worauf du achtest

**Erster Bildschirm (desktop-oben.png)**
- Steht die Überschrift groß und vollständig da, und sind Bild und Anruf-Schaltfläche zu sehen, ohne zu scrollen?
- Liegt Text nur auf ruhiger Fläche? Kein Wort über Gegenständen im Bild, nichts abgeschnitten, nichts übereinander.
- `buehne`: Geht das Bild links ohne sichtbare Kante in den Seitengrund über? Sonst liegt `--grund` zu weit vom Wandton des Bildes entfernt.

**Ganze Seite (desktop.png, handy.png)**
- Fehlt ein Bild (leere Fläche, sichtbarer Ersatztext)? Dann stimmt ein Pfad nicht.
- Wirken die Farben wie aus dem Bild genommen? Ein Akzent, der mit dem Bild streitet, wird nachgezogen.
- Hat jeder Abschnitt genug Inhalt, um für sich zu stehen? Ein Abschnitt mit einer einzigen Zeile wird mit dem Nachbarn zusammengelegt oder gestrichen.
- Steht eine Angabe öfter als dreimal auf der Seite? Streichen.
- Läuft eine Überschrift über mehr als drei Zeilen, oder ist ein Wort hässlich getrennt? Kürzer fassen.
- Handy: Ist die Reihenfolge sinnvoll (Bild, Überschrift, Anruf), sind Schaltflächen breit und gut zu treffen, ist nichts winzig?

**Die eine Frage zum Schluss:** Könnte diese Seite unverändert einem anderen Betrieb gehören? Wenn ja, fehlt etwas Eigenes des Nutzers in Überschrift, Einleitung oder Liste.

## Was du dabei nicht tust

- Du überschreibst keine Bausteine der Grundlage und baust keine neuen Abschnitte. Du änderst Werte im Gestaltungsplan, Worte, Bildwahl und die Auswahl der Abschnitte.
- Du zeigst dem Nutzer die Bilder nicht ungefragt und sprichst nicht über Pixel. In der Übergabe genügt ein Satz („Ich habe mir die Seite auf Handy und großem Bildschirm angesehen.“).
