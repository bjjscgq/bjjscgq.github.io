//参考文献：https://www.cnblogs.com/zhaoyu1995/p/6067762.html
let requestUrl = "json/英汉.json";
let request = new XMLHttpRequest();
request.open('GET', requestUrl);
request.send(null); /*不发送数据到服务器*/
var json;
var words;
var wordsArraySorted; // = words.sort(function() { return 0.5 - Math.random(); });
request.onload = function() { /*XHR对象获取到返回信息后执行*/
    if (request.status == 200) { /*返回状态为200，即为数据获取成功*/
        json = JSON.parse(request.responseText);
        words = json.words;
        wordsArraySorted = words.sort(function() { return 0.5 - Math.random(); });
    }
}
//窗口尺寸改变响应（修改canvas大小）
function resizeCanvas() {
    $("#program2").attr("width", $(window).get(0).innerWidth);
    $("#program2").attr("height", $(window).get(0).innerHeight);
};

function bigCanvas() {
    $("#program2").attr("width", $(window).get(0).innerWidth);
    $("#program2").attr("height", $(window).get(0).innerHeight * (parseInt(words.length / 10) + 2));
}
window.onload = function() {
    const u = navigator.userAgent;
    if(u.indexOf("MMWEBSDK")!=-1){
        $("body").empty();
        $("body").append($('<div id="weixinTip"><div class="test"><p>请点击右上角↗,选择"在浏览器中打开"</p></div></div>'));
    }
    //$(window).resize(resizeCanvas);
    //页面加载后先设置一下canvas大小
    resizeCanvas();
    String.prototype.padLeft =
        Number.prototype.padLeft = function(total, pad) {
            return (Array(total).join(pad || 0) + this).slice(-total);
        }
    //获取画布以及context
    var canvas = document.getElementById("program2");
    var context = canvas.getContext("2d");
    var lastframe = 0; //上一次刷新的时间
    var fpstime = 0; //帧时间
    var framecount = 0; //帧数
    var fps = 0; //每秒传输帧数
    var gamemode = 0; //游戏模式，0表示主菜单，1表示看题库，2表示英译汉，3表示汉译英
    var wordsLearned = new Array;
    var wordsUnLearned = new Array;
    var KTK = {
        x: 20,
        y: 86,
        width: canvas.width - 40,
        height: (canvas.height - 100) / 3 - 10
    }; //看题库
    var YYH = {
        x: 20,
        y: 86 + KTK.height + 20,
        width: canvas.width - 40,
        height: (canvas.height - 100) / 3 - 10
    }; //英译汉
    var HYY = {
        x: 20,
        y: 86 + 2 * (YYH.height + 20),
        width: canvas.width - 40,
        height: (canvas.height - 100) / 3 - 10
    }; //汉译英
    var YHL = {
        x: 20,
        y: 86 + 2 * (YYH.height + 20),
        width: (canvas.width - 40) / 4,
        height: (canvas.height - 100) / 3 - 10
    }; //爷会了
    var TJ = {
        x: canvas.width / 2 - ((canvas.width - 40) / 2 - 20) / 2,
        y: 86 + 2 * (YYH.height + 20),
        width: (canvas.width - 40) / 2 - 20,
        height: (canvas.height - 100) / 3 - 10
    }; //提交
    var YBH = {
        x: canvas.width - 20 - (canvas.width - 40) / 4,
        y: 86 + 2 * (YYH.height + 20),
        width: (canvas.width - 40) / 4,
        height: (canvas.height - 100) / 3 - 10
    }; //提交
    var FHZCD;
    var gameover = 0;
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
                context.fillText("看题库", canvas.width / 2 - 150, KTK.y + KTK.height / 2 + 35);
                context.fillText("英译汉", canvas.width / 2 - 150, YYH.y + YYH.height / 2 + 35);
                context.fillText("汉译英", canvas.width / 2 - 150, HYY.y + HYY.height / 2 + 35);
                break;
            case 1:
                context.fillStyle = "black";
                context.font = "24px 幼圆";
                for (var i = 0; i < words.length; i++) {
                    context.fillText(words[i].English, 40, 86 + parseInt($(window).get(0).innerHeight / 10) * (i + 1));
                    context.fillText(words[i].Chinese, 40, 86 + 28 + parseInt($(window).get(0).innerHeight / 10) * (i + 1));
                }
                FHZCD = {
                    x: 20,
                    y: 86 + 28 + parseInt($(window).get(0).innerHeight / 10) * (words.length + 1),
                    width: canvas.width - 40,
                    height: 200
                }; //返回主菜单
                context.fillStyle = "black";
                context.fillRect(FHZCD.x, FHZCD.y, FHZCD.width, FHZCD.height);
                context.fillStyle = "white";
                context.font = "100px 幼圆";
                context.fillText("返回主菜单", canvas.width / 2 - 250, FHZCD.y + FHZCD.height / 2 + 35);
                break;
            case 2:
                if ((wordsUnLearned.length == 0) && (!wordLearning)) {
                    context.fillStyle = "black";
                    context.font = "24px 幼圆";
                    context.fillText("这组的30个背完了", canvas.width / 2 - 12 * 9, 86 + 28);
                    gameover = 1;
                    FHZCD = {
                        x: 20,
                        y: 86 + 2 * (YYH.height + 20),
                        width: canvas.width - 40,
                        height: (canvas.height - 100) / 3 - 10
                    }; //返回主菜单
                    context.fillStyle = "black";
                    context.fillRect(FHZCD.x, FHZCD.y, FHZCD.width, FHZCD.height);
                    context.fillStyle = "white";
                    context.font = "100px 幼圆";
                    context.fillText("返回主菜单", canvas.width / 2 - 250, FHZCD.y + FHZCD.height / 2 + 35);
                } else {
                    context.fillStyle = "black";
                    context.font = "50px TimesNewRoman";
                    context.fillText(wordLearning.English, (canvas.width - 22 * (wordLearning.English.length)) / 2, 86 + 28);
                    context.fillStyle = "#fff";
                    context.font = "24px 宋体";
                    context.fillText("本轮剩余单词：" + (wordsUnLearned.length + 1), canvas.width - 10 - 24 * 8, 30);
                    context.fillStyle = "black";
                    context.fillRect(YHL.x, YHL.y, YHL.width, YHL.height);
                    context.fillRect(TJ.x, TJ.y, TJ.width, TJ.height);
                    context.fillRect(YBH.x, YBH.y, YBH.width, YBH.height);
                    context.fillStyle = "white";
                    context.font = "100px 幼圆";
                    if (YHL.width > YHL.height) {
                        context.fillText("爷会了", YHL.x + YHL.width / 2 - 50 * 3, YHL.y + YHL.height / 2 + 35);
                    } else {
                        context.fillText("爷", YHL.x + YHL.width / 2 - 50, YHL.y + YHL.height / 2 + 35 - 100);
                        context.fillText("会", YHL.x + YHL.width / 2 - 50, YHL.y + YHL.height / 2 + 35);
                        context.fillText("了", YHL.x + YHL.width / 2 - 50, YHL.y + YHL.height / 2 + 35 + 100);
                    }
                    if (TJ.width > TJ.height) {
                        context.fillText("提交", TJ.x + TJ.width / 2 - 50 * 2, TJ.y + TJ.height / 2 + 35);
                    } else {
                        context.fillText("提", TJ.x + TJ.width / 2 - 50, TJ.y + TJ.height / 2 + 35 - 50);
                        context.fillText("交", TJ.x + TJ.width / 2 - 50, TJ.y + TJ.height / 2 + 35 + 50);
                    }
                    if (YBH.width > YBH.height) {
                        context.fillText("爷不会", YBH.x + YBH.width / 2 - 50 * 3, YBH.y + YBH.height / 2 + 35);
                    } else {
                        context.fillText("爷", YBH.x + YBH.width / 2 - 50, YBH.y + YBH.height / 2 + 35 - 100);
                        context.fillText("不", YBH.x + YBH.width / 2 - 50, YBH.y + YBH.height / 2 + 35);
                        context.fillText("会", YBH.x + YBH.width / 2 - 50, YBH.y + YBH.height / 2 + 35 + 100);
                    }
                }
                break;
            case 3:
                if ((wordsUnLearned.length == 0) && (!wordLearning)) {
                    context.fillStyle = "black";
                    context.font = "24px 幼圆";
                    context.fillText("这组的30个背完了", canvas.width / 2 - 12 * 9, 86 + 28);
                    gameover = 1;
                    FHZCD = {
                        x: 20,
                        y: 86 + 2 * (YYH.height + 20),
                        width: canvas.width - 40,
                        height: (canvas.height - 100) / 3 - 10
                    }; //返回主菜单
                    context.fillStyle = "black";
                    context.fillRect(FHZCD.x, FHZCD.y, FHZCD.width, FHZCD.height);
                    context.fillStyle = "white";
                    context.font = "100px 幼圆";
                    context.fillText("返回主菜单", canvas.width / 2 - 250, FHZCD.y + FHZCD.height / 2 + 35);
                } else {
                    context.fillStyle = "black";
                    context.font = "50px 幼圆";
                    context.fillText(wordLearning.Chinese, (canvas.width / 2 - 25 * wordLearning.Chinese.length), 86 + 28);
                    context.fillStyle = "#fff";
                    context.font = "24px 宋体";
                    context.fillText("本轮剩余单词：" + (wordsUnLearned.length + 1), canvas.width - 10 - 24 * 8, 30);
                    context.fillStyle = "black";
                    context.fillRect(YHL.x, YHL.y, YHL.width, YHL.height);
                    context.fillRect(TJ.x, TJ.y, TJ.width, TJ.height);
                    context.fillRect(YBH.x, YBH.y, YBH.width, YBH.height);
                    context.fillStyle = "white";
                    context.font = "100px 幼圆";
                    if (YHL.width > YHL.height) {
                        context.fillText("爷会了", YHL.x + YHL.width / 2 - 50 * 3, YHL.y + YHL.height / 2 + 35);
                    } else {
                        context.fillText("爷", YHL.x + YHL.width / 2 - 50, YHL.y + YHL.height / 2 + 35 - 100);
                        context.fillText("会", YHL.x + YHL.width / 2 - 50, YHL.y + YHL.height / 2 + 35);
                        context.fillText("了", YHL.x + YHL.width / 2 - 50, YHL.y + YHL.height / 2 + 35 + 100);
                    }
                    if (TJ.width > TJ.height) {
                        context.fillText("提交", TJ.x + TJ.width / 2 - 50 * 2, TJ.y + TJ.height / 2 + 35);
                    } else {
                        context.fillText("提", TJ.x + TJ.width / 2 - 50, TJ.y + TJ.height / 2 + 35 - 50);
                        context.fillText("交", TJ.x + TJ.width / 2 - 50, TJ.y + TJ.height / 2 + 35 + 50);
                    }
                    if (YBH.width > YBH.height) {
                        context.fillText("爷不会", YBH.x + YBH.width / 2 - 50 * 3, YBH.y + YBH.height / 2 + 35);
                    } else {
                        context.fillText("爷", YBH.x + YBH.width / 2 - 50, YBH.y + YBH.height / 2 + 35 - 100);
                        context.fillText("不", YBH.x + YBH.width / 2 - 50, YBH.y + YBH.height / 2 + 35);
                        context.fillText("会", YBH.x + YBH.width / 2 - 50, YBH.y + YBH.height / 2 + 35 + 100);
                    }
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
                var left = wordsArraySorted.length - indexYYH;
                for (var i = 0; i < Math.min(30, left); i++) {
                    wordsUnLearned[i] = wordsArraySorted[indexYYH++];
                }
                wordLearning = wordsUnLearned.pop();
            } else if (pos.x >= HYY.x && pos.x < HYY.x + HYY.width &&
                pos.y >= HYY.y && pos.y < HYY.y + HYY.height) {
                gamemode = 3;
                var left = wordsArraySorted.length - indexHYY;
                for (var i = 0; i < Math.min(30, left); i++) {
                    wordsUnLearned[i] = wordsArraySorted[indexHYY++];
                }
                wordLearning = wordsUnLearned.pop();
            }
        } else if (gamemode == 1) {
            var pos = getMousePos(canvas, e);
            if (pos.x >= FHZCD.x && pos.x < FHZCD.x + FHZCD.width &&
                pos.y >= FHZCD.y && pos.y < FHZCD.y + FHZCD.height) {
                gamemode = 0;
                gameover = 0;
                resizeCanvas();
            }
        } else if (gamemode == 2) {
            var pos = getMousePos(canvas, e);
            if (gameover) {
                if (pos.x >= FHZCD.x && pos.x < FHZCD.x + FHZCD.width &&
                    pos.y >= FHZCD.y && pos.y < FHZCD.y + FHZCD.height) {
                    gamemode = 0;
                    gameover = 0;
                    resizeCanvas();
                }
            } else if (pos.x >= YHL.x && pos.x < YHL.x + YHL.width &&
                pos.y >= YHL.y && pos.y < YHL.y + YHL.height) {
                wordsLearned.push(wordLearning);
                wordLearning = wordsUnLearned.pop();
            } else if (pos.x >= TJ.x && pos.x < TJ.x + TJ.width &&
                pos.y >= TJ.y && pos.y < TJ.y + TJ.height) {
                answer = prompt("请输入中文");
                if (answer == wordLearning.Chinese) {
                    wordsLearned.push(wordLearning);
                    wordLearning = wordsUnLearned.pop();
                } else if (answer) {
                    alert("答案错误，正确答案是" + wordLearning.Chinese);
                }
            } else if (pos.x >= YBH.x && pos.x < YBH.x + YBH.width &&
                pos.y >= YBH.y && pos.y < YBH.y + YBH.height) {
                alert(wordLearning.Chinese);
                wordsUnLearned.unshift(wordLearning);
                wordLearning = wordsUnLearned.pop();
            }
        } else if (gamemode == 3) {
            var pos = getMousePos(canvas, e);
            if (gameover) {
                if (pos.x >= FHZCD.x && pos.x < FHZCD.x + FHZCD.width &&
                    pos.y >= FHZCD.y && pos.y < FHZCD.y + FHZCD.height) {
                    gamemode = 0;
                    gameover = 0;
                    resizeCanvas();
                }
            } else if (pos.x >= YHL.x && pos.x < YHL.x + YHL.width &&
                pos.y >= YHL.y && pos.y < YHL.y + YHL.height) {
                wordsLearned.push(wordLearning);
                wordLearning = wordsUnLearned.pop();
            } else if (pos.x >= TJ.x && pos.x < TJ.x + TJ.width &&
                pos.y >= TJ.y && pos.y < TJ.y + TJ.height) {
                answer = prompt("请输入英文");
                if (answer == wordLearning.English) {
                    wordsLearned.push(wordLearning);
                    wordLearning = wordsUnLearned.pop();
                } else if (answer) {
                    alert("答案错误，正确答案是" + wordLearning.English);
                }
            } else if (pos.x >= YBH.x && pos.x < YBH.x + YBH.width &&
                pos.y >= YBH.y && pos.y < YBH.y + YBH.height) {
                alert(wordLearning.English);
                wordsUnLearned.unshift(wordLearning);
                wordLearning = wordsUnLearned.pop();
            }
        } else {

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
