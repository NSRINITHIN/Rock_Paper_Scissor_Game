let score=JSON.parse(localStorage.getItem('score'))||{wins:0,losses:0,ties:0};
let highScore=parseInt(localStorage.getItem('highScore'))||0;
let totalGames=score.wins+score.losses+score.ties;
let gameHistory=[];

updateScore(); updateHighScore(); updateTotal(); updateHistory();

function playGame(playerMove){
const computerMoveEl=document.querySelector('.moves');
const resultEl=document.querySelector('.result');
const difficulty=document.getElementById('difficulty').value;
const moves=['rock','paper','scissors'];
let i=0;
const interval=setInterval(()=>{computerMoveEl.innerHTML=`You ${getEmoji(playerMove)} - ${getEmoji(moves[i])} CPU`;i=(i+1)%3;},150);

setTimeout(()=>{
clearInterval(interval);
const computerMove=pickComputerMove(difficulty,playerMove);
let result='';
if(playerMove==='scissors') result=(computerMove==='rock')?'You lose 😢':(computerMove==='paper')?'You win 🎉':'Tie 🤝';
else if(playerMove==='paper') result=(computerMove==='rock')?'You win 🎉':(computerMove==='paper')?'Tie 🤝':'You lose 😢';
else result=(computerMove==='rock')?'Tie 🤝':(computerMove==='paper')?'You lose 😢':'You win 🎉';

if(result.includes('win')){document.getElementById('winSound').play();confetti({particleCount:100,spread:70,origin:{y:0.6}});}
else if(result.includes('lose')) document.getElementById('loseSound').play();
else document.getElementById('tieSound').play();

if(result.includes('win')) score.wins++;
else if(result.includes('lose')) score.losses++;
else score.ties++;

totalGames++;
gameHistory.push(`You:${playerMove},CPU:${computerMove}`);
if(gameHistory.length>5) gameHistory.shift();

if(score.wins>highScore){highScore=score.wins; localStorage.setItem('highScore',highScore);}
localStorage.setItem('score',JSON.stringify(score));

resultEl.textContent=result;
resultEl.style.color=result.includes('win')?'green':result.includes('lose')?'red':'orange';
computerMoveEl.innerHTML=`You ${getEmoji(playerMove)} - ${getEmoji(computerMove)} CPU`;
updateScore(); updateHighScore(); updateTotal(); updateHistory();
},700);
}

function pickComputerMove(difficulty,playerMove){
const rand=Math.random();
if(difficulty==='easy') return ['rock','paper','scissors'][Math.floor(Math.random()*3)];
if(difficulty==='medium') return ['rock','paper','scissors'][Math.floor(Math.random()*3)];
if(difficulty==='hard'){
if(rand<0.6){if(playerMove==='rock') return 'paper'; if(playerMove==='paper') return 'scissors'; if(playerMove==='scissors') return 'rock';}
else return ['rock','paper','scissors'][Math.floor(Math.random()*3)];
}
}

function getEmoji(move){if(move==='rock') return '✊'; if(move==='paper') return '✋'; if(move==='scissors') return '✌';}
function updateScore(){document.querySelector('.score').innerHTML=`<span class="badge bg-success animate-score">Wins:${score.wins}</span> <span class="badge bg-danger animate-score">Losses:${score.losses}</span> <span class="badge bg-secondary animate-score">Ties:${score.ties}</span>`;}
function updateHighScore(){document.querySelector('.high-score').textContent=`High Score Wins: ${highScore}`;}
function updateTotal(){document.querySelector('.total-games').textContent=`Total Games Played: ${totalGames}`;}
function updateHistory(){document.getElementById('history-log').textContent=gameHistory.join(' | ')||'-';}
function resetGame(){score={wins:0,losses:0,ties:0};totalGames=0;gameHistory=[];localStorage.removeItem('score');localStorage.removeItem('highScore');updateScore();updateHighScore();updateTotal();updateHistory();}

// Theme switch
function switchTheme(){
const theme=document.getElementById('theme').value;
const game=document.getElementById('game');
document.body.className=`${theme} theme-animated`;
game.className=`game-container ${theme} theme-animated`;
}

// Full swipe gestures for all 3 moves
let touchstartX=0, touchstartY=0, touchendX=0, touchendY=0;
const threshold=50; // minimum swipe distance

document.addEventListener('touchstart', e=>{touchstartX=e.changedTouches[0].screenX; touchstartY=e.changedTouches[0].screenY;});
document.addEventListener('touchend', e=>{
touchendX=e.changedTouches[0].screenX; touchendY=e.changedTouches[0].screenY;
const diffX=touchendX-touchstartX; const diffY=touchendY-touchstartY;

if(Math.abs(diffX)>Math.abs(diffY)){ // horizontal swipe
if(diffX>threshold) playGame('paper'); // swipe right
else if(diffX<-threshold) playGame('rock'); // swipe left
}else{ // vertical swipe
if(diffY<-threshold) playGame('scissors'); // swipe up
}
});