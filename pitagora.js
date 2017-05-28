//http://thecodeplayer.com/walkthrough/create-binary-trees-using-javascript-and-html5-canvas
//https://github.com/goldfire/CanvasInput

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	//Lets resize the canvas to occupy the full page
	var W = 1000;
	var H = 700;
	canvas.width = W;
	canvas.height = H;
	var step;

	var a = 3;
	var b = 4;
	var c = 5;
	var factor = 40;
	var startX = 350;
	var startY = 300;

	init();
	
	function init()
	{
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, W, H);
		
		step = 0;
		ctx.beginPath();
	    ctx.moveTo(startX, startY);
	    ctx.lineTo(startX, startY - a*factor);
	    ctx.lineTo(startX + b*factor, startY);
	    ctx.lineTo(startX, startY);
	    ctx.stroke();

	    ctx.strokeRect(startX, startY, b*factor, b*factor);
	    fillRectangle(startX, startY, b, factor, "#008B8B");
	    ctx.strokeRect(startX - a*factor, startY - a*factor, a*factor, a*factor);
	    fillRectangle(startX - a*factor, startY - a*factor, a, factor, "#E9967A");

	    //translating & rotating
	    ctx.translate(startX, startY - a*factor);	 
		ctx.rotate(Math.PI / 4.882031454);
	    ctx.strokeRect(0, 0 - c*factor, c*factor, c*factor);
	    fillRectangle(0, 0 - c*factor, c, factor, "white");

	    //reset
	    ctx.setTransform(1,0,0,1,0,0);

	    ctx.fillStyle = "cadetblue";
		ctx.fillRect(50, 500, 120, 40);
	    makePlayButton(200, 500, 50, 40);
	    write();

	}


	function fillRectangle(xStart, yStart, length, factor, color) 
	{
		ctx.fillStyle = color;
		x = xStart;
		y = yStart;
		for (k = 0; k < length; k++) {
			for (i = 0; i < length; i++)
			{
				ctx.fillRect(x,y,factor,factor);
				ctx.strokeRect(x,y,factor, factor);
				x = x + factor;	
			}
			x = xStart;
			y = y + factor;
		}
		
	}

	function fillSquare(rotated) 
	{
		var rot = rotated;

		return function( x, y, i, j, color) {
			if (rotated) {
		    	ctx.translate(startX, startY - a*factor);	 
				ctx.rotate(Math.PI / 4.882031454);
			}
			ctx.fillStyle = color;
			ctx.fillRect(x,y,factor,factor);
			ctx.strokeRect(x,y,factor, factor);

			ctx.setTransform(1,0,0,1,0,0);
		}

	}

	function switchSquares(rotated, xStart, yStart, length, startTime, color)
	{
		x = xStart;
		y = yStart;
		for (i = 0; i < length; i++) {
			for (j = 0; j < length; j++) {
				if (rotated && startTime >= 16*500) color = "#E9967A";
				setTimeout(fillSquare(rotated), startTime, x, y, i, j, color);
				x = x + factor;
				startTime = startTime + 500;
			}
			x = xStart;
			y = y + factor;
		}
	}

	function write(startx, starty, words)
	{
		ctx.fillStyle = "black";
		ctx.font = "30px Courier New";
	    ctx.fillText("a", startX - a*factor - 50, startY - a*factor/2);
		ctx.font = "20px Courier New";
 	    ctx.fillText("2", startX - a*factor - 35, startY - a*factor/2 - 20);

		ctx.fillStyle = "black";
		ctx.font = "30px Courier New";
	    ctx.fillText("b", startX + b*factor/2 - 10, startY + b*factor + 40);
		ctx.font = "20px Courier New";
 	    ctx.fillText("2", startX + b*factor/2 , startY + b*factor + 20);

		ctx.fillStyle = "black";
		ctx.font = "30px Courier New";
	    ctx.fillText("c", startX + c*factor, 70);
		ctx.font = "20px Courier New";
 	    ctx.fillText("2", startX + c*factor + 15 , 50);

		ctx.fillStyle = "black";
		ctx.font = "30px Courier New";
	    ctx.fillText("c = a + b", 700, 300);
		ctx.font = "20px Courier New";
 	    ctx.fillText("2", 720, 280);
 	    ctx.fillText("2", 790, 280);
 	    ctx.fillText("2", 860, 280);


		ctx.font = "18px Courier New";
 	    ctx.fillText("Ponastavi", 60, 525);
	}

	function makePlayButton(x, y, w, h) {

		ctx.fillStyle = "cadetblue";

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

	    if (isInside(mousePos, 50, 500, 120, 40)) {
	    	var highestTimeoutId = setTimeout(";");
			for (var i = 0 ; i < highestTimeoutId ; i++) {
			    clearTimeout(i); 
			}
	    	init();
	    }
	   
    	if (isInside(mousePos, 200, 500, 50, 40)) {
    		switchSquares(false, startX, startY, b, 0, "white");
    		switchSquares(false, startX - a*factor, startY - a*factor, a, 500*16, "white");
		    switchSquares(true, 0, 0 - c*factor, c, 0, "#008B8B");		  
		}
	}, false);
	
}