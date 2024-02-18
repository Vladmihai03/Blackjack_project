import {result, dealer, player, total_dealer, total_player, balanceAmount} from './div.js';
import {play_btn, stand_btn, hit_btn, double_btn, disable, enable, restart} from './buttons.js';
import {showInsuranceNotification, hideInsuranceNotification,showResponseNotification,hideResponseNotification} from './insurance.js';

// Clasa Player reprezintă logica jocului și acțiunile jucătorului
class Player {
    constructor(balance, betAmount) {
        // Inițializează starea jucătorului
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

        // Inițializează variabilele suplimentare pentru gestionarea jocului
        this.dealer_second = null;
        this.outcome = '';
    }

    // Metoda pentru actualizarea balanței și textului rezultatului
    updateBalanceAndText() {
        const isDoubleDown = double_btn.getAttribute('data-double-down') === 'true';

        switch (this.outcome) {
            case 'WIN':
                // Câștigul este dublu pentru parierea dublă
                if (isDoubleDown) {
                    this.balance += this.betAmount * 3;
                    result.textContent += ` You won ${this.betAmount * 2} units! (Double Down)`;
                } else {
                    this.balance += this.betAmount * 2;
                    result.textContent += ` You won ${this.betAmount} units!`;
                }
                break;
            case 'LOSE':
                // Pierderea este dublă pentru parierea dublă
                if (isDoubleDown) {
                    this.balance -= this.betAmount;
                    result.textContent += ` You lost ${this.betAmount * 2} units! (Double Down)`;
                } else {
                    result.textContent += ` You lost ${this.betAmount} units!`;
                }
                break;
            case 'PUSH':
                // Push: banii pariți sunt returnați
                this.balance += this.betAmount;
                result.textContent += ' Push! Your bet is returned.';
                break;
            case 'BJ':
                // Câștigul pentru blackjack
                this.balance += this.betAmount * 2.5;
                break;
            default:
                break;
        }

        // Actualizează balanța și elementul HTML corespunzător
        balanceAmount.textContent = this.balance;
        double_btn.removeAttribute('data-double-down');
    }

    // Inițializează cărțile jucătorului și dealerului la începutul unui joc nou
    initializeCards() {
        this.player.cards = [this.randomm(), this.randomm()];
        this.dealer.cards = [this.randomm(), this.randomm()];
        this.dealer.ok = 0;
        this.player.ok = 0;

        // Converteste valorile cartilor in nume
        this.player.names = this.player.cards.map(card => this.conversion(card));
        this.dealer.names = this.dealer.cards.map(card => this.conversion(card));

        // Resetarea afișării rezultatului și cărților pe ecran
        result.innerHTML = '';
        dealer.innerHTML = '';
        player.innerHTML = '';
        total_dealer.textContent = '';
        total_player.textContent = '';
        this.outcome = '';
    }

    // Generează un număr aleatoriu între 1 și 13 pentru reprezentarea cărților
    randomm() {
        return Math.floor(Math.random() * 13) + 1;
    }

    // Converteste valorile numerice ale cărților în nume
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

    // Metoda pentru tranzitia la un joc nou
    newGame() {

        if (this.betAmount > this.balance) {
            alert("Your bet exceeds your balance. Please lower your bet amount.");
            restart();
            return; // Întrerupe executarea metodei în caz de pariu excesiv
        }
        this.initializeCards();
        this.balance -= this.betAmount;
        balanceAmount.textContent = this.balance;

        // Afiseaza cartile dealerului si ale jucatorului
        this.renderDealerCards();
        this.renderPlayerCards();

        if (this.hasBlackjack(this.dealer) && this.hasBlackjack(this.player)) {
            this.outcome = 'PUSH'; // Setăm rezultatul la PUSH
            this.revealDealerCard()
            this.updateBalanceAndText();
            total_dealer.textContent = 'BLACKJACK';
            total_player.textContent = 'BLACKJACK';
            return; // Întrerupem executarea metodei pentru că este push
        }else{

        // Oferă asigurarea dacă dealerul arată un As
        if (this.dealer.names[0] === 'Ace') {
            this.offerInsurance();
        } else if (this.hasBlackjack(this.dealer)) {
            // Dealerul are blackjack
            this.handleDealerBlackjack();
            return;
        }

        if (this.hasBlackjack(this.player)) {
            // Jucătorul are blackjack
            this.handlePlayerBlackjack();
            return;
        }

        // Niciun blackjack, continuăm jocul
        this.continueGame();
    }
    }

    // Oferă asigurarea jucătorului în cazul în care dealerul arată un As
    offerInsurance() {
        showInsuranceNotification();

        document.getElementById('take-insurance').addEventListener('click', () => {
            const betAmount = parseInt(document.getElementById('insurance-amount').value);
            this.balance -= betAmount;
            balanceAmount.textContent = this.balance;
            hideInsuranceNotification();
            if (this.hasBlackjack(this.dealer)) {
                this.handleDealerBlackjackWithInsurance(betAmount);
                this.revealDealerCard();
            }else{
                showResponseNotification();
                document.getElementById('response').addEventListener('click', () => {
                    hideResponseNotification();
                });
            }
        });

        document.getElementById('decline-insurance').addEventListener('click', () => {
            hideInsuranceNotification();
            if (this.hasBlackjack(this.dealer)) {
                this.handleDealerBlackjack();
                this.revealDealerCard();
            }else{
                showResponseNotification();
                document.getElementById('response').addEventListener('click', () => {
                    hideResponseNotification();
                });
            }
        });
    }

    // Tratează cazul în care dealerul are blackjack și jucătorul a acceptat asigurarea
    handleDealerBlackjackWithInsurance(betAmount) {
        total_dealer.textContent = 'Blackjack';
        result.textContent = ` Blackjack! You won ${betAmount * 2} units!`;
        this.balance += betAmount * 3;
        balanceAmount.textContent = this.balance;
        this.revealDealerCard();
        restart();
    }

    // Tratează cazul în care dealerul are blackjack și jucătorul nu a acceptat asigurarea
    handleDealerBlackjack() {
        total_dealer.textContent = 'BLACKJACK';
        result.textContent = ` Blackjack! You lost ${this.betAmount} units!`;
        this.revealDealerCard();
        restart();
    }

    // Tratează cazul în care jucătorul are blackjack
    handlePlayerBlackjack() {
        total_player.textContent = 'BLACKJACK';
        result.textContent = ` Blackjack! You won ${this.betAmount * 1.5} units!`;
        this.outcome = 'BJ';
        this.updateBalanceAndText();
        this.revealDealerCard();
        restart();
    }

    // Continuă jocul, afișând totalurile și acțiunile disponibile
    continueGame() {
        total_player.textContent = `Total: ${this.sum(this.player)}`;
        this.ace(this.player.names[0]);
        this.ace(this.player.names[1]);
    }

    // Dezvăluie a doua carte a dealerului
    revealDealerCard() {
        this.dealer_second.textContent = this.dealer.names[1] = this.conversion(this.dealer.cards[1]);
        this.dealer_second.classList.remove('second-card');
    }

    // Afiseaza cartile dealerului
    renderDealerCards() {
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
    }

    // Afiseaza cartile jucatorului
    renderPlayerCards() {
        this.player.names.forEach(cardName => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('cards');
            cardDiv.textContent = cardName;
            player.appendChild(cardDiv);
        });
    }

    // Verifica daca un participant are blackjack
    hasBlackjack(participant) {
        const sum = this.sum(participant);
        if (sum === 21 && participant.cards.length === 2) {
            return true;
        }
        return false;
    }

    // Compară totalurile jucătorului și dealerului pentru a determina câștigătorul
    compare(participant1, participant2) {
        if (this.sum(participant1) === this.sum(participant2)) {
            this.outcome = 'PUSH';
            play_btn.disabled = false;
        } else if (this.sum(participant1) > this.sum(participant2)) {
            this.outcome = 'LOSE';
            play_btn.disabled = false;
        } else {
            this.outcome = 'WIN';
            play_btn.disabled = false;
        }
        this.updateBalanceAndText();
    }

    // Jucătorul stă în joc și așteaptă decizia dealerului
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

    // Realizeaza o carte in plus pentru jucator
    hit(participant) {
        // Extrage o nouă carte și numele ei
        const card = this.randomm();
        const name = this.conversion(card);

        // Adaugă cartea la participant
        participant.cards.push(card);
        participant.names.push(name);

        // Creează un element div pentru afișarea cărții adăugate
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('cards');
        cardDiv.textContent = name;

        // Adaugă cartea la interfață, în funcție de participant
        if (participant === this.player) {
            player.appendChild(cardDiv);
        } else {
            dealer.appendChild(cardDiv);
        }

        // Verifică dacă participantul a depășit 21 de puncte
        if (this.sum(participant) > 21) {
            this.bust(participant);
            // Afișează rezultatul în funcție de câștigător
            if (participant === this.player) {
                this.outcome = 'LOSE';
                total_player.textContent = 'BUST';
                this.updateBalanceAndText();
            } else {
                this.outcome = 'WIN';
                total_dealer.textContent = 'BUST';
                this.updateBalanceAndText();
            }
        } else {
            // Actualizează totalul jucătorului sau dealerului
            if (participant === this.player) {
                total_player.textContent = `Total: ${this.sum(this.player)}`;
                this.ace(this.player.names[this.player.names.length - 1]);
            } else {
                total_dealer.textContent = `Total: ${this.sum(this.dealer)}`;
            }

        }
    }

    // Realizeaza o carte in plus pentru jucator cu dublare
    double_down(participant) {
        disable(double_btn);
        disable(hit_btn);
        disable(stand_btn);
        const card = this.randomm();
        const name = this.conversion(card);

        participant.cards.push(card);
        participant.names.push(name);

        double_btn.setAttribute('data-double-down', 'true');
        total_player.textContent = `Total: ${this.sum(this.player)}`;
        this.ace(this.player.names[this.player.names.length - 1]);

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('cards');
        cardDiv.textContent = name;
        player.appendChild(cardDiv);
        if (this.sum(participant) > 21) {
            this.bust(participant);
            this.outcome = 'LOSE';
            total_player.textContent = `BUST`;
            this.updateBalanceAndText();
        } else {
            this.stand(this.dealer, participant);
        }
    }

    // Marcheaza un participant ca "bust"
    bust(participant) {
        participant.cards = [];
        participant.names = [];
        participant.ok = 1;
        restart();
    }

    // Calculează suma punctelor pentru un participant
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

        // Adaugăm 10 puncte pentru fiecare As dacă adăugarea acestora nu depășește 21
        for (let i = 0; i < numberOfAces; i++) {
            if (sum + 10 <= 21) {
                sum += 10;
            }
        }
        return sum;
    }

    // Gestionarea comportamentului pentru as
    ace(card) {
        if (card == 'Ace' && this.sum(this.player) <= 21) {
            total_player.textContent = `Total: ${(this.sum(this.player) - 10)}/${this.sum(this.player)}`;
        }
    }
}

export default Player;
