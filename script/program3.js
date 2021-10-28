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
    $("#program3").attr("height", $(window).get(0).innerHeight*(parseInt(words.length/10)+2));
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
    var wordsArraySorted;// = words.sort(function() { return 0.5 - Math.random(); });
    var wordsLearned = new Array;
    var wordsUnLearned = new Array;
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
    var FHZCD;
    //游戏平面
    var level = {
        x: 1,
        y: 65,
        width: canvas.width - 2,
        height: canvas.height - 66
    };
    //YYH单词序号
    var indexYYH = 0;
    var indexHYY = 0;
    var wordLearning;
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
                context.fillText("看题库", canvas.width / 2 - 150, KTK.y + KTK.height/2+ 35);
                context.fillText("英译汉", canvas.width / 2 - 150, YYH.y + YYH.height/2+ 35);
                context.fillText("汉译英", canvas.width / 2 - 150, HYY.y + HYY.height/2+ 35);
                break;
            case 1:
                context.fillStyle = "black";
                context.font = "24px 幼圆";    
                for(var i = 0; i<words.length;i++){
                    context.fillText(words[i].English, 40, 86+parseInt($(window).get(0).innerHeight/10)*(i+1));
                    context.fillText(words[i].Chinese, 40, 86+28+parseInt($(window).get(0).innerHeight/10)*(i+1));
                }
                FHZCD = {
                    x: 20,
                    y: 86+28+parseInt($(window).get(0).innerHeight/10)*(words.length+1),
                    width: canvas.width - 40,
                    height: 200
                };//返回主菜单
                context.fillStyle = "black";
                context.fillRect(FHZCD.x, FHZCD.y, FHZCD.width, FHZCD.height);
                context.fillStyle = "white";
                context.font = "100px 幼圆";
                context.fillText("返回主菜单", canvas.width / 2 - 250, FHZCD.y +FHZCD.height/2+ 35);
                break;
            case 2:
                if(wordsUnLearned.length==0){
                    context.fillStyle = "black";
                    context.font = "24px 幼圆";    
                    context.fillText("这组的30个背完了", canvas.width / 2 - 12*9, 86+28);
                    FHZCD = {
                        x: 20,
                        y: 86 + 2*(YYH.height + 20),
                        width: canvas.width - 40,
                        height: (canvas.height - 100) / 3 - 10
                    };//返回主菜单
                    context.fillStyle = "black";
                    context.fillRect(FHZCD.x, FHZCD.y, FHZCD.width, FHZCD.height);
                    context.fillStyle = "white";
                    context.font = "100px 幼圆";
                    context.fillText("返回主菜单", canvas.width / 2 - 250, FHZCD.y +FHZCD.height/2+ 35);
                }
                else{
                    context.fillStyle = "black";
                    context.font = "50px TimesNewRoman";    
                    context.fillText(wordLearning.English, canvas.width / 2 - 25*(wordLearning.English.length), 86+28);
                }
                break;
            case 3:
                wordsArraySorted = words.sort(function() { return 0.5 - Math.random(); });
                if(wordsUnLearned.length==0){
                    context.fillStyle = "black";
                    context.font = "24px 幼圆";    
                    context.fillText("这组的30个背完了", canvas.width / 2 - 12*9, 86+28);
                    FHZCD = {
                        x: 20,
                        y: 86 + 2*(YYH.height + 20),
                        width: canvas.width - 40,
                        height: (canvas.height - 100) / 3 - 10
                    };//返回主菜单
                    context.fillStyle = "black";
                    context.fillRect(FHZCD.x, FHZCD.y, FHZCD.width, FHZCD.height);
                    context.fillStyle = "white";
                    context.font = "100px 幼圆";
                    context.fillText("返回主菜单", canvas.width / 2 - 250, FHZCD.y +FHZCD.height/2+ 35);
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
                wordsArraySorted = words.sort(function() { return 0.5 - Math.random(); });
                for(var i = 0; i<30;i++){
                    wordsUnLearned[i] = wordsArraySorted[indexYYH++];
                }
                wordLearning = wordsUnLearned.pop();
            } else if (pos.x >= HYY.x && pos.x < HYY.x + HYY.width &&
                pos.y >= HYY.y && pos.y < HYY.y + HYY.height) {
                gamemode = 3;
                wordsArraySorted = words.sort(function() { return 0.5 - Math.random(); });
                for(var i = 0; i<30;i++){
                    wordsUnLearned[i] = wordsArraySorted[indexHYY++];
                }
                wordLearning = wordsUnLearned.pop();
            }
        } else if (gamemode == 1) {
            var pos = getMousePos(canvas, e);
            if (pos.x >= FHZCD.x && pos.x < FHZCD.x + FHZCD.width &&
                pos.y >= FHZCD.y && pos.y < FHZCD.y + FHZCD.height) {
                gamemode = 0;
                resizeCanvas();
            }
        } else if (gamemode == 2) {
            var pos = getMousePos(canvas, e);
            if (pos.x >= FHZCD.x && pos.x < FHZCD.x + FHZCD.width &&
                pos.y >= FHZCD.y && pos.y < FHZCD.y + FHZCD.height) {
                gamemode = 0;
                resizeCanvas();
            }
        } else if (gamemode == 3) {
            var pos = getMousePos(canvas, e);
            if (pos.x >= FHZCD.x && pos.x < FHZCD.x + FHZCD.width &&
                pos.y >= FHZCD.y && pos.y < FHZCD.y + FHZCD.height) {
                gamemode = 0;
                resizeCanvas();
            }
        } else{
            
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