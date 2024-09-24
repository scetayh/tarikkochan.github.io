function submit() {
    var testerName = document.getElementById("testerName").value;
    var testerUnit = document.getElementById("testerUnit").value;

    if (window.confirm("确认提交答卷？\n确认后将不允许更改任何答案。")) {
        while (testerName == null || testerName == "") {
            testerName = prompt("姓名不可为空。请检查你输入的字符并再次提交。")
        }

        while (testerUnit == null || testerUnit == "") {
            testerUnit = prompt("单位不可为空。请检查你输入的字符并再次提交。")
        }

        var fraction = 0;

        var questionSingleAll = document.getElementsByClassName("questionSingle");
        // for i in every single questions
        for (var i = 1; i <= questionSingleAll.length; i++) {
            var answerSingle = document.getElementsByName("answer" + (i));
            // for j in every options
            for (var j = 0; j < answerSingle.length; j++) {
                // if correct
                if (answerSingle[j].value == "correct") {
                    // if checked, fraction+ed+
                    if (answerSingle[j].checked) {
                        fraction++;
                    }
                    // if not check, break circulation j
                    else {
                        break;
                    }
                }
                // if incorrect
                else {
                    // if checked, break circulation j
                    if (answerSingle[j].checked) {
                        break;
                    }
                    // if not checked, continue
                }
            }
        }

        //var questionMultipleAll = document.getElementsByClassName("questionMultiple");
        // for i in every multiple questions
        //for (var i = 1; i <= questionMultipleAll.length; i++) {
            //var answerMultiple = document.getElementsByName("amswer" + (i));
            // fot j in every options
            
        //}

        var dateEnd = new Date();
        var timestampEnd = dateEnd.getTime();
        var timestampDuration = timestampEnd - timestampStart;
        
        while (true) {
            alert("☆ 测试结果\n\n姓名　" + testerName + "\n单位　" + testerUnit + "\n\n开始时间　" + dateStart.toLocaleString() + "\n结束时间　" + dateEnd.toLocaleString() + "\n用时　" + parseInt(timestampDuration / 1000 / 60) + "分钟\n\n分数　" + fraction + "\n\n截图或拍摄本页以存储测试记录。");
        }
    }
    else {
        return false;
    }
}