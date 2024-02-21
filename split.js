// Funcție pentru afișarea elementului 'split'
function showSplitElement() {
  document.getElementById('split').style.display = 'block';
}

// Funcție pentru ascunderea elementului 'split'
function hideSplitElement() {
  document.getElementById('split').style.display = 'none';
}

// Funcție pentru evidențierea unei mâini (element) specificate prin numărul acesteia
function highlightHand(handNumber) {
  // Selectează elementul mâinii specificate și adaugă o clasă CSS pentru evidențiere
  const handElement = document.querySelector(`.total-split-${handNumber}`);
  handElement.classList.add('highlight');
}

// Funcție pentru eliminarea evidențierii de pe o mână specificată prin numărul acesteia
function removeHighlight(handNumber) {
  // Selectează elementul mâinii specificate și elimină clasa CSS pentru evidențiere
  const handElement = document.querySelector(`.total-split-${handNumber}`);
  handElement.classList.remove('highlight');
}

// Exportul funcțiilor pentru manipularea elementului 'split' și evidențierea mâinilor
export {
  showSplitElement,
  hideSplitElement,
  highlightHand,
  removeHighlight
}
