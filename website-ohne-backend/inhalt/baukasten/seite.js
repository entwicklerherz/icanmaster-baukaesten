// Kleines Extra des Baukastens: zeigt, ob heute geöffnet ist, und markiert den heutigen Tag. Sendet nichts, speichert nichts.
// Erwartet Zeilen mit data-tage="2-7" (1 = Montag … 7 = Sonntag) und data-von/data-bis in vollen oder halben Stunden ("9", "17.30").
(() => {
  const jetzt = new Date(), heute = jetzt.getDay() || 7, uhr = jetzt.getHours() + jetzt.getMinutes() / 60;
  const zahl = t => { const [h, m = 0] = String(t).split(/[.:]/).map(Number); return h + m / 60; };
  const text = t => String(t).replace(':', '.') + ' Uhr';
  let zeile = null;
  document.querySelectorAll('[data-tage]').forEach(el => {
    const [a, b = a] = el.dataset.tage.split('-').map(Number);
    if (a <= b ? heute >= a && heute <= b : heute >= a || heute <= b) { el.classList.add('ist-heute'); zeile = el; }
  });
  // Die Statuszeile sagt nur, was aus den genannten Zeiten sicher folgt. An Tagen ohne Angabe und nach Schluss bleibt der feste Text stehen.
  document.querySelectorAll('[data-status]').forEach(el => {
    if (!zeile) return;
    const {von, bis} = zeile.dataset;
    if (!von || !bis) { const wort = zeile.querySelector('dd')?.textContent.trim(); if (wort) { el.textContent = `Heute ${wort}`; el.classList.add('ist-zu'); } return; }
    if (uhr < zahl(von)) el.textContent = `Heute ab ${text(von)} geöffnet`;
    else if (uhr < zahl(bis)) { el.textContent = `Heute bis ${text(bis)} geöffnet`; el.classList.add('ist-offen'); }
  });
})();
