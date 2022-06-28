var words = ["lion", "dog", "god", "dinosaur", "bookkeeper",'chocolate', 'definition', 'affair', 'road', 'significance', 'college', 'bath', 'dealer', 'version', 'artisan', 'patience', 'exam', 'photo', 'bird', 'world', 'painting', 'presence', 'finding', 'opinion', 'transportation', 'entertainment', 'employee', 'river', 'effort', 'employment', 'hat', 'leader', 'measurement', 'performance', 'percentage', 'priority', 'actor', 'blood', 'education', 'politics', 'bonus', 'speaker', 'grandmother', 'throat', 'difference', 'addition', 'success', 'energy', 'movie', 'lake', 'driver', 'pizza', 'winner', 'psychology', 'hearing'];
var currentWord = "";
var scrambledWord = scramble(currentWord);
var $scrambled = $("#scrambled");
var $submit = $("#submit-button");
var $guess = $("#guess-field");
var $output = $("#output-place");
var incorrectGuesses = 0;
var gameStats = {
	"totalWords": 0,
	"correctWords": 0,
	"incorrectWords": 0,
	"totalLettersInAllWords": 0,
	"totalLettersInCorrectWords": 0,
	"totalLettersInIncorrectWords": 0,
	"totalGuesses": 0,
	"correctGuesses": 0,
	"incorrectGuesses": 0,
	"totalGuessesOnCorrectWords": 0,
	"totalGuessesOnIncorrectWords": 0
}

function startNewRound(){
	if(words.length > 0){
		getNewWord();
		$scrambled.text(scrambledWord);
		$guess.val("");
		$guess.text("");
	}
	else{
		$output.text("You have unscrambled/failed every word");
		$submit.prop("disabled", true);
		$guess.prop("disabled", true);
	}
}

function getNewWord(){
	let randIndex = Math.floor(Math.random() * words.length);
	currentWord = words[randIndex];
	scrambledWord = scramble(currentWord);
	words.splice(randIndex, 1);
}

function scramble(word){
	let wordArray = word.split("");
	let shuffledWordArray = shuffle(wordArray);
	let shuffledWord = shuffledWordArray.join("");
	return shuffledWord;
}

function checkWord(guess){
	if(guess.toLowerCase() == currentWord.toLowerCase()){
		return true;
	}
	else{
		return false;
	}
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

function updateStatistics(scrambledWord, correct, numGuesses){
	gameStats["totalWords"]++;
	gameStats["totalLettersInAllWords"] += scrambledWord.length;
	gameStats["totalGuesses"] += numGuesses;
	if(correct){
		gameStats["correctWords"]++;
		gameStats["totalLettersInCorrectWords"] += scrambledWord.length;
		gameStats["correctGuesses"]++;
		gameStats["totalGuessesOnCorrectWords"] += numGuesses;
		gameStats["incorrectGuesses"] += numGuesses - 1;
	}
	else{
		gameStats["incorrectWords"]++;
		gameStats["totalLettersInIncorrectWords"] += scrambledWord.length;
		gameStats["incorrectGuesses"] += numGuesses;
		gameStats["totalGuessesOnIncorrectWords"] += numGuesses;
	}
	
	$("#stats-total-words").text("Total Words: " + gameStats["totalWords"]);
	$("#stats-proportion-words-correct").text("% Words Correct: " + Math.round((gameStats["correctWords"]/gameStats["totalWords"])*10000)/100);
	$("#stats-total-guesses").text("Total Guesses: " + gameStats["totalGuesses"]);
	$("#stats-proportion-guesses-correct").text("% Guesses Correct: " + Math.round((gameStats["correctGuesses"]/gameStats["totalGuesses"])*10000)/100);
	$("#stats-mean-guesses-on-correct-words").text("Mean Guesses On Correct Words: " + Math.round((gameStats["totalGuessesOnCorrectWords"]/gameStats["correctWords"])*100)/100);
	$("#stats-mean-guesses-on-incorrect-words").text("Mean Guesses On Incorrect Words: " + Math.round((gameStats["totalGuessesOnIncorrectWords"]/gameStats["incorrectWords"])*100)/100);
	$("#stats-mean-letters-in-correct-words").text("Mean Letters In Correct Words: " + Math.round((gameStats["totalLettersInCorrectWords"]/gameStats["correctWords"])*100)/100);
	$("#stats-mean-letters-in-incorrect-words").text("Mean Letters In Incorrect Words: " + Math.round((gameStats["totalLettersInIncorrectWords"]/gameStats["incorrectWords"])*100)/100);
}

$submit.on("click", function(e){
	e.preventDefault();
	let guess = $guess.val();
	if(checkWord(guess)){
		$output.text(guess + " is the correct answer :D");
		updateStatistics(guess, true, 1 + incorrectGuesses);
		incorrectGuesses = 0;
		startNewRound();
	}
	else if(incorrectGuesses < 1){
		incorrectGuesses++;
		$output.text(guess + " is incorrect :( The answer starts with " + currentWord.slice(0,2));
		$guess.val(currentWord.slice(0,2));
	}
	else{
		$output.text(guess + " is incorrect D: The correct answer was " + currentWord);
		updateStatistics(guess, false, 1 + incorrectGuesses);
		incorrectGuesses = 0;
		startNewRound();
	}
});