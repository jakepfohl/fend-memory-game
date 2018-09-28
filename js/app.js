/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
const cardList = [...document.querySelectorAll(".card")];
let openCards = [];
let matchedCards = [];
let moves = 0;
let time = 0;
let timerInterval;
let gameRunning = false;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle the cards and display the new cards 
function shuffleCards() {
    const shuffledDeck = shuffle(cardList);
    for (card of shuffledDeck) {
        deck.appendChild(card);
    }
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

resetGame();

cardList.forEach(function(card) {
    card.addEventListener("click", function() {
        if (isClickValid(this)) {
            if(!gameRunning) {
                beginTimer();
                gameRunning = true;
            }
            toggleCard(this);
            addCardToOpenList(this);
            if (openCards.length === 2) {
                incrementAndShowMoves();
                checkMoves();
                if (cardsMatch()) {
                    keepCardsOpen();
                }
                else {
                    closeCardsAndHideSymbol();
                }
            }
        }
    });
});

document.querySelector(".close-button").addEventListener("click", toggleFinalScore);

document.querySelector(".modal-cancel").addEventListener("click", toggleFinalScore);

document.querySelector(".modal-replay").addEventListener("click", replayGame);

document.querySelector(".restart").addEventListener("click", resetGame);

// reset the game
function resetGame() {
    resetTimer();
    resetMoves();
    resetStars();
    resetArrays();
    resetCards();
    shuffleCards();
}

// replay game 
function replayGame() {
    resetGame();
    toggleFinalScore();
}

// begin the timer 
function beginTimer() {
    time = 0;
    timerInterval = setInterval(function() {
        time++;
        showTime();
    }, 1000);
}

// stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// reset the timer
function resetTimer() {
    stopTimer();
    gameRunning = false;
    time = 0;
    showTime();
}

// display the time on the page
function showTime() {
    const timer = document.querySelector(".timer");
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    seconds < 10 ? timer.innerHTML = `${minutes}:0${seconds}` : timer.innerHTML = `${minutes}:${seconds}`;
}

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
    if (matchedCards.length === 16) {
        gameOver();
    }
}

// if the cards do not match, remove the cards from the list and hide the card's symbol
function closeCardsAndHideSymbol() {
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

// reset the cards and turn them all back over
function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (card of cards) {
        card.className = 'card';
    }
}

// reset openCards and matchedCards arrays to 0 
function resetArrays() {
    openCards.length = 0;
    matchedCards.length = 0;
}

// increment the move counter and display it on the page
function incrementAndShowMoves() {
    moves++;
    document.querySelector(".moves").textContent = moves;
}

// check if the user is on move 15 or 22. If so, call removeStar() 
function checkMoves() {
    if (moves === 15 || moves === 22) {
        removeStar();
    }
}

// reset moves to 0 and display them 
function resetMoves() {
    moves = 0;
    document.querySelector(".moves").textContent = moves;
}

// figure out the number of stars for the end of the game
function getStars() {
    const stars = document.querySelectorAll(".stars li");
    let starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

// 'hide' a star from the DOM by adding the hidden class 
function removeStar() {
    const stars = document.querySelectorAll(".stars li");
    for (star of stars) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

// reset stars back to 3 and display them 
function resetStars() {
    const stars = document.querySelectorAll(".stars li");
    for (star of stars) {
        star.style.display = 'inline';
    }
}

function gameOver() {
    stopTimer();
    displayStats();
    toggleFinalScore();
}

// if all cards have matched, display a modal with the final score
function toggleFinalScore() {
    const modal = document.querySelector(".modal");
    modal.classList.toggle("show-modal");
}

// get stat numbers at the end of the game and put them in modal
function displayStats() {
    const timerVal = document.querySelector(".timer").innerHTML;
    const starVal = getStars();

    const finalTime = document.querySelector(".final-time");
    const finalStars = document.querySelector(".final-stars");
    const finalMoves = document.querySelector(".final-moves");


    finalTime.innerHTML = `Time: ${timerVal}`;
    finalMoves.innerHTML = `Moves: ${moves}`;
    finalStars.innerHTML = `Stars: ${starVal}`;
}

