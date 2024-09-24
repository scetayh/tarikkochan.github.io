function countDown() {
    var diffSec = (targetTime.getTime() - Date.now()) / 1000;
    return {
        min: parseInt(diffSec / 60 % 60),
        sec: Math.round(diffSec % 60)
    }
}

function renderCountDown() {
    var res = countDown();
    minEle.innerHTML = addZero(res.min);
    secEle.innerHTML = addZero(res.sec);
}

function addZero(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num;
}