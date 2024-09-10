const timerDisplay = document.querySelector('.timer');
const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');
const resetButton = document.querySelector('.reset-button');
const setTimeButton = document.querySelector('.set-time-button');
const timeButtons = document.querySelectorAll('.time-button');
const fullscreenButton = document.querySelector('.fullscreen-button');
const exitFullscreenButton = document.querySelector('.exit-fullscreen-button');
const controls = document.querySelector('.controls');
const buttons = document.querySelector('.buttons');
const minutesInput = document.getElementById('minutesInput');

let timer = 0; // Varsayılan olarak 0 saniye
let lastSetTime = 0; // En son ayarlanan zamanı saklayacak
let intervalId;
let isRunning = false;

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
    timer = lastSetTime; // Zamanlayıcıyı en son ayarlanan değere sıfırla
    updateTimer();
    startButton.disabled = false;
}

setTimeButton.addEventListener('click', () => {
    let minutes = parseInt(minutesInput.value, 10);
    if (isNaN(minutes) || minutes <= 0) {
        alert('Lütfen geçerli bir dakika değeri girin.');
        return;
    }
    lastSetTime = minutes * 60; // En son ayarlanan süreyi sakla
    timer = lastSetTime;
    if (!isRunning) {
        updateTimer();
    }
});

timeButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (isRunning) {
            stopTimer(); // Zamanlayıcı başlatıldıysa durdur
        }
        lastSetTime = parseInt(button.getAttribute('data-time'), 10); // En son ayarlanan süreyi güncelle
        timer = lastSetTime;
        updateTimer(); // Yeni zaman ayarını güncelle
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
    }, 2000); // 2 saniye sonra butonlar tekrar gizlenir
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
    }
});
