//Welcome page hero section
const hero = document.querySelector('.hero');
const hero_btn = document.getElementById('heroBtn');
//game section
const game = document.querySelector('.game');
const rock = document.getElementById('rock');
const paper = document.getElementById('paper');
const scissors = document.getElementById('scissors');



// Hide hero section when button is clicked
hero_btn.addEventListener('click', () => {
    hero.style.display = 'none';
    game.style.display = 'flex';
    console.log('hero button clicked');
});