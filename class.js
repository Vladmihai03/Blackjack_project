import {result,dealer, player,total_dealer,total_player, balanceAmount} from './div.js';
import { play_btn, stand_btn, hit_btn, double_btn,disable,enable,restart} from './buttons.js';  
class Player {
  constructor(balance, betAmount) {
    this.balance = balance;
    this.betAmount = betAmount;
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
    this.outcome = '';
  }

  updateBalanceAndText() {
    const isDoubleDown = double_btn.getAttribute('data-double-down') === 'true';

    switch (this.outcome) {
      case 'WIN':
        // Aplică logica pentru câștig
        if (isDoubleDown) {
          this.balance += this.betAmount * 2; // Câștigul este dublu pentru parierea dublă
          result.textContent += ` You won ${this.betAmount * 2} units! (Double Down)`;
        } else {
          this.balance += this.betAmount;
          result.textContent += ` You won ${this.betAmount} units!`;
        }
        break;
      case 'LOSE':
        // Aplică logica pentru pierdere
        if (isDoubleDown) {
          this.balance -= this.betAmount * 2; // Pierderea este dublă pentru parierea dublă
          result.textContent += ` You lost ${this.betAmount * 2} units! (Double Down)`;
        } else {
          this.balance -= this.betAmount;
          result.textContent += ` You lost ${this.betAmount} units!`;
        }
        break;
      case 'PUSH':
        // Aplică logica pentru push
        result.textContent += ' Push! Your bet is returned.';
        break;
      case 'BJ':
          this.balance += this.betAmount * 1.5;
        break;
      default:
        break;
    }

    // Actualizează balanța și elementul HTML corespunzător
    balanceAmount.textContent = this.balance;
    double_btn.removeAttribute('data-double-down');
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
    this.outcome = '';
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
            this.outcome  = 'LOSE';
            total_player.textContent = 'BUST';
            this.updateBalanceAndText();
        } else {
            this.outcome = 'WIN';
            total_dealer.textContent = 'BUST';
            this.updateBalanceAndText();
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
    let ok = 0;

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
        result.textContent += ` Blackjack! You lost ${this.betAmount * 1.5} units!`;
        this.outcome = 'BJ';
        this.updateBalanceAndText();
        this.dealer_second.textContent = this.dealer.names[1] = this.conversion(this.dealer.cards[1]);
        this.dealer_second.classList.remove('second-card');
        ok =1;
    }

    if (this.hasBlackjack(this.player)) {
        total_player.textContent = 'Blackjack';
        result.textContent += ` Blackjack! You won ${this.betAmount * 1.5} units!`;
        this.outcome = 'BJ';
        this.updateBalanceAndText();
        this.dealer_second.textContent = this.dealer.names[1] = this.conversion(this.dealer.cards[1]);
        this.dealer_second.classList.remove('second-card');
        ok =1;
    }
    if(ok === 1){
      restart();
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
      this.outcome = 'PUSH';
      play_btn.disabled = false;
    }else if(this.sum(participant1) > this.sum(participant2)){
      this.outcome = 'LOSE';
      play_btn.disabled = false;
    }else{
      this.outcome = 'WIN';
      play_btn.disabled = false;
    }
    this.updateBalanceAndText();
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

    double_btn.setAttribute('data-double-down', 'true');
    total_player.textContent = `Total: ${this.sum(this.player)}`;

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('cards');
    cardDiv.textContent = name;
    player.appendChild(cardDiv);
    if(this.sum(participant) >21){
      this.bust(participant);
      this.outcome = 'LOSE';
      total_player.textContent = `BUST`;
      this.updateBalanceAndText();
    }else{
      this.stand(this.dealer, participant);
    }
    }
  
    bust(participant) {
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