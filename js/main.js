const primaryBtn = document.getElementById("primary");
const questionText = document.getElementById("question-text");
const buttonContainer = document.getElementById("button-container");
const gifContent = document.getElementById("gift-content");

const yesGifs = [
    "assets/yes/1.gif",
    "assets/yes/2.gif"
];

const noGifs = [
    "assets/no/1.gif",
    "assets/no/2.gif",
    "assets/no/3.gif",
    "assets/no/4.gif",
    "assets/no/5.gif",
];

let currentGif = "";
let noClickCount = 0;
let yesButtonWidth = 150;
const maxYesWidth = 180;
const yesGrowthRate = 2;

function getRandomGif(gifsArray) {
    let newGif;
    do {
        newGif = gifsArray[Math.floor(Math.random() * gifsArray.length)];
    } while (newGif === currentGif && gifsArray.length > 1);
    return newGif;
}

function changeGif(gifsArray) {
    const newGif = getRandomGif(gifsArray);
    gifContent.src = newGif;
    currentGif = newGif;
}

function moveNoButtonAway() {
    const noBtn = document.getElementById("secondary");
    const yesBtn = document.getElementById("primary");
    if (!noBtn || !yesBtn) return;
    
    noBtn.style.position = 'fixed';
    
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    
    const isMobile = window.innerWidth < 600;
    const minDistance = isMobile ? 200 : 250;
    const padding = 10;
    
    let randomX, randomY, distance;
    let attempts = 0;
    
    do {
        randomX = Math.random() * (window.innerWidth - btnWidth - padding * 2) + padding;
        randomY = Math.random() * (window.innerHeight - btnHeight - padding * 2) + padding;
        
        const noBtnCenterX = randomX + btnWidth / 2;
        const noBtnCenterY = randomY + btnHeight / 2;
        const yesBtnCenterX = yesBtnRect.left + yesBtnRect.width / 2;
        const yesBtnCenterY = yesBtnRect.top + yesBtnRect.height / 2;
        
        distance = Math.sqrt(
            Math.pow(noBtnCenterX - yesBtnCenterX, 2) + 
            Math.pow(noBtnCenterY - yesBtnCenterY, 2)
        );
        
        attempts++;
    } while (distance < minDistance && attempts < 50);
    
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

function growYesButton() {
    const yesBtn = document.getElementById("primary");
    if (!yesBtn) return;
    
    if (yesButtonWidth < maxYesWidth) {
        yesButtonWidth += yesGrowthRate;
        yesBtn.style.minWidth = yesButtonWidth + 'px';
    }
}

function avoidMouse(event) {
    const noBtn = document.getElementById("secondary");
    if (!noBtn || noClickCount < 6) return;
    
    let clientX, clientY;
    
    if (event.type === 'touchmove' || event.type === 'touchstart') {
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            return;
        }
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    
    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    const distance = Math.sqrt(
        Math.pow(clientX - btnCenterX, 2) + 
        Math.pow(clientY - btnCenterY, 2)
    );
    
    const threshold = window.innerWidth < 600 ? 120 : 100;
    
    if (distance < threshold) {
        moveNoButtonAway();
    }
}

function getQuestionText() {
    if (noClickCount === 0) {
        return "Will you be my valentine?";
    } else if (noClickCount <= 6) {
        return "Please ".repeat(noClickCount) + " be my valentine?";
    } else {
        return "Please be my valentine?";
    }
}

function showValentineQuestion() {
    gifContent.src = "assets/no/2.gif";
    questionText.textContent = "Will you be my valentine?";
    
    buttonContainer.innerHTML = `
        <button id="primary">Yes</button>
        <button id="secondary">No</button>
    `;
    
    const yesBtn = document.getElementById("primary");
    const noBtn = document.getElementById("secondary");
    
    yesBtn.style.minWidth = yesButtonWidth + 'px';
    
    document.addEventListener('mousemove', avoidMouse);
    document.addEventListener('touchmove', avoidMouse, { passive: true });
    document.addEventListener('touchstart', avoidMouse, { passive: true });
    
    yesBtn.addEventListener("click", function() {
        changeGif(yesGifs);
        questionText.textContent = "Are you available tomorrow? heheh";
        document.removeEventListener('mousemove', avoidMouse);
        document.removeEventListener('touchmove', avoidMouse);
        document.removeEventListener('touchstart', avoidMouse);
        
        if (noBtn) {
            noBtn.style.display = 'none';
        }
        
        yesBtn.textContent = "Yes!";
        
        yesBtn.addEventListener("click", function() {
            questionText.textContent = "Okayy, See you tomorrow then";
            yesBtn.textContent = "Okay!";
            yesBtn.disabled = true;
        }, { once: true });
    });
    
    noBtn.addEventListener("click", function() {
        noClickCount++;
        changeGif(noGifs);
        questionText.textContent = getQuestionText();
        growYesButton();
        moveNoButtonAway();
    });
}

const HEART_COUNT = 15;
const MIN_DURATION = 8;
const MAX_DURATION = 16;
const MIN_SIZE = 18;
const MAX_SIZE = 42;
const SPAWN_INTERVAL = 800;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤️';

    const duration = random(MIN_DURATION, MAX_DURATION);
    const size = random(MIN_SIZE, MAX_SIZE);
    const left = random(0, 100);

    const drift = random(-60, 60);
    const rotation = random(-30, 30);

    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;

    heart.style.setProperty('--drift', `${drift}px`);
    heart.style.setProperty('--rotation', `${rotation}deg`);

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), duration * 1000);
}

for (let i = 0; i < HEART_COUNT; i++) {
    setTimeout(createHeart, i * 200);
}

setInterval(createHeart, SPAWN_INTERVAL);

primaryBtn.addEventListener('click', showValentineQuestion);