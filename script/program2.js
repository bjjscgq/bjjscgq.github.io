let requestUrl = "json/大富翁.json";
let request = new XMLHttpRequest();
request.open('GET', requestUrl);
request.send(null);/*不发送数据到服务器*/
request.onload = function () {/*XHR对象获取到返回信息后执行*/
    alert("1");
    if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
        var json = JSON.parse(request.responseText);
        alert(json);
    }
}