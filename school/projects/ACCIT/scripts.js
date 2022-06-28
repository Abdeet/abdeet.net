var colors = [
	['#FFFCE8', '#3E363F', '#697A21', '#B8B42D'], 
	['#FBFEF9', '#191923', '#0E79B2', '#BF1363'], 
	['#C7E8F3', '#41393E', '#BF9ACA', '#8E4162'], 
	['#0A2342', '#2CA58D', '#84BC9C', '#FFFDF7'],
	['#BBBDF6', '#72727E', '#9893DA', '#797A9E'],
	['#4F7CAC', '#C0E0DE', '#162521', '#3C474B'],
	['#2D2A32', '#DDD92A', '#EAE151', '#EEEFA8'],
	['#6E2594', '#ECD444', '#808080', '#000000'],
	['#E3E7AF', '#A2A77F', '#EFF1C5', '#035E7B'],
	['#AAABBC', '#8B8982', '#373F47', '#6C91C2'],
	['#FFBA49', '#20A39E', '#EF5B5B', '#23001E'],
	['#11270B', '#71B340', '#669D31', '#598B2C'],
	['#45503B', '#747572', '#B098A4', '#DBD9DB'],
	['#EDFFEC', '#61E786', '#5A5766', '#48435C'],
	['#B37BA4', '#D99AC5', '#DCCDE8', '#14BDEB'],
	['#05299E', '#5E4AE3', '#947BD3', '#F0A7A0'],
	['#FBF2C0', '#48392A', '#48392A', '#C06E52'],
	['#0B2027', '#40798C', '#70A9A1', '#CFD7C7'],
	['#584D3D', '#9F956C', '#CBBF7A', '#F4E87C'],
	['#050517', '#CF5C36', '#EFC88B', '#F4E3B2'],
];

var currentColor = Math.floor(Math.random() * colors.length);
var isCycling = false;
var cycleInterval;
console.log(currentColor);

$("#color-changer").on("click", changeColor);
$("#color-cycler").on("click", cycleColors);

function changeColor(){
	$(".allow-color-change").attr("style", "background: " + colors[currentColor][0] + " !important;");
	$("h1").attr("style", "color: " + colors[currentColor][1] + ";");
	$("h5").attr("style", "color: " + colors[currentColor][2] + " !important;");
	$("p, a").attr("style", "color: " + colors[currentColor][3] + " !important;");
	currentColor++;
	currentColor = currentColor % colors.length;
	console.log(currentColor);
}	

function cycleColors(){
	if(isCycling){
		clearInterval(cycleInterval);
		isCycling = false;
	}
	else{
		cycleInterval = setInterval(changeColor, 1);
		isCycling = true;
	}
}