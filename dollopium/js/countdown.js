var targetTime = new Date();
targetTime.setMinutes(targetTime.getMinutes() + totalTime);

var minEle = document.getElementById("min");
var secEle = document.getElementById("sec");

setInterval(renderCountDown, 100);