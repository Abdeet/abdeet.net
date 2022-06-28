<?php

require_once 'sql.php';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
	if($_POST['reason'] == 'create'){
		if($_POST['message'] != ""){
			$sql = new MySql();
			$result = $sql->setMessage($_POST['message']);
			if($result === true){
				echo $_POST['message'];
			}
			else{
				echo $result;
			}
		}
	}
	else if($_POST['reason'] == "delete"){
		$sql = new MySql();
		$result = $sql->deleteMessage($_POST['id']);
		if($result === false){
			echo $result;
		}
		else{
			echo true;
		}
	}
	else if($_POST['reason'] == "update"){
		$sql = new MySql();
		$result = $sql->updateMessage($_POST['id'], $_POST['message']);
		if($result === true){
			echo $_POST['message'];
		}
		else{
			echo $result;
		}
	}
}