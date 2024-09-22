var dateStart = new Date();
var timestampStart = dateStart.getTime();

setTimeout(() => {
    alert("作答时间到。请查看你的结果。")
    while (true) {
        terminate();
    }
}, totalTime * 60 * 1000);