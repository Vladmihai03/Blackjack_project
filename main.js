import Player from './class.js';
import { play_btn, stand_btn, hit_btn, double_btn} from './buttons.js';


const player = new Player(1000);


play_btn.addEventListener('click', () =>{
    player.newGame();
    hit_btn.disabled = false;
    stand_btn.disabled = false;
    double_btn.disabled = false;
    play_btn.disabled = true;

    setTimeout(() => {
      play_btn.disabled = false;
  }, 4000);
});

double_btn.addEventListener('click', () =>{
  player.double_down(player.player);
});

stand_btn.addEventListener('click', () =>{
  player.stand(player.dealer, player.player);
});

hit_btn.addEventListener('click', () => {
  player.hit(player.player);
});

