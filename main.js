/**
 * Importuri module
 */
import Player from './class.js'; // Importă clasa Player din fișierul class.js
import { // Importă butoanele și funcțiile asociate din fișierul buttons.js
    play_btn,
    stand_btn,
    hit_btn,
    double_btn,
    disable,
    enable,
    split_btn,
    restart
} from './buttons.js';
import { // Importă elementele HTML pentru afișarea informațiilor din fișierul div.js
    total_dealer,
    total_player,
    betInput,
    balanceAmount,
    playeer,
    dealer
} from './div.js';
import { // Importă funcțiile pentru gestionarea împărțirii din fișierul split.js
    showSplitElement,
    hideSplitElement,
    highlightHand,
    removeHighlight
} from './split.js';

let player; // Variabilă pentru obiectul jucătorului

/**
 * Adaugă un ascultător de eveniment pentru butonul de play (PLAY)
 */
play_btn.addEventListener('click', () => {
    const betAmount = betInput.value; // Obține valoarea pariului din input
    const balance = balanceAmount.textContent; // Obține valoarea balanței din input
    player = new Player(parseInt(balance), parseInt(betAmount)); // Creează un nou obiect jucător cu balanța și pariul

    // Activează butoanele corespunzătoare și dezactivează butonul de play
    enable(hit_btn);
    enable(stand_btn);
    enable(double_btn);
    disable(play_btn);
    hideSplitElement(); // Ascunde elementul de împărțire (SPLIT) în cazul în care este afișat
    player.newGame(); // Începe un joc nou
    play_btn.textContent = 'Play Again'; // Actualizează textul butonului de play pentru a afișa "Play Again"
});

/**
 * Adaugă un ascultător de eveniment pentru butonul de double down (DOUBLE)
 */
double_btn.addEventListener('click', () => {
    // Verifică dacă balanța jucătorului permite dublarea pariului
    if (player.balance === 0) {
        // Dezactivează butonul de double down dacă balanța este 0 și afișează un mesaj de avertizare
        disable(double_btn);
        alert("You don't have balance to double down");
    } else {
        // Efectuează dublarea pariului
        player.double_down(player.player, playeer, 'cards', total_player, dealer, 'cards', total_dealer);
    }
});

/**
 * Adaugă un ascultător de eveniment pentru butonul de hit (HIT)
 */
hit_btn.addEventListener('click', () => {
    // Verifică dacă jucătorul are posibilitatea de a împărți mâna
    if (hit_btn.hasAttribute('data-split')) {
        // Verifică dacă există atributul data-split și efectuează acțiuni corespunzătoare
        if (player.player.split.first_hand.cards.length > 0 && player.player.split.first_hand.ok === 0 && player.player.split.first_hand.sd === 0) {
            // Verifică dacă prima mână împărțită nu a fost completată și efectuează hit pentru prima mână
            player.hit(player.player.split.first_hand, document.querySelector('.hand-1 .cards-container-1'), 'cards-split', document.querySelector('.total-split-1'));
        } else if (player.player.split.second_hand.ok === 0) {
            // Dacă prima mână a fost completată, efectuează hit pentru a doua mână
            removeHighlight(1);
            highlightHand(2);
            player.hit(player.player.split.second_hand, document.querySelector('.hand-2 .cards-container-2'), 'cards-split', document.querySelector('.total-split-2'));
        }
    } else {
        // Dacă nu există atributul data-split, efectuează hit pentru mâna principală
        disable(double_btn); // Dezactivează butonul de double down după ce a fost apăsat hit
        player.hit(player.player, playeer, 'cards', total_player);
    }
});

/**
 * Adaugă un ascultător de eveniment pentru butonul de stand (STAND)
 */
stand_btn.addEventListener('click', () => {
    if (stand_btn.hasAttribute('data-split')) {
        // Verifică dacă există atributul data-split și efectuează acțiuni corespunzătoare pentru mâinile împărțite
        if (player.player.split.first_hand.cards.length > 0 && player.player.split.first_hand.sd === 0 && player.player.split.first_hand.ok === 0) {
            // Dacă prima mână nu a fost încă completată, marchează-o ca stand și afișează mâna a doua
            player.player.split.first_hand.sd = 1;
            removeHighlight(1);
            highlightHand(2);
        } else if (player.player.split.second_hand.cards.length > 0 && player.player.split.second_hand.sd === 0 && player.player.split.second_hand.ok === 0) {
            // Dacă a doua mână nu a fost încă completată, marchează-o ca stand
            player.player.split.second_hand.sd = 1;
        }
        // Verifică dacă toate mâinile împărțite au fost finalizate și continuă jocul
        if ((player.player.split.first_hand.sd === 1 && player.player.split.second_hand.sd === 1) || (player.player.split.first_hand.ok === 1 && player.player.split.second_hand.ok === 0 && player.player.split.second_hand.sd === 1)) {
            player.standSplit(); // Continuă jocul după ce toate mâinile împărțite au fost finalizate
        }
    } else {
        // Dacă nu există atributul data-split, aplică stand pentru mâna principală
        player.stand(player.dealer, player.player, dealer, 'cards', total_dealer);
    }
});

/**
 * Adaugă un ascultător de eveniment pentru butonul de split (SPLIT)
 */
split_btn.addEventListener('click', () => {
    player.split(); // Împarte mâna
});
