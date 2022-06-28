var monkeys = [
				"images/bigmonkey.jpg",
				"images/brownmonkey.jpg",
				"images/hauntedmonkey.jpg",
				"images/lemonke.jpg",
				"images/nosemonkey.jpg",
				"images/pinkmonkey.jpg",
				"images/smilingmonkey.jpg",
				"images/smugmonkey.jpg",
				"images/spidermonkey.jpg",
				"images/squirrelmonkey.jpg",
				"images/wisemonkey.jpg",
				"images/ape.jpg"
			 ];	

var imageset = monkeys;
var gameArray = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11];
var shuffledArray = [...gameArray];
var completedPairs = [];
var gameBeingPlayed = false;
var canClick = false;
var delayTime = 500;
var oneClicked = false;
var clickedA = null;
var clickedB = null;

$(".square img").on("click", function(e){
	if(gameBeingPlayed){
		if(!oneClicked && canClick){
			console.log("oneclick" + $(e.target).attr("src"));
			changeAllImgsButCompletedPairs(0);
			clickedA = getImgIndex(e.target);
			changeImg(clickedA, 1);
			oneClicked = true;
		}
		else if(oneClicked && canClick && getImgIndex(e.target) != clickedA){
			console.log("twoclick" + $(e.target).attr("src"));
			oneClicked = false;
			canClick = false;
			clickedB = getImgIndex(e.target);
			changeImg(clickedB, 1);
			if(shuffledArray[clickedA] == shuffledArray[clickedB]){
				completedPairs.push(shuffledArray[clickedA])
			}
			setTimeout(function(){
				console.log("here");
				changeAllImgsButCompletedPairs(0);
				canClick = true;
			}, delayTime);
		}
		if(allPairsCompleted()){
			canClick = false;
			oneClicked = false;
			clickedA = null;
			clickedB = null;
			return endGame();
		}
	}
	else if(!gameBeingPlayed){
		gameBeingPlayed = true;
		prepareGame();
	}
});

function prepareGame(){
	shuffledArray = [...gameArray];
	shuffledArray = shuffle(shuffledArray);
	completedPairs = [];
	changeAllImgs(1);
	console.log(completedPairs);
	setTimeout(function(){
		changeAllImgs(0);
		canClick = true;
	}, delayTime);
}

function endGame(){
	var greenIndexes = [0, 5, 6, 8, 9, 11, 12, 14, 15, 17, 19, 22];
	var blackIndexes = [1, 2, 3, 4, 7, 10, 13, 16, 18, 20, 21, 23];
	for(var i = 0; i < greenIndexes.length; i++){
		changeImg(greenIndexes[i], 2);
	}
	for(var i = 0; i < blackIndexes.length; i++){
		changeImg(blackIndexes[i], 0);
	}
	setTimeout(function(){gameBeingPlayed = false;}, delayTime);
}

function changeImg(index, show){
	$img = $($(".square img")[index]);
	if(show == 1){
		$img.attr("src", imageset[shuffledArray[index]]);
	}
	else if(show == 0){
		$img.attr("src", "images/black.jpg");
	}
	else{
		$img.attr("src", "images/green.png");
	}
}

function changeAllImgs(show){
	var $imgs = $(".square img");
	for(var i = 0; i < $imgs.length; i++){
		changeImg(i, show);
	}
}

function changeAllImgsButCompletedPairs(show){
	var $imgs = $(".square img");
	for(var i = 0; i < $imgs.length; i++){
		var img = $imgs[i];
		if(!completedPairs.includes(shuffledArray[getImgIndex(img)])){		
			changeImg(i, show);
		}
	}
}

function completeAllPairs(){
	completedPairs = [];
	for(var i = 0; i < imageset.length; i++){
		completedPairs.push(i);
	}
}

function allPairsCompleted(){
	for(var i = 0; i < imageset.length; i++){
		if(!completedPairs.includes(i)){
			return false;
		}
	}
	return true;
}

function getImgIndex(img){
	var idStr = img.id;
	return idStr.slice(1);
}

//Got this from the Fisher-Yates shuffle algorithm here: https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length;
  var t;
  var i;
  
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m);
	m--;
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}