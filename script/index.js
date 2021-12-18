function showHideUl(id) {
    var oDiv = document.getElementById(id);
    var oH = oDiv.getElementsByClassName('head')[0]; //得到h2元素 []表示索引
    var oUl = oDiv.getElementsByTagName('ul')[0];
    if (oUl.style.display == 'none') { //判断样式
        oH.innerHTML="▼"+oH.innerHTML.substring(1);
        oUl.style.display = 'block';
    } else {
        oH.innerHTML="▶"+oH.innerHTML.substring(1);
        oUl.style.display = 'none';
    }
}