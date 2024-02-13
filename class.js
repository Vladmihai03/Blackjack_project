import {result,dealer, player} from './div.js';
import { play_btn, stand_btn, hit_btn, double_btn,disable,enable} from './buttons.js';

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
    const card = this.randomm();
    const name = this.conversion(card);
    
    participant.cards.push(card);
    participant.names.push(name);
    if(participant == this.player){
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('cards');
      cardDiv.textContent = name;
      player.appendChild(cardDiv);
    }else{
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('cards');
      cardDiv.textContent = name;
      dealer.appendChild(cardDiv);
    }
    if (this.sum(participant) > 21 && participant === this.dealer) {
      this.bust(participant);
    } else if (this.sum(participant) > 21) {
      this.bust(participant);
      if(participant == this.player){
        result.textContent = 'LOSE';
      }else{
        result.textContent = 'WIN';
      }
    }
  }
  
  newGame() {
    this.initializeCards();
    this.balance -= 10;
    /*
    const div1 = document.createElement('div');
        div1.classList.add('value-box');
        div1.textContent = value1;
        outputDiv.appendChild(div1);
    */
    this.dealer.names.forEach((cardName, index) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('cards');
      if (index === 1) {
          cardDiv.classList.add('second-card'); // Adăugare clasă pentru a doua carte
          cardDiv.textContent = "?"; // Text pentru a doua carte, de exemplu "Hidden"
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

    if(this.hasBlackjack(this.dealer)){
      result.textContent = 'Dealer has blackjack! You lose!';
      this.dealer_second.textContent = this.dealer.names[1] = this.conversion(this.dealer.cards[1]);
      this.dealer_second.classList.remove('second-card');
      enable(play_btn);
      return;
  }

  // Verifică dacă jucătorul are blackjack
  if(this.hasBlackjack(this.player)){
      result.textContent = 'BLACKJACK! You win!';
      enable(play_btn);
      return;
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
      console.log('');
      console.log("PUSH");
      result.textContent = 'PUSH';
      play_btn.disabled = false;
    }else if(this.sum(participant1) > this.sum(participant2)){
      console.log('');
      console.log("LOSE");
      result.textContent = 'LOSE';
      play_btn.disabled = false;
    }else{
      console.log('');
      console.log("WIN");
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
            this.hit(participant1);
        }
        if (this.sum(participant1) >= 17 && this.sum(participant1) <= 21) {
            this.compare(participant1, participant2);
        } else {
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
      console.log("BUST");
      result.textContent = 'LOSE';
    }else{
      this.stand(this.dealer, participant);
    }
    }
  
  bust(participant){
   participant.cards = [];
   participant.names = [];
   participant.ok = 1;
   disable(double_btn);
   disable(hit_btn);
   disable(stand_btn);
   enable(play_btn);
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