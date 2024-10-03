const gameModel = {
    playerName: '',
    playerHealth: 100,
    enemyHealth: 100,
    counter: 20,
    choices: ['rock', 'paper', 'scissors'],

    resetGame() {
        this.playerHealth = 100;
        this.enemyHealth = 100;
        this.counter = 20;
    },

    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }

        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            this.enemyHealth -= 20;
            return 'player';
        } else {
            this.playerHealth -= 20;
            return 'computer';
        }
    },

    isGameOver() {
        return this.playerHealth <= 0 || this.enemyHealth <= 0;
    }
};

const gameView = {
    countdownElement: document.querySelector('.countdown span'),
    playerHealthBar: document.querySelector('.player-display .progress'),
    computerHealthBar: document.querySelector('.computer-player .progress'),
    playerChoiceImages: document.querySelectorAll('#playerChoice img'),
    computerChoiceImages: document.querySelectorAll('#computerChoice img'),

    updatePlayerName() {
        const name = gameModel.playerName; gameModel
        const playerNameElements = document.querySelector('.playerHealthSection');
        const playerNameHeading = document.createElement('h2');

        playerNameHeading.textContent = name;

        playerNameElements.prepend(playerNameHeading);
    },
    updateHealth() {
        this.playerHealthBar.value = gameModel.playerHealth;
        this.computerHealthBar.value = gameModel.enemyHealth;
    },

    updateCountdown(counter) {
        this.countdownElement.style.setProperty('--value', counter); // Update the CSS custom property
    },

    showPlayerChoice(playerChoice) {
        this.playerChoiceImages.forEach(img => {
            img.classList.toggle('hidden', img.alt !== playerChoice);
        });
    },

    hideAllPlayerChoices() {
        // Start with the first child of the playerChoiceImages container
        let currentImage = this.playerChoiceImages[0].parentNode.firstElementChild;

        // Loop through all sibling elements
        while (currentImage) {
            currentImage.classList.add('hidden');
            currentImage = currentImage.nextElementSibling; // Move to the next sibling
        }
    },

    showComputerChoice(computerChoice) {
        this.computerChoiceImages.forEach(img => {
            img.classList.toggle('hidden', img.alt !== computerChoice);
        });
    },

    resetUI() {
        this.updateHealth();
        this.updateCountdown(gameModel.counter);
    },

    showResultMessage(message) {
        alert(message);
    },
    showInvalidNameMessage() {

        // Select the existing alert if any
        const existingAlert = document.querySelector('.alert');

        // Remove the existing alert if it exists
        if (existingAlert) {
            existingAlert.remove();
        }
        // Create the alert div
        const alertElement = document.createElement('div');
        alertElement.setAttribute('role', 'alert');
        alertElement.className = 'alert alert-warning';
        alertElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Please enter a valid name!</span>
        `;

        // Select the input field in the .hero section
        const heroInput = document.querySelector('.hero input');

        // Insert the alert element right after the input field
        heroInput.insertAdjacentElement('afterend', alertElement);

        // Automatically remove the alert after 3 seconds
        setTimeout(() => {
            alertElement.remove();
        }, 3000);
    }


};


const gameController = {
    shuffleInterval: null,
    countdownInterval: null,

    init() {
        this.bindEvents();
    },

    bindEvents() {
        const hero_btn = document.getElementById('heroBtn');
        hero_btn.addEventListener('click', event => {
            const playerName = document.querySelector('.hero input').value;
            gameModel.playerName = playerName;
            if (playerName.length > 0) {
                this.startGame();
            }
        });

        const playerChoices = document.querySelectorAll('.rpc-choose img');
        playerChoices.forEach(choice => {
            choice.addEventListener('click', this.handlePlayerChoice.bind(this));
        });

        const playerName = document.querySelector('.hero input');
        playerName.addEventListener('input', event => {
            if (this.playerNameValidation()) {
                if (event.target.value.length > 0) {
                    hero_btn.classList.remove('btn-disabled');
                } else {
                    hero_btn.classList.add('btn-disabled');
                }
            } else {
                hero_btn.classList.add('btn-disabled');
                gameView.showInvalidNameMessage();
            }

        });
    },

    startGame() {
        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.game').style.display = 'flex';

        this.startShuffle();
        this.startCountdown();
        gameView.updatePlayerName();
        console.log(gameModel.playerName);
    },

    playerNameValidation() {
        const playerName = document.querySelector('.hero input').value;
        const namePattern = /^[a-zA-Z]+$/;

        // Test the playerName against the pattern
        if (namePattern.test(playerName)) {
            return true;
        } else {
            return false; // Name is invalid (contains non-alphabetic characters)
        }
    },
    startShuffle() {
        if (this.shuffleInterval) {
            clearInterval(this.shuffleInterval);
        }
        let currentIndex = 0;

        this.shuffleInterval = setInterval(() => {
            const choices = gameModel.choices;
            gameView.showComputerChoice(choices[currentIndex]);

            currentIndex = (currentIndex + 1) % choices.length;
        }, 200);
    },

    stopShuffle() {
        clearInterval(this.shuffleInterval);
    },
    stopCountdown() {
        clearInterval(this.countdownInterval);
    },

    startCountdown() {
        this.stopCountdown();
        gameModel.counter = 20;

        this.countdownInterval = setInterval(() => {
            gameView.updateCountdown(gameModel.counter);

            if (gameModel.counter === 0) {
                setTimeout(() => {
                    this.handleTimeOut();
                }, 1000);

                clearInterval(this.countdownInterval);
            }

            gameModel.counter--;
        }, 1000);
    },

    handleTimeOut() {
        gameModel.playerHealth -= 20;
        gameView.updateHealth();

        gameView.showResultMessage('You ran out of time! You lost this round.');

        if (gameModel.isGameOver()) {
            gameView.showResultMessage('Game over! Click OK to restart the game.');
            this.resetGame();
        } else {

            this.nextRound();

        }
    },

    handlePlayerChoice(event) {
        const playerChoice = event.target.alt;
        this.stopShuffle();
        clearInterval(this.countdownInterval);

        const computerChoice = this.getComputerChoice();
        gameView.showPlayerChoice(playerChoice);
        gameView.showComputerChoice(computerChoice);

        setTimeout(() => {
            const winner = gameModel.determineWinner(playerChoice, computerChoice);
            gameView.updateHealth();

            if (winner === 'draw') {
                gameView.showResultMessage('It\'s a draw!');
            } else {
                const message = winner === 'player' ? 'You won!' : 'You lost!';
                gameView.showResultMessage(message);
            }

            if (gameModel.isGameOver()) {
                gameView.showResultMessage('Game over! Click OK to restart the game.');
                this.resetGame();
            } else {
                this.nextRound();
            }
        }, 1000);
    },

    getComputerChoice() {
        return Array.from(gameView.computerChoiceImages).find(
            img => !img.classList.contains('hidden')
        ).alt;
    },

    resetGame() {
        gameModel.resetGame();
        gameView.resetUI();
        gameView.hideAllPlayerChoices();
        setTimeout(() => {
            this.startShuffle();
            this.startCountdown();
        }, 2000);

    },

    nextRound() {
        gameModel.counter = 20;
        gameView.updateCountdown(gameModel.counter);
        this.startCountdown();
        setTimeout(() => {
            gameView.hideAllPlayerChoices();
            this.startShuffle();
        }, 1000);
    }
};

// Initialize the game controller
gameController.init();



