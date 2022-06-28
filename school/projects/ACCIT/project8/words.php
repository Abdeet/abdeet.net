<?php
include "wordlist.php";
session_start();


if($_SERVER['REQUEST_METHOD'] === 'GET'){
	if($_GET['request'] == "blanked"){
		$randomIndex = rand(0, count($words)-1);
		$correct = FALSE;
		$_SESSION['word'] = str_split($words[$randomIndex]);
		$_SESSION['wordToGuess'] = [];
		if($_GET['vowels'] == 'true'){
			$_SESSION['wordToGuess'] = $_SESSION['word'];
		}
		else{
			for($i = 0; $i < count($_SESSION['word']); $i++){
				if(preg_match('/[aeiou]/', $_SESSION['word'][$i])){
					$_SESSION['wordToGuess'][] = "_";
				}
				else{
					$_SESSION['wordToGuess'][] = $_SESSION['word'][$i];
				}
			}
		}
		$_SESSION['blankedWord'] = 	array_fill(0, count($_SESSION['word']), "_");
		$_SESSION['incorrectGuesses'] = 0;
		echo implode("", $_SESSION['blankedWord']);
	}
	else if($_GET['request'] == "word"){
	if($_SESSION['incorrectGuesses'] > 7 || $_SESSION['blankedWord'] == $_SESSION['wordToGuess']){
			echo implode("", $_SESSION['word']);
		}
		else{
			echo "401 Access Denied";
		}
	}
}

if($_SERVER['REQUEST_METHOD'] === 'POST'){
	if($_POST['request'] == "guess"){
		$correctGuess = FALSE;
		for($i = 0; $i < count($_SESSION['wordToGuess']); $i++){
			if(strcmp(strtolower($_POST['guess']), strtolower($_SESSION['wordToGuess'][$i])) == 0){
				$_SESSION['blankedWord'][$i] = $_POST['guess'];
				$correctGuess = TRUE;
			}
		}
		if($correctGuess){
			if(implode("", $_SESSION['wordToGuess']) == implode("", $_SESSION['blankedWord'])){
				echo json_encode([
					"status" => 100,
					"word" => implode("", $_SESSION['blankedWord']),
					"incorrectGuesses" => $_SESSION['incorrectGuesses']
				]);
			}
			else{
				echo json_encode([
					"status" => 200,
					"word" => implode("", $_SESSION['blankedWord']),
					"incorrectGuesses" => $_SESSION['incorrectGuesses']
				]);
			}
		}
		else{
			$_SESSION['incorrectGuesses']++;
			echo json_encode([
				"status" => 400,
				"word" => implode("", $_SESSION['blankedWord']),
				"incorrectGuesses" => $_SESSION['incorrectGuesses']
			]);
		}
	}
}