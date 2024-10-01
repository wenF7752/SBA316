const log = console.log;

// Welcome page hero section
const hero = document.querySelector('.hero');
const hero_btn = document.getElementById('heroBtn');

// Game section
const countdownElement = document.querySelector('.countdown span');
const game = document.querySelector('.game');
const rock = document.getElementById('rock');
const paper = document.getElementById('paper');
const scissors = document.getElementById('scissors');
const computerChoiceImages = document.querySelectorAll('#computerChoice img'); // Correct selector
const playerChoiceImages = document.querySelectorAll('#playerChoice img'); // Correct selector

// Health progress bars
const playerHealthBar = document.querySelector('.player-display .progress'); // Correct selector for player health
const computerHealthBar = document.querySelector('.computer-player .progress'); // Correct selector for computer health

let health = 100;
let enemyHealth = 100;
let counter = 20;
let shuffleInterval;
let countdown; // Store countdown interval

// Hide hero section when button is clicked
hero_btn.addEventListener('click', () => {
    hero.style.display = 'none';
    game.style.display = 'flex';
    log('Hero button clicked');
    setTimeout(() => {
        startShuffle();
        startCountdown(); // Start the countdown

    }, 250);

});

// Function to shuffle computer choices
function startShuffle() {
    let currentIndex = 0;

    shuffleInterval = setInterval(() => {
        // Hide all computer choices first
        computerChoiceImages.forEach(choice => choice.classList.add('hidden'));

        // Show the current choice 
        computerChoiceImages[currentIndex].classList.remove('hidden');

        // Move to the next image, loop back to the first one
        currentIndex = (currentIndex + 1) % computerChoiceImages.length;
    }, 200); // 200 milliseconds
}

// Function to stop shuffling the computer's choices
function stopShuffle() {
    clearInterval(shuffleInterval);
}

// Countdown function
function startCountdown() {
    countdown = setInterval(() => {
        countdownElement.style.setProperty('--value', counter); // Update the CSS custom property
        countdownElement.innerText = counter; // Update the visible countdown text

        if (counter === 0) {
            clearInterval(countdown);
            log('Countdown finished');
            handleTimeOut(); // Handle the case where the countdown reaches zero
        } else {
            counter--; // Decrease the counter
        }
    }, 1000); // 1000ms = 1 second
}

// Handle case when the countdown reaches zero
function handleTimeOut() {
    health -= 20; // Deduct player health for timeout
    playerHealthBar.value = health;
    alert('You ran out of time! You lost this round. Your health: ' + health);

    if (health <= 0) {
        alert('Game over!');
        resetGame();
    } else {
        setTimeout(() => {
            confirmNextRound(); // Confirm next round after timeout loss
        }, 1000);
    }
}

// Function to handle the player's choice
function playerChoiceHandler(event) {
    event.preventDefault();
    const playerClicked = event.target.id; // Get the ID of the clicked image (rock, paper, or scissors)
    log('Player clicked:', playerClicked);

    // Show the player's selected choice
    for (let i = 0; i < playerChoiceImages.length; i++) {
        if (i == 0 && playerClicked === 'rock') {
            playerChoiceImages[i].classList.remove('hidden');
        } else if (i == 1 && playerClicked === 'paper') {
            playerChoiceImages[i].classList.remove('hidden');
        } else if (i == 2 && playerClicked === 'scissors') {
            playerChoiceImages[i].classList.remove('hidden');
        } else {
            playerChoiceImages[i].classList.add('hidden');
        }
    }

    stopShuffle(); // Stop shuffling computer choices after the player makes their choice
    clearInterval(countdown); // Stop the countdown once a choice is made
    determineWinner(playerClicked); // Determine who won
}

// Add event listeners to the player's choices
rock.addEventListener('click', playerChoiceHandler);
paper.addEventListener('click', playerChoiceHandler);
scissors.addEventListener('click', playerChoiceHandler);

// Function to handle the computer's choice
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * computerChoiceImages.length);
    const computerPick = computerChoiceImages[randomIndex].src; // Get the image source of the randomly selected choice
    log('Computer picked:', computerPick);
    return computerChoiceImages[randomIndex].alt || computerChoiceImages[randomIndex].src.split('/').pop().split('.')[0]; // Use `alt` or filename as a fallback
}

// Function to determine the winner
function determineWinner(playerChoice) {
    const computerPick = getComputerChoice();

    if (playerChoice === computerPick) {
        alert('It\'s a draw!');
    } else if (
        (playerChoice === 'rock' && computerPick === 'scissors') ||
        (playerChoice === 'paper' && computerPick === 'rock') ||
        (playerChoice === 'scissors' && computerPick === 'paper')
    ) {
        enemyHealth -= 20; // Reduce enemy health
        computerHealthBar.value = enemyHealth; // Update computer health bar
        alert('You won this round! Enemy health: ' + enemyHealth);
    } else {
        health -= 20; // Reduce player health
        playerHealthBar.value = health; // Update player health bar
        alert('You lost this round! Your health: ' + health);
    }

    if (health <= 0 || enemyHealth <= 0) {
        // Game over
        alert('Game over!');
        resetGame();
    } else {
        // Proceed to the next round
        setTimeout(() => {
            confirmNextRound();
        }, 1000);
    }
}

function resetGame() {
    health = 100;
    enemyHealth = 100;
    playerHealthBar.value = 100;
    computerHealthBar.value = 100;
    counter = 20;
    startShuffle();
    startCountdown();
}

// Function to confirm the next round
function confirmNextRound() {
    const ready = confirm('Are you ready for the next round?');
    if (ready) {
        // Reset timer, start shuffle again
        counter = 20;
        startShuffle();
        startCountdown();
    }
}
