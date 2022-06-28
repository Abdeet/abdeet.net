<?php
include "wordlist.php";
session_start();


if($_SERVER['REQUEST_METHOD'] === 'GET'){
	if($_GET['request'] == "hint"){
		echo substr($words[$_SESSION['randomIndex']], 0, 2);
	}
	else if($_GET['request'] == "blanked"){
		$_SESSION['randomIndex'] = rand(0, count($words)-1);
		$_SESSION['correct'] = FALSE;
		$_SESSION['incorrectGuesses'] = 0;
		$_SESSION['word'] = str_split($words[$_SESSION['randomIndex']]);
		$_SESSION['blankedWord'] = 	array_fill(0, count($_SESSION['word']));
		echo implode("", $_SESSION['blankedWord']);
	}
	else if($_GET['request'] == "word"){
		echo implode("", $_SESSION['word']);
	}
}

if($_SERVER['REQUEST_METHOD'] === 'POST'){
	if($_POST['request'] == "guess"){
		$correctGuess = FALSE;
		for($i = 0; $i < count($_SESSION['word']; $i++){
			if($_POST['guess'] == $_SESSION['word'][$i]){
				$_SESSION['blankedWord'][$i] = $_POST['guess'];
				$correctGuess = TRUE;
			}
		}
		if($correctGuess){
			if(implode("", $_SESSION['word']) == implode("", $_SESSION['blankedWord']){
				echo json_encode([
					"status" => 100,
					"incorrectGuesses" => $_SESSION['incorrectGuesses'],
					"word" => $_SESSION['word']
			}
			else{
				echo json_encode([
					"status" => 200,
					"incorrectGuesses" => $_SESSION['incorrectGuesses'],
					"word" => $_SESSION['blankedWord']
				]);
			}
		else{
			$_SESSION['incorrectGuesses']++;
			echo json_encode([
				"status" => 400,
				"incorrectGuesses" => $_SESSION['incorrectGuesses'],
				"word" => $_SESSION['blankedWord']
			]);
		}
	}
}