/*
$.ajax({
	type: '', //get or post
	url: '', //file on the server that will handle the request
	data: '', //only use data if sending something to the server, formatted as json
	success: function(response){
		console.log(response); //response is storing anything that was returned from the server
	},
	error: function(error){
		alert('error communicating with the server');
	}
});
*/

var currentWord = "";
var scrambledWord = "test";
var $scrambled = $("#scrambled");
var $submit = $("#submit-button");
var $guess = $("#guess-field");
var $output = $("#output-place");

function playGame(){
	updateStatistics();
	startNewRound();
}

function startNewRound(){
	getNewWord();
	$scrambled.text(scrambledWord);
	$guess.val("");
	$guess.text("");
}

function updateStatistics(){
	$.ajax({
		type: 'GET',
		url: 'words.php',
		data: {'request': 'stats'},
		success: function(response){
			gameStats = JSON.parse(response);
			$("#stats-total-words").text("Total Words: " + gameStats["totalWords"]);
			$("#stats-proportion-words-correct").text("% Words Correct: " + Math.round((gameStats["correctWords"]/gameStats["totalWords"])*10000)/100);
			$("#stats-total-guesses").text("Total Guesses: " + gameStats["totalGuesses"]);
			$("#stats-proportion-guesses-correct").text("% Guesses Correct: " + Math.round((gameStats["correctGuesses"]/gameStats["totalGuesses"])*10000)/100);
			$("#stats-mean-guesses-on-correct-words").text("Mean Guesses On Correct Words: " + Math.round((gameStats["totalGuessesOnCorrectWords"]/gameStats["correctWords"])*100)/100);
			$("#stats-mean-guesses-on-incorrect-words").text("Mean Guesses On Incorrect Words: " + Math.round((gameStats["totalGuessesOnIncorrectWords"]/gameStats["incorrectWords"])*100)/100);
			$("#stats-mean-letters-in-correct-words").text("Mean Letters In Correct Words: " + Math.round((gameStats["totalLettersInCorrectWords"]/gameStats["correctWords"])*100)/100);
			$("#stats-mean-letters-in-incorrect-words").text("Mean Letters In Incorrect Words: " + Math.round((gameStats["totalLettersInIncorrectWords"]/gameStats["incorrectWords"])*100)/100);

		},
		error: function(error){
			alert("Error communicating with the server");
		}
	});
	}

$submit.on("click", function(e){
	e.preventDefault();
	$scrambled.text(scrambledWord);
	let guess = $guess.val();
	checkWord(guess);
});

function getNewWord(){
	$.ajax({
		type: 'GET',
		url: 'words.php',
		data: {'request': 'scrambled'},
		success: function(response){
			scrambledWord = response;
			$scrambled.text(scrambledWord);
		},
		error: function(error){
			alert("Error communicating with the server");
		}
	});
}

function getHint(){
	$.ajax({
		type: 'GET',
		url: 'words.php',
		data: {'request': 'hint'},
		success: function(response) {
			$output.text($guess.val() + " is incorrect :( The answer starts with " + response);
			$guess.val(response);
		},
		error: function(error){
			alert("Error communicating with the server");
		}
	});
}

function getWord(){
	$.ajax({
		type: 'GET',
		url: 'words.php',
		data: {'request': 'word'},
		success: function(response){
			$output.text($guess.val() + " is incorrect D: The correct answer was " + response);
			updateStatistics();
			startNewRound();
		},
		error: function(error){
			alert("Error communicating with the server");
		}
	});
}

function checkWord(guess){
	$.ajax({
		type: 'POST',
		url: 'words.php',
		data: {
			'request': 'guess',
			'guess': guess
		},
		success: function(response){
			responseJSON = JSON.parse(response);
			if(responseJSON["status"] == "200"){
				$output.text(guess + " is the correct answer :D");
				updateStatistics();
				startNewRound();
			}
			else{
				if(responseJSON["guesses"] == "1"){
					getHint();
				}
				else{
					getWord();
				}
			}
		},
		error: function(error){
			alert("Error communicating with the server");
		}
	});
}