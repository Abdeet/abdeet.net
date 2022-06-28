//abhi senthilkumar
//i attest is was my own work and was not copied from any other source

//words from random word generator website
var words = ["lion", "dog", "god", "dinosaur", "bookkeeper",'chocolate', 'definition', 'affair', 'road', 'significance', 'college', 'bath', 'dealer', 'version', 'artisan', 'patience', 'exam', 'photo', 'bird', 'world', 'painting', 'presence', 'finding', 'opinion', 'transportation', 'entertainment', 'employee', 'river', 'effort', 'employment', 'hat', 'leader', 'measurement', 'performance', 'percentage', 'priority', 'actor', 'blood', 'education', 'politics', 'bonus', 'speaker', 'grandmother', 'throat', 'difference', 'addition', 'success', 'energy', 'movie', 'lake', 'driver', 'pizza', 'winner', 'psychology', 'hearing'];
var currentWord = "";
var currentWordAsArray = [];
var revealedWord = [];
var $form = $("#guessing-form");
var $blanked = $("#blanked");
var $submit = $("#submit-button");
var $guess = $("#guess-field");
var $output = $("#output-place");
var $incorrect = $("#incorrect-guesses");
var incorrectGuesses = 0;
var listOfIncorrectGuesses = [];
var gameOver = false;

function startGame(){
	gameOver = false;
	clearScreen();
	$output.text("");
	drawTitle(125, canvas.height-90);
	currentWord = "";
	incorrectGuesses = 0;
	listOfIncorrectGuesses = [];
	if(words.length > 0){
		getNewWord();
		display(incorrectGuesses);
	}
	else{
		$output.text("You have beaten the game (or lost horribly)!");
		$submit.prop("disabled", true);
		$guess.prop("disabled", true);
	}
}

function getNewWord(){
	let randIndex = Math.floor(Math.random() * words.length);
	currentWord = words[randIndex].toLowerCase();
	//currentWord = "entertainment";
	currentWordAsArray = currentWord.split("");
	revealedWord = Array(currentWord.length).fill("_");
	words.splice(randIndex, 1);
}

function display(incorrectGuesses){
	let reveal = revealedWord.join(" ");
	$blanked.text(reveal);
	$guess.val("");
	$incorrect.text(listOfIncorrectGuesses.join(" "));
	drawHangman(incorrectGuesses, 125, canvas.height-90);
}

function getIndexes(wordArray, letter){
	let indexes = [];
	for(var i = 0; i < wordArray.length; i++){
		if(letter == wordArray[i]){
			indexes.push(i);
		}
	}
	return indexes;
}

function endGame(win){
	gameOver = true;
	display(incorrectGuesses);
	if(win){
		$output.text("You Win! New game starts in ...3 ");
	}
	else{
		$output.text("You Lose :( New game starts in ...3 ");
	}
	let time = 3;
	var decrementTimer = setInterval(function(){
		time--;
		$output.text($output.text() + "..." + time + " ");
	}, 1000);
	
	setTimeout(function(){
		clearInterval(decrementTimer);
		startGame();
	}, 3000);
	
}

$form.on("submit", function(e){
	e.preventDefault();
	if(!gameOver){
		let guess = $guess.val().toLowerCase();
		console.log(guess);
		if(listOfIncorrectGuesses.includes(guess) || guess == " "){
			$guess.val("");
		}
		else{
			let indexes = getIndexes(currentWordAsArray, guess.toLowerCase());
			if(indexes.length == 0){
				incorrectGuesses++;
				listOfIncorrectGuesses.push(guess);
				if(incorrectGuesses > 7){
					endGame(false);
				}
			}
			else{
				for(var i = 0; i < indexes.length; i++){
					revealedWord[indexes[i]] = guess;
				}
				if(!revealedWord.includes("_")){
					endGame(true);
				}
			}
			display(incorrectGuesses);
		}
	}
});