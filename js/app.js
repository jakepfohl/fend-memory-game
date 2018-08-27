/*
 * Create a list that holds all of your cards
 */
let cardList = [...document.querySelectorAll(".card")];
let openCards = [];
let matchedCards = [];
let moveCounter = 0;
let timerCount = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function init(cardList) {
    moveCounter = 0;
    openCards.length = 0;
    matchedCards.length = 0;
    timerCount = 0;
    let deck = document.querySelector(".deck");
    let shuffledDeck = shuffle(cardList);
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    shuffledDeck.forEach(function(card) {
        deck.appendChild(card);
    });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

init(cardList);

cardList.forEach(function(card) {
    card.addEventListener("click", function() {
        if (isClickValid(this)) {
            toggleCard(this);
            addCardToOpenList(this);
            console.log("openCards.length =" + openCards.length);
            console.log(openCards);
            if (openCards.length === 2) {
                if (cardsMatch()) {
                    console.log("It's a match!");
                    keepCardsOpen();
                }
                else {
                    closeCardsAndHideSymbol();
                }
            }
        }
    });
});

// determine if a click on a card is valid or not 
function isClickValid(card) {
    return(!card.classList.contains("open") 
    && !card.classList.contains("show") 
    && !card.classList.contains("match") 
    && openCards.length <= 1);
}

// display the card's symbol
function toggleCard(card) {
    card.classList.toggle("show");
    card.classList.toggle("open");
}

// add the card to a *list* of "open" cards
function addCardToOpenList(card) {
    openCards.push(card);
}

function cardsMatch() {
    return(openCards[0].firstElementChild.className === openCards[1].firstElementChild.className);
}

// if the cards do match, lock the cards in the open position 
function keepCardsOpen() {
    openCards.forEach(function(card) {
        card.classList.remove("show");
        card.classList.remove("open");
        card.classList.add("match");
        matchedCards.push(card);
    });
    openCards.length = 0;
    incrementAndShowMoveCounter();
    if (matchedCards.length === 16) {
        showFinalScore();
    }
}

// if the cards do not match, remove the cards from the list and hide the card's symbol
function closeCardsAndHideSymbol() {
    incrementAndShowMoveCounter();
    openCards[0].classList.add("nomatch");
    openCards[1].classList.add("nomatch");
    setTimeout(function() {
        toggleCard(openCards[0]);
        toggleCard(openCards[1]);
        openCards[0].classList.remove("nomatch");
        openCards[1].classList.remove("nomatch");
        openCards.length = 0;
    }, 1000);
}

// increment the move counter and display it on the page
function incrementAndShowMoveCounter() {
    moveCounter++;
    document.querySelector(".moves").textContent = moveCounter;
}

// if all cards have matched, display a message with the final score
function showFinalScore() {
    console.log("Game over!");
}

