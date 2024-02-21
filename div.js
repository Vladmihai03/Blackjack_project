// Obține elementul pentru afișarea rezultatului jocului
const result = document.querySelector('.result');

// Obține elementul pentru cărțile dealerului
const dealer = document.querySelector('.dealer-cards');

// Obține elementul pentru cărțile jucătorului
const playeer = document.querySelector('.player-cards');

// Obține elementul pentru totalul punctelor jucătorului
const total_player = document.querySelector('.total-player');

// Obține elementul pentru totalul punctelor dealerului
const total_dealer = document.querySelector('.total-dealer');

// Obține elementul pentru introducerea mizei
const betInput = document.getElementById('betAmount');

// Obține elementul pentru afișarea soldului jucătorului
const balanceAmount = document.getElementById('balanceAmount');

// Exportă constantele pentru a fi utilizate în alte module JavaScript
export {
  result,
  dealer,
  playeer,
  total_dealer,
  total_player,
  betInput,
  balanceAmount
};
