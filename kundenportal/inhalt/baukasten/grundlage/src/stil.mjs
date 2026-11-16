// Gestaltung des Kundenportals. Farben und Maße stehen oben als Variablen; nur dort ändern.
export const STIL = `
:root {
  --papier: #f6f4ee; --flaeche: #ffffff; --tinte: #1d231c; --gedaempft: #5a6257; --linie: #d9d6cb;
  --akzent: #2f5d46; --akzent-hell: #e3efe6; --warnung: #8a3b1e; --radius: 14px; --breite: 40rem;
  --schrift: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; }
html { font-family: var(--schrift); font-size: 106.25%; line-height: 1.55; color: var(--tinte); background: var(--papier); -webkit-text-size-adjust: 100%; }
body { margin: 0; min-height: 100dvh; display: flex; flex-direction: column; }
a { color: var(--akzent); text-underline-offset: 0.18em; }
:focus-visible { outline: 3px solid var(--akzent); outline-offset: 3px; border-radius: 6px; }
.kopf, .inhalt, .fuss { width: 100%; max-width: var(--breite); margin: 0 auto; padding-inline: clamp(1rem, 4vw, 1.5rem); }
.kopf { padding-block: 1.25rem 0.5rem; }
.marke { font-weight: 700; font-size: 1.1rem; color: var(--tinte); text-decoration: none; overflow-wrap: anywhere; }
.inhalt { flex: 1; padding-block: 1rem 3rem; }
.fuss { display: flex; gap: 1.25rem; padding-block: 1.25rem 2rem; border-top: 1px solid var(--linie); font-size: 0.9rem; }
h1 { font-size: clamp(1.6rem, 5vw, 2.1rem); line-height: 1.15; margin: 0.5rem 0 1rem; text-wrap: balance; }
h2 { font-size: 1.15rem; margin: 2rem 0 0.5rem; }
p { margin: 0 0 1rem; max-width: 62ch; }
.einleitung { color: var(--gedaempft); }
.klein { font-size: 0.88rem; color: var(--gedaempft); }
.formular { display: grid; gap: 1.1rem; }
.formular label, .zeile label { display: grid; gap: 0.35rem; font-weight: 600; }
input, select, textarea { font: inherit; font-size: 1rem; padding: 0.7rem 0.8rem; min-height: 3rem; width: 100%; background: var(--flaeche); color: var(--tinte); border: 1px solid #8f978b; border-radius: 10px; }
fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
legend { font-weight: 600; padding: 0; margin-bottom: 0.5rem; }
.haken { grid-template-columns: auto 1fr; align-items: start; gap: 0.7rem; font-weight: 400; }
.haken input { width: 1.4rem; height: 1.4rem; min-height: 0; margin-top: 0.15rem; padding: 0; }
.knopf { display: inline-flex; align-items: center; justify-content: center; min-height: 3rem; padding: 0.7rem 1.3rem; font: inherit; font-weight: 700; color: #fff; background: var(--akzent); border: 1px solid var(--akzent); border-radius: 999px; text-decoration: none; cursor: pointer; }
.knopf.zweitrangig { color: var(--akzent); background: transparent; }
.knopf.klein { min-height: 2.75rem; padding: 0.4rem 0.9rem; font-size: 0.9rem; color: var(--akzent); background: transparent; }
.angaben { display: grid; grid-template-columns: auto 1fr; gap: 0.4rem 1.2rem; margin: 0 0 1.5rem; padding: 1.1rem; background: var(--flaeche); border: 1px solid var(--linie); border-radius: var(--radius); }
.angaben dt { color: var(--gedaempft); } .angaben dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }
.merken, .meldung { padding: 0.8rem 1rem; border-radius: 10px; background: var(--akzent-hell); }
.meldung { background: #f6e3da; color: var(--warnung); font-weight: 600; }
.zeile { display: flex; gap: 0.8rem; align-items: end; flex-wrap: wrap; }
section { margin-top: 2.2rem; }
.anrede { color: var(--gedaempft); margin: 0.5rem 0 0; }
.anrede + h1 { margin-top: 0.2rem; }
.nurvorlesen { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.stufen { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; counter-reset: stufe; }
.stufen li { position: relative; display: flex; align-items: center; gap: 0.9rem; min-height: 3rem; padding: 0.35rem 0; color: var(--gedaempft); counter-increment: stufe; }
.stufen li::before { content: counter(stufe); flex: none; display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 50%; border: 2px solid var(--linie); background: var(--flaeche); font-weight: 700; font-size: 0.9rem; z-index: 1; }
.stufen li + li::after { content: ""; position: absolute; left: calc(1rem - 1px); bottom: calc(50% + 1rem); height: calc(100% - 2rem); border-left: 2px solid var(--linie); }
.stufen .erledigt { color: var(--tinte); }
.stufen .erledigt::before { content: "✓"; background: var(--akzent-hell); border-color: var(--akzent); color: var(--akzent); }
.stufen .erledigt + li::after { border-color: var(--akzent); }
.stufen .aktuell { color: var(--tinte); font-weight: 700; font-size: 1.1rem; }
.stufen .aktuell::before { background: var(--akzent); border-color: var(--akzent); color: #fff; }
.liste { list-style: none; margin: 0 0 1.2rem; padding: 0; display: grid; gap: 0.6rem; }
.karte { padding: 0.95rem 1.1rem; background: var(--flaeche); border: 1px solid var(--linie); border-radius: var(--radius); overflow-wrap: anywhere; }
.karte p { margin: 0; } .karte .klein { margin-bottom: 0.2rem; }
.text { white-space: pre-line; }
.datei { display: flex; justify-content: space-between; align-items: baseline; gap: 0.4rem 1rem; flex-wrap: wrap; }
.datei a, .reihe a { font-weight: 600; display: inline-flex; align-items: center; min-height: 2.75rem; }
.reihe { display: flex; justify-content: space-between; align-items: start; gap: 1rem; flex-wrap: wrap; }
.leer { color: var(--gedaempft); }
.zeile-link { display: flex; justify-content: space-between; align-items: baseline; gap: 0.3rem 1rem; flex-wrap: wrap; padding: 0.95rem 1.1rem; min-height: 3rem; background: var(--flaeche); border: 1px solid var(--linie); border-radius: var(--radius); color: var(--tinte); text-decoration: none; overflow-wrap: anywhere; }
.zeile-link:hover { border-color: var(--akzent); }
.zeile-link span { color: var(--gedaempft); font-size: 0.92rem; }
.link { padding: 1rem 1.1rem; background: var(--flaeche); border: 2px solid var(--akzent); border-radius: var(--radius); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.95rem; overflow-wrap: anywhere; user-select: all; max-width: none; }
.knopf.warnung { background: var(--warnung); border-color: var(--warnung); margin-top: 0.8rem; }
.zeile label { flex: 1 1 10rem; }
input[type="file"] { padding: 0.55rem 0.6rem; }
@media (prefers-reduced-motion: no-preference) { .zeile-link, .knopf { transition: border-color 0.15s, background-color 0.15s; } }
`;
