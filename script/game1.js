//参考文献：https://www.cnblogs.com/zhaoyu1995/p/6067762.html
window.onload = function(){
	//获取画布以及context
	var canvas = document.getElementById("viewport");
	var context = canvas.getContext("2d");

	var lastframe = 0; 		//上一次刷新的时间
	var fpstime = 0;		//帧时间
	var framecount = 0;		//帧数
	var fps = 0;			//每秒传输帧数
	var gamemode = 0;     	//主菜单
	var qiPan = new Image();	
	qiPan.src = "img/棋盘.png" 	//棋盘
	var quan = new Image();
	quan.src = "img/圈.png"		//圈
	var cha = new Image();
	cha.src = "img/叉.png"		//叉
	var qiZiBuJu = [0, 0, 0, 0, 0, 0, 0, 0, 0];//0表示无子，1表示圈，2表示叉
	var qiZiBuJu2 = [0, 0, 0, 0, 0, 0, 0, 0, 0];//0表示无子，1表示圈，2表示叉，保存PVC的棋盘布局。
	var player = 1;//圈（用于存储人人中正执子的player）
	var player2 = 1;//圈（用于存储人机中人的player）
	//游戏平面
	var level = {
		x: 1,
		y: 65,
		width: canvas.width - 2,
		height: canvas.height - 66
	};
	//PVP按钮
	var PVP = {
		x: 20,
		y: 100,
		width: canvas.width - 40,
		height: 150
	};

	//PVC按钮
	var PVC = {
		x: 20,
		y: 300,
		width: canvas.width - 40,
		height: 150
	};

	

	var qiPanX = (canvas.width - canvas.height + 65)/2;
	var qiPanY = 65;
	var qiPanWidth = canvas.height - 65;
	var squareWidth = (canvas.height - 65)/3;

	//再来一局按钮
	var ZLYJ = {
		x: 20, 
		y: 300,
		width: (canvas.width-qiPanWidth)/2-40, 
		height: 150 
	};

	//返回菜单按钮
	var FHCD = {
		x: 20,
		y: 100,
		width: (canvas.width-qiPanWidth)/2-40,
		height: 150
	};

	var RDNX = {
		x: 130+qiPanWidth,
		y: 100,
		width: (canvas.width-qiPanWidth)/2-40,
		height: 150
	}
	//初始化游戏，监听鼠标
	function init(){
		canvas.addEventListener("mousemove", onMouseMove); //鼠标移动
		canvas.addEventListener("mousedown", onMouseDown); //鼠标按下
		canvas.addEventListener("mouseup", onMouseUp);	   //鼠标抬起
		canvas.addEventListener("mouseout", onMouseOut);   
		gamemode = 0;
		//进入主循环
		main(0);
	}

	//主循环
	function main(tframe){
		//递归调用main
		window.requestAnimationFrame(main);

		//刷新游戏
		update(tframe);

		//渲染
		render();
		//判断游戏是否结束
		if(gamemode == 1)
		{
			if(playerWin(1))
			{
				render();
				setTimeout(function(){ alert("圈赢了");qiZiBuJu = [0, 0, 0, 0, 0, 0, 0, 0, 0]; player = 1; }, 1);	
			}
			else if(playerWin(2))
			{
				render();
				setTimeout(function(){ alert("叉赢了");qiZiBuJu = [0, 0, 0, 0, 0, 0, 0, 0, 0]; player = 1; }, 1);
			}
			else if(qiPanMan())
			{
				render();
				setTimeout(function(){ alert("平局");qiZiBuJu = [0, 0, 0, 0, 0, 0, 0, 0, 0]; player = 1; }, 1);
			}
		}
		if(gamemode == 2)
		{
			if(playerWin(1))
			{
				render();
				setTimeout(function(){ alert("圈赢了");qiZiBuJu2 = [0, 0, 0, 0, 0, 0, 0, 0, 0]; player2 = 1; }, 1);
			}
			else if(playerWin(2))
			{
				render();
				setTimeout(function(){ alert("叉赢了");qiZiBuJu2 = [0, 0, 0, 0, 0, 0, 0, 0, 0]; player2 = 1; }, 1);
			}
			else if(qiPan2Man())
			{
				render();
				setTimeout(function(){ alert("平局");qiZiBuJu2 = [0, 0, 0, 0, 0, 0, 0, 0, 0]; player2 = 1; }, 1);
			}
		}
	}

	function update(tframe){
		var dt = (tframe - lastframe)/1000;
		lastframe = tframe;

		//更新fps
		updateFps(dt);
	}

	function updateFps(dt){
		if(fpstime > 0.25){
			//每0.25s计算一次帧数
			fps = Math.round(framecount/fpstime);
			//重置帧数
			fpstime = 0;
			framecount = 0;
		}
		fpstime += dt;
		framecount++;
	}

	function render(){
		drawFrame();
	}

	function drawFrame(){
		//背景、边界
		context.fillStyle="#d0d0d0";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle="#e8eaec";
		context.fillRect(1, 1, canvas.width - 2, canvas.height - 2);

		//标题头
		context.fillStyle = "#303030";
		context.fillRect(0, 0, canvas.width, 65);

		context.fillStyle = "#fff";
		context.font = "24px 宋体";
		context.fillText("井字棋", 10, 30);

		//显示帧数
		context.fillStyle = "#fff";
		context.font = "12px TimesNewRoman";
		context.fillText("Fps: " + fps, 13, 50);
		switch (gamemode){
			case 0:
				context.fillStyle = "black";
				context.fillRect(20, 100, canvas.width-40, 150);
				context.fillRect(20, 300, canvas.width-40, 150);
				context.fillStyle = "white";
				context.font = "100px TimesNewRoman";
				context.fillText("PVP", canvas.width/2-100, 200);
				context.fillText("PVC", canvas.width/2-100, 400);
				break;
			case 1:
				context.drawImage(qiPan, qiPanX, qiPanY, qiPanWidth, qiPanWidth);
				context.fillStyle = "black";
				context.fillRect(20, 100, (canvas.width-qiPanWidth)/2-40, 150);
				context.fillRect(20, 300, (canvas.width-qiPanWidth)/2-40, 150);
				context.fillStyle = "white";
				context.font = "30px 宋体";
				context.fillText("返", 40, 125);
				context.fillText("回", 40, 165);
				context.fillText("菜", 40, 205);
				context.fillText("单", 40, 245);
				context.fillText("再", 40, 325);
				context.fillText("来", 40, 365);
				context.fillText("一", 40, 405);
				context.fillText("局", 40, 445);
				for(var i=0;i<3;i++)
				{
					for(var j=0;j<3;j++)
					{
						if(qiZiBuJu[i*3+j]==1)
						{
							context.drawImage(quan, qiPanX + j*squareWidth+20,
								qiPanY + i*squareWidth+20, squareWidth-40, squareWidth-40);
						}
						else if(qiZiBuJu[i*3+j]==2)
						{
							context.drawImage(cha, qiPanX + j*squareWidth+20,
								qiPanY + i*squareWidth+20, squareWidth-40, squareWidth-40);
						}

					}
				}
				break;
			case 2:
				context.drawImage(qiPan, qiPanX, qiPanY, qiPanWidth, qiPanWidth);
				context.fillStyle = "black";
				context.fillRect(20, 100, (canvas.width-qiPanWidth)/2-40, 150);
				context.fillRect(20, 300, (canvas.width-qiPanWidth)/2-40, 150);
				if (qiZiBuJu2.join("") == "000000000")
					context.fillRect(130+qiPanWidth, 100, (canvas.width-qiPanWidth)/2-40, 150);
				context.fillStyle = "white";
				context.font = "30px 宋体";
				context.fillText("返", 40, 125);
				context.fillText("回", 40, 165);
				context.fillText("菜", 40, 205);
				context.fillText("单", 40, 245);
				context.fillText("再", 40, 325);
				context.fillText("来", 40, 365);
				context.fillText("一", 40, 405);
				context.fillText("局", 40, 445);
				if (qiZiBuJu2.join("") == "000000000")
				{
				context.fillText("让", 150+qiPanWidth, 125);
				context.fillText("电", 150+qiPanWidth, 165);
				context.fillText("脑", 150+qiPanWidth, 205);
				context.fillText("先", 150+qiPanWidth, 245);
				}
				for(var i=0;i<3;i++)
				{
					for(var j=0;j<3;j++)
					{
						if(qiZiBuJu2[i*3+j]==1)
						{
							context.drawImage(quan, qiPanX + j*squareWidth+20,
								qiPanY + i*squareWidth+20, squareWidth-40, squareWidth-40);
						}
						else if(qiZiBuJu2[i*3+j]==2)
						{
							context.drawImage(cha, qiPanX + j*squareWidth+20,
								qiPanY + i*squareWidth+20, squareWidth-40, squareWidth-40);
						}

					}
				}
		}
	}

	function onMouseMove(e) {}
	function onMouseDown(e) {
	}
	function onMouseUp(e) {
		var pos = getMousePos(canvas, e);
		if(gamemode==0)
		{
			if (pos.x >= PVP.x && pos.x < PVP.x + PVP.width &&
				pos.y >= PVP.y && pos.y < PVP.y + PVP.height)
				gamemode = 1;//PVP
			else if(pos.x >= PVC.x && pos.x < PVC.x + PVC.width &&
				pos.y >= PVC.y && pos.y < PVC.y + PVC.height)
				gamemode = 2;//PVC
		}
		else if(gamemode==1)
		{

			if(pos.x >= qiPanX && pos.x < qiPanX + qiPanWidth &&
				pos.y >= qiPanY && pos.y < qiPanY + qiPanWidth)
			{
				var i = parseInt((pos.y-qiPanY)/squareWidth);
				var j = parseInt((pos.x-qiPanX)/squareWidth);
				if(!qiZiBuJu[3*i+j])
				{
					qiZiBuJu[3*i+j] = player;
					player = 3-player;
				}

			}
			else if(pos.x >= FHCD.x && pos.x < FHCD.x + FHCD.width &&
				pos.y >= FHCD.y && pos.y < FHCD.y + FHCD.height)
				{	
				gamemode = 0;
				}
			else if(pos.x >= ZLYJ.x && pos.x < ZLYJ.x + ZLYJ.width &&
				pos.y >= ZLYJ.y && pos.y < ZLYJ.y + ZLYJ.height)
				{
				qiZiBuJu = [0, 0, 0, 0, 0, 0, 0, 0, 0]
				player = 1;
				}
		}
		else if(gamemode == 2)
		{
			if(pos.x >= qiPanX && pos.x < qiPanX + qiPanWidth &&
				pos.y >= qiPanY && pos.y < qiPanY + qiPanWidth)
			{
				var i = parseInt((pos.y-qiPanY)/squareWidth);
				var j = parseInt((pos.x-qiPanX)/squareWidth);
				if(!qiZiBuJu2[3*i+j])
				{
					qiZiBuJu2[3*i+j] = player2;
					computerPlay();
				}
			}
			else if(pos.x >= FHCD.x && pos.x < FHCD.x + FHCD.width &&
				pos.y >= FHCD.y && pos.y < FHCD.y + FHCD.height)
				{	
				gamemode = 0;
				}
			else if(pos.x >= RDNX.x && pos.x < RDNX.x + RDNX.width &&
				pos.y >= RDNX.y && pos.y < RDNX.y + RDNX.height &&
				qiZiBuJu2.join("")=="000000000")
				{	
					player2 = 2;
					computerPlay();
				}
			else if(pos.x >= ZLYJ.x && pos.x < ZLYJ.x + ZLYJ.width &&
				pos.y >= ZLYJ.y && pos.y < ZLYJ.y + ZLYJ.height)
				{
				qiZiBuJu2 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
				player2 = 1;
				}
		}
	}
	function onMouseOut(e) {}

	function getMousePos(canvas, e){
		var rect = canvas.getBoundingClientRect();
		return{
			x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
			y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
		};
	}

	function playerWin(player){
		if(gamemode == 1)
		{
			if(((qiZiBuJu[0]==qiZiBuJu[1])&&(qiZiBuJu[1]==qiZiBuJu[2])&&(qiZiBuJu[2]==player))||
				((qiZiBuJu[3]==qiZiBuJu[4])&&(qiZiBuJu[4]==qiZiBuJu[5])&&(qiZiBuJu[5]==player))||
				((qiZiBuJu[6]==qiZiBuJu[7])&&(qiZiBuJu[7]==qiZiBuJu[8])&&(qiZiBuJu[8]==player))||
				((qiZiBuJu[0]==qiZiBuJu[3])&&(qiZiBuJu[3]==qiZiBuJu[6])&&(qiZiBuJu[6]==player))||
				((qiZiBuJu[1]==qiZiBuJu[4])&&(qiZiBuJu[4]==qiZiBuJu[7])&&(qiZiBuJu[7]==player))||
				((qiZiBuJu[2]==qiZiBuJu[5])&&(qiZiBuJu[5]==qiZiBuJu[8])&&(qiZiBuJu[8]==player))||
				((qiZiBuJu[0]==qiZiBuJu[4])&&(qiZiBuJu[4]==qiZiBuJu[8])&&(qiZiBuJu[8]==player))||
				((qiZiBuJu[2]==qiZiBuJu[4])&&(qiZiBuJu[4]==qiZiBuJu[6])&&(qiZiBuJu[6]==player)))
				return true;
			return false;
		}
		else if(gamemode == 2)
		{
			if(((qiZiBuJu2[0]==qiZiBuJu2[1])&&(qiZiBuJu2[1]==qiZiBuJu2[2])&&(qiZiBuJu2[2]==player))||
				((qiZiBuJu2[3]==qiZiBuJu2[4])&&(qiZiBuJu2[4]==qiZiBuJu2[5])&&(qiZiBuJu2[5]==player))||
				((qiZiBuJu2[6]==qiZiBuJu2[7])&&(qiZiBuJu2[7]==qiZiBuJu2[8])&&(qiZiBuJu2[8]==player))||
				((qiZiBuJu2[0]==qiZiBuJu2[3])&&(qiZiBuJu2[3]==qiZiBuJu2[6])&&(qiZiBuJu2[6]==player))||
				((qiZiBuJu2[1]==qiZiBuJu2[4])&&(qiZiBuJu2[4]==qiZiBuJu2[7])&&(qiZiBuJu2[7]==player))||
				((qiZiBuJu2[2]==qiZiBuJu2[5])&&(qiZiBuJu2[5]==qiZiBuJu2[8])&&(qiZiBuJu2[8]==player))||
				((qiZiBuJu2[0]==qiZiBuJu2[4])&&(qiZiBuJu2[4]==qiZiBuJu2[8])&&(qiZiBuJu2[8]==player))||
				((qiZiBuJu2[2]==qiZiBuJu2[4])&&(qiZiBuJu2[4]==qiZiBuJu2[6])&&(qiZiBuJu2[6]==player)))
				return true;
			return false;
		}
	}

	function playerGonnaWin(qi, player, t){
		qi2 = qi.slice(0, 9);
		qi2[t] = player;
		if(gamemode == 2)
		{
			if(((qi2[0]==qi2[1])&&(qi2[1]==qi2[2])&&(qi2[2]==player))||
				((qi2[3]==qi2[4])&&(qi2[4]==qi2[5])&&(qi2[5]==player))||
				((qi2[6]==qi2[7])&&(qi2[7]==qi2[8])&&(qi2[8]==player))||
				((qi2[0]==qi2[3])&&(qi2[3]==qi2[6])&&(qi2[6]==player))||
				((qi2[1]==qi2[4])&&(qi2[4]==qi2[7])&&(qi2[7]==player))||
				((qi2[2]==qi2[5])&&(qi2[5]==qi2[8])&&(qi2[8]==player))||
				((qi2[0]==qi2[4])&&(qi2[4]==qi2[8])&&(qi2[8]==player))||
				((qi2[2]==qi2[4])&&(qi2[4]==qi2[6])&&(qi2[6]==player)))
				return true;
			return false;
		}
	}

	function qiPanMan(){
		for(var i=0;i<9;i++)
			if(qiZiBuJu[i]==0)
				return false;
		return true;
	}

	function qiPan2Man(){
		for(var i=0;i<9;i++)
			if(qiZiBuJu2[i]==0)
				return false;
		return true;
	}

	function computerPlay(){
		var s = qiZiShu();
		switch (s){
			case 0:
				qiZiBuJu2 = [0, 0, 0, 0, 1, 0, 0, 0, 0];
				break;
			case 1:
				if(qiZiBuJu2[4] == 1)
					qiZiBuJu2[2] = 2;
				else
					qiZiBuJu2[4] = 2;
				break;
			case 2:
				if(qiZiBuJu2[8] == 2)
					qiZiBuJu2[0] = 1;
				else if(qiZiBuJu2[2] == 2)
					qiZiBuJu2[6] = 1;
				else if(qiZiBuJu2[6] == 2)
					qiZiBuJu2[2] = 1;
				else
					qiZiBuJu2[8] = 1;
				break;
			case 3:
				if(qiZiBuJu2.join("") == "002010100")
					qiZiBuJu2[0] = 2;
				else if(qiZiBuJu2.join("") == "001020100"||qiZiBuJu2.join("") == "100020001")
					qiZiBuJu2[7] = 2;
				else if(qiZiBuJu2.join("") == "100020010"||qiZiBuJu2.join("") == "001120000"||
					qiZiBuJu2.join("") == "001020010"||qiZiBuJu2.join("") == "000120001")
					qiZiBuJu2[6] = 2;
				else if(qiZiBuJu2.join("") == "100021000"||qiZiBuJu2.join("") == "010020001"||
					qiZiBuJu2.join("") == "010020100"||qiZiBuJu2.join("") == "000021100")
					qiZiBuJu2[2] = 2;
				else if(qiZiBuJu2.join("") == "010021000"||qiZiBuJu2.join("") == "000021010"||
					qiZiBuJu2.join("") == "000120010")
					qiZiBuJu2[8] = 2;
				else if(qiZiBuJu2.join("") == "010120000")
					qiZiBuJu2[2] = 2;
				else if(qiZiBuJu2.join("") == "000121000"||qiZiBuJu2.join("") == "010020010")
					qiZiBuJu2[0] = 2;
				else 
				{
					for(var i = 0; i < 9; i++)
						if(qiZiBuJu2[i]==0&&playerGonnaWin(qiZiBuJu2, 1, i))
						{
							qiZiBuJu2[i] = 2;
							break;
						}
				}
				break;
			case 4:
				if (computerWin(3 - player2))
				 	break;
				else if(duZhu(3 - player2))
					break;
				else if(qiZiBuJu2.join("") == "002210100"||qiZiBuJu2.join("") == "021010200")
					qiZiBuJu2[8] = 1;
				else if(qiZiBuJu2.join("") == "200010021"||qiZiBuJu2.join("") == "100210002")
					qiZiBuJu2[2] = 1;
				else if(qiZiBuJu2.join("") == "200012001"||qiZiBuJu2.join("") == "120010002")
					qiZiBuJu2[6] = 1;
				else if(qiZiBuJu2.join("") == "002010120"||qiZiBuJu2.join("") == "001012200")
					qiZiBuJu2[0] = 1;
				break;
			default:
				if (computerWin(3 - player2))
				 	break;
				else if(duZhu(3 - player2))
					break;
				else
				{
				 	for(var i = 0; i < 9; i++)
				 	{
				 		if(qiZiBuJu2[i]==0)
				 		{
				 			qiZiBuJu2[i] = 3-player2;
				 			break;
				 		}
				 	}
				}
		}
	}

	function computerWin(com){ 
		for(var i = 0; i < 9; i++)
			if(qiZiBuJu2[i]==0&&playerGonnaWin(qiZiBuJu2, com, i))
			{		
				qiZiBuJu2[i] = com;
				return true;
			}
		return false;
	}

	function qiZiShu(){
		var sum=0;
		for(var i=0;i<9;i++)
			if(qiZiBuJu2[i]!=0)
				sum++;
		return sum;
	}

	function duZhu(com){
		for(var i = 0; i < 9; i++)
			if(qiZiBuJu2[i]==0&&playerGonnaWin(qiZiBuJu2, 3-com, i))
			{
				qiZiBuJu2[i] = com;
				return true;
			}
		return false;
	}

	init();
}

