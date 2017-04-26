//http://thecodeplayer.com/walkthrough/create-binary-trees-using-javascript-and-html5-canvas
//https://github.com/goldfire/CanvasInput

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	//Lets resize the canvas to occupy the full page
	var W = 1000;
	var H = 600;
	canvas.width = W;
	canvas.height = H;
	

	init();
	
	function init()
	{
		ctx.beginPath();
	    ctx.moveTo(100, H-200);
	    ctx.lineTo(100, H-500);
	    ctx.lineTo(400, H-200);
	    ctx.lineTo(100, H-200);
	    ctx.stroke();
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

	    //if (isInside(mousePos, W-290, 400, 130, 40)) {}


	}, false);



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
	
}