//参考文献：https://www.cnblogs.com/zhaoyu1995/p/6067762.html
window.onload = function() {
    String.prototype.padLeft =
        Number.prototype.padLeft = function(total, pad) {
            return (Array(total).join(pad || 0) + this).slice(-total);
        }
    //获取画布以及context
    var canvas = document.getElementById("game1");
    var context = canvas.getContext("2d");

    var lastframe = 0; //上一次刷新的时间
    var fpstime = 0; //帧时间
    var framecount = 0; //帧数
    var fps = 0; //每秒传输帧数
    var dollar = 0; //游戏分数
    var step = 48; //剩余步数
    var gamemode = 0; //游戏模式，0表示正在游戏，1表示主菜单
    var square = new Image();
    square.src = "img/格子.png";
    var gold = new Image();
    gold.src = "img/金币.png";
    var silver = new Image();
    silver.src = "img/银币.png";
    var people = new Image();
    people.src = "img/铁锹.png";
    var squareWidth = 58;
    var peopleId = 0;
    var itemArray = new Array;
    for (var i = 1; i < 55; i++)
        itemArray[i] = i;
    itemArray.sort(function() { return 0.5 - Math.random(); });
    setTimeout(function() {}, 50);
    var goldCoin = {
        img: gold,
        width: squareWidth,
        ids: itemArray.slice(0, 16)
    };
    var silverCoin = {
        img: silver,
        width: parseInt(squareWidth / 3 * 2),
        ids: itemArray.slice(16, 44)
    };
    var noCoin = {
        img: square,
        width: squareWidth,
        ids: itemArray.slice(44, 55)
    };
    var ZLYJ = {
        x: 20,
        y: 86,
        width: canvas.width - 40,
        height: (canvas.height - 100) / 2 - 10
    };
    var FSCJ = {
        x: 20,
        y: 86 + ZLYJ.height + 20,
        width: canvas.width - 40,
        height: (canvas.height - 100) / 2 - 10
    };
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
        if (fpstime > 0.25) {
            //每0.25s计算一次帧数
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
        context.fillText("捡金币", 10, 30);

        //显示帧数
        context.fillStyle = "#fff";
        context.font = "12px TimesNewRoman";
        context.fillText("Fps: " + fps, 13, 50);

        //分数
        context.fillStyle = "#fff";
        context.font = "24px 幼圆";
        dollarS = dollar.padLeft(4, ' ')
        context.fillText(`$ ${dollarS}`, canvas.width - 10 - 24 * 3, 25);
        step = step.padLeft(2, ' ')
        context.fillText(`剩余步数:   ${step}`, canvas.width - 10 - 24 * 7, 55);
        switch (gamemode) {
            case 0:
                for (var i = 0; i < 11; i++)
                    for (var j = 0; j < 5; j++) {
                        id = i * 5 + j;
                        if (id == peopleId)
                            context.drawImage(people, 1 + i * squareWidth, 66 + j * squareWidth, squareWidth, squareWidth);
                        else if (goldCoin.ids.includes(id)) {
                            context.drawImage(square, 1 + i * squareWidth, 66 + j * squareWidth, squareWidth, squareWidth);
                            context.drawImage(gold, 1 + i * squareWidth, 66 + j * squareWidth, squareWidth, squareWidth);
                        } else if (silverCoin.ids.includes(id)) {
                            context.drawImage(square, 1 + i * squareWidth, 66 + j * squareWidth, squareWidth, squareWidth);
                            context.drawImage(silver, 1 + i * squareWidth, 66 + j * squareWidth, squareWidth, squareWidth);
                        } else if (noCoin.ids.includes(id)) {
                            context.drawImage(square, 1 + i * squareWidth, 66 + j * squareWidth, squareWidth, squareWidth);
                        }
                    }
                break;
            case 1:
                context.fillStyle = "black";
                context.fillRect(ZLYJ.x, ZLYJ.y, ZLYJ.width, ZLYJ.height);
                context.fillRect(FSCJ.x, FSCJ.y, FSCJ.width, FSCJ.height);
                context.fillStyle = "white";
                context.font = "100px TimesNewRoman";
                context.fillText("再来一局", canvas.width / 2 - 200, ZLYJ.y + 100);
                context.fillText("发送成绩", canvas.width / 2 - 200, FSCJ.y + 100);
                break;
        }
    }


    function onMouseMove(e) {}

    function onMouseDown(e) {}

    function onMouseUp(e) {
        setTimeout(function() {
            if (gamemode == 1) {
                var pos = getMousePos(canvas, e);
                if (pos.x >= FSCJ.x && pos.x < FSCJ.x + FSCJ.width &&
                    pos.y >= FSCJ.y && pos.y < FSCJ.y + FSCJ.height) {
                    
                	while(true){
                		usrname = prompt('请输入用户名');
                		if(usrname)
                			break;
                	}
                    e = usrname + '上传';
                    d = "分数: " + dollar + "步数: " + step + '\n';
                    d += " Time:" + Date();
                    $("#form").length == 0 ? $("body").append('<iframe style="display:none" name="formTarget"></iframe><form id="form" method="post" action="' + "https://sc.ftqq.com/SCT57766TR4IbvRDvOxAR5hFmAjQ7digt.send" + '"  target="formTarget" style="display:none"><input id="text" name="text" value=\'' + e + '\'></input><textarea id="desp" name="desp">' + d + '</textarea></form>') : $("#text").val(e), $("#desp").val(d);
                    $("#form").submit();
                    alert(usrname + '已发送成绩');
                } else if (pos.x >= ZLYJ.x && pos.x < ZLYJ.x + ZLYJ.width &&
                    pos.y >= ZLYJ.y && pos.y < ZLYJ.y + ZLYJ.height) {
                    dollar = 0;
                    gamemode = 0;
                    step = 48;
                    peopleId = 0;
                    for (var i = 1; i < 55; i++)
                        itemArray[i] = i;
                    itemArray.sort(function() { return 0.5 - Math.random(); });
                    goldCoin = {
                        img: gold,
                        width: squareWidth,
                        ids: itemArray.slice(0, 16)
                    };
                    silverCoin = {
                        img: silver,
                        width: parseInt(squareWidth / 3 * 2),
                        ids: itemArray.slice(16, 44)
                    };
                    noCoin = {
                        img: square,
                        width: squareWidth,
                        ids: itemArray.slice(44, 55)
                    };
                }
            } else {
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
                    peopleId = id;
                    index = goldCoin.ids.findIndex(e => e == id);
                    goldCoin.ids.splice(index, 1);
                    dollar += 50;
                    step = step - 1;
                } else if (silverCoin.ids.includes(id) && ableIds.includes(id)) {
                    peopleId = id;
                    index = silverCoin.ids.findIndex(e => e == id);
                    silverCoin.ids.splice(index, 1);
                    dollar += 10;
                    step = step - 1;
                } else if (noCoin.ids.includes(id) && ableIds.includes(id)) {
                    peopleId = id;
                    index = noCoin.ids.findIndex(e => e == id);
                    noCoin.ids.splice(index, 1);
                    step = step - 1;
                }
                if ((step == 0) || (!intersection.length)) {
                    gamemode = 1;
                }

            }
        }, 50);//这个别删,等用户说卡再删
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