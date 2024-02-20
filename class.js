import {result, dealer, playeer, total_dealer, total_player, balanceAmount} from './div.js';
import {play_btn, stand_btn, hit_btn, double_btn, disable, enable, restart,split_btn} from './buttons.js';
import {showInsuranceNotification, hideInsuranceNotification,showResponseNotification,hideResponseNotification} from './insurance.js';
import {showSplitElement,hideSplitElement} from './split.js';

// Clasa Player reprezintă logica jocului și acțiunile jucătorului
class Player {
    constructor(balance, betAmount) {
        // Inițializează starea jucătorului
        this.balance = balance;
        this.betAmount = betAmount;
        this.player = {
            cards: [],
            names: [],
            ok: 0,
            split: {
                first_hand: {
                    cards: [],
                    names: [],
                    container: '',
                    total: '',
                    ok: 0,
                    sd: 0
                },
                second_hand: {
                    cards:  [],
                    names: [],
                    container: '',
                    total: '',
                    ok: 0,
                    sd: 0
                }
            }
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
        restart();
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
        playeer.innerHTML = '';
        total_dealer.textContent = '';
        total_player.textContent = '';
        this.outcome = '';
        this.player.split.first_hand.cards = '';
        this.player.split.second_hand.cards = '';
        this.player.split.first_hand.names = '';
        this.player.split.second_hand.names = '';
        this.player.split.first_hand.ok = 0;
        this.player.split.second_hand.ok = 0;
        this.player.split.first_hand.sd = 0;
        this.player.split.second_hand.sd = 0;
        document.getElementById('insurance-amount').value = '';
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

        if (this.betAmount === 0 || isNaN(this.betAmount)) {
            alert("Please enter a valid bet amount.");
            restart();
            return;
        }
    
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

        if(this.player.cards[0] === this.player.cards[1]){
            showSplitElement();
            
        }

        if (this.hasBlackjack(this.dealer) && this.hasBlackjack(this.player)) {
            this.outcome = 'PUSH'; // Setăm rezultatul la PUSH
            this.revealDealerCard()
            this.updateBalanceAndText();
            total_dealer.textContent = 'BLACKJACK';
            total_player.textContent = 'BLACKJACK';
            return; // Întrerupem executarea metodei pentru că este push
        }else{

        // Oferă asigurarea dacă dealerul arată un As
        if (this.dealer.names[0] === 'Ace' && !this.hasBlackjack(this.player)) {
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
        this.continueGame(this.player, total_player);
    }
    }

    // Oferă asigurarea jucătorului în cazul în care dealerul arată un As
    offerInsurance() {
        showInsuranceNotification();

        document.getElementById('take-insurance').addEventListener('click', () => {
            const betAmount = parseInt(document.getElementById('insurance-amount').value);
            if(!betAmount){
                alert("Please enter a valid bet amount.");
            }else{
            this.balance -= betAmount;
            balanceAmount.textContent = this.balance;
            hideInsuranceNotification();
            if (this.hasBlackjack(this.dealer)) {
                this.handleDealerBlackjackWithInsurance(betAmount);
            }else{
                showResponseNotification();
                document.getElementById('response').addEventListener('click', () => {
                    hideResponseNotification();
                });
            }
        }
        });

        document.getElementById('decline-insurance').addEventListener('click', () => {
            hideInsuranceNotification();
            if (this.hasBlackjack(this.dealer)) {
                this.handleDealerBlackjack();
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
        hideSplitElement();
        restart();
    }

    // Tratează cazul în care dealerul are blackjack și jucătorul nu a acceptat asigurarea
    handleDealerBlackjack() {
        total_dealer.textContent = 'BLACKJACK';
        result.textContent = ` Blackjack! You lost ${this.betAmount} units!`;
        this.revealDealerCard();
        hideSplitElement();
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
    continueGame(participant, total) {
        total.textContent = `Total: ${this.sum(participant)}`;
        this.ace(participant, participant.names[0],total_player);
        this.ace(participant, participant.names[1], total_player);
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
            playeer.appendChild(cardDiv);
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
        } else if (this.sum(participant1) > this.sum(participant2)) {
            this.outcome = 'LOSE';
        } else {
            this.outcome = 'WIN';
        }
        if(this.player.split.first_hand.cards.length === 0){
            this.updateBalanceAndText();
        }
    }

    stand(participant1, participant2, parentElement, cardClass, totalElement) {
        disable(hit_btn);
        disable(double_btn);
        disable(stand_btn);
        this.dealer_second.textContent = this.dealer.names[1] = this.conversion(this.dealer.cards[1]);
        this.dealer_second.classList.remove('second-card');
    
        if (participant2.ok === 0) {
            while (this.sum(participant1) < 17 && participant1.ok === 0) {
                total_dealer.textContent = `Total: ${this.sum(this.dealer)}`;
                this.hit(participant1, parentElement, cardClass, totalElement); // Apelează hit cu parametrii corespunzători
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
    hit(participant, parentElement, cardClass, totalElement) {
        // Extrage o nouă carte și numele ei
        const card = this.randomm();
        const name = this.conversion(card);
    
        // Adaugă cartea la participant
        participant.cards.push(card);
        participant.names.push(name);

    
        // Creează un element div pentru afișarea cărții adăugate
        const cardDiv = document.createElement('div');
        cardDiv.classList.add(cardClass); // Adăugăm clasa specificată pentru cartea adăugată
        cardDiv.textContent = name;
        // Adaugă cartea la interfață, în funcție de participant
        parentElement.appendChild(cardDiv);
        // Verifică dacă participantul a depășit 21 de puncte
        if (this.sum(participant) > 21) {
            this.bust(participant);
            if (participant === this.player) {
                this.outcome = 'LOSE';
                totalElement.textContent = 'BUST';
                this.updateBalanceAndText();
                restart();
            } else if(participant === this.dealer) {
                this.outcome = 'WIN';
                totalElement.textContent = 'BUST';
                if(this.player.split.first_hand.cards.length === 0){
                this.updateBalanceAndText();
                restart();
                }
            }else{
                totalElement.textContent = 'BUST';
                if(this.player.split.second_hand === participant && this.player.split.first_hand.ok === 0){
                    this.standSplit();
                }
                if(this.player.split.first_hand.ok && this.player.split.second_hand.ok){
                    hit_btn.removeAttribute('data-split');
                    stand_btn.removeAttribute('data-split');
                    result.textContent += ` You lost ${this.betAmount*2} units!`;
                    restart();
                }
            }
        }else {
            // Actualizează totalul jucătorului sau dealerului
            totalElement.textContent = `Total: ${this.sum(participant)}`;
            
            if (participant != this.dealer) {
                this.ace(participant,participant.names[participant.names.length - 1],totalElement);
            }
        }
    }
    

    // Realizeaza o carte in plus pentru jucator cu dublare
    double_down(participant, parentElement, cardClass, totalElement, secparentElement, seccardClass, sectotalElement) {
        disable(double_btn);
        disable(hit_btn);
        disable(stand_btn);
        const card = this.randomm();
        const name = this.conversion(card);
    
        participant.cards.push(card);
        participant.names.push(name);
    
        double_btn.setAttribute('data-double-down', 'true');
        totalElement.textContent = `Total: ${this.sum(this.player)}`;
        this.ace(this.player.names[this.player.names.length - 1]);
    
        const cardDiv = document.createElement('div');
        cardDiv.classList.add(cardClass);
        cardDiv.textContent = name;
        parentElement.appendChild(cardDiv);
    
        if (this.sum(participant) > 21) {
            this.bust(participant);
            this.outcome = 'LOSE';
            totalElement.textContent = `BUST`;
            this.updateBalanceAndText();
        } else {
            this.stand(this.dealer, participant,secparentElement,seccardClass,sectotalElement);
        }
    }
    

    // Marcheaza un participant ca "bust"
    bust(participant) {
        participant.cards = [];
        participant.names = [];
        participant.ok = 1;
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
    ace(participant, card, totalElement) {
        if (card == 'Ace' && this.sum(this.player) <= 21) {
            totalElement.textContent = `Total: ${(this.sum(participant) - 10)}/${this.sum(participant)}`;
        }
    }

    split() {
        // Verifică dacă jucătorul are două cărți de aceeași valoare pentru a putea împărți mâinile
        if (this.player.cards.length !== 2 || this.player.cards[0] !== this.player.cards[1]) {
            alert("You can only split when you have two cards of the same value.");
            return;
        }
        disable(double_btn);
        hit_btn.setAttribute('data-split', 'true');
        stand_btn.setAttribute('data-split', 'true');
        this.balance -= this.betAmount;
        balanceAmount.textContent = this.balance;
        playeer.innerHTML = '';
        total_player.innerHTML = '';
    
        // Extrage cărțile pentru împărțire din mâna jucătorului
        const firstCard = this.player.cards[0];
        const secondCard = this.player.cards[1];
    
        // Actualizează cărțile și numele pentru prima mână împărțită
        this.player.split.first_hand.cards = [firstCard, this.randomm()];
        this.player.split.first_hand.names = [this.player.names[0], this.conversion(this.player.split.first_hand.cards[1])];
    
        // Actualizează cărțile și numele pentru a doua mână împărțită
        this.player.split.second_hand.cards = [secondCard, this.randomm()];
        this.player.split.second_hand.names = [this.player.names[1], this.conversion(this.player.split.second_hand.cards[1])];
    
        // Afiseaza mâinile împărțite pe ecran
        this.renderSplitHands(this.player.split.first_hand, this.player.split.second_hand);
    
        playeer.style.justifyContent = 'space-between';
    
        // Ascunde butonul de split după ce jucătorul a împărțit mâinile
        hideSplitElement();
    }
    
    
    // Afiseaza mâinile împărțite pe ecran
    // Afiseaza mâinile împărțite pe ecran
    // Metoda pentru afișarea mâinilor împărțite pe ecran
    renderSplitHands(firstHand, secondHand) {
        const hands = [firstHand, secondHand];

        hands.forEach((hand, index) => {
            const handBox = document.createElement('div');
            handBox.classList.add('hand');
            handBox.classList.add(`hand-${index + 1}`);

            const cardsContainer = document.createElement('div');
            cardsContainer.classList.add(`cards-container-${index + 1}`);

            // Afiseaza cartile pentru mana curenta
            hand.cards.forEach((card, i) => {
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('cards-split');
                cardDiv.textContent = hand.names[i];
                cardsContainer.appendChild(cardDiv);
            });

            handBox.appendChild(cardsContainer);

            // Afiseaza scorul pentru mana curenta
            const totalDiv = document.createElement('div');
            totalDiv.classList.add(`total-split-${index + 1}`);
            totalDiv.textContent = `Total: ${this.sum(hand)}`; // Utilizam suma pentru mâna curentă
            handBox.appendChild(totalDiv);

            playeer.appendChild(handBox);
        });
    }

    
    standSplit(){
        console.log(this.player.split.first_hand.ok, this.player.split.second_hand.ok);
        hit_btn.removeAttribute('data-split');
        stand_btn.removeAttribute('data-split');
        disable(hit_btn);
        disable(double_btn);
        disable(stand_btn);
        this.dealer_second.textContent = this.dealer.names[1] = this.conversion(this.dealer.cards[1]);
        this.dealer_second.classList.remove('second-card');
        /*
        if(this.player.split.first_hand.ok === 0 && this.player.split.second_hand.ok === 1){
            this.stand(this.dealer, this.player.split.first_hand, dealer, 'cards', total_dealer)
            if(total_dealer.textContent === 'BUST'){
                result.textContent = `WIN AND LOSS. MONEY BACK ${this.betAmount}`;
                this.balance += this.betAmount * 2;
            }else if(this.outcome === 'PUSH'){
                result.textContent = `PUSH AND LOSS. HALF THE BET ${this.betAmount/2}`;
                this.balance += this.betAmount;
            }else{
                result.textContent = `LOST MONEY ON BOTH HANDS`;
            }
        }
        */
        while (this.sum(this.dealer) < 17 && this.dealer.ok === 0) {
            total_dealer.textContent = `Total: ${this.sum(this.dealer)}`;
            this.hit(this.dealer,dealer, 'cards', total_dealer); // Apelează hit cu parametrii corespunzători
        }
        if (this.sum(this.dealer) >= 17 && this.sum(this.dealer) <= 21) {
            total_dealer.textContent = `Total: ${this.sum(this.dealer)}`;
            this.checkSplitResult();
        } else {
            total_dealer.textContent = `BUST`;
            this.checkSplitResult();
        }
    }

    checkSplitResult() {
        console.log(this.player.split.first_hand.ok,this.player.split.second_hand.ok)
        if (total_dealer.textContent === 'BUST') {
            if (this.player.split.first_hand.ok === 0 && this.player.split.second_hand.ok === 0) {
                result.textContent = `Win BOTH HANDS`;
                this.balance += this.betAmount * 4;
                balanceAmount.textContent = this.balance;
            } else if (this.player.split.first_hand.ok === 1 && this.player.split.second_hand.ok === 0) {
                result.textContent = `Lost FIRST HAND, Win SECOND HAND`;
                this.balance += this.betAmount * 2;
                balanceAmount.textContent = this.balance;
            } else if (this.player.split.first_hand.ok === 0 && this.player.split.second_hand.ok === 1) {
                result.textContent = `Win FIRST HAND, Lost SECOND HAND`;
                this.balance += this.betAmount * 2;
                balanceAmount.textContent = this.balance;
            } else {
                
            }
        } else {
            if(this.player.split.first_hand.ok === 0 && this.player.split.second_hand.ok === 0){
                if((this.sum(this.player.split.first_hand) > this.sum(this.dealer)) && (this.sum(this.player.split.second_hand) > this.sum(this.dealer)) ){
                    result.textContent = `Win BOTH HANDS`;
                    this.balance += this.betAmount * 4;
                    balanceAmount.textContent = this.balance;
                }else if((this.sum(this.player.split.first_hand) < this.sum(this.dealer)) && (this.sum(this.player.split.second_hand) > this.sum(this.dealer))){
                    result.textContent = `Lost FIRST HAND, Win SECOND HAND`;
                    this.balance += this.betAmount * 2;
                    balanceAmount.textContent = this.balance;
                }else if((this.sum(this.player.split.first_hand) > this.sum(this.dealer)) && (this.sum(this.player.split.second_hand) < this.sum(this.dealer))){
                    result.textContent = `Win FIRST HAND, Lost SECOND HAND`;
                    his.balance += this.betAmount * 2;
                    balanceAmount.textContent = this.balance;
                }else{
                    result.textContent = `Lost BOTH`;
                }
            }else if(this.player.split.first_hand.ok === 1 && this.player.split.second_hand.ok === 0){
                if(this.sum(this.player.split.second_hand) > this.sum(this.dealer)){
                    result.textContent = `Lost FIRST HAND, Win SECOND HAND`;
                    this.balance += this.betAmount * 2;
                    balanceAmount.textContent = this.balance;
                }else{
                    result.textContent = `Lost BOTH`;
                }
            }else if(this.player.split.first_hand.ok === 0 && this.player.split.second_hand.ok === 1){
                if(this.sum(this.player.split.first_hand) > this.sum(this.dealer)){
                    result.textContent = `Win FIRST HAND, Lost SECOND HAND`;
                    this.balance += this.betAmount * 2;
                    balanceAmount.textContent = this.balance;
                }else{
                    result.textContent = `Lost BOTH`;
                }
            }
        }
        restart();
    }
    



}

export default Player;
