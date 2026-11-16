// Baut die Übersicht der Verträge und setzt Kündigungsschreiben: einzelne HTML-Dateien ohne Skripte und ohne Abrufe aus dem Netz.
// Bildidee der Übersicht: jeder Vertrag als Laufzeitstreifen. Die Füllung zeigt, wie weit die Laufzeit ist; die Kerbe zeigt den letzten Tag für die Kündigung.
// Der Wortlaut des Kündigungsschreibens ist fest; eingesetzt werden nur geprüfte Angaben aus Vertrag und Dokumenten.

const esc = text => String(text ?? '').replace(/[&<>"']/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[z]));
const euro = wert => new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(wert) + ' €';
const de = wert => wert.split('-').reverse().join('.');
const lang = wert => new Date(wert + 'T12:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const DAUER = { tage: ['Tag', 'Tage'], wochen: ['Woche', 'Wochen'], monate: ['Monat', 'Monate'], jahre: ['Jahr', 'Jahre'] };
const dauer = d => d ? `${d.wert} ${DAUER[d.einheit][d.wert === 1 ? 0 : 1]}` : null;
const RHYTHMUS = { monatlich: 'im Monat', vierteljaehrlich: 'im Vierteljahr', halbjaehrlich: 'im Halbjahr', jaehrlich: 'im Jahr', einmalig: 'einmalig' };
const schriften = tiefe => `@font-face{font-family:"Bricolage Grotesque";src:url("${tiefe}baukasten/grundlage/schriften/bricolage-grotesque.woff2") format("woff2");font-weight:200 800;font-display:swap}
@font-face{font-family:"Figtree";src:url("${tiefe}baukasten/grundlage/schriften/figtree.woff2") format("woff2");font-weight:300 900;font-display:swap}`;

// ---------- Übersicht ----------

const css = `
:root{--grund:#eef1f4;--karte:#fff;--tinte:#16202c;--leise:#55616f;--linie:#d3dae2;--akzent:#2146a8;--akzent-hell:#e4eaf8;--eilt:#a3321f;--eilt-hell:#f9e6e1;--bald:#8a5300;--bald-hell:#fbefd9;--ruhe:#17693f;--ruhe-hell:#e1f1e7;--haar:.0625rem;--rund:.875rem}
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
.kopf{display:grid;gap:1.25rem;padding-bottom:2rem;border-bottom:.125rem solid var(--tinte)}
.kopf p{max-width:44rem;color:var(--leise);font-size:1.125rem}
.summe{display:flex;flex-wrap:wrap;align-items:baseline;gap:.25rem 1.5rem}
.summe strong{font:700 clamp(2rem,1.4rem + 3vw,3.25rem)/1 "Bricolage Grotesque",sans-serif;font-variant-numeric:tabular-nums}
.summe span{color:var(--leise)}
.stand{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.75rem;margin:2rem 0 0}
.stand div{padding:1rem 1.125rem;border-radius:var(--rund);background:var(--karte);border:var(--haar) solid var(--linie)}
.stand strong{display:block;font:700 2.25rem/1 "Bricolage Grotesque",sans-serif;font-variant-numeric:tabular-nums}
.stand .eilt strong{color:var(--eilt)}.stand .ruhe strong{color:var(--ruhe)}.stand .offen strong{color:var(--bald)}
section{margin-top:3.5rem}
.einleitung{max-width:44rem;margin:-.5rem 0 1.5rem;color:var(--leise)}
.liste{display:grid;gap:1.25rem}
.vertrag{display:grid;gap:1.25rem;padding:clamp(1.125rem,3vw,1.75rem);border-radius:var(--rund);background:var(--karte);border:var(--haar) solid var(--linie);scroll-margin-top:1rem;--farbe:var(--akzent);--hell:var(--akzent-hell)}
.vertrag.eilt{--farbe:var(--eilt);--hell:var(--eilt-hell)}.vertrag.bald{--farbe:var(--bald);--hell:var(--bald-hell)}.vertrag.ruhe{--farbe:var(--ruhe);--hell:var(--ruhe-hell)}
.vertrag.fertig{opacity:.75}
.vertrag__kopf{display:flex;flex-wrap:wrap;align-items:start;justify-content:space-between;gap:.75rem 1.5rem}
.vertrag__art{color:var(--leise);margin-top:.25rem}
.preis{text-align:right;flex-shrink:0}
.preis strong{display:block;font:700 1.5rem/1.1 "Bricolage Grotesque",sans-serif;font-variant-numeric:tabular-nums}
.preis span{color:var(--leise);font-size:.9375rem}
/* Laufzeitstreifen: Füllung bis heute, Kerbe am letzten Tag für die Kündigung. */
.streifen{display:grid;gap:.5rem}
.streifen__bahn{position:relative;height:1.125rem;border-radius:.25rem;background:var(--hell);border:var(--haar) solid var(--farbe);overflow:hidden}
.streifen__bahn i{position:absolute;inset:0 auto 0 0;background:var(--farbe);opacity:.38}
.streifen__bahn b{position:absolute;top:0;bottom:0;width:.25rem;margin-left:-.125rem;background:var(--farbe)}
.streifen__rand{display:flex;justify-content:space-between;gap:1rem;color:var(--leise);font-size:.875rem;font-variant-numeric:tabular-nums}
.termin{display:grid;gap:.25rem;padding:.875rem 1.125rem;border-radius:.625rem;background:var(--hell);border-left:.375rem solid var(--farbe)}
.termin strong{font:700 1.25rem/1.2 "Bricolage Grotesque",sans-serif;color:var(--farbe)}
.daten{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:.75rem 1.5rem;margin:0}
.daten div{display:grid;gap:.125rem}
.daten dt{color:var(--leise);font-size:.875rem}
.daten dd{margin:0;font-weight:600}
.daten dd.fehlt{font-weight:400;color:var(--leise)}
.merk{display:grid;gap:.375rem;padding:.875rem 1.125rem;border-radius:.625rem;border:var(--haar) dashed var(--leise);font-size:.9375rem}
.merk strong{font-size:.9375rem}
.merk a{font-weight:600}
details{border-top:var(--haar) solid var(--linie);padding-top:.875rem}
summary{cursor:pointer;font-weight:600;min-height:2.75rem;display:flex;align-items:center;gap:.5rem}
summary::marker,summary::-webkit-details-marker{display:none;content:""}
summary::before{content:"+";display:inline-grid;place-items:center;flex-shrink:0;width:1.5rem;height:1.5rem;border:var(--haar) solid var(--tinte);border-radius:50%;font-weight:700;line-height:1}
details[open] summary::before{content:"–"}
.zitate{display:grid;gap:.625rem;margin:.75rem 0 0;padding:0;list-style:none;font-size:.9375rem}
.zitate span{display:block;color:var(--leise)}
.zitate q{quotes:"„" "“"}
.weiter{display:grid;gap:.5rem;padding:.875rem 1.125rem;border-radius:.625rem;background:var(--akzent-hell)}
.weiter strong{font-size:.9375rem}
.weiter a{display:inline-flex;align-items:center;min-height:2.75rem;font-weight:600}
.zettel{padding:.625rem .875rem;border-radius:.5rem;background:var(--grund)}
.fuss{color:var(--leise);font-size:.9375rem}
.leer{padding:2rem;border:.125rem dashed var(--linie);border-radius:var(--rund);background:var(--karte);color:var(--leise)}
.hinweis{margin-top:4rem;padding-top:1.5rem;border-top:var(--haar) solid var(--tinte);display:grid;gap:.75rem;max-width:52rem;color:var(--leise);font-size:.9375rem}
@media (max-width:34rem){.preis{text-align:left}}
@media print{.vertrag{break-inside:avoid}details{display:block}}
`;

export function uebersichtSeite({ eintraege, heute, summe, hinweise, ARTEN }) {
  const stufe = e => e.lage === 'frist' ? (e.tage <= 30 ? 'eilt' : e.tage <= 90 ? 'bald' : '') : e.lage === 'jederzeit' ? 'ruhe' : ['gekuendigt', 'beendet'].includes(e.lage) ? 'fertig' : '';
  const angabe = (etikett, wert) => `<div><dt>${etikett}</dt>${wert ? `<dd>${esc(wert)}</dd>` : '<dd class="fehlt">steht nicht im Dokument</dd>'}</div>`;
  const karte = e => {
    const v = e.vertrag, name = [v.anbieter, v.bezeichnung].filter(Boolean);
    let termin = '';
    if (e.lage === 'frist') termin = `<div class="termin"><strong>Kündigen bis ${de(e.kuendigen_bis)}</strong><p>${e.tage === 0 ? 'Das ist heute.' : `Das sind noch ${e.tage} ${e.tage === 1 ? 'Tag' : 'Tage'}.`} Kommt die Kündigung bis dahin an, endet der Vertrag am ${de(e.ende)}. ${v.verlaengerung.art === 'unbefristet' ? `Sonst läuft er laut Vertragstext auf unbestimmte Zeit weiter und ist dann mit einer Frist von ${esc(dauer(v.kuendigungsfrist))} kündbar.` : `Sonst verlängert er sich laut Vertragstext um ${esc(dauer(v.verlaengerung))}.`}</p>${e.verpasst ? `<p>Die Frist für den früheren Termin ist am ${de(e.verpasst)} verstrichen.</p>` : ''}</div>`;
    else if (e.lage === 'jederzeit') termin = `<div class="termin"><strong>Jederzeit kündbar</strong><p>${e.fruehestes_ende ? `Mit einer Frist von ${esc(dauer(v.kuendigungsfrist))}. Kündigst du heute, endet der Vertrag frühestens am ${de(e.fruehestes_ende)}.` : 'Wann die Kündigung wirkt, steht im Dokument (siehe Wortlaut unten).'}</p></div>`;
    else if (e.lage === 'unbekannt') termin = `<div class="termin"><strong>Termin nicht berechenbar</strong><p>In deinen Dokumenten fehlt: ${esc(e.fehlt.join(', '))}. Such den Vertrag oder die Vertragsbestätigung heraus, oder frag beim Anbieter nach.</p></div>`;
    else if (e.lage === 'endet_von_selbst') termin = `<div class="termin"><strong>Endet von selbst am ${de(e.ende)}</strong><p>Laut Vertragstext verlängert er sich nicht.</p></div>`;
    else if (e.lage === 'gekuendigt') termin = `<div class="termin"><strong>Gekündigt am ${de(v.gekuendigt_am)}${v.gekuendigt_zum ? ` zum ${de(v.gekuendigt_zum)}` : ''}</strong><p>${v.bestaetigt ? 'Der Anbieter hat die Kündigung bestätigt.' : 'Die Bestätigung des Anbieters steht noch aus. Kommt sie nicht innerhalb von zwei Wochen, frag nach und heb den Nachweis für das Abschicken auf.'}</p></div>`;
    else termin = '<div class="termin"><strong>Beendet</strong></div>';
    const streifen = e.abschnitt ? `<div class="streifen" aria-hidden="true"><div class="streifen__bahn"><i style="width:${e.abschnitt.heute}%"></i><b style="left:${e.abschnitt.frist}%"></b></div><div class="streifen__rand"><span>${de(e.abschnitt.von)}</span><span>Kerbe: letzter Tag für die Kündigung</span><span>${de(e.ende)}</span></div></div>` : '';
    const merk = e.hinweise.map(key => hinweise.hinweise[key]).filter(Boolean).map(h => `<div class="merk"><strong>Gut zu wissen: ${esc(h.titel)}</strong><p>${esc(h.text)}</p><p><a href="${esc(h.quelle)}" rel="noopener noreferrer">Gesetzestext lesen</a> · Stand der Angabe: ${de(hinweise.stand)}</p></div>`).join('');
    const zitate = [['Nummer', v.nummer], ['Vertragsabschluss', v.abschluss], ['Vertragsbeginn', v.beginn], ['Erste Laufzeit', v.erstlaufzeit], ['Verlängerung', v.verlaengerung], ['Kündigungsfrist', v.kuendigungsfrist], ['Form der Kündigung', v.kuendigung_form], ['Empfänger der Kündigung', v.kuendigung_an], ...v.kosten.map(k => [`${k.was || 'Kosten'}${k.gilt === 'kuenftig' ? ` (ab ${de(k.ab)})` : k.gilt === 'abgeloest' ? ' (abgelöst)' : ''}`, k])].filter(([, eintrag]) => eintrag?.zitat);
    let weiter = '';
    if (e.schreiben && v.status === 'laufend') weiter = `<div class="weiter"><strong>So geht es weiter</strong><p>Das Kündigungsschreiben liegt als Entwurf vor. Lies es, unterschreib es und schick es selbst ab, am besten so, dass du den Zugang nachweisen kannst. Danach sag deinem Agenten: „Gekündigt.“</p><p><a href="${esc(e.schreiben)}">Schreiben öffnen</a></p></div>`;
    else if (['frist', 'jederzeit'].includes(e.lage)) weiter = `<div class="weiter"><strong>So geht es weiter</strong><p>Willst du kündigen, sag deinem Agenten: „Bereite die Kündigung für ${esc(v.anbieter)} vor.“</p></div>`;
    return `<article class="vertrag ${stufe(e)}" id="${esc(v.id)}">
<div class="vertrag__kopf"><div><h3>${esc(name[0])}</h3><p class="vertrag__art">${esc([ARTEN[v.art], name[1]].filter(Boolean).join(' · '))}</p></div><p class="preis"><strong>${euro(e.kosten_jahr)}</strong><span>im Jahr · ${euro(e.kosten_monat)} im Monat</span></p></div>
${termin}
${streifen}
<dl class="daten">${angabe('Vertrags- oder Kundennummer', v.nummer?.wert)}${angabe('Beginn', v.beginn ? de(v.beginn.datum) : null)}${angabe('Kündigungsfrist', dauer(v.kuendigungsfrist))}${angabe('Kündigung an', v.kuendigung_an ? [v.kuendigung_an.name, v.kuendigung_an.email].filter(Boolean).join(', ') : null)}</dl>
${e.angekuendigt.length ? `<p class="zettel"><strong>Angekündigt:</strong> ${e.angekuendigt.map(k => `ab ${de(k.ab)} ${esc(k.was)} ${euro(k.betrag)} ${RHYTHMUS[k.rhythmus]}`).join('; ')}. Bis dahin zählt der bisherige Betrag.</p>` : ''}
${merk}
${v.notiz ? `<p class="zettel"><strong>Deine Notiz:</strong> ${esc(v.notiz)}</p>` : ''}
${weiter}
${zitate.length ? `<details><summary>Wortlaut aus deinen Dokumenten (${zitate.length})</summary><ul class="zitate">${zitate.map(([etikett, eintrag]) => `<li><span>${esc(etikett)}${eintrag.betrag !== undefined ? `: ${euro(eintrag.betrag)} ${RHYTHMUS[eintrag.rhythmus]}` : ''}</span><q>${esc(eintrag.zitat)}</q></li>`).join('')}</ul></details>` : ''}
<p class="fuss">${esc(v.id)} · aus ${v.quellen.map(q => esc(q.datei.replace(/^eingang\//, ''))).join(', ')}</p>
</article>`;
  };
  const laufend = eintraege.filter(e => !['gekuendigt', 'beendet'].includes(e.lage));
  const eilig = laufend.filter(e => e.lage === 'frist' && e.tage <= 90), spaeter = laufend.filter(e => e.lage === 'frist' && e.tage > 90), frei = laufend.filter(e => e.lage === 'jederzeit'), offen = laufend.filter(e => ['unbekannt', 'endet_von_selbst'].includes(e.lage)), fertig = eintraege.filter(e => ['gekuendigt', 'beendet'].includes(e.lage));
  const gruppe = (titel, text, liste) => liste.length ? `<section><h2>${titel}</h2><p class="einleitung">${text}</p><div class="liste">${liste.map(karte).join('')}</div></section>` : '';
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Verträge: ${eintraege.length} erfasst · Stand ${esc(lang(heute))}</title><style>${schriften('')}${css}</style></head>
<body><main>
<header class="kopf"><h1>Deine Verträge</h1><div class="summe"><strong>${euro(summe)}</strong><span>im Jahr für ${laufend.length} laufende Verträge · ${euro(Math.round(summe / 12 * 100) / 100)} im Monat</span></div><p>Stand ${esc(lang(heute))}. Beträge und Fristen stehen wörtlich so in deinen Dokumenten; die Termine sind daraus gerechnet. Was dort nicht steht, ist als offen markiert und nicht geschätzt.</p></header>
<div class="stand" aria-label="Überblick"><div><strong>${eintraege.length}</strong>Verträge erfasst</div><div class="eilt"><strong>${laufend.filter(e => e.lage === 'frist' && e.tage <= 30).length}</strong>Fristen in 30 Tagen</div><div class="ruhe"><strong>${frei.length}</strong>jederzeit kündbar</div><div class="offen"><strong>${offen.filter(e => e.lage === 'unbekannt').length}</strong>mit fehlenden Angaben</div></div>
${eintraege.length ? '' : '<p class="leer">Noch kein Vertrag erfasst. Leg Verträge, Bestätigungen oder Rechnungen in den Ordner „eingang“ oder füge ihren Text im Gespräch ein und sag: „Neue Unterlagen“.</p>'}
${gruppe('Bald fällig', 'Hier endet die Kündigungsfrist in den nächsten 90 Tagen. Die Datei „fristen“ im Ordner trägt alle Termine mit Erinnerung in deinen Kalender ein.', eilig)}
${gruppe('Frist liegt weiter weg', 'Diese Verträge laufen noch länger. Der letzte Tag für die Kündigung steht jeweils dabei.', spaeter)}
${gruppe('Jederzeit kündbar', 'Hier bindet dich keine feste Laufzeit mehr.', frei)}
${gruppe('Angaben fehlen', 'Aus deinen Dokumenten lässt sich kein Termin rechnen. Was fehlt, steht dabei.', offen)}
${gruppe('Gekündigt oder beendet', 'Diese Verträge zählen nicht mehr zu den laufenden Kosten.', fertig)}
<footer class="hinweis"><p>Die Termine sind aus dem Wortlaut deiner Verträge gerechnet (Beginn, Laufzeit, Verlängerung, Frist). Sie ersetzen keine Rechtsauskunft. Bei knappen Fristen kündige früh und so, dass du den Zugang nachweisen kannst; im Zweifel frag den Anbieter oder die Verbraucherzentrale.</p><p>Die Übersicht wird vom Baukasten gebaut und gilt für den Tag, an dem sie entstand. Ändere sie nicht von Hand, sondern sag deinem Agenten, was sich geändert hat.</p></footer>
</main></body></html>
`;
}

// ---------- Kündigungsschreiben (fester Wortlaut) ----------

const briefCss = `
:root{--tinte:#1b2530;--leise:#566472;--tisch:#e9ecee}
*{box-sizing:border-box}
html{font-size:11pt}
body{margin:0;background:var(--tisch);color:var(--tinte);font:400 1rem/1.5 "Figtree",system-ui,sans-serif}
p{margin:0}
.leiste{max-width:210mm;margin:0 auto;padding:1rem 1.25rem;color:var(--leise);font-size:12pt}
.leiste strong{color:var(--tinte)}
.blatt{width:210mm;min-height:297mm;margin:0 auto 2rem;padding:20mm 20mm 20mm 25mm;background:#fff;box-shadow:0 .25rem 1.5rem rgb(27 37 48 / .14)}
.absender{line-height:1.4}
.absender strong{font:700 14pt/1.2 "Bricolage Grotesque","Figtree",sans-serif;display:block}
.empfaenger{min-height:30mm;margin-top:16mm;line-height:1.4}
.datum{text-align:right;color:var(--leise)}
.betreff{margin:9mm 0 0;font:700 12pt/1.35 "Bricolage Grotesque","Figtree",sans-serif}
.text p{margin-top:4mm;max-width:160mm}
.gruss{margin-top:8mm}
.unterschrift{margin-top:18mm;padding-top:1.5mm;border-top:.2mm solid var(--leise);width:70mm;color:var(--leise);font-size:9.5pt}
@media screen and (max-width:215mm){.blatt{width:auto;min-height:0;padding:9mm 7mm;box-shadow:none}}
@page{size:A4;margin:0}
@media print{body{background:#fff}.leiste{display:none}.blatt{margin:0;box-shadow:none;min-height:0}}
`;

// Feste Zusatzsätze, die der Nutzer auf Wunsch dazunehmen kann.
export const ZUSATZ = { schadenfreiheit: 'Bitte senden Sie mir außerdem eine Bescheinigung über meinen Schadenfreiheitsrabatt und den Schadenverlauf.', daten_loeschen: 'Bitte löschen Sie nach dem Ende des Vertrags meine Daten, soweit Sie nicht gesetzlich zur Aufbewahrung verpflichtet sind.' };

function briefTeile({ vertrag: v, kuendigung: k, angaben, heute }) {
  const ort = (angaben.anschrift || '').match(/\b\d{5}\s+([^,]+)/)?.[1]?.trim() || null;
  const sache = [v.bezeichnung || null, v.nummer ? `Nummer ${v.nummer.wert}` : null].filter(Boolean).join(', ');
  const zum = k.zum === 'naechstmoeglich' ? 'zum nächstmöglichen Zeitpunkt' : `fristgerecht zum ${lang(k.zum)}, hilfsweise zum nächstmöglichen Zeitpunkt`;
  return {
    empfaenger: [v.kuendigung_an.name || v.anbieter, v.kuendigung_an.anschrift || null, !v.kuendigung_an.anschrift && v.kuendigung_an.email ? `per E-Mail an ${v.kuendigung_an.email}` : null].filter(Boolean),
    datum: [ort, lang(heute)].filter(Boolean).join(', '),
    betreff: `Kündigung${sache ? `: ${sache}` : ` meines Vertrags bei ${v.anbieter}`}`,
    absaetze: [`hiermit kündige ich den oben genannten Vertrag ${zum}.`, 'Bitte bestätigen Sie mir den Eingang dieser Kündigung und den Tag, an dem der Vertrag endet, in Textform.', ...(k.zusatz || []).map(key => ZUSATZ[key]).filter(Boolean)]
  };
}

export function kuendigungSeite(daten) {
  const t = briefTeile(daten), a = daten.angaben;
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Kündigung ${esc(daten.vertrag.anbieter)}</title><style>${schriften('../')}${briefCss}</style></head>
<body><p class="leiste"><strong>Entwurf deiner Kündigung.</strong> Bitte lesen, drucken (Strg + P, am Mac Befehl + P; auch „Als PDF sichern“ geht), unterschreiben und selbst abschicken. Heb den Nachweis für das Abschicken auf. Dieser Hinweis wird nicht mitgedruckt.</p>
<main class="blatt">
<p class="absender"><strong>${esc(a.name)}</strong>${esc(a.anschrift)}</p>
<p class="empfaenger">${t.empfaenger.map(esc).join('<br>')}</p>
<p class="datum">${esc(t.datum)}</p>
<p class="betreff">${esc(t.betreff)}</p>
<div class="text"><p>Sehr geehrte Damen und Herren,</p>${t.absaetze.map(absatz => `<p>${esc(absatz)}</p>`).join('')}</div>
<p class="gruss">Mit freundlichen Grüßen</p>
<p class="unterschrift">${esc(a.name)}</p>
</main></body></html>
`;
}

export function kuendigungText(daten) {
  const t = briefTeile(daten), a = daten.angaben;
  return ['ENTWURF. Bitte selbst prüfen und abschicken.', '', ...(daten.vertrag.kuendigung_an.email ? [`An: ${daten.vertrag.kuendigung_an.email}`] : []), `Betreff: ${t.betreff}`, '', 'Sehr geehrte Damen und Herren,', '', ...t.absaetze.flatMap(absatz => [absatz, '']), 'Mit freundlichen Grüßen', a.name, a.anschrift, ''].join('\n');
}
