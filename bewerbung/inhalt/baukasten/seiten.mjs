// Setzt Lebenslauf, Anschreiben und Übersicht als einzelne HTML-Dateien: ohne Skripte, ohne Abrufe aus dem Netz.
// Lebenslauf und Anschreiben sind für DIN A4 gebaut; aus dem Browser werden sie mit „Drucken“ zu PDF-Dateien.
// Was auf dem Blatt steht, kommt aus dem geprüften Profil. Hier wird nichts ergänzt.

// Zeichen, die in HTML eine Bedeutung haben, werden über ihre Nummer ersetzt (kaufmännisches Und, spitze Klammern, beide Anführungszeichen).
const ERSATZ = new Map([[38, '&amp;'], [60, '&lt;'], [62, '&gt;'], [34, '&quot;'], [39, '&#39;']]);
const esc = text => Array.from(String(text ?? ''), z => ERSATZ.get(z.codePointAt(0)) ?? z).join('');
const monat = wert => wert === null ? 'heute' : wert.length === 4 ? wert : wert.slice(5) + '/' + wert.slice(0, 4);
const zeitraum = e => e.von === e.bis ? monat(e.von) : monat(e.von) + ' – ' + monat(e.bis);
const tagLang = tag => new Date(tag + 'T12:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const tagKurz = tag => new Date(tag + 'T12:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
const ohneZusatz = titel => titel.replace(/\s*\((?:m\/w\/d|w\/m\/d|m\/w|d\/m\/w|gn|all genders)\)/i, '');
const schriften = tiefe => `@font-face{font-family:"Bricolage Grotesque";src:url("${tiefe}baukasten/grundlage/schriften/bricolage-grotesque.woff2") format("woff2");font-weight:200 800;font-display:swap}
@font-face{font-family:"Figtree";src:url("${tiefe}baukasten/grundlage/schriften/figtree.woff2") format("woff2");font-weight:300 900;font-display:swap}`;

// ---------- Gemeinsames Blatt für Lebenslauf und Anschreiben ----------

const blattCss = `
:root{--tinte:#1b2530;--leise:#566472;--linie:#d5dbe0;--akzent:#1f5a52;--tisch:#e9ecee;--blatt:#fff}
*{box-sizing:border-box}
html{font-size:10.5pt}
body{margin:0;background:var(--tisch);color:var(--tinte);font:400 1rem/1.45 "Figtree",system-ui,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3{font-family:"Bricolage Grotesque","Figtree",system-ui,sans-serif;margin:0;line-height:1.1;letter-spacing:-.01em}
p{margin:0}
.leiste{max-width:210mm;margin:0 auto;padding:1rem 1.25rem;color:var(--leise);font-size:12pt;line-height:1.5}
.leiste strong{color:var(--tinte)}
.blatt{width:210mm;min-height:297mm;margin:0 auto 2rem;padding:17mm 20mm 16mm 22mm;background:var(--blatt);box-shadow:0 .25rem 1.5rem rgb(27 37 48 / .14)}
.kopf{display:flex;justify-content:space-between;align-items:flex-end;gap:10mm;padding-bottom:5mm;border-bottom:.6mm solid var(--akzent)}
.kopf h1{font-size:25pt;font-weight:700}
.kopf__ziel{margin-top:1.5mm;color:var(--akzent);font-weight:600;font-size:11pt}
.kontakt{display:grid;gap:.6mm;margin:0;padding:0;list-style:none;text-align:right;color:var(--leise);font-size:9.5pt;line-height:1.35;white-space:nowrap}
@media screen and (max-width:215mm){html{font-size:9.5pt}.blatt{width:auto;min-height:0;padding:9mm 7mm;box-shadow:none}.kopf{flex-direction:column;align-items:flex-start;gap:4mm}.kontakt{text-align:left;white-space:normal}}
@page{size:A4;margin:15mm 0 13mm}
@media print{body{background:#fff}.leiste{display:none}.blatt,.blatt--dicht,.blatt--eng{margin:0;box-shadow:none;min-height:0;padding-top:0;padding-bottom:0}}
`;

function kopf(p, ziel) {
  const person = p.person, kontakt = [person.anschrift, person.telefon, person.email, person.geburtsdatum ? `geboren am ${person.geburtsdatum}` : null].filter(Boolean);
  return `<header class="kopf"><div><h1>${esc(person.name)}</h1>${ziel ? `<p class="kopf__ziel">${esc(ziel)}</p>` : ''}</div>${kontakt.length ? `<ul class="kontakt">${kontakt.map(zeile => `<li>${esc(zeile)}</li>`).join('')}</ul>` : ''}</header>`;
}
const leiste = was => `<p class="leiste"><strong>${was} zum Ausdrucken.</strong> So wird daraus eine PDF-Datei: im Browser „Drucken“ wählen (Strg + P, am Mac Befehl + P), als Ziel „Als PDF sichern“ einstellen, Kopf- und Fußzeilen ausschalten. Dieser Hinweis wird nicht mitgedruckt.</p>`;

// ---------- Lebenslauf ----------

const lebenslaufCss = `
.teil{margin-top:calc(7mm*var(--d,1))}
.teil h2{font-size:11.5pt;font-weight:700;color:var(--akzent);padding-bottom:1.6mm;margin-bottom:calc(3.2mm*var(--d,1));border-bottom:.2mm solid var(--linie)}
.kurz{margin-top:calc(6mm*var(--d,1));max-width:158mm;font-size:1.05rem;line-height:1.5}
.eintrag{display:grid;grid-template-columns:33mm 1fr;gap:0 5mm;break-inside:avoid;padding-bottom:calc(4mm*var(--d,1))}
.eintrag:last-child{padding-bottom:0}
.eintrag__zeit{color:var(--leise);font-variant-numeric:tabular-nums;font-size:9.5pt;padding-top:.5mm}
.eintrag h3{font-size:11pt;font-weight:650}
.eintrag__wo{color:var(--leise)}
.eintrag ul{margin:calc(1.6mm*var(--d,1)) 0 0;padding:0 0 0 4mm}
.eintrag li{padding-left:.5mm;margin-top:calc(.7mm*var(--d,1))}
.eintrag li::marker{color:var(--akzent)}
.eintrag--ruhe h3{font-weight:500}
.paare{display:grid;grid-template-columns:33mm 1fr;gap:1.6mm 5mm;margin:0}
.paare dt{color:var(--leise);font-size:9.5pt;padding-top:.5mm}
.paare dd{margin:0}
.reihe{display:flex;flex-wrap:wrap;gap:1.4mm 2mm;margin:0;padding:0;list-style:none}
.reihe li{padding:.6mm 2.4mm;border:.2mm solid var(--linie);border-radius:1.2mm}
/* Längere Lebensläufe rücken zusammen, damit sie auf einer Seite bleiben. */
.blatt--dicht{--d:.68;font-size:10pt;padding-top:14mm;padding-bottom:12mm}
.blatt--eng{--d:.5;font-size:9.4pt;padding-top:12mm;padding-bottom:10mm}
@media screen and (max-width:215mm){.eintrag,.paare{grid-template-columns:1fr;gap:.6mm}.paare dd{margin-bottom:2mm}}
`;

// Schätzt, wie viele Zeilen der Lebenslauf braucht (Text je Zeile grob 86 Zeichen), und wählt danach die Dichte des Blatts.
export function lebenslaufLast(p, auswahl) {
  const zeilen = (text, breite = 86) => Math.max(1, Math.ceil(String(text || '').length / breite));
  const punkteVon = st => { const gewaehlt = auswahl.punkte[st.id]; return gewaehlt ? gewaehlt.map(id => st.punkte.find(punkt => punkt.id === id)).filter(Boolean) : st.punkte.slice(0, 4); };
  let last = auswahl.kurzprofil ? zeilen(auswahl.kurzprofil.text, 96) + 1.5 : 0;
  for (const st of p.stationen) last += st.art === 'auszeit' ? 1.8 : 3 + punkteVon(st).reduce((summe, punkt) => summe + zeilen(punkt.text) * 1.15, 0);
  last += p.ausbildung.reduce((summe, ab) => summe + 2 + zeilen([ab.einrichtung, ab.zusatz].filter(Boolean).join(' · ')), 0);
  last += 3 * 2.2 + Math.ceil(auswahl.kenntnisse.length / 3) * 1.6 + Math.ceil(p.sprachen.length / 3) * 1.6;
  return Math.round(last * 10) / 10;
}

export function lebenslaufSeite({ profil: p, auswahl, stelle }) {
  const last = lebenslaufLast(p, auswahl), dichte = last > 47 ? ' blatt--eng' : last > 42 ? ' blatt--dicht' : '';
  const stationen = [...p.stationen].sort((a, b) => (b.bis ?? '9999-99').localeCompare(a.bis ?? '9999-99') || b.von.localeCompare(a.von));
  const ausbildung = [...p.ausbildung].sort((a, b) => b.von.localeCompare(a.von));
  const punkteVon = st => { const gewaehlt = auswahl.punkte[st.id]; return gewaehlt ? gewaehlt.map(id => st.punkte.find(punkt => punkt.id === id)).filter(Boolean) : st.punkte.slice(0, 4); };
  const station = st => st.art === 'auszeit'
    ? `<div class="eintrag eintrag--ruhe"><p class="eintrag__zeit">${esc(zeitraum(st))}</p><div><h3>${esc(st.rolle)}</h3></div></div>`
    : `<div class="eintrag"><p class="eintrag__zeit">${esc(zeitraum(st))}</p><div><h3>${esc(st.rolle)}</h3><p class="eintrag__wo">${esc([st.arbeitgeber, st.ort, st.zusatz].filter(Boolean).join(' · '))}</p>${punkteVon(st).length ? `<ul>${punkteVon(st).map(punkt => `<li>${esc(punkt.text)}</li>`).join('')}</ul>` : ''}</div></div>`;
  const kenntnisse = auswahl.kenntnisse.map(id => p.kenntnisse.find(k => k.id === id)).filter(Boolean);
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Lebenslauf ${esc(p.person.name)}</title><style>${schriften('../../')}${blattCss}${lebenslaufCss}</style></head>
<body>${leiste('Dein Lebenslauf')}
<main class="blatt${dichte}" data-last="${last}">
${kopf(p, null)}
${auswahl.kurzprofil ? `<p class="kurz">${esc(auswahl.kurzprofil.text)}</p>` : ''}
${stationen.length ? `<section class="teil"><h2>Berufserfahrung</h2>${stationen.map(station).join('')}</section>` : ''}
${ausbildung.length ? `<section class="teil"><h2>Ausbildung</h2>${ausbildung.map(ab => `<div class="eintrag"><p class="eintrag__zeit">${esc(zeitraum(ab))}</p><div><h3>${esc(ab.abschluss)}</h3><p class="eintrag__wo">${esc([ab.einrichtung, ab.zusatz].filter(Boolean).join(' · '))}</p></div></div>`).join('')}</section>` : ''}
${kenntnisse.length || p.sprachen.length ? `<section class="teil"><h2>Kenntnisse</h2><dl class="paare">${kenntnisse.length ? `<dt>Arbeitsmittel</dt><dd><ul class="reihe">${kenntnisse.map(k => `<li>${esc(k.text)}</li>`).join('')}</ul></dd>` : ''}${p.sprachen.length ? `<dt>Sprachen</dt><dd><ul class="reihe">${p.sprachen.map(sp => `<li>${esc(sp.sprache)}${sp.niveau ? ` (${esc(sp.niveau)})` : ''}</li>`).join('')}</ul></dd>` : ''}</dl></section>` : ''}
</main><!-- gesetzt für ${esc(stelle.id)} --></body></html>
`;
}

// ---------- Anschreiben ----------

const anschreibenCss = `
.brief{font-size:11pt;line-height:1.5}
.absender{margin-top:13mm;color:var(--leise);font-size:7.5pt}
.empfaenger{min-height:27mm;margin-top:2mm;line-height:1.4}
.datum{text-align:right;margin-top:4mm;color:var(--leise)}
.betreff{margin-top:9mm;font:700 12pt/1.3 "Bricolage Grotesque","Figtree",sans-serif}
.anrede{margin-top:7mm}
.absatz{margin-top:3.6mm;max-width:165mm}
.gruss{margin-top:7mm}
.name{margin-top:12mm;font-weight:600}
.anlagen{margin-top:11mm;color:var(--leise);font-size:9.5pt}
`;

export function anschreibenSeite({ profil: p, anschreiben: a, stelle: s, heute }) {
  const ort = (p.person.anschrift || '').match(/\b\d{5}\s+([^,]+)/)?.[1]?.trim() || null;
  const empfaenger = [s.arbeitgeber, s.ansprechperson?.name, s.ort].filter(Boolean);
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Anschreiben ${esc(p.person.name)} · ${esc(s.arbeitgeber)}</title><style>${schriften('../../')}${blattCss}${anschreibenCss}</style></head>
<body>${leiste('Dein Anschreiben')}
<main class="blatt brief">
${kopf(p, null)}
<p class="absender">${esc([p.person.name, p.person.anschrift].filter(Boolean).join(' · '))}</p>
<p class="empfaenger">${empfaenger.map(esc).join('<br>')}</p>
<p class="datum">${esc([ort, tagLang(heute)].filter(Boolean).join(', '))}</p>
<h2 class="betreff">${esc(a.betreff)}</h2>
<p class="anrede">${esc(a.anrede)}</p>
${a.absaetze.map(absatz => `<p class="absatz">${esc(absatz.text)}</p>`).join('\n')}
<p class="gruss">${esc(a.gruss)}</p>
<p class="name">${esc(p.person.name)}</p>
<p class="anlagen">Anlagen: Lebenslauf, Zeugnisse</p>
</main></body></html>
`;
}

// ---------- Übersicht ----------

const URTEIL = { passt: ['Passt', 'Alles, was verlangt wird, findet sich in deinem Werdegang.'], klaeren: ['Erst klären', 'Bei mindestens einer Anforderung fehlt noch deine Antwort.'], luecke: ['Mit Lücke', 'Eine verlangte Anforderung ist in deinem Werdegang nicht belegt.'], passt_nicht: ['Passt nicht', 'Verstößt gegen eine deiner Vorgaben, oder mehrere verlangte Anforderungen fehlen.'] };
const STATUS = { neu: 'neu', interessant: 'vorgemerkt', entwurf: 'Bewerbung liegt als Entwurf vor', abgeschickt: 'abgeschickt', einladung: 'Einladung zum Gespräch', absage: 'Absage', zusage: 'Zusage', verworfen: 'von dir verworfen' };
const ZEICHEN = { erfuellt: ['ja', 'belegt'], teilweise: ['halb', 'zum Teil belegt'], fehlt: ['nein', 'nicht belegt'], offen: ['offen', 'noch zu klären'] };

const uebersichtCss = `
:root{--grund:#f3f1ec;--karte:#fff;--tinte:#1b2530;--leise:#566472;--linie:#d8d5cc;--akzent:#1f5a52;--akzent-hell:#e3efec;--passt:#17693f;--passt-hell:#e1f1e7;--klaeren:#8a5300;--klaeren-hell:#fbefd9;--luecke:#6a4a9c;--luecke-hell:#eee8f7;--nicht:#93382d;--nicht-hell:#f7e5e2;--haar:.0625rem;--rund:.875rem}
*{box-sizing:border-box}
html{font-size:clamp(100%,.9rem + .25vw,112.5%)}
body{margin:0;background:var(--grund);color:var(--tinte);font:400 1rem/1.55 "Figtree",system-ui,sans-serif}
main{max-width:70rem;margin:0 auto;padding:clamp(1.25rem,4vw,3.5rem) clamp(1rem,4vw,2.5rem) 4rem}
h1,h2,h3{font-family:"Bricolage Grotesque","Figtree",system-ui,sans-serif;line-height:1.08;letter-spacing:-.02em;margin:0;text-wrap:balance}
h1{font-size:clamp(2.25rem,1.4rem + 4vw,4.25rem);font-weight:700}
h2{font-size:clamp(1.5rem,1.2rem + 1.4vw,2.125rem);font-weight:650;margin-bottom:1.25rem}
h3{font-size:1.3125rem;font-weight:650}
p{margin:0}
a{color:var(--akzent);text-underline-offset:.2em}
a:focus-visible,summary:focus-visible{outline:.1875rem solid var(--akzent);outline-offset:.1875rem;border-radius:.25rem}
.kopf{display:grid;gap:1.5rem;padding-bottom:2rem;border-bottom:.125rem solid var(--tinte)}
.kopf p{max-width:44rem;color:var(--leise);font-size:1.125rem}
.profil{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
.profil li{padding:.3125rem .75rem;border:var(--haar) solid var(--tinte);border-radius:99rem;background:var(--karte);font-size:.9375rem}
.profil .nein{border-style:dashed;color:var(--leise)}
.stand{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.75rem;margin:2rem 0 0}
.stand div{padding:1rem 1.125rem;border-radius:var(--rund);background:var(--karte);border:var(--haar) solid var(--linie)}
.stand strong{display:block;font:700 2.25rem/1 "Bricolage Grotesque",sans-serif;font-variant-numeric:tabular-nums}
.stand .passt strong{color:var(--passt)}.stand .luecke strong{color:var(--luecke)}.stand .weg strong{color:var(--akzent)}
.merk{margin-top:1.25rem;padding:.875rem 1.125rem;border-radius:var(--rund);background:var(--klaeren-hell);color:var(--klaeren);max-width:52rem}
section{margin-top:3.5rem}
.einleitung{max-width:44rem;margin:-.5rem 0 1.5rem;color:var(--leise)}
.liste{display:grid;gap:1.25rem}
.stelle{display:grid;gap:1.25rem;padding:clamp(1.125rem,3vw,1.75rem);border-radius:var(--rund);background:var(--karte);border:var(--haar) solid var(--linie);border-top:.375rem solid var(--farbe);scroll-margin-top:1rem}
.stelle.passt{--farbe:var(--passt);--hell:var(--passt-hell)}.stelle.klaeren{--farbe:var(--klaeren);--hell:var(--klaeren-hell)}.stelle.luecke{--farbe:var(--luecke);--hell:var(--luecke-hell)}.stelle.passt_nicht{--farbe:var(--nicht);--hell:var(--nicht-hell)}
.stelle.ruht{opacity:.72}
.stelle__kopf{display:flex;flex-wrap:wrap;align-items:start;justify-content:space-between;gap:.75rem 1.5rem}
.stelle__wo{color:var(--leise);margin-top:.25rem}
.stempel{flex-shrink:0;padding:.3125rem .75rem;border:.125rem solid var(--farbe);border-radius:.375rem;background:var(--hell);color:var(--farbe);font:700 .9375rem/1.2 "Bricolage Grotesque",sans-serif;transform:rotate(-2deg)}
/* Deckung: ein Feld je verlangter Anforderung. Gefüllt ist belegt, halb ist zum Teil belegt, leer fehlt, gepunktet ist offen. */
.deckung{display:grid;gap:.5rem}
.deckung__felder{display:flex;gap:.25rem;margin:0;padding:0;list-style:none}
.deckung__felder li{flex:1;max-width:4.5rem;height:.75rem;border-radius:.1875rem;border:var(--haar) solid var(--farbe)}
.deckung__felder .erfuellt{background:var(--farbe)}
.deckung__felder .teilweise{background:linear-gradient(90deg,var(--farbe) 50%,transparent 50%)}
.deckung__felder .offen{border-style:dotted;border-width:.125rem}
.deckung p{color:var(--leise);font-size:.9375rem}
.teil{display:grid;gap:.5rem}
.teil > strong{font-size:.9375rem}
.punkte{display:grid;gap:.625rem;margin:0;padding:0;list-style:none}
.punkte li{display:grid;grid-template-columns:4.25rem 1fr;gap:.75rem;align-items:baseline}
.marke{justify-self:start;padding:.0625rem .5rem;border-radius:.25rem;font-size:.8125rem;font-weight:700;border:var(--haar) solid currentColor}
.marke.erfuellt{color:var(--passt);background:var(--passt-hell)}.marke.teilweise{color:var(--klaeren);background:var(--klaeren-hell)}.marke.fehlt{color:var(--nicht);background:var(--nicht-hell)}.marke.offen{color:var(--leise);border-style:dashed}
.punkte q{quotes:"„" "“"}
.punkte small{display:block;color:var(--leise);font-size:.9375rem}
.gruende{display:grid;gap:.375rem;margin:0;padding:0;list-style:none}
.gruende li{display:grid;grid-template-columns:1.25rem 1fr;gap:.5rem;align-items:baseline}
.gruende li::before{font-weight:700;text-align:center}
.gruende .ko::before{content:"×";color:var(--nicht)}.gruende .offen::before{content:"?";color:var(--klaeren)}
details{border-top:var(--haar) solid var(--linie);padding-top:.875rem}
summary{cursor:pointer;font-weight:600;min-height:2.75rem;display:flex;align-items:center;gap:.5rem}
summary::marker,summary::-webkit-details-marker{display:none;content:""}
summary::before{content:"+";display:inline-grid;place-items:center;flex-shrink:0;width:1.5rem;height:1.5rem;border:var(--haar) solid var(--tinte);border-radius:50%;font-weight:700;line-height:1}
details[open] summary::before{content:"–"}
details .punkte{margin-top:.75rem}
.weiter{display:grid;gap:.625rem;padding:.875rem 1.125rem;border-radius:.625rem;background:var(--akzent-hell)}
.weiter strong{font-size:.9375rem}
.weiter ul{display:flex;flex-wrap:wrap;gap:.25rem 1.25rem;margin:0;padding:0;list-style:none}
.weiter a{display:inline-flex;align-items:center;min-height:2.75rem;font-weight:600}
.zettel{padding:.625rem .875rem;border-radius:.5rem;background:var(--grund)}
.fuss{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;align-items:center;justify-content:space-between;color:var(--leise);font-size:.9375rem}
.fuss a{display:inline-flex;align-items:center;min-height:2.75rem;font-weight:600}
.leer{padding:2rem;border:.125rem dashed var(--linie);border-radius:var(--rund);background:var(--karte);color:var(--leise)}
.hinweis{margin-top:4rem;padding-top:1.5rem;border-top:var(--haar) solid var(--tinte);display:grid;gap:.75rem;max-width:52rem;color:var(--leise);font-size:.9375rem}
@media (max-width:34rem){.stempel{transform:none}.punkte li{grid-template-columns:1fr;gap:.25rem}}
@media print{.stelle{break-inside:avoid}details{display:block}}
`;

export function uebersichtSeite({ profil: p, liste, heute, VERLANGT }) {
  const ruht = e => ['absage', 'verworfen'].includes(e.stelle.status);
  const etikett = id => { const fund = p.eintraege.get(id); if (!fund) return id; const e = fund.eintrag; return fund.art === 'station' ? [e.rolle, e.arbeitgeber].filter(Boolean).join(', ') : fund.art === 'punkt' ? e.text : fund.art === 'ausbildung' ? e.abschluss : fund.art === 'sprache' ? `${e.sprache}${e.niveau ? ` (${e.niveau})` : ''}` : e.text; };
  const anforderung = a => `<li><span class="marke ${a.stand}">${ZEICHEN[a.stand][0]}</span><div><q>${esc(a.zitat)}</q><small>${a.stand === 'offen' ? esc(a.frage) : a.deckung.length ? `${ZEICHEN[a.stand][1]} durch: ${a.deckung.map(id => esc(etikett(id))).join('; ')}` : 'in deinen Unterlagen nicht belegt'}${a.anmerkung ? ` · ${esc(a.anmerkung)}` : ''}</small></div></li>`;
  const weiter = e => {
    const s = e.stelle, d = e.dateien || {}, links = [d.anschreiben && `<li><a href="${esc(d.anschreiben)}">Anschreiben öffnen</a></li>`, d.lebenslauf && `<li><a href="${esc(d.lebenslauf)}">Lebenslauf öffnen</a></li>`, d.mail && `<li><a href="${esc(d.mail)}">Entwurf der E-Mail öffnen</a></li>`].filter(Boolean).join('');
    const verlangt = s.verlangt.length ? ` Die Anzeige verlangt: ${s.verlangt.map(v => VERLANGT[v.was]).join(' und ')}.` : '';
    let text;
    if (s.status === 'zusage') text = 'Zusage erhalten. Glückwunsch.';
    else if (s.status === 'einladung') text = `Du bist eingeladen${s.termin ? ` (${s.termin})` : ''}. Sag deinem Agenten: „Bereite mich auf das Gespräch bei ${s.arbeitgeber} vor.“`;
    else if (s.status === 'abgeschickt') text = `Abgeschickt am ${tagKurz(s.abgeschickt_am)}. Kommt bis zum ${tagKurz(e.nachfassen)} keine Antwort, lohnt eine kurze Nachfrage.`;
    else if (s.status === 'absage') text = 'Abgesagt. Die Stelle bleibt hier, damit sie nicht noch einmal auftaucht.';
    else if (s.status === 'verworfen') text = 'Von dir verworfen.';
    else if (links) text = `Die Bewerbung liegt als Entwurf vor. Lies sie, sichere beide Blätter als PDF und schick sie selbst ab${s.bewerbungsweg ? ` (${{ email: `per E-Mail an ${s.bewerbungsweg.adresse || 'die Adresse aus der Anzeige'}`, portal: 'über das Portal des Arbeitgebers', post: 'per Post', telefon: 'nach telefonischer Absprache' }[s.bewerbungsweg.art]})` : ''}. Danach sag deinem Agenten: „Abgeschickt.“`;
    else if (e.urteil === 'passt_nicht') text = 'Kein nächster Schritt vorgeschlagen. Willst du dich trotzdem bewerben, sag es deinem Agenten.';
    else if (e.urteil === 'klaeren') text = 'Beantworte deinem Agenten zuerst die offenen Fragen. Danach lässt sich sagen, ob die Stelle passt.';
    else text = `Sag deinem Agenten: „Schreib die Bewerbung für ${s.arbeitgeber}.“${verlangt}`;
    return `<div class="weiter"><strong>So geht es weiter</strong><p>${esc(text)}</p>${links ? `<ul>${links}</ul>` : ''}</div>`;
  };
  const karte = e => {
    const s = e.stelle, muss = s.anforderungen.filter(a => a.art === 'muss'), kann = s.anforderungen.filter(a => a.art === 'kann');
    const wo = [s.arbeitgeber, s.ort, s.arbeitszeit ? s.arbeitszeit.zitat : null].filter(Boolean).join(' · ');
    const frist = s.frist ? `Frist: ${tagKurz(s.frist.datum)}${e.frist_tage >= 0 ? ` (noch ${e.frist_tage} ${e.frist_tage === 1 ? 'Tag' : 'Tage'})` : ' (abgelaufen)'}` : 'keine Frist genannt';
    const links = s.quellen.filter(q => q.link).map((q, i, alle) => `<a href="${esc(q.link)}" rel="noopener noreferrer">Anzeige${q.portal ? ` bei ${esc(q.portal)}` : alle.length > 1 ? ` ${i + 1}` : ''} öffnen</a>`).join('');
    return `<article class="stelle ${e.urteil}${ruht(e) ? ' ruht' : ''}" id="${esc(s.id)}">
<div class="stelle__kopf"><div><h3>${esc(s.titel)}</h3><p class="stelle__wo">${esc(wo)}</p></div><p class="stempel">${URTEIL[e.urteil][0]}</p></div>
${muss.length ? `<div class="deckung"><ul class="deckung__felder" aria-hidden="true">${muss.map(a => `<li class="${a.stand}"></li>`).join('')}</ul><p>${String(e.muss.gedeckt).replace('.', ',')} von ${e.muss.gesamt} verlangten Anforderungen sind in deinem Werdegang belegt. ${esc(URTEIL[e.urteil][1])}</p></div>` : ''}
${e.gegen.length ? `<div class="teil"><strong>Das spricht nach deinen Vorgaben dagegen</strong><ul class="gruende">${e.gegen.map(t => `<li class="ko">${esc(t)}</li>`).join('')}</ul></div>` : ''}
${e.offen.length ? `<div class="teil"><strong>Noch offen</strong><ul class="gruende">${e.offen.map(t => `<li class="offen">${esc(t)}</li>`).join('')}</ul></div>` : ''}
${muss.length ? `<div class="teil"><strong>Verlangt wird</strong><ul class="punkte">${muss.map(anforderung).join('')}</ul></div>` : ''}
${kann.length ? `<details><summary>Wünschenswert, aber kein Muss (${kann.length})</summary><ul class="punkte">${kann.map(anforderung).join('')}</ul></details>` : ''}
${s.notiz ? `<p class="zettel"><strong>Deine Notiz:</strong> ${esc(s.notiz)}</p>` : ''}
${weiter(e)}
<div class="fuss"><span>${esc(s.id)} · ${esc(STATUS[['neu', 'interessant'].includes(s.status) && e.dateien?.anschreiben ? 'entwurf' : s.status])} · ${esc(frist)}</span>${links}</div>
</article>`;
  };
  const offen = liste.filter(e => !ruht(e)), menge = art => offen.filter(e => e.urteil === art).length;
  const zuerst = offen.filter(e => ['passt', 'klaeren'].includes(e.urteil)), rest = offen.filter(e => !zuerst.includes(e)), fertig = liste.filter(ruht);
  const gruppe = (titel, text, eintraege) => eintraege.length ? `<section><h2>${titel}</h2><p class="einleitung">${text}</p><div class="liste">${eintraege.map(karte).join('')}</div></section>` : '';
  const s = p.suche, chips = [s.taetigkeit, s.orte.length ? s.orte.join(', ') : null, s.arbeitszeit ? { vollzeit: 'Vollzeit', teilzeit: 'Teilzeit', beides: 'Vollzeit oder Teilzeit' }[s.arbeitszeit] + (s.stunden ? `, ${s.stunden} Stunden` : '') : null, s.ab_wann ? `ab ${s.ab_wann}` : null].filter(Boolean);
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Bewerbungen: ${liste.length} Stellen · Stand ${esc(tagLang(heute))}</title><style>${schriften('')}${uebersichtCss}</style></head>
<body><main>
<header class="kopf"><h1>Deine Bewerbungen</h1><p>Stand ${esc(tagLang(heute))}. Jede Anforderung steht wörtlich so in einer Anzeige, die du bekommen hast. Als belegt gilt nur, was in deinen Unterlagen steht oder was du selbst gesagt hast.</p>${chips.length || s.ausschluss.length ? `<ul class="profil" aria-label="Was du suchst">${chips.map(t => `<li>${esc(t)}</li>`).join('')}${s.ausschluss.map(t => `<li class="nein">Nicht: ${esc(t)}</li>`).join('')}</ul>` : ''}</header>
<div class="stand" aria-label="Überblick"><div><strong>${liste.length}</strong>Stellen erfasst</div><div class="passt"><strong>${menge('passt')}</strong>passen</div><div class="luecke"><strong>${menge('luecke') + menge('klaeren')}</strong>mit Lücke oder offen</div><div class="weg"><strong>${liste.filter(e => ['abgeschickt', 'einladung', 'zusage'].includes(e.stelle.status)).length}</strong>abgeschickt</div></div>
${p.luecken.length ? `<p class="merk">In deinem Werdegang fehlt eine Angabe für ${esc(p.luecken.join(' und '))}. Sag deinem Agenten, was in dieser Zeit war. Eine erklärte Lücke ist besser als eine offene.</p>` : ''}
${liste.length ? '' : '<p class="leer">Noch keine Stelle erfasst. Leg Benachrichtigungen oder Anzeigen in den Ordner „eingang“ oder füge ihren Text im Gespräch ein und sag: „Neue Stellen“.</p>'}
${gruppe('Zuerst ansehen', 'Stellen, bei denen alles Verlangte in deinem Werdegang belegt ist oder nur noch deine Antwort fehlt. Die Reihenfolge sagt nichts über den Arbeitgeber und nichts über deine Aussichten.', zuerst)}
${gruppe('Die übrigen Stellen', 'Hier fehlt etwas Verlangtes, oder die Stelle verstößt gegen eine deiner Vorgaben.', rest)}
${gruppe('Abgeschlossen', 'Absagen und Stellen, die du verworfen hast.', fertig)}
<footer class="hinweis"><p>Diese Übersicht vergleicht Anzeigen mit deinen Unterlagen. Sie sagt nicht voraus, ob eine Bewerbung Erfolg hat, und ersetzt keine Berufs- oder Rechtsberatung. Abgeschickt wird nichts von selbst: Jede Bewerbung liest du und schickst sie selbst ab.</p><p>Die Übersicht wird vom Baukasten gebaut; ändere sie nicht von Hand, sondern sag deinem Agenten, was sich geändert hat.</p></footer>
</main></body></html>
`;
}
