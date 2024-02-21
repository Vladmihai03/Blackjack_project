// Obține elementul butonului "PLAY" din interfața jocului
const play_btn = document.getElementById('play');

// Obține elementele butoanelor "HIT", "STAND", "DOUBLE" și "SPLIT" din interfața jocului
const hit_btn = document.getElementById('hit');
const stand_btn = document.getElementById('stand');
const double_btn = document.getElementById('double');
const split_btn = document.getElementById('split');

// Funcție pentru dezactivarea unui buton
function disable(button) {
  button.disabled = true; // Dezactivează butonul
}

// Funcție pentru activarea unui buton
function enable(button) {
  button.disabled = false; // Activează butonul
}

// Funcție pentru resetarea stării butoanelor la începutul sau la sfârșitul unui joc
function restart() {
  disable(hit_btn); // Dezactivează butonul "HIT"
  disable(stand_btn); // Dezactivează butonul "STAND"
  disable(double_btn); // Dezactivează butonul "DOUBLE"
  enable(play_btn); // Activează butonul "PLAY"
}

// Exportă constantele și funcțiile definite pentru a fi folosite în alte module JavaScript
export {
  play_btn,
  hit_btn,
  stand_btn,
  double_btn,
  split_btn,
  disable,
  enable,
  restart
};
