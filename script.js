

const log = console.log;
//Welcome page hero section
const hero = document.querySelector('.hero');
const hero_btn = document.getElementById('heroBtn');
//game section

const countdownElement = document.querySelector('.countdown span');
const game = document.querySelector('.game');
const rock = document.getElementById('rock');
const paper = document.getElementById('paper');
const scissors = document.getElementById('scissors');
const computerChoice = document.getElementById('computerChoice');


let health = 100;
let enemyHealth = 100;
let enemyChoice = ['rock', 'paper', 'scissors'];
let playerChoice = ['rock', 'paper', 'scissors'];;
let counter = 20;


// Hide hero section when button is clicked
hero_btn.addEventListener('click', () => {
    hero.style.display = 'none';
    game.style.display = 'flex';
    console.log('hero button clicked');
    toggleComputerChoices();
});

log(computerChoice.innerHTML);


function toggleComputerChoices() {
    let currentIndex = 0;
    const choices = computerChoice.querySelectorAll('img');

    setInterval(() => {
        // Hide all choices first
        choices.forEach(choice => choice.classList.add('hidden'));

        // Show the current choice 
        choices[currentIndex].classList.remove('hidden');

        // Move to the next image, loop back to the first one
        currentIndex = (currentIndex + 1) % choices.length;
    }, 200); // 200 milliseconds 
}



// Function to update the countdown every second
const countdown = setInterval(() => {
    countdownElement.style.setProperty('--value', counter); // Update the CSS custom property
    countdownElement.innerText = counter; // Update the visible countdown text

    if (counter === 0) {
        clearInterval(countdown);
        console.log('Countdown finished');
    } else {
        counter--; // Decrease the counter
    }
}, 1000); // 1000ms = 1 second

// Function to handle the player's choice
function playerChoiceHandler(event) {
    const playerChoice = event.target.id;
    console.log('Player choice:', playerChoice);
}

// Add event listeners to the player's choices
rock.addEventListener('click', playerChoiceHandler);
paper.addEventListener('click', playerChoiceHandler);
scissors.addEventListener('click', playerChoiceHandler);