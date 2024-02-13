const play_btn = document.getElementById('play');
const hit_btn = document.getElementById('hit');
const stand_btn = document.getElementById('stand');
const double_btn = document.getElementById('double');
const new_game_btn = document.getElementById('new_game');

function disable(button){
  button.disabled = true;
}

function enable(button){
  button.disabled = false;
}


export {
  play_btn,
  hit_btn,
  stand_btn,
  double_btn,
  disable,
  enable
}