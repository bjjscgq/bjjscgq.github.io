let requestUrl = "json/大富翁.json";
let request = new XMLHttpRequest();
request.open('GET', requestUrl);
request.send(null); /*不发送数据到服务器*/
var json;
request.onload = function() { /*XHR对象获取到返回信息后执行*/
    if (request.status == 200) { /*返回状态为200，即为数据获取成功*/
        json = JSON.parse(request.responseText);
    }
}

function find() {
    var index = parseInt(document.getElementById("in").value) - 1;
    document.getElementById("question").value = json.daFuWeng[index].question;
    document.getElementById("answer").value = json.daFuWeng[index].answer;
}