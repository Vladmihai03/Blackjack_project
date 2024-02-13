import Player from './class.js';
import { play_btn, stand_btn, hit_btn, double_btn,disable,enable} from './buttons.js';


const player = new Player(1000);


play_btn.addEventListener('click', () =>{
    player.newGame();
    enable(hit_btn);
    enable(stand_btn);
    enable(double_btn);
    disable(play_btn);
    play_btn.textContent = 'Play Again';
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
