import Player from './class.js';
import { play_btn, stand_btn, hit_btn, double_btn,disable,enable, split_btn} from './buttons.js';
import { total_dealer,total_player, betInput, balanceAmount,playeer,dealer} from './div.js';
import { showSplitElement, hideSplitElement } from './split.js';

let player;

play_btn.addEventListener('click', () =>{
    const betAmount = betInput.value; // Obțineți valoarea pariului
    const balance = balanceAmount.textContent; // Obțineți valoarea balanței
    player = new Player(parseInt(balance), parseInt(betAmount)); // Instantiați clasa Player cu balanța și pariul
    enable(hit_btn);
    enable(stand_btn);
    enable(double_btn);
    disable(play_btn);
    hideSplitElement();
    player.newGame();
    play_btn.textContent = 'Play Again';
});

double_btn.addEventListener('click', () =>{
  player.double_down(player.player, playeer, 'cards', total_player,dealer,'cards', total_dealer);
});

hit_btn.addEventListener('click', () => {
  if (hit_btn.hasAttribute('data-split')) {
      // Verificați dacă există atributul data-split și efectuați acțiunile corespunzătoare
      if (player.player.split.first_hand.cards.length > 0 && player.player.split.first_hand.ok === 0 && player.player.split.first_hand.sd === 0) {
          player.hit(player.player.split.first_hand, document.querySelector('.hand-1 .cards-container-1'), 'cards-split', document.querySelector('.total-split-1'));
      } else if (player.player.split.second_hand.ok === 0) {
          player.hit(player.player.split.second_hand, document.querySelector('.hand-2 .cards-container-2'), 'cards-split', document.querySelector('.total-split-2'));
      }
  } else {
      disable(double_btn);
      // Dacă nu există atributul data-split, aplicați hit pentru mâna principală
      player.hit(player.player, playeer, 'cards', total_player);
  }
});

stand_btn.addEventListener('click', () => {
    if (stand_btn.hasAttribute('data-split')) {
        // Verificați dacă există atributul data-split și efectuați acțiunile corespunzătoare pentru mâinile împărțite
        if (player.player.split.first_hand.cards.length > 0 && player.player.split.first_hand.sd === 0 && player.player.split.first_hand.ok === 0) {
            player.player.split.first_hand.sd = 1;
        } else if (player.player.split.second_hand.cards.length > 0 && player.player.split.second_hand.sd === 0 && player.player.split.second_hand.ok === 0) {
            player.player.split.second_hand.sd = 1;
        }
        // Verificați dacă toate mâinile împărțite au fost finalizate și apelați standSplit() pentru a continua jocul
        if ((player.player.split.first_hand.sd === 1 && player.player.split.second_hand.sd === 1) || (player.player.split.first_hand.ok === 1 && player.player.split.second_hand.ok === 0 && player.player.split.second_hand.sd === 1)) {
            player.standSplit();
        }
    } else {
        // Dacă nu există atributul data-split, aplicați stand pentru mâna principală
        player.stand(player.dealer, player.player, dealer, 'cards', total_dealer);
    }
});




split_btn.addEventListener('click', () => {
  player.split();
});



