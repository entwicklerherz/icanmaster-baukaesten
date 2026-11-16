// Gestaltung der Terminbuchung. Farben und Maße stehen oben als Variablen; nur dort ändern.
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
.tage, .buchungen, .sperren { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6rem; }
.tag { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; flex-wrap: wrap; padding: 0.95rem 1.1rem; min-height: 3rem; background: var(--flaeche); border: 1px solid var(--linie); border-radius: var(--radius); color: var(--tinte); text-decoration: none; }
.tag:hover { border-color: var(--akzent); }
.tag span { color: var(--gedaempft); font-size: 0.92rem; }
.formular { display: grid; gap: 1.1rem; }
.formular label, .zeile label { display: grid; gap: 0.35rem; font-weight: 600; }
input, select, textarea { font: inherit; font-size: 1rem; padding: 0.7rem 0.8rem; min-height: 3rem; width: 100%; background: var(--flaeche); color: var(--tinte); border: 1px solid #8f978b; border-radius: 10px; }
fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
legend { font-weight: 600; padding: 0; margin-bottom: 0.5rem; }
.zeiten { display: grid; grid-template-columns: repeat(auto-fill, minmax(6.2rem, 1fr)); gap: 0.5rem; }
.zeit { position: relative; display: block; font-weight: 500; }
.zeit input { position: absolute; opacity: 0; inset: 0; width: 100%; height: 100%; min-height: 0; margin: 0; cursor: pointer; }
.zeit span { display: flex; align-items: center; justify-content: center; min-height: 3rem; background: var(--flaeche); border: 1px solid var(--linie); border-radius: 10px; }
.zeit input:checked + span { background: var(--akzent); border-color: var(--akzent); color: #fff; font-weight: 700; }
.zeit input:focus-visible + span { outline: 3px solid var(--akzent); outline-offset: 3px; }
.haken { grid-template-columns: auto 1fr; align-items: start; gap: 0.7rem; font-weight: 400; }
.haken input { width: 1.4rem; height: 1.4rem; min-height: 0; margin-top: 0.15rem; padding: 0; }
.falle { position: absolute; left: -200vw; width: 1px; height: 1px; overflow: hidden; }
.knopf { display: inline-flex; align-items: center; justify-content: center; min-height: 3rem; padding: 0.7rem 1.3rem; font: inherit; font-weight: 700; color: #fff; background: var(--akzent); border: 1px solid var(--akzent); border-radius: 999px; text-decoration: none; cursor: pointer; }
.knopf.zweitrangig { color: var(--akzent); background: transparent; }
.knopf.klein { min-height: 2.75rem; padding: 0.4rem 0.9rem; font-size: 0.9rem; color: var(--akzent); background: transparent; }
.angaben { display: grid; grid-template-columns: auto 1fr; gap: 0.4rem 1.2rem; margin: 0 0 1.5rem; padding: 1.1rem; background: var(--flaeche); border: 1px solid var(--linie); border-radius: var(--radius); }
.angaben dt { color: var(--gedaempft); } .angaben dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }
.merken, .meldung { padding: 0.8rem 1rem; border-radius: 10px; background: var(--akzent-hell); }
.meldung { background: #f6e3da; color: var(--warnung); font-weight: 600; }
.buchung { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding: 1rem 1.1rem; background: var(--flaeche); border: 1px solid var(--linie); border-radius: var(--radius); overflow-wrap: anywhere; }
.buchung.abgesagt { opacity: 0.7; }
.marker { font-size: 0.8rem; font-weight: 700; color: var(--warnung); }
.aktionen { display: flex; gap: 0.5rem; align-items: start; flex-wrap: wrap; }
.zeile { display: flex; gap: 0.8rem; align-items: end; flex-wrap: wrap; }
.sperren { margin-top: 1rem; } .sperren li { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
@media (prefers-reduced-motion: no-preference) { .tag, .knopf { transition: border-color 0.15s, background-color 0.15s; } }
`;
