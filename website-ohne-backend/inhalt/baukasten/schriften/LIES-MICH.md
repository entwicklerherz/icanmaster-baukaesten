# Schriften des Baukastens

Sechs frei lizenzierte Schriften (SIL Open Font License 1.1, Lizenztexte unter `LIZENZEN/`), jeweils als eine Datei mit allen Strichstärken (variable Schrift, lateinischer Zeichensatz mit Umlauten). Sie werden mit der Website ausgeliefert, nichts wird von fremden Servern geladen.

| Datei | Name für `font-family` | Stärken | Charakter | passt zu | `--titel-breite` |
|---|---|---|---|---|---|
| `fraunces.woff2` | Fraunces | 100–900 | weiche, warme Serifenschrift mit Charakter | Überschriften: Gesundheit, Genuss, Persönliches | 0.55 bei Stärke 360, 0.58 bei 600 |
| `newsreader.woff2` | Newsreader | 200–800 | ruhige Lese-Serife | Überschriften: Kanzlei, Praxis, Beratung | 0.50 bei 400, 0.53 bei 600 |
| `bricolage-grotesque.woff2` | Bricolage Grotesque | 200–800 | eigenwillige, kräftige Grotesk mit Ecken und Kanten | Überschriften: Handwerk, Gastronomie, Kreative | 0.55 bei 500, 0.58 bei 700 |
| `schibsted-grotesk.woff2` | Schibsted Grotesk | 400–900 | sachliche, feste Zeitungs-Grotesk | Überschriften und Text: Technik, Vereine, Dienstleistung | 0.55 bei 500, 0.58 bei 700 |
| `instrument-sans.woff2` | Instrument Sans | 400–700 | klare, präzise Textschrift | Fließtext zu jeder Überschrift | 0.55 bei 500, 0.56 bei 700 |
| `figtree.woff2` | Figtree | 300–900 | freundliche, runde Textschrift | Fließtext, wenn es nahbar wirken soll | 0.52 bei 500, 0.53 bei 700 |

Die letzte Spalte ist die gemessene mittlere Buchstabenbreite. Trage sie zusammen mit `--titel-zeichen` (Buchstaben des längsten Wortes der Hauptüberschrift) in den Gestaltungsplan ein; dann passt die Überschrift auf jedem Bildschirm in ihre Zeilen.

Gute Paare: Fraunces mit Instrument Sans (ruhig, hell) · Newsreader mit Figtree (seriös, nahbar) · Bricolage Grotesque mit Instrument Sans (kräftig, handwerklich) · Schibsted Grotesk allein (sachlich).

## Einbinden

Kopiere nur die ein oder zwei Dateien, die du verwendest, mit `cp` nach `website/assets/schriften/` und die passenden Lizenztexte dazu. Dann am Anfang von `style.css`:

```css
@font-face {
  font-family: "Fraunces";
  src: url("schriften/fraunces.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

Der Bereich bei `font-weight` ist der aus der Tabelle. Es gibt keine kursiven Schnitte: Betone über Strichstärke, nicht über Kursive.
