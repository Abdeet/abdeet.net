//abhi senthilkumar
//i attest is was my own work and was not copied from any other source

var revealedWord = [];
var $form = $("#guessing-form");
var $blanked = $("#blanked");
var $submit = $("#submit-button");
var $guess = $("#guess-field");
var $output = $("#output-place");
var $incorrect = $("#incorrect-guesses");
var $checkbox = $("#allow-vowels");
var incorrectGuesses = 0;
var listOfIncorrectGuesses = [];
var gameOver = false;
var enableVowels = true;

function startGame(){
	$checkbox.attr("disabled", true);
	gameOver = false;
	clearScreen();
	$output.text("");
	drawTitle(125, canvas.height-90);
	incorrectGuesses = 0;
	listOfIncorrectGuesses = [];
	getNewWord();
	display(incorrectGuesses);
}

function getNewWord(){
	if($checkbox.is(":checked")){
		enableVowels = true;
	}
	else{
		enableVowels = false;
	}
	$.ajax({
		type: 'GET',
		url: 'words.php',
		data: {'request': 'blanked', 'vowels': enableVowels},
		success: function(response){
			revealedWord = response.split("");
			$blanked.text(revealedWord.join(" "));
		},
		error: function(error){
			alert("Error communicating with the server");
		}
	});
}

function display(incorrectGuesses){
	let reveal = revealedWord.join(" ");
	$blanked.text(reveal);
	$guess.val("");
	$incorrect.text(listOfIncorrectGuesses.join(" "));
	drawHangman(incorrectGuesses, 125, canvas.height-90);
}

function endGame(win){
	gameOver = true;
	display(incorrectGuesses);
	$checkbox.attr("disabled", false);
	if(win){
		$.ajax({
			type: 'GET',
			url: 'words.php',
			data: {
				'request': 'word'
			},
			success: function(response){
				let correctWord = response.split("");
				$blanked.text(correctWord.join(" "));
			},
			error: function(error){
				alert("Error communicating with the server");
			}
		});
		$output.text("You Win! New game starts in ...5 ");
	}
	else{
		$.ajax({
			type: 'GET',
			url: 'words.php',
			data: {
				'request': 'word'
			},
			success: function(response){
				let correctWord = response.split("");
				$blanked.html("");
				for(var i = 0; i < correctWord.length; i++){
					if(correctWord[i] == revealedWord[i]){
						$blanked.html($blanked.html() + correctWord[i] + " ");
					}
					else{
						$blanked.html($blanked.html() + '<span class="red-text">' + correctWord[i] + "</span> ");
					}
				}
			},
			error: function(error){
				alert("Error communicating with the server");
			}
		});
		$output.text("You Lose :( New game starts in ...5 ");
	}
	let time = 5;
	var decrementTimer = setInterval(function(){
		time--;
		$output.text($output.text() + "..." + time + " ");
	}, 1000);
	
	setTimeout(function(){
		clearInterval(decrementTimer);
		startGame();
	}, 5000);
}

$form.on("submit", function(e){
	e.preventDefault();
	let guess = $guess.val().toLowerCase();
	if(!enableVowels && guess.match(/[aeiou]/)){
		$guess.val("");
	}
	else if(listOfIncorrectGuesses.includes(guess) || gameOver || guess == ""){
		$guess.val("");
	}
	else{
		$.ajax({
			type: 'POST',
			url: 'words.php',
			data: {
				'request': 'guess',
				'guess': guess
			},
			success: function(response){
				var responseJSON = JSON.parse(response);
				revealedWord = responseJSON["word"].split("");
				$blanked.text(revealedWord.join(" "));
				if(responseJSON["status"] == "100"){
					incorrectGuesses = 10;
					endGame(true);
				}
				else if(responseJSON["status"] == "200"){
					incorrectGuesses = responseJSON['incorrectGuesses'];
				}
				else{
					incorrectGuesses = responseJSON['incorrectGuesses'];
					listOfIncorrectGuesses.push(guess);
					if(incorrectGuesses > 7){
						endGame(false);
					}
				}
				display(incorrectGuesses);
			},
			error: function(error){
				alert("Error communicating with the server");
			}
		});
	}

});

$checkbox.change(function(){
	if(this.checked){
		$("#checkbox-label").text("Vowels enabled");
		//$output.text("Vowels will be enabled once a new game starts.");
	} 	
	else{
		$("#checkbox-label").text("Vowels disabled");
		//$output.text("Vowels will be disabled once a new game starts.");
	}
});