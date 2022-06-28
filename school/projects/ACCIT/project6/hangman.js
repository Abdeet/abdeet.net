const $canvas = $("#canvas");
const ctx = $canvas[0].getContext("2d");

//Draw all things starting from the bottom left point of the gallows :D
function drawHangman(stage, x, y){
	switch(stage){
		case 0:
			gallows(x, y);
			break;
		case 1:
			head(x, y);
			break;
		case 2:
			torso(x, y);
			break;
		case 3:
			leftArm(x, y);
			break;
		case 4:
			rightArm(x, y);
			break;
		case 5: 
			leftLeg(x, y);
			break;
		case 6:
			rightLeg(x, y);
			break;
		case 7:
			face(x, y);
			break;
		default:
			drawEntireHangman(x, y);
			break;
	}
}

function clearScreen(){
	with(ctx){
		clearRect(0, 0, 2000, 2000);
	}
}

function drawEntireHangman(x, y){
	gallows(x, y);
	head(x, y);
	torso(x, y);
	leftArm(x, y);
	rightArm(x, y);
	leftLeg(x, y);
	rightLeg(x, y);
	face(x, y);
}

function gallows(x, y){
	drawTitle(x, y);
	with(ctx){
		beginPath();
		moveTo(x - 100, y);
		strokeStyle = "brown";
		lineWidth = 10;
		lineTo(x + 100, y);
		moveTo(x, y);
		lineTo(x, y - 600);
		lineTo(x + 400, y - 600);
		stroke();
		
		beginPath();
		moveTo(x + 400, y - 600);
		strokeStyle = "tan";
		lineWidth = 3;
		lineTo(x + 400, y - 500);
		stroke();
		
		beginPath();
		moveTo(x, y - 500);
		strokeStyle = "brown";
		lineWidth = 10;
		lineTo(x + 100, y - 600);
		stroke();
	}
}

function head(x, y){
	with(ctx){
		beginPath();
		strokeStyle = "lime";
		lineWidth = 3;
		arc(x + 400, y - 450, 50, 0, Math.PI * 2);
		fillStyle = "lime";
		fill();
		stroke();
	}
}

function face(x, y){
	with(ctx){
		beginPath();
		strokeStyle = "black";
		lineWidth = 10;
		arc(x + 380, y - 470, 10, 0, Math.PI * 2);
		fillStyle = "red";
		fill();
		stroke();
		
		beginPath();
		strokeStyle = "black";
		lineWidth = 10;
		arc(x + 420, y - 470, 10, 0, Math.PI * 2);
		fillStyle = "red";
		fill();
		stroke();
		
		beginPath();
		strokeStyle = "black";
		lineWidth = 10;
		arc(x + 400, y - 440, 30, -1 * Math.PI / 8, Math.PI * 9 / 8);
		stroke();
	}
}

function torso(x, y){
	with(ctx){
		beginPath();
		moveTo(x + 400, y - 400);
		strokeStyle = "lime";
		lineWidth = 30;
		lineTo(x + 400, y - 300);
		stroke();
	}
}

function leftArm(x, y){
	with(ctx){
		beginPath();
		moveTo(x + 400, y - 430);
		strokeStyle = "lime";
		lineWidth = 10;
		lineTo(x + 370, y - 290);
		stroke();
	}
}

function rightArm(x, y){
	with(ctx){
		beginPath();
		moveTo(x + 400, y - 430);
		strokeStyle = "lime";
		lineWidth = 10;
		lineTo(x + 430, y - 290);
		stroke();
	}
}

function leftLeg(x, y){
	with(ctx){
		beginPath();
		moveTo(x + 390, y - 310);
		strokeStyle = "lime";
		lineWidth = 10;
		lineTo(x + 380, y - 200);
		stroke();
	}
}

function rightLeg(x, y){
	with(ctx){
		beginPath();
		moveTo(x + 410, y - 310);
		strokeStyle = "lime";
		lineWidth = 10;
		lineTo(x + 420, y - 200);
		stroke();
	}
}

function drawTitle(x, y){
	with(ctx){
		beginPath();
		font = "60px Impact";
		fillStyle = "black";
		fillText("HANG ALIEN", x + 50, y - 650);
		fillText("BOTTOM TEXT", x + 30, y + 70);
	}
}