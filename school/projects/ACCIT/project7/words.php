<?php
include "wordlist.php";
session_start();

if(!isset($_SESSION['stats'])){
	$_SESSION['stats'] = [
		"totalWords" => 0,
		"correctWords" => 0,
		"incorrectWords" => 0,
		"totalLettersInAllWords" => 0,
		"totalLettersInCorrectWords" => 0,
		"totalLettersInIncorrectWords" => 0,
		"totalGuesses" => 0,
		"correctGuesses" => 0,
		"incorrectGuesses" => 0,
		"totalGuessesOnCorrectWords" => 0,
		"totalGuessesonIncorrectWords" => 0
	];
}

if($_SERVER['REQUEST_METHOD'] === 'GET'){
	if($_GET['request'] == "hint"){
		if($_SESSION['guesses'] >= 1){
			echo substr($words[$_SESSION['randomIndex']], 0, 2);
		}
		else{
			echo "401 Access Denied";
		}
	}
	else if($_GET['request'] == "scrambled"){
		$_SESSION['randomIndex'] = rand(0, count($words)-1);
		$_SESSION['correct'] = FALSE;
		$_SESSION['guesses'] = 0;
		$scrambledWord = str_shuffle($words[$_SESSION['randomIndex']]);
		echo $scrambledWord;
	}
	else if($_GET['request'] == "word"){
		if($_SESSION['guesses'] >= 2){
			echo $words[$_SESSION['randomIndex']];
		}
		else{
			echo "401 Access Denied";
		}
	}
	else if($_GET['request'] == "stats"){
		updateStats();
		echo json_encode($_SESSION['stats']);
	}
}

if($_SERVER['REQUEST_METHOD'] === 'POST'){
	if($_POST['request'] == "guess"){
		$_SESSION['guesses'] += 1;
		if(strcmp(strtolower($_POST['guess']), strtolower($words[$_SESSION['randomIndex']])) === 0){
			$_SESSION['correct'] = TRUE;
			echo json_encode([
				"status" => 200,
				"guesses" => $_SESSION['guesses']
			]);
		}
		else{
			echo json_encode([
				"status" => 400,
				"guesses" => $_SESSION['guesses']
			]);
		}
	}
}

function updateStats(){
	$correct = $_SESSION['correct'];
	$numGuesses = $_SESSION['guesses'];
	$_SESSION["stats"]["totalWords"] += 1;
	$_SESSION['stats']['totalLettersInAllWords'] += strlen($words[$_SESSION['randomIndex']]);
	$_SESSION['stats']['totalGuesses'] += $numGuesses;
	if($correct){
		$_SESSION["stats"]["correctWords"] += 1;
		$_SESSION['stats']['totalLettersInCorrectWords'] += strlen($words[$_SESSION['randomIndex']]);
		$_SESSION['stats']['correctGuesses'] += 1;
		$_SESSION['stats']['incorrectGuesses'] += $numGuesses - 1;
		$_SESSION['stats']['totalGuessesOnCorrectWords'] += $numGuesses;
	}
	else{
		$_SESSION["stats"]["incorrectWords"] += 1;
		$_SESSION['stats']['totalLettersInIncorrectWords'] += strlen($words[$_SESSION['randomIndex']]);
		$_SESSION['stats']['incorrectGuesses'] += $numGuesses;
		$_SESSION['stats']['totalGuessesOnIncorrectWords'] += $numGuesses;
	}
}
?>