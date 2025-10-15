// Score & storage
let score = JSON.parse(localStorage.getItem('score')) || {wins:0, losses:0, ties:0};
let highScore = parseInt(localStorage.getItem('highScore')) || 0;
let totalGames = score.wins + score.losses + score.ties;
let gameHistory = [];
updateScore(); updateHighScore(); updateTotal(); updateHistory();

// Play game
function playGame(playerMove){
    const computerMoveEl = document.querySelector('.moves');
    const resultEl = document.querySelector('.result');
    const difficulty = document.getElementById('difficulty').value;
    const moves = ['rock','paper','scissors'];
    let i=0;
    const interval = setInterval(()=>{
        computerMoveEl.textContent = `You ${getEmoji(playerMove)} - ${getEmoji(moves[i])} CPU`;
        i=(i+1)%3;
    },150);

    setTimeout(()=>{
        clearInterval(interval);
        const computerMove = pickComputerMove(difficulty, playerMove);
        let result='';
        if(playerMove==='scissors') result = (computerMove==='rock')?'You lose 😢':(computerMove==='paper')?'You win 🎉':'Tie 🤝';
        else if(playerMove==='paper') result = (computerMove==='rock')?'You win 🎉':(computerMove==='paper')?'Tie 🤝':'You lose 😢';
        else result = (computerMove==='rock')?'Tie 🤝':(computerMove==='paper')?'You lose 😢':'You win 🎉';

        // Play sounds + confetti
        if(result.includes('win')){
            document.getElementById('winSound').play();
            confetti({particleCount:150,spread:100,colors:['#ff6b6b','#feca57','#48dbfb','#1dd1a1','#ff9ff3']});
        } else if(result.includes('lose')) document.getElementById('loseSound').play();
        else document.getElementById('tieSound').play();

        // Update scores
        if(result.includes('win')) score.wins++;
        else if(result.includes('lose')) score.losses++;
        else score.ties++;
        totalGames++;
        gameHistory.push(`You:${playerMove},CPU:${computerMove}`);
        if(gameHistory.length>5) gameHistory.shift();
        if(score.wins>highScore){ highScore=score.wins; localStorage.setItem('highScore', highScore); }
        localStorage.setItem('score', JSON.stringify(score));

        resultEl.textContent=result;
        resultEl.style.color=result.includes('win')?'green':result.includes('lose')?'red':'orange';
        computerMoveEl.textContent=`You ${getEmoji(playerMove)} - ${getEmoji(computerMove)} CPU`;

        updateScore(); updateHighScore(); updateTotal(); updateHistory();
    },700);
}

// Computer logic
function pickComputerMove(difficulty, playerMove){
    const rand=Math.random();
    if(difficulty==='easy'||difficulty==='medium') return ['rock','paper','scissors'][Math.floor(Math.random()*3)];
    if(difficulty==='hard'){
        if(rand<0.6){
            if(playerMove==='rock') return 'paper';
            if(playerMove==='paper') return 'scissors';
            if(playerMove==='scissors') return 'rock';
        } else return ['rock','paper','scissors'][Math.floor(Math.random()*3)];
    }
}

// Emoji helper
function getEmoji(move){ return move==='rock'?'✊':move==='paper'?'✋':'✌'; }

// Update UI
function updateScore(){ document.querySelector('.score').innerHTML =
    `<span class="badge bg-success animate-score">Wins:${score.wins}</span>
     <span class="badge bg-danger animate-score">Losses:${score.losses}</span>
     <span class="badge bg-secondary animate-score">Ties:${score.ties}</span>`; }
function updateHighScore(){ document.querySelector('.high-score').textContent = `High Score Wins: ${highScore}`; }
function updateTotal(){ document.querySelector('.total-games').textContent = `Total Games Played: ${totalGames}`; }
function updateHistory(){ document.getElementById('history-log').textContent = gameHistory.join(' | ')||'-'; }

// Reset
document.querySelector('.btn-reset').addEventListener('click', ()=>{
    score={wins:0,losses:0,ties:0}; totalGames=0; gameHistory=[];
    localStorage.removeItem('score'); localStorage.removeItem('highScore');
    updateScore(); updateHighScore(); updateTotal(); updateHistory();
});

// Theme switch
const themeSelect=document.getElementById('theme');
themeSelect.innerHTML=`<option value="theme-light">Light</option><option value="theme-dark">Dark</option><option value="theme-fun">Fun</option>`;
themeSelect.addEventListener('change', switchTheme);
function switchTheme(){
    const theme=themeSelect.value;
    document.body.className=`${theme} theme-animated`;
    document.getElementById('game').className=`game-container ${theme} theme-animated`;
}

// Button click
document.querySelectorAll('.btn-game').forEach(btn=>{
    btn.addEventListener('click', ()=>playGame(btn.textContent.split(' ')[0].toLowerCase()));
});

// Swipe gestures
let touchstartX=0,touchstartY=0,touchendX=0,touchendY=0;
const threshold=50;
document.addEventListener('touchstart', e=>{ touchstartX=e.changedTouches[0].screenX; touchstartY=e.changedTouches[0].screenY; });
document.addEventListener('touchend', e=>{
    touchendX=e.changedTouches[0].screenX; touchendY=e.changedTouches[0].screenY;
    const diffX=touchendX-touchstartX, diffY=touchendY-touchstartY;
    if(Math.abs(diffX)>Math.abs(diffY)){
        if(diffX>threshold) playGame('paper'); 
        else if(diffX<-threshold) playGame('rock'); 
    } else { if(diffY<-threshold) playGame('scissors'); }
});

// 3D pop animation for touch
document.querySelectorAll('.btn-game, .btn-reset').forEach(btn=>{
    btn.addEventListener('touchstart', ()=>{
        btn.style.transform='scale(1.2) rotateX(5deg) rotateY(5deg)';
        btn.style.boxShadow='5px 10px 20px rgba(0,0,0,0.4)';
    });
    btn.addEventListener('touchend', ()=>{
        setTimeout(()=>{
            btn.style.transform='scale(1) rotateX(0deg) rotateY(0deg)';
            btn.style.boxShadow='2px 4px 10px rgba(0,0,0,0.2)';
        },100);
    });
});

// Click name triggers confetti
document.querySelector('.developer-credit .highlight-name').addEventListener('click', ()=>{
    confetti({particleCount:200, spread:160, origin:{y:0.3}, colors:['#ff6b6b','#feca57','#48dbfb','#1dd1a1','#ff9ff3']});
});
