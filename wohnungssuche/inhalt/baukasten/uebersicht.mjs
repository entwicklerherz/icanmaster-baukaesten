// Baut die Übersicht (uebersicht.html) aus Suchprofil, Angeboten und Auswertung.
// Eine einzige Datei ohne Skripte und ohne Abrufe aus dem Netz; die Schriften liegen im Baukasten.
// Bildidee: ein Blatt wie aus der Planmappe. Maße stehen mit Maßlinie, das Urteil als Stempel am Rand.

const esc = text => String(text ?? '').replace(/[&<>"']/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[z]));
const zahl = (wert, stellen = 0) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: stellen }).format(wert);
const euro = wert => `${zahl(wert)} €`;
const URTEIL = { passt: ['Passt', 'Erfüllt alles, was du verlangt hast.'], pruefen: ['Erst klären', 'Nichts spricht dagegen, aber etwas Wichtiges steht nicht in der Anzeige.'], passt_nicht: ['Passt nicht', 'Verstößt gegen mindestens eine deiner Vorgaben.'] };
const STATUS = { neu: 'neu', interessant: 'interessant', besichtigung: 'Besichtigung geplant', abgelehnt: 'von dir abgelehnt' };

const css = `
@font-face{font-family:"Bricolage Grotesque";src:url("baukasten/grundlage/schriften/bricolage-grotesque.woff2") format("woff2");font-weight:200 800;font-display:swap}
@font-face{font-family:"Figtree";src:url("baukasten/grundlage/schriften/figtree.woff2") format("woff2");font-weight:300 900;font-display:swap}
:root{--blatt:#f2f4f1;--karte:#fff;--tinte:#17222b;--leise:#586670;--linie:#cfd6d2;--plan:#1d4ed0;--plan-hell:#e6ecfb;--passt:#17693f;--passt-hell:#e1f1e7;--klaeren:#8a5300;--klaeren-hell:#fbefd9;--nicht:#93382d;--nicht-hell:#f7e5e2;--mass:.0625rem;--rund:.875rem}
*{box-sizing:border-box}
html{font-size:clamp(100%,.9rem + .25vw,112.5%)}
body{margin:0;background:var(--blatt);color:var(--tinte);font:400 1rem/1.55 "Figtree",system-ui,sans-serif;background-image:linear-gradient(var(--linie) var(--mass),transparent var(--mass)),linear-gradient(90deg,var(--linie) var(--mass),transparent var(--mass));background-size:2.5rem 2.5rem;background-position:-1px -1px;background-attachment:fixed}
body::before{content:"";position:fixed;inset:0;background:var(--blatt);opacity:.86;pointer-events:none;z-index:-1}
main{max-width:70rem;margin:0 auto;padding:clamp(1.25rem,4vw,3.5rem) clamp(1rem,4vw,2.5rem) 4rem}
h1,h2,h3{font-family:"Bricolage Grotesque","Figtree",system-ui,sans-serif;line-height:1.08;letter-spacing:-.02em;margin:0;text-wrap:balance}
h1{font-size:clamp(2.25rem,1.4rem + 4vw,4.25rem);font-weight:700}
h2{font-size:clamp(1.5rem,1.2rem + 1.4vw,2.125rem);font-weight:650;margin-bottom:1.25rem}
h3{font-size:1.3125rem;font-weight:650}
p{margin:0}
a{color:var(--plan);text-underline-offset:.2em}
a:focus-visible,summary:focus-visible{outline:.1875rem solid var(--plan);outline-offset:.1875rem;border-radius:.25rem}
.kopf{display:grid;gap:1.5rem;padding-bottom:2rem;border-bottom:.125rem solid var(--tinte)}
.kopf p{max-width:44rem;color:var(--leise);font-size:1.125rem}
.profil{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
.profil li{padding:.3125rem .75rem;border:var(--mass) solid var(--tinte);border-radius:99rem;background:var(--karte);font-size:.9375rem}
.profil .nein{border-style:dashed;color:var(--leise)}
.stand{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.75rem;margin:2rem 0 3.5rem}
.stand div{padding:1rem 1.125rem;border-radius:var(--rund);background:var(--karte);border:var(--mass) solid var(--linie)}
.stand strong{display:block;font:700 2.25rem/1 "Bricolage Grotesque",sans-serif;font-variant-numeric:tabular-nums}
.stand .passt strong{color:var(--passt)}.stand .pruefen strong{color:var(--klaeren)}.stand .passt_nicht strong{color:var(--nicht)}
section{margin-top:3.5rem}
.einleitung{max-width:44rem;margin:-.5rem 0 1.5rem;color:var(--leise)}
.liste{display:grid;gap:1.25rem}
.angebot{position:relative;display:grid;gap:1.125rem;padding:clamp(1.125rem,3vw,1.75rem);border-radius:var(--rund);background:var(--karte);border:var(--mass) solid var(--linie);border-left:.375rem solid var(--farbe);scroll-margin-top:1rem}
.angebot.passt{--farbe:var(--passt);--hell:var(--passt-hell)}.angebot.pruefen{--farbe:var(--klaeren);--hell:var(--klaeren-hell)}.angebot.passt_nicht{--farbe:var(--nicht);--hell:var(--nicht-hell)}
.angebot.abgelehnt{opacity:.72}
.angebot__kopf{display:flex;flex-wrap:wrap;align-items:start;justify-content:space-between;gap:.75rem 1.5rem}
.angebot__ort{color:var(--leise);margin-top:.25rem}
.stempel{flex-shrink:0;padding:.3125rem .75rem;border:.125rem solid var(--farbe);border-radius:.375rem;background:var(--hell);color:var(--farbe);font:700 .9375rem/1.2 "Bricolage Grotesque",sans-serif;letter-spacing:.01em;transform:rotate(-2deg)}
.masse{display:grid;grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr));gap:1rem 1.5rem;margin:0}
.masse div{display:grid;gap:.3125rem}
.masse dt{color:var(--leise);font-size:.875rem}
.masse dd{margin:0;font:650 1.375rem/1.1 "Bricolage Grotesque",sans-serif;font-variant-numeric:tabular-nums}
.masse dd.fehlt{font:400 1rem/1.4 "Figtree",sans-serif;color:var(--leise)}
/* Maßlinie wie im Grundriss: Strich mit zwei Anschlägen unter jeder Zahl. */
.masse dd:not(.fehlt)::after{content:"";display:block;height:.5rem;margin-top:.3125rem;border:solid var(--plan);border-width:0 var(--mass) var(--mass);opacity:.55}
.gruende{display:grid;gap:.375rem;margin:0;padding:0;list-style:none}
.gruende li{display:grid;grid-template-columns:1.25rem 1fr;gap:.5rem;align-items:baseline}
.gruende li::before{font-weight:700;text-align:center}
.gruende .plus::before{content:"+";color:var(--passt)}.gruende .ko::before{content:"×";color:var(--nicht)}.gruende .offen::before{content:"?";color:var(--klaeren)}
.teil{display:grid;gap:.5rem}
.teil > strong{font-size:.9375rem}
details{border-top:var(--mass) solid var(--linie);padding-top:.875rem}
summary{cursor:pointer;font-weight:600;min-height:2.75rem;display:flex;align-items:center;gap:.5rem}
summary::marker,summary::-webkit-details-marker{display:none;content:""}
summary::before{content:"+";display:inline-grid;place-items:center;width:1.5rem;height:1.5rem;border:var(--mass) solid var(--tinte);border-radius:50%;font-weight:700;line-height:1}
details[open] summary::before{content:"–"}
.rechnung{width:100%;border-collapse:collapse;margin-top:.5rem;font-variant-numeric:tabular-nums}
.rechnung th,.rechnung td{padding:.4375rem 0;border-bottom:var(--mass) solid var(--linie);text-align:left;font-weight:400}
.rechnung td{text-align:right;white-space:nowrap}
.rechnung tr:last-child th,.rechnung tr:last-child td{border-bottom:0;font-weight:700}
.fuss{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;align-items:center;justify-content:space-between;color:var(--leise);font-size:.9375rem}
.fuss a{display:inline-flex;align-items:center;min-height:2.75rem;font-weight:600}
.zettel{padding:.625rem .875rem;border-radius:.5rem;background:var(--plan-hell)}
.leer{padding:2rem;border:.125rem dashed var(--linie);border-radius:var(--rund);background:var(--karte);color:var(--leise)}
.hinweis{margin-top:4rem;padding-top:1.5rem;border-top:var(--mass) solid var(--tinte);display:grid;gap:.75rem;max-width:52rem;color:var(--leise);font-size:.9375rem}
@media (max-width:34rem){.stempel{transform:none}.rechnung th{padding-right:.75rem}}
@media print{body{background:#fff}body::before{display:none}.angebot{break-inside:avoid}details{display:block}}
`;

function profilZeile(p, MERKMALE) {
  const teile = [p.orte.join(', ') + (p.stadtteile.length ? `: ${p.stadtteile.join(', ')}` : ''), `bis ${euro(p.kaufpreis_max)}`];
  if (p.wohnflaeche_min) teile.push(`ab ${zahl(p.wohnflaeche_min, 1)} m²`);
  if (p.zimmer_min) teile.push(`ab ${zahl(p.zimmer_min, 1)} Zimmer`);
  teile.push(p.nutzung === 'selbst' ? 'zum Selbstbewohnen' : 'zum Vermieten');
  return `<ul class="profil" aria-label="Dein Suchprofil">${teile.map(t => `<li>${esc(t)}</li>`).join('')}${p.muss.map(k => `<li>Muss: ${esc(MERKMALE[k])}</li>`).join('')}${p.ausschluss.map(k => `<li class="nein">Nicht: ${esc(k === 'vermietet' ? 'vermietet' : k[0].toUpperCase() + k.slice(1))}</li>`).join('')}${p.wuensche.map(w => `<li class="nein">Wunsch: ${esc(w)}</li>`).join('')}</ul>`;
}

function karte(e, steuer) {
  const a = e.angebot, r = e.rechnung, mass = (etikett, wert) => `<div><dt>${etikett}</dt>${wert === null ? '<dd class="fehlt">nicht genannt</dd>' : `<dd>${wert}</dd>`}</div>`;
  const ort = [a.plz, a.ort, a.stadtteil].filter(Boolean).join(' ');
  const gruende = [...e.gruende.filter(g => g.art === 'ko'), ...e.gruende.filter(g => g.art === 'plus')];
  const links = a.quellen.filter(q => q.link).map((q, i, alle) => `<a href="${esc(q.link)}" rel="noopener noreferrer">Anzeige${q.portal ? ` bei ${esc(q.portal)}` : alle.length > 1 ? ` ${i + 1}` : ''} öffnen</a>`).join('');
  return `<article class="angebot ${e.urteil}${a.status === 'abgelehnt' ? ' abgelehnt' : ''}" id="${esc(a.id)}">
<div class="angebot__kopf"><div><h3>${esc(a.titel)}</h3><p class="angebot__ort">${esc(ort || 'Ort nicht genannt')}${a.status !== 'neu' ? ` · ${esc(STATUS[a.status])}` : ''}</p></div><p class="stempel">${URTEIL[e.urteil][0]}</p></div>
<dl class="masse">${mass('Kaufpreis', a.kaufpreis === null ? null : euro(a.kaufpreis))}${mass('Wohnfläche', a.wohnflaeche === null ? null : `${zahl(a.wohnflaeche, 2)} m²`)}${mass('Zimmer', a.zimmer === null ? null : zahl(a.zimmer, 1))}${mass('Preis je m²', r?.preis_je_qm ? euro(r.preis_je_qm) : null)}${mass('Hausgeld im Monat', a.hausgeld === null ? null : euro(a.hausgeld))}${mass('Baujahr', a.baujahr === null ? null : String(a.baujahr))}</dl>
${gruende.length ? `<div class="teil"><strong>Warum dieses Urteil</strong><ul class="gruende">${gruende.map(g => `<li class="${g.art}">${esc(g.text)}</li>`).join('')}</ul></div>` : ''}
${e.offen.length ? `<div class="teil"><strong>Noch offen: das fragst du nach</strong><ul class="gruende">${e.offen.map(t => `<li class="offen">${esc(t)}</li>`).join('')}</ul></div>` : ''}
${a.notiz ? `<p class="zettel"><strong>Deine Notiz:</strong> ${esc(a.notiz)}</p>` : ''}
${r ? `<details><summary>Was die Wohnung insgesamt kostet (Schätzung)</summary><table class="rechnung"><tbody><tr><th scope="row">Kaufpreis</th><td>${euro(a.kaufpreis)}</td></tr><tr><th scope="row">Grunderwerbsteuer (${zahl(r.grunderwerbsteuer_prozent, 1)} % in ${esc(steuer.laender[e.land])})</th><td>${euro(r.grunderwerbsteuer)}</td></tr><tr><th scope="row">Notar und Grundbuch (rund ${zahl(steuer.notar_grundbuch_prozent, 1)} %)</th><td>${euro(r.notar_grundbuch)}</td></tr><tr><th scope="row">Makler${r.makler_bekannt ? ` (${zahl(a.provision_prozent, 2)} % laut Anzeige)` : ''}</th><td>${r.makler_bekannt ? euro(r.makler) : 'nicht genannt'}</td></tr><tr><th scope="row">Zusammen${r.makler_bekannt ? '' : ', ohne Makler'}</th><td>${euro(r.gesamt)}</td></tr></tbody></table></details>` : ''}
<div class="fuss"><span>${esc(a.id)} · aus ${a.quellen.map(q => esc(q.datei.replace(/^eingang\//, ''))).join(', ')}</span>${links}</div>
</article>`;
}

export function seite({ profil: p, liste, stand, steuer, MERKMALE }) {
  for (const e of liste) e.land = p.bundesland;
  const offen = liste.filter(e => e.angebot.status !== 'abgelehnt'), menge = art => offen.filter(e => e.urteil === art).length;
  const abgelehnt = liste.filter(e => e.angebot.status === 'abgelehnt');
  const zuerst = offen.filter(e => e.urteil !== 'passt_nicht').slice(0, 3), rest = offen.filter(e => !zuerst.includes(e));
  const gruppe = (titel, text, eintraege) => eintraege.length ? `<section><h2>${titel}</h2><p class="einleitung">${text}</p><div class="liste">${eintraege.map(e => karte(e, steuer)).join('')}</div></section>` : '';
  const tag = new Date(stand + 'T12:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Wohnungssuche: ${liste.length} Angebote · Stand ${esc(tag)}</title><style>${css}</style></head>
<body><main>
<header class="kopf"><h1>Deine Wohnungssuche</h1><p>Stand ${esc(tag)}. Jede Zahl stammt wörtlich aus einer Anzeige, die du bekommen hast. Was dort nicht steht, ist als offen markiert und nicht geschätzt.</p>${profilZeile(p, MERKMALE)}</header>
<div class="stand" aria-label="Überblick"><div><strong>${liste.length}</strong>Angebote erfasst</div><div class="passt"><strong>${menge('passt')}</strong>passen</div><div class="pruefen"><strong>${menge('pruefen')}</strong>erst klären</div><div class="passt_nicht"><strong>${menge('passt_nicht')}</strong>passen nicht</div></div>
${liste.length ? '' : '<p class="leer">Noch kein Angebot erfasst. Leg Benachrichtigungen in den Ordner „eingang“ oder füge ihren Text im Gespräch ein und sag: „Neue Angebote“.</p>'}
${gruppe('Zuerst ansehen', 'Die besten Treffer nach deinem Suchprofil. Die Reihenfolge ergibt sich aus deinen Vorgaben, nicht aus einer Einschätzung des Marktes.', zuerst)}
${gruppe('Die übrigen Angebote', 'Alles Weitere, zuerst das Passende, dann das, was gegen eine deiner Vorgaben verstößt.', rest)}
${gruppe('Von dir abgelehnt', 'Diese Angebote hast du aussortiert. Sie bleiben hier, damit sie nicht noch einmal auftauchen.', abgelehnt)}
<footer class="hinweis"><p>${esc(steuer.hinweis)}</p><p>Diese Übersicht ersetzt keine Beratung zu Recht, Steuern oder Finanzierung und sagt nichts darüber, ob ein Preis angemessen ist. Sie wird vom Baukasten gebaut; ändere sie nicht von Hand, sondern sag deinem Agenten, was sich geändert hat.</p></footer>
</main></body></html>
`;
}
