import {result,dealer, player,total_dealer,total_player} from './div.js';
import { play_btn, stand_btn, hit_btn, double_btn,disable,enable,restart} from './buttons.js';  
class Player {
  constructor(balance) {
    this.balance = balance;
    this.player = {
      cards: [],
      names: [],
      ok: 0
    };
    this.dealer = {
      cards: [],
      names: [],
      ok: 0
    };

    this.dealer_second = null;
  }

  initializeCards() {
    this.player.cards = [this.randomm(), this.randomm()];
    this.dealer.cards = [this.randomm(), this.randomm()];
    this.dealer.ok = 0;
    this.player.ok = 0;

    this.player.names = this.player.cards.map(card => this.conversion(card));
    this.dealer.names = this.dealer.cards.map(card => this.conversion(card));


    result.innerHTML = '';
    dealer.innerHTML = '';
    player.innerHTML = '';
    total_dealer.textContent = '';
    total_player.textContent = '';
  }

  randomm() {
    return Math.floor(Math.random() * 13) + 1;
  }

  conversion(value) {
    switch (value) {
      case 1:
        return 'Ace';
      case 11:
        return 'Jack';
      case 12:
        return 'Queen';
      case 13:
        return 'King';
      default:
        return value.toString();
    }
  }



  hit(participant) {
    // Se extrage o nouă carte și numele ei
    const card = this.randomm();
    const name = this.conversion(card);

    // Se adaugă cartea la participant
    participant.cards.push(card);
    participant.names.push(name);

    // Se creează un element div pentru afișarea cărții adăugate
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('cards');
    cardDiv.textContent = name;

    // Se adaugă cartea la interfață, în funcție de participant
    if (participant === this.player) {
        player.appendChild(cardDiv);
    } else {
        dealer.appendChild(cardDiv);
    }

    // Se verifică dacă participantul a depășit 21 de puncte
    if (this.sum(participant) > 21) {
        this.bust(participant);
        // Se afișează rezultatul în funcție de câștigător
        if (participant === this.player) {
            result.textContent = 'LOSE';
            total_player.textContent = 'BUST';
        } else {
            result.textContent = 'WIN';
            total_dealer.textContent = 'BUST';
        }
    } else {
        // Se actualizează totalul jucătorului sau dealerului
        if (participant === this.player) {
            total_player.textContent = `Total: ${this.sum(this.player)}`;
        } else {
            total_dealer.textContent = `Total: ${this.sum(this.dealer)}`;
        }
    }
}

  newGame() {
    this.initializeCards();
    this.balance -= 10;
    const ok = 0;

    this.dealer.names.forEach((cardName, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('cards');
        if (index === 1) {
            cardDiv.classList.add('second-card');
            cardDiv.textContent = "?";
        } else {
            cardDiv.textContent = cardName;
        }
        dealer.appendChild(cardDiv);
    });

    this.dealer_second = document.querySelector('.cards.second-card');

    this.player.names.forEach(cardName => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('cards');
        cardDiv.textContent = cardName;
        player.appendChild(cardDiv);
    });

    if (this.hasBlackjack(this.dealer)) {
        total_dealer.textContent = 'Blackjack';
        result.textContent = 'Dealer has blackjack! You lose!';
        this.dealer_second.textContent = this.dealer.names[1] = this.conversion(this.dealer.cards[1]);
        this.dealer_second.classList.remove('second-card');
        ok =1;
    }

    if (this.hasBlackjack(this.player)) {
        total_player.textContent = 'Blackjack';
        result.textContent = 'BLACKJACK! You win!';
        this.dealer_second.textContent = this.dealer.names[1] = this.conversion(this.dealer.cards[1]);
        this.dealer_second.classList.remove('second-card');
        ok =1;
    }
    if(ok === 1){
      play_btn.disabled = false;
    }else{
      total_player.textContent = `Total: ${this.sum(this.player)}`;
      total_dealer.textContent = `Total: ${this.sum(this.dealer)-this.dealer.cards[1]}`;
    }
  }

  

  hasBlackjack(participant) {
    const sum = this.sum(participant);
    if (sum === 21 && participant.cards.length === 2) {
        return true;

    }
    return false;
}

  
  compare(participant1, participant2){
    if(this.sum(participant1) === this.sum(participant2)){
      result.textContent = 'PUSH';
      play_btn.disabled = false;
    }else if(this.sum(participant1) > this.sum(participant2)){
      result.textContent = 'LOSE';
      play_btn.disabled = false;
    }else{
      result.textContent = 'WIN';
      play_btn.disabled = false;
    }
  }

  stand(participant1, participant2) {
    disable(hit_btn);
    disable(double_btn);
    disable(stand_btn);
    this.dealer_second.textContent = this.dealer.names[1] = this.conversion(this.dealer.cards[1]);
    this.dealer_second.classList.remove('second-card');

    if (participant2.ok === 0) {
        while (this.sum(participant1) < 17 && participant1.ok === 0) {
            total_dealer.textContent = `Total: ${this.sum(this.dealer)}`;
            this.hit(participant1);
        }
        if (this.sum(participant1) >= 17 && this.sum(participant1) <= 21) {
            total_dealer.textContent = `Total: ${this.sum(this.dealer)}`;
            this.compare(participant1, participant2);
        } else {
            total_dealer.textContent = `BUST`;
            result.textContent = 'WIN';
        }
        participant2.ok = 1; // Actualizează ok pentru participant2
    }
  }

  
  double_down(participant){
    disable(double_btn);
    disable(hit_btn);
    disable(stand_btn);
    const card = this.randomm();
    const name = this.conversion(card);

    participant.cards.push(card);
    participant.names.push(name);
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('cards');
    cardDiv.textContent = name;
    player.appendChild(cardDiv);
    if(this.sum(participant) >21){
      this.bust(participant);
      result.textContent = 'LOSE';
      total_player.textContent = `BUST`;
    }else{
      this.stand(this.dealer, participant);
    }
    }
  
  bust(participant){
   participant.cards = [];
   participant.names = [];
   participant.ok = 1;
   restart();
    }

  sum(participant) {
    let sum = 0;
    let numberOfAces = 0;
  
    participant.cards.forEach((elem) => {
      if (elem >= 2 && elem <= 10) {
        sum += elem;
      } else if (elem >= 11 && elem <= 13) {
        sum += 10; // Jack, Queen, King valorează fiecare 10 puncte
      } else {
        numberOfAces++;
        sum += 1; // Presupunând că inițial valorile Aces sunt 1
      }
    });
  
    // Adăugăm 10 puncte pentru fiecare As dacă adăugarea acestora nu depășește 21
    for (let i = 0; i < numberOfAces; i++) {
      if (sum + 10 <= 21) {
        sum += 10;
      }
    }
    return sum;
  }
    
  }

export default Player;