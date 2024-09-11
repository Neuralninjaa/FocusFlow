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
let mouseMoveTimeout;
const overlay = document.querySelector('.overlay');

// Titreşim işlevini tanımlayın
function vibrateDevice() {
    if ("vibrate" in navigator) {
        // Destekleniyorsa, titreşimi başlat
        navigator.vibrate([200]); 
    } else {
        console.log("Titreşim özelliği bu cihazda desteklenmiyor.");
    }
}

// Ses dosyasını tanımlayın
function playEndSound() {
    if (typeof endSound !== 'undefined') {
        endSound.play(); // Ses dosyasını çal
    }
    vibrateDevice(); // Titreşimi başlat
}

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
            overlay.style.opacity = 1; // Overlay görünür hale gelir
            
            playEndSound();
            setTimeout(() => {
                overlay.style.opacity = 0; // Overlay gizlenir
            }, 1000); // 3 saniye sonra animasyon kaldırılır

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

function toggleFullscreen() {
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
}

function handleKeydown(e) {
    if (e.key === 'Enter') {
        if (document.activeElement === minutesInput) {
            // Eğer input üzerinde odaklanmışsa (focus) setTimeButton tıklanır
            setTimeButton.click();
        } else if (document.fullscreenElement) {
            // Tam ekran modundaysa tam ekran modundan çıkma
            document.exitFullscreen().then(() => {
                document.body.classList.remove('fullscreen-mode');
                fullscreenButton.style.display = 'block'; // Tam ekran butonunu göster
                exitFullscreenButton.style.display = 'none'; // Çıkış butonunu gizle
            }).catch(err => {
                console.log(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
            });
        } else {
            // Tam ekran modunda değilse tam ekran moduna geçiş
            document.documentElement.requestFullscreen().then(() => {
                document.body.classList.add('fullscreen-mode');
                fullscreenButton.style.display = 'none'; // Tam ekran butonunu gizle
                exitFullscreenButton.style.display = 'block'; // Çıkış butonunu göster
            }).catch(err => {
                console.log(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
            });
        }
    } else if (e.key === ' ') {
        // Boşluk tuşu ile başlat/durdur
        isRunning ? stopTimer() : startTimer();
    } else if (e.key === 'r') {
        // 'r' tuşu ile sıfırlama
        resetTimer();
    } else if (e.key === 'Escape' && document.fullscreenElement) {
        // Escape tuşuna basıldığında tam ekrandan çık
        document.exitFullscreen().then(() => {
            document.body.classList.remove('fullscreen-mode');
            fullscreenButton.style.display = 'block'; // Tam ekran butonunu göster
            exitFullscreenButton.style.display = 'none'; // Çıkış butonunu gizle
        }).catch(err => {
            console.log(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
        });
    } else if (e.key >= '1' && e.key <= '6') {
        // 1-6 tuşları ile süre ayarlama
        const timeValues = [600, 900, 1800, 2700, 3600, 5400];
        const index = parseInt(e.key, 10) - 1;
        document.querySelector(`[data-time="${timeValues[index]}"]`).click();
    }
}

function handleFocus() {
    timeButtons.forEach(button => button.disabled = true);
    setTimeButton.disabled = false; // Set butonunu etkinleştir
}

function handleBlur() {
    timeButtons.forEach(button => button.disabled = false);
}

// Event Listeners
setTimeButton.addEventListener('click', () => {
    let minutes = parseInt(minutesInput.value, 10);
    if (isNaN(minutes) || minutes <= 0) {
        alert('Lütfen geçerli bir dakika değeri girin.');
        return;
    }
    lastSetTime = minutes * 60; // En son ayarlanan süreyi sakla
    timer = lastSetTime;
    updateTimer(); // Yeni zaman ayarını güncelle

    if (isRunning) {
        stopTimer(); // Zamanlayıcı çalışıyorsa durdur
    }

    minutesInput.blur(); // Input kutusundan imleci çıkar
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

fullscreenButton.addEventListener('click', toggleFullscreen);
exitFullscreenButton.addEventListener('click', () => {
    document.exitFullscreen().then(() => {
        document.body.classList.remove('fullscreen-mode');
        fullscreenButton.style.display = 'block'; // Tam ekran butonunu göster
        exitFullscreenButton.style.display = 'none'; // Çıkış butonunu gizle
    }).catch(err => {
        console.log(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
    });
});

document.addEventListener('mousemove', () => {
    // Mouse hareket ettiğinde butonları göster
    controls.classList.add('visible');
    buttons.classList.add('visible');
    exitFullscreenButton.classList.add('visible');

    // Mouse hareket durduktan sonra butonları tekrar gizle
    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
        controls.classList.remove('visible');
        buttons.classList.remove('visible');
        exitFullscreenButton.classList.remove('visible');
    }, 2000); // 2 saniye sonra butonlar tekrar gizlenir
});

document.addEventListener('keydown', handleKeydown);
minutesInput.addEventListener('focus', handleFocus);
minutesInput.addEventListener('blur', handleBlur);
