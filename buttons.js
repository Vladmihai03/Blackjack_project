const play_btn = document.getElementById('play');
const hit_btn = document.getElementById('hit');
const stand_btn = document.getElementById('stand');
const double_btn = document.getElementById('double');


function disable(button){
  button.disabled = true;
}

function enable(button){
  button.disabled = false;
}

function restart(){
  disable(hit_btn);
  disable(stand_btn);
  disable(double_btn);
  enable(play_btn);
}



export {
  play_btn,
  hit_btn,
  stand_btn,
  double_btn,
  disable,
  enable,
  restart
}