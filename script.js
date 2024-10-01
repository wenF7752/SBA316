const gameModel = {
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

    confirmNextRound() {
        return confirm('Are you ready for the next round?');
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
        hero_btn.addEventListener('click', this.startGame.bind(this));

        const playerChoices = document.querySelectorAll('.rpc-choose img');
        playerChoices.forEach(choice => {
            choice.addEventListener('click', this.handlePlayerChoice.bind(this));
        });
    },

    startGame() {
        document.querySelector('.hero').style.display = 'none';
        document.querySelector('.game').style.display = 'flex';

        this.startShuffle();
        this.startCountdown();
    },

    startShuffle() {
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

    startCountdown() {
        gameModel.counter = 20;

        this.countdownInterval = setInterval(() => {
            gameView.updateCountdown(gameModel.counter);

            if (gameModel.counter === 0) {
                this.handleTimeOut();
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
            gameView.showResultMessage('Game over!');
            this.resetGame();
        } else {
            if (gameView.confirmNextRound()) {
                this.nextRound();
            }
        }
    },

    handlePlayerChoice(event) {
        const playerChoice = event.target.alt;
        this.stopShuffle();
        clearInterval(this.countdownInterval);

        const computerChoice = this.getComputerChoice();
        gameView.showPlayerChoice(playerChoice);
        gameView.showComputerChoice(computerChoice);

        const winner = gameModel.determineWinner(playerChoice, computerChoice);
        if (winner === 'player') {
            gameView.showResultMessage('You won this round!');
        } else if (winner === 'computer') {
            gameView.showResultMessage('You lost this round!');
        } else {
            gameView.showResultMessage('It\'s a draw!');
        }

        if (gameModel.isGameOver()) {
            gameView.showResultMessage('Game over!');
            this.resetGame();
        } else {

            if (gameView.confirmNextRound())
                this.nextRound();

        }
    },

    getComputerChoice() {
        return Array.from(gameView.computerChoiceImages).find(
            img => !img.classList.contains('hidden')
        ).alt;
    },

    resetGame() {
        gameModel.resetGame();
        gameView.resetUI();
        this.startShuffle();
        this.startCountdown();
    },

    nextRound() {
        gameModel.counter = 20;
        gameView.updateCountdown(gameModel.counter);
        this.startShuffle();
        this.startCountdown();
    }
};

// Initialize the game controller
gameController.init();
