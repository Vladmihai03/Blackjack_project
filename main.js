import Player from './class.js';
import { play_btn, stand_btn, hit_btn, double_btn,disable,enable} from './buttons.js';
import { total_dealer,total_player, betInput, balanceAmount} from './div.js';


let player;

play_btn.addEventListener('click', () =>{
    const betAmount = betInput.value; // Obțineți valoarea pariului
    const balance = balanceAmount.textContent; // Obțineți valoarea balanței
    player = new Player(parseInt(balance), parseInt(betAmount)); // Instantiați clasa Player cu balanța și pariul
    enable(hit_btn);
    enable(stand_btn);
    enable(double_btn);
    disable(play_btn);
    player.newGame();
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
