---
name: website-gestalten
description: Dritter Schritt des Baukastens „Website ohne Backend“. Legt vor dem Bauen fest, wie die Seite aufgebaut ist und aussieht: Komposition nach der Aufgabe der Besucher, Szenenbild, Farben aus dem Bild, Schriften, Überschrift. Nach website-gespraech (und gegebenenfalls website-uebernahme) und vor website-bauen verwenden.
---

# Gestalten

Der Baukasten bringt drei fertig gestaltete Kompositionen mit. Deine Aufgabe ist die Art-Direktion: die Komposition wählen, die zur Aufgabe der Besucher passt, und Bild, Farben, Schrift und Worte so setzen, dass die Seite nach genau diesem Betrieb aussieht. Der Nutzer wird dazu nicht befragt.

Schreibe den Plan als Kommentar an den Anfang von `website/assets/style.css` (Überschrift `GESTALTUNGSPLAN`, sechs bis zehn Zeilen), bevor du eine Zeile HTML schreibst.

## 1. Komposition: Was wollen Besucher hier als Erstes?

Beantworte im Plan in einem Satz: Wer kommt auf diese Seite, und was will die Person in den ersten zehn Sekunden wissen oder tun? Danach wählst du:

| Komposition | wenn Besucher fragen | typisch für | Muster |
|---|---|---|---|
| `buehne` | „Ist offen? Wo ist das? Was gibt es?“ Man kommt vorbei. | Café, Restaurant, Bäckerei, Laden, Hofladen, Blumenladen, Verein mit festem Ort | `baukasten/muster-buehne.html` |
| `werkbank` | „Was machen die? Kann ich denen das anvertrauen? Wie erreiche ich sie?“ Man beauftragt. | Tischlerei, Maler, Elektrik, Fahrrad- oder Kfz-Werkstatt, Gartenbau, Hausmeisterdienst | `baukasten/muster-werkbank.html` |
| `ruhe` | „Bin ich hier richtig? Wer behandelt oder berät mich? Wie bekomme ich einen Termin?“ Man vereinbart etwas. | Praxis, Massage, Kosmetik, Beratung, Kanzlei, Coaching, Unterricht | `baukasten/muster-ruhe.html` |

Passt ein Vorhaben zu zweien, entscheidet, was der Nutzer als Zweck genannt hat (anrufen lassen, vorbeikommen lassen, Termin vereinbaren). Du mischst keine Kompositionen und erfindest keine vierte.

## 2. Bild: ein Raum, in dem man sich den Betrieb vorstellen kann

Wähle aus `baukasten/szenen/` (Tabelle in `LIES-MICH.md` dort, Einzelheiten in `verzeichnis.json`) das **eine** Szenenbild, das zur Welt des Betriebs passt. Dazu gehört ein Stillleben aus `baukasten/illustrationen/` als zweites Bild weiter unten (in der Tabelle genannt). Kopiere die Dateien groß und klein mit `cp` nach `website/assets/bilder/`.

- Passt keine Szene wirklich, nimm die nächstliegende ruhige (für Dienstleistungen meist `buero`) statt einer falschen. Zeigt das Bild etwas, das der Betrieb nicht hat (ein Klavier bei der Mathenachhilfe), ist es falsch.
- Hat der Nutzer eigene Fotos gegeben, haben sie Vorrang: das beste breite Foto an die Stelle der Szene. Soll das Aussehen einer alten Seite bleiben, siehe `website-uebernahme`.
- **Du zeichnest nichts selbst:** keine Illustrationen, Symbole, Logos oder Schmuckformen als SVG oder CSS, keine Verläufe als Schmuck.

## 3. Farben: neun Werte, abgeleitet aus dem Bild

Die Seite soll aussehen, als sei sie um das Bild herum gebaut. Besonders wichtig ist `--grund`: In der Komposition `buehne` läuft das Bild links in den Seitengrund aus; er muss dem hellen Wandton links im Bild sehr nahe sein. Trage im Block „Gestaltungsplan“ der Grundlage ein und rechne die Kontraste nach (nicht schätzen):

| Variable | Rolle | Regel |
|---|---|---|
| `--grund` | Seite | sehr hell, im Ton der hellsten Bildfläche; nie reines Weiß oder Grau |
| `--schrift` | Text | sehr dunkler Ton aus der Farbfamilie des Bildes, mindestens 7:1 zu `--grund` |
| `--akzent` | Aktionen | der eine kräftige Ton des Bildes, abgedunkelt bis mindestens 4,5:1 zu `--grund` **und** zu `--flaeche` |
| `--auf-akzent` | Text auf Akzent | fast weiß, mindestens 4,5:1 zu `--akzent` |
| `--flaeche` | zweiter Abschnitt | eine Stufe dunkler als der Grund, gleiche Richtung |
| `--karte` | Auskunftsleiste, Notiz | heller als der Grund, fast weiß |
| `--tief` | Schlussabschnitt, Plakette | der dunkelste Ton, eng verwandt mit `--akzent` oder `--schrift` |
| `--auf-tief` | Text im Band | sehr hell, mindestens 7:1 zu `--tief` |
| `--gegen` | Unterstreichungen, kleine Zeichen | ein warmer Gegenton aus dem Bild; nie als Textfarbe auf hellem Grund |

Die prägenden Farben stehen in `verzeichnis.json`. Sie sind meist zu hell für Text und Aktionen: dunkle sie ab, bis die Kontraste stimmen. Soll das Aussehen einer alten Seite bleiben, kommen Akzent und Grund von dort.

## 4. Schrift und Form

Wähle aus `baukasten/schriften/` (Tabelle und gute Paare in `LIES-MICH.md` dort) und trage ein: `--familie-titel`, `--familie-text`, `--titel-gewicht`, `--titel-laufweite` (zwischen -0.04em und -0.01em), `--titel-breite` (aus der Tabelle). Die Schrift trägt den Charakter:

- `buehne`: gern eine Serife mit Wärme, kräftig gesetzt (Fraunces um 560).
- `werkbank`: gern eine kräftige Grotesk (Bricolage Grotesque oder Schibsted Grotesk, 700), kleine Radien (`--radius: 0.375rem; --radius-gross: 0.75rem`).
- `ruhe`: gern eine leichte Serife (Newsreader um 420), weiche Radien (`--radius: 0.75rem; --radius-gross: 1.75rem`).

Das sind Ausgangspunkte, keine Vorschrift: Wünscht der Nutzer „kräftig und modern“ für seine Praxis, bekommt sie eine Grotesk.

## 5. Worte

- **Überschrift:** zwei, höchstens drei kurze Zeilen, je Zeile ein `<span>` und **höchstens 16 Zeichen** (Leerzeichen mitgezählt). Sie sagt, was es hier gibt und wo, in den Worten des Nutzers („Frühstück und / Kuchen am / Marktplatz“, „Möbel nach Maß, / gebaut in Kiel“). Kein Name allein, kein Werbespruch, nichts Gefolgertes.
- Zähle die Zeichen der längsten Zeile und trage sie als `--titel-zeichen` ein. Die Zeilen brechen nicht von selbst um; die Schriftgröße richtet sich nach dieser Zahl.
- **Anruf-Schaltfläche:** eine kurze Zeile, die sagt, was der Anruf bringt („Tisch reservieren“, „Vorhaben besprechen“, „Termin vereinbaren“), darunter die Nummer.
- **Keine Angabe öfter als nötig.** Zeiten und Adresse stehen oben kurz (Statuszeile, Auskunft oder Plakette) und einmal vollständig im Schlussabschnitt, nirgends sonst. Die Telefonnummer steht in der Kopfzeile, im Einstieg und im Schluss.
- Deutsche Feinheiten: „solche“ Anführungszeichen, Halbgeviertstrich für Spannen (8–18 Uhr), geschütztes Leerzeichen in Telefonnummern (`&nbsp;`).

## 6. Bewegung

Die Bausteine bringen ihre Bewegung mit: gestaffelter Auftritt (`auftritt`, `nr-1` bis `nr-6`), das Szenenbild wird scharf (`entfalten`), Abschnitte erscheinen beim Scrollen (`erscheinen`), die Kopfzeile geht mit. Füge nichts hinzu und nimm nichts weg. Alles schaltet sich bei `prefers-reduced-motion` von selbst ab.

## Selbstkritik vor dem Bauen

Lies deinen Plan und frage: Könnte diese Seite unverändert einem anderen Betrieb gehören? Dann fehlt etwas Eigenes: ein Wort des Nutzers in der Überschrift, die richtige Szene, der Ton aus seinem Wunsch. Stimmen alle Kontraste nachgerechnet? Ändere, was nicht trägt, und schreibe im Plan einen Satz dazu.
