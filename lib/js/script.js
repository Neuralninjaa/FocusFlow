// script.js
const timerDisplay = document.querySelector('.timer');
const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');
const resetButton = document.querySelector('.reset-button');
const modeButtons = document.querySelectorAll('.mode-button');
const fullscreenButton = document.querySelector('.fullscreen-button');
const exitFullscreenButton = document.querySelector('.exit-fullscreen-button');
const controls = document.querySelector('.controls');
const buttons = document.querySelector('.buttons');

let timer = 25 * 60; // Varsayılan olarak 25 dakika
let intervalId;
let isRunning = false;
let hideTimeout; // Mouse hareket etmediğinde butonları gizlemek için kullanacağız

function updateTimer() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    intervalId = setInterval(() => {
        if (timer <= 0) {
            clearInterval(intervalId);
            isRunning = false;
            startButton.disabled = false;
            return;
        }
        timer--;
        updateTimer();
    }, 1000);
    startButton.disabled = true;
}

function stopTimer() {
    clearInterval(intervalId);
    isRunning = false;
    startButton.disabled = false;
}

function resetTimer() {
    clearInterval(intervalId);
    isRunning = false;
    timer = 25 * 60; // Varsayılan olarak 25 dakika
    updateTimer();
    startButton.disabled = false;
}

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.getAttribute('data-mode');
        switch (mode) {
            case 'pomodoro':
                timer = 25 * 60; // Pomodoro süresi
                break;
            case 'short-break':
                timer = 5 * 60;  // Kısa mola süresi
                break;
            case 'long-break':
                timer = 10 * 60; // Uzun mola süresi
                break;
        }
        if (!isRunning) {
            updateTimer();
        }
    });
});

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            document.body.classList.add('fullscreen-mode');
            fullscreenButton.style.display = 'none'; // Tam ekran butonunu gizle
            exitFullscreenButton.style.display = 'block'; // Çıkış butonunu göster
        }).catch(err => {
            console.log(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen().then(() => {
            document.body.classList.remove('fullscreen-mode');
            fullscreenButton.style.display = 'block'; // Tam ekran butonunu göster
            exitFullscreenButton.style.display = 'none'; // Çıkış butonunu gizle
        }).catch(err => {
            console.log(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
        });
    }
});

exitFullscreenButton.addEventListener('click', () => {
    document.exitFullscreen().then(() => {
        document.body.classList.remove('fullscreen-mode');
        fullscreenButton.style.display = 'block'; // Tam ekran butonunu göster
        exitFullscreenButton.style.display = 'none'; // Çıkış butonunu gizle
    }).catch(err => {
        console.log(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
    });
});

let mouseMoveTimeout;

document.addEventListener('mousemove', () => {
    // Mouse hareket ettiğinde butonları göster
    document.querySelector('.controls').classList.add('visible');
    document.querySelector('.buttons').classList.add('visible');
    document.querySelector('.exit-fullscreen-button').classList.add('visible');

    // Mouse hareket durduktan sonra butonları tekrar gizle
    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
        document.querySelector('.controls').classList.remove('visible');
        document.querySelector('.buttons').classList.remove('visible');
        document.querySelector('.exit-fullscreen-button').classList.remove('visible');
    }, 2000); // 2 saniye sonra butonlar tekrar gizlenecek
});

