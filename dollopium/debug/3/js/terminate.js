function terminate() {
    var testerName = document.getElementById("testerName").value;
    var testerUnit = document.getElementById("testerUnit").value;

    if (window.confirm("确认提交答卷？\n确认后将不允许更改任何答案。")) {
        while (testerName == null || testerName == "") {
            testerName = prompt("姓名不可为空。请检查你输入的字符并再次提交。")
        }

        while (testerUnit == null || testerUnit == "") {
            testerUnit = prompt("单位不可为空。请检查你输入的字符并再次提交。")
        }

        var totalScores = 0;
        var qestions = document.getElementsByClassName("singleQuestion");

        for (var i = 0; i < qestions.length; i++) {
            var count = 0;
            var flag = 1;
            var answer = document.getElementsByName("answer" + (i + 1));

            for (var j = 0; j < answer.length; j++) {
                if (answer[j].checked) {
                    if (answer[j].value * 1 < 0) {
                        flag = 0;
                        break;
                    }
                    else
                        count += answer[j].value * 1;
                }
            }

            if (flag == 1)
                totalScores += count;
        }

        var dateEnd = new Date();
        var timestampEnd = dateEnd.getTime();
        var timestampDuration = timestampEnd - timestampStart;
        
        while (true) {
            alert("☆ 测试结果\n\n姓名　" + testerName + "\n单位　" + testerUnit + "\n\n开始时间　" + dateStart.toLocaleString() + "\n结束时间　" + dateEnd.toLocaleString() + "\n用时　" + parseInt(timestampDuration / 1000 / 60) + "分钟\n\n分数　" + totalScores + "\n\n截图或拍摄本页以存储测试记录。");
        }
    }
    else {
        return false;
    }
}