const timerDisplay = document.querySelector('.timer');
const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button'); // Stop butonunu ekleyin
const resetButton = document.querySelector('.reset-button');
const modeButtons = document.querySelectorAll('.mode-button');

let timer;
let intervalId;
let isRunning = false;

// Fonksiyonları güncelle
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

// Mod düğmelerine tıklandığında yapılacak işlemler
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

// Başlat, durdur ve sıfırla butonlarına event listener'lar ekleyin
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer); // Stop butonunu ekleyin
resetButton.addEventListener('click', resetTimer);

// Sayfa yüklendiğinde başlangıç zamanı ayarla
timer = 25 * 60; // Varsayılan olarak 25 dakika
updateTimer();
