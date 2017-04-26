//http://thecodeplayer.com/walkthrough/create-binary-trees-using-javascript-and-html5-canvas
//https://github.com/goldfire/CanvasInput

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	//Lets resize the canvas to occupy the full page
	var W = 1000;
	var H = 600;
	// has to be dynamic
	var startNumber;
	var base;
	var stop;
	var toFinish;
	canvas.width = W;
	canvas.height = H;
	

	//Some variables
	var length, divergence, reduction, line_width, start_points = [];
	
	init();
	
	function init()
	{
		startNumber = 32;
		base = 2;
		stop = false;
		toFinish = false;

		//Lets draw the trunk of the tree
		//length of the trunk - 100-150
		length = 220;
		//angle at which branches will diverge - 10-60
		divergence = 35;
		//Every branch will be 0.75times of the previous one - 0.5-0.75
		reduction = 0.6
		//width of the branch/trunk
		line_width = 10;

		initMenu();
	}

	function initMenu() {
				//filling the canvas white
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, W, H);
		
		ctx.fillStyle = "khaki";
		ctx.fillRect(W-301, 50, 300, 500);
		ctx.stroke();

		ctx.font = "25px Courier New";
		ctx.fillStyle = "black";
		ctx.fillText("Logaritem", W-280, 80);

		form();
		playButtons();
	}

	function startDrawing() {

		initMenu();

		//This is the end point of the trunk, from where branches will diverge
		var trunk = {x: W/3, y: length+50, angle: 90};
		//It becomes the start point for branches
		start_points = []; //empty the start points on every init();
		start_points.push(trunk);
		
		//Y coordinates go positive downwards, hence they are inverted by deducting it
		//from the canvas height = H
		ctx.beginPath();
		ctx.moveTo(trunk.x, H-50);
		ctx.lineTo(trunk.x, H-trunk.y);
		ctx.strokeStyle = "brown";
		ctx.lineWidth = line_width;
		ctx.stroke();

		ctx.font = "15px Courier New";
		ctx.fillStyle = "black";
		ctx.fillText(startNumber, trunk.x- 10, H-trunk.y-30);

		startNumber = startNumber / base;
		setTimeout(branches, 800);
	}

	function isInside(pos, rectX, rectY, rectW, rectH){
	    return pos.x > rectX && pos.x < rectX+rectW && pos.y < rectY+rectH && pos.y > rectY;
	}

	function getMousePos(canvas, event) {
    	var rect = canvas.getBoundingClientRect();
	    return {
	        x: event.clientX - rect.left,
	        y: event.clientY - rect.top
	    };
	}

	canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

	    if (isInside(mousePos, W-290, 400, 130, 40)) {
	    	init();
	     	startDrawing();   
	    }

	    //next step
	    if (isInside(mousePos, W-290, 450, 130, 40)) {
	   		branches();
	    }

	    //to the end
	    if (isInside(mousePos, W-150, 450, 130, 40)) {
	    	toFinish = true;
	   		branches();
	    }

	}, false);


	function form()
	{		
		ctx.fillStyle = "aliceblue";
		ctx.beginPath();
		ctx.fillRect(W-290, 150, 200, 40);
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.fillText("log 32 = 5", W-280, 180);
		ctx.font = "15px Courier New";
		ctx.fillText("2", W-230, 185);

		ctx.fillStyle = "aliceblue";
		ctx.beginPath();
		ctx.fillRect(W-290, 200, 200, 40);
		ctx.stroke();
		ctx.font = "25px Courier New";
		ctx.fillStyle = "black";
		ctx.fillText("log 81 = 4", W-280, 230);
		ctx.font = "15px Courier New";
		ctx.fillText("3", W-230, 235);
	}

	function makePlayButton(x, y, w, h, type) {

		ctx.fillStyle = "aliceblue";

		//make rectangle
		ctx.beginPath();
		ctx.fillRect(x, y, w, h)
		ctx.stroke();

		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.moveTo(x+10, y+10);
		ctx.lineTo(x+10, y+30);
		ctx.lineTo(x+30, y+20);
		ctx.fill();

		if (type == "next" || type == "end") {
			ctx.beginPath();
			ctx.moveTo(x+20, y+10);
			ctx.lineTo(x+20, y+30);
			ctx.lineTo(x+40, y+20);
			ctx.fill();
		}
		if (type == "end") {
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = "black";
			ctx.moveTo(x+40, y+10);
			ctx.lineTo(x+40, y+30);
			ctx.stroke();
		}
	}

	function playButtons()
	{
		makePlayButton(W-290, 400, 130, 40, "start");
		ctx.font = "20px Courier New";
		ctx.fillText("Začni", W-250, 427);

		makePlayButton(W-290, 450, 130, 40, "next");
		ctx.fillText("Naprej", W-250, 477);

		makePlayButton(W-150, 450, 130, 40, "end");
		ctx.fillText("Konec", W-100, 477);
	}
	
	//Lets draw the branches now
	function branches()
	{

		//reducing line_width and length
		length = length * reduction;
		line_width = line_width * reduction;
		ctx.lineWidth = line_width;
		
		var new_start_points = [];
		ctx.beginPath();
		for(var i = 0; i < start_points.length; i++)
		{

			var sp = start_points[i];
		
			//2 branches will come out of every start point. Hence there will be
			//2 end points. There is a difference in the divergence.
			var ep1 = get_endpoint(sp.x, sp.y, sp.angle+divergence, length);
			var ep2 = get_endpoint(sp.x, sp.y, sp.angle-divergence, length);
			if (base == 3) {
				var ep3 = get_endpoint(sp.x, sp.y, sp.angle, length);
			}

			//drawing the branches now
			ctx.moveTo(sp.x, H-sp.y);
			ctx.lineTo(ep1.x, H-ep1.y);
			ctx.moveTo(sp.x, H-sp.y);
			ctx.lineTo(ep2.x, H-ep2.y);
			if (base == 3) {
				ctx.moveTo(sp.x, H-sp.y);
				ctx.lineTo(ep3.x, H-ep3.y);
			}

			if (startNumber >= 1) {
				ctx.font = "15px Courier New";
				ctx.fillStyle = "black";
				ctx.fillText(startNumber,ep1.x, H-ep1.y);
				ctx.fillText(startNumber,ep2.x, H-ep2.y);
			}

			//Time to make this function recursive to draw more branches
			ep1.angle = sp.angle+divergence;
			ep2.angle = sp.angle-divergence;
			if (base == 3) {
				ep3.angle = sp.angle;
			}
			new_start_points.push(ep1);
			new_start_points.push(ep2);
			if (base == 3) {
				new_start_points.push(ep3);
			}

		}

		if (stop) return;
		

		//Lets add some more color
		if(startNumber <= 1) {
			ctx.strokeStyle = "green";
			stop = true;
		} 
		else ctx.strokeStyle = "brown";
		ctx.stroke();
		start_points = new_start_points;
		startNumber = startNumber / base;
		//recursive call - only if length is more than 2.
		//Else it will fall in an long loop

		//if(startNumber >= 1) setTimeout(branches, 800);
		if (toFinish) setTimeout(branches, 800);
	
		//else setTimeout(init, 800);
	}
	
	function get_endpoint(x, y, a, length)
	{
		//This function will calculate the end points based on simple vectors
		//http://physics.about.com/od/mathematics/a/VectorMath.htm
		//You can read about basic vectors from this link
		var epx = x + length * Math.cos(a*Math.PI/180);
		var epy = y + length * Math.sin(a*Math.PI/180);
		return {x: epx, y: epy};
	}
	
	
	
}