//参考文献：https://www.cnblogs.com/zhaoyu1995/p/6067762.html
let requestUrl = "json/英汉.json";
let request = new XMLHttpRequest();
request.open('GET', requestUrl);
request.send(null); /*不发送数据到服务器*/
var json;
var words;
request.onload = function() { /*XHR对象获取到返回信息后执行*/
    if (request.status == 200) { /*返回状态为200，即为数据获取成功*/
        json = JSON.parse(request.responseText);
        words = json.words;
    }
}
//窗口尺寸改变响应（修改canvas大小）
function resizeCanvas() {
    $("#program3").attr("width", $(window).get(0).innerWidth);
    $("#program3").attr("height", $(window).get(0).innerHeight);
};
function bigCanvas(){
    $("#program3").attr("width", $(window).get(0).innerWidth);
    $("#program3").attr("height", $(window).get(0).innerHeight*(parseInt(words.length/10)+1));
}
window.onload = function() {
    //$(window).resize(resizeCanvas);
    //页面加载后先设置一下canvas大小
    resizeCanvas();
    String.prototype.padLeft =
        Number.prototype.padLeft = function(total, pad) {
            return (Array(total).join(pad || 0) + this).slice(-total);
        }
    //获取画布以及context
    var canvas = document.getElementById("program3");
    var context = canvas.getContext("2d");
    var lastframe = 0; //上一次刷新的时间
    var fpstime = 0; //帧时间
    var framecount = 0; //帧数
    var fps = 0; //每秒传输帧数
    var gamemode = 0; //游戏模式，0表示主菜单，1表示看题库，2表示英译汉，3表示汉译英
    /*var itemArray = new Array;
    for (var i = 0; i < 54; i++)
        itemArray[i] = i + 1;
    itemArraySorted = itemArray.sort(function() { return 0.5 - Math.random(); });
    var goldCoin = {
        img: gold,
        width: squareWidth,
        ids: itemArraySorted.slice(0, 16)
    };
    var silverCoin = {
        img: silver,
        width: parseInt(squareWidth / 3 * 2),
        ids: itemArraySorted.slice(16, 44)
    };
    var noCoin = {
        img: square,
        width: squareWidth,
        ids: itemArraySorted.slice(44, 55)
    };*/
    var KTK = {
        x: 20,
        y: 86,
        width: canvas.width - 40,
        height: (canvas.height - 100) / 3 - 10
    };//看题库

    var YYH = {
        x: 20,
        y: 86 + KTK.height + 20,
        width: canvas.width - 40,
        height: (canvas.height - 100) / 3 - 10
    };//英译汉
    var HYY = {
        x: 20,
        y: 86 + 2*(YYH.height + 20),
        width: canvas.width - 40,
        height: (canvas.height - 100) / 3 - 10
    };//汉译英
    //游戏平面
    var level = {
        x: 1,
        y: 65,
        width: canvas.width - 2,
        height: canvas.height - 66
    };


    //初始化游戏，监听鼠标
    function init() {
        canvas.addEventListener("mousemove", onMouseMove); //鼠标移动
        canvas.addEventListener("mousedown", onMouseDown); //鼠标按下
        canvas.addEventListener("mouseup", onMouseUp); //鼠标抬起
        canvas.addEventListener("mouseout", onMouseOut);
        //进入主循环
        main(0);
    }

    //主循环
    function main(tframe) {
        //递归调用main
        window.requestAnimationFrame(main);

        //刷新游戏
        update(tframe);

        //渲染
        render();
        //判断游戏是否结束

    }

    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;

        //更新fps
        updateFps(dt);
    }

    function updateFps(dt) {
        if (fpstime > 1) {
            //每1s计算一次帧数
            fps = Math.round(framecount / fpstime);
            //重置帧数
            fpstime = 0;
            framecount = 0;
        }
        fpstime += dt;
        framecount++;
    }

    function render() {
        drawFrame();
    }

    function drawFrame() {
        //背景、边界
        context.fillStyle = "#d0d0d0";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#e8eaec";
        context.fillRect(1, 1, canvas.width - 2, canvas.height - 2);

        //标题头
        context.fillStyle = "#303030";
        context.fillRect(0, 0, canvas.width, 65);
        context.fillStyle = "#fff";
        context.font = "24px 宋体";
        context.fillText("背英语", 10, 30);

        //显示帧数
        context.fillStyle = "#fff";
        context.font = "12px TimesNewRoman";
        context.fillText("Fps: " + fps, 13, 50);
        switch (gamemode) {
            case 0:
                context.fillStyle = "black";
                context.fillRect(KTK.x, KTK.y, KTK.width, KTK.height);
                context.fillRect(YYH.x, YYH.y, YYH.width, YYH.height);
                context.fillRect(HYY.x, HYY.y, HYY.width, HYY.height);
                context.fillStyle = "white";
                context.font = "100px 幼圆";
                context.fillText("看题库", canvas.width / 2 - 150, KTK.y + 100);
                context.fillText("英译汉", canvas.width / 2 - 150, YYH.y + 100);
                context.fillText("汉译英", canvas.width / 2 - 150, HYY.y + 100);
                break;
            case 1:
                context.fillStyle = "black";
                context.font = "24px 幼圆";    
                for(var i = 0; i<words.length;i++){
                    context.fillText(words[i].English, 40, 86+parseInt($(window).get(0).innerHeight/10)*(i+1));
                    context.fillText(words[i].Chinese, 40, 86+28+parseInt($(window).get(0).innerHeight/10)*(i+1));
                }
                break;
        }
    }


    function onMouseMove(e) {}

    function onMouseDown(e) {}

    function onMouseUp(e) {
        if (gamemode == 0) {
            var pos = getMousePos(canvas, e);
            if (pos.x >= KTK.x && pos.x < KTK.x + KTK.width &&
                pos.y >= KTK.y && pos.y < KTK.y + KTK.height) {
                gamemode = 1;
                bigCanvas();
            } else if (pos.x >= YYH.x && pos.x < YYH.x + YYH.width &&
                pos.y >= YYH.y && pos.y < YYH.y + YYH.height) {
                gamemode = 2;
            } else if (pos.x >= HYY.x && pos.x < HYY.x + HYY.width &&
                pos.y >= HYY.y && pos.y < HYY.y + HYY.height) {
                gamemode = 3;
            }
        } else if (gamemode == 1) {

        } else{
            var pos = getMousePos(canvas, e);
            var X = parseInt((pos.x - 1) / 58);
            var Y = parseInt((pos.y - 65) / 58);
            var id = X * 5 + Y;
            var ableIds;
            if ([1, 2, 3].includes(peopleId))
                ableIds = [peopleId + 1, peopleId - 1, peopleId + 5];
            else if ([5, 10, 15, 20, 25, 30, 35, 40, 45].includes(peopleId))
                ableIds = [peopleId + 1, peopleId + 5, peopleId - 5];
            else if ([51, 52, 53].includes(peopleId))
                ableIds = [peopleId + 1, peopleId - 1, peopleId - 5];
            else if ([9, 14, 19, 24, 29, 34, 39, 44, 49].includes(peopleId))
                ableIds = [peopleId - 1, peopleId + 5, peopleId - 5];
            else if (peopleId == 0)
                ableIds = [peopleId + 1, peopleId + 5];
            else if (peopleId == 4)
                ableIds = [peopleId - 1, peopleId + 5];
            else if (peopleId == 50)
                ableIds = [peopleId + 1, peopleId - 5];
            else if (peopleId == 54)
                ableIds = [peopleId - 1, peopleId - 5];
            else
                ableIds = [peopleId + 1, peopleId - 1, peopleId + 5, peopleId - 5];
            var union = goldCoin.ids.concat(silverCoin.ids.filter(v => !goldCoin.ids.includes(v)));
            union = union.concat(noCoin.ids.filter(v => !union.includes(v)));
            var intersection = union.filter(v => ableIds.includes(v));
            var index;
            if (goldCoin.ids.includes(id) && ableIds.includes(id)) {
                index = goldCoin.ids.findIndex(e => e == id);
                goldCoin.ids.splice(index, 1);
                dollar += 50;
                step = step - 1;
                peopleId = id;
            } else if (silverCoin.ids.includes(id) && ableIds.includes(id)) {
                index = silverCoin.ids.findIndex(e => e == id);
                silverCoin.ids.splice(index, 1);
                dollar += 10;
                step = step - 1;
                peopleId = id;
            } else if (noCoin.ids.includes(id) && ableIds.includes(id)) {
                index = noCoin.ids.findIndex(e => e == id);
                noCoin.ids.splice(index, 1);
                step = step - 1;
                peopleId = id;
            }
            if ((step == 0) || (!intersection.length)) {
                gamemode = 1;
            }
        }
    }

    function onMouseOut(e) {}

    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
            y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
        };
    }

    init();
}