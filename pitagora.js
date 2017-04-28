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
	

	init();
	
	function init()
	{
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, W, H);
		
		step = 0;
		ctx.beginPath();
	    ctx.moveTo(200, H-300);
	    ctx.lineTo(200, H-600);
	    ctx.lineTo(500, H-300);
	    ctx.lineTo(200, H-300);
	    ctx.stroke();

	    makePlayButton(50, 500, 50, 40, "start");
	    makePlayButton(150, 500, 50, 40, "next");
	    makePlayButton(250, 500, 50, 40, "end");
	}

	function angle90()
	{
		ctx.beginPath();
		ctx.strokeStyle = "chocolate";
	    ctx.rect(200, H-330, 30, 30);
	    ctx.stroke();
	}

	function names()
	{
		ctx.font = "25px Courier New";
		ctx.fillStyle = "cadetblue";
	    ctx.fillText("a = kateta", 250, H-270);
	    ctx.fillText("b = kateta", 30, H-400);
	    ctx.fillText("c = hipotenuza", 320, H-500);
	}


	function equation()
	{
		ctx.font = "18px Courier New";
		ctx.fillStyle = "black";

	    ctx.fillText("hiptenuza = kateta1 + kateta2", 600, 200);
	
	}

	function makePlayButton(x, y, w, h, type) {

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

	    if (isInside(mousePos, 50, 500, 50, 40)) {
	    	init();
	    }
	    if (isInside(mousePos, 150, 500, 50, 40)) {

	    	if (step == 0) {
	    		angle90();
	    		step++;
	    	} else if (step == 1) {
	    		names();
	    		step++;
	    	} else if (step == 2) {
				equation();
				step++;
	    	} 

    	}
    	if (isInside(mousePos, 250, 500, 50, 40)) {
    		init();
    		setTimeout(angle90, 800);
    		setTimeout(names, 1600);
    		setTimeout(equation, 2400, 600);
    	}

	}, false);
	
}