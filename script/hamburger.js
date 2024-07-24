let hamburgerOpen = document.querySelector('.hamburgerMenu')
let hamburgerClose = document.querySelector('.hamburgerClose')

hamburgerOpen.addEventListener('click', () => {
    document.querySelector('.left').style.left = '0%';
})

hamburgerClose.addEventListener('click', () => {
    document.querySelector('.left').style.left = '-5000%';
})


// Convert Seconds to Minutes
function secondstoMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    let minutesStr = minutes.toString().padStart(2, '0');
    let secondsStr = remainingSeconds.toFixed(0).padStart(2, '0');
    return `${minutesStr}:${secondsStr}`;
}