<?php
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
	
	require_once "sql.php";
	$sql = new MySql();
	
	$messages = $sql->getMessages();
?>

<!doctype html>
<html lang="en">
	 <head>
		<!-- Required meta tags -->
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- Bootstrap CSS -->
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
		<!-- project stylesheet link -->
		<link href="styles.css" rel="stylesheet">
		
		<title></title>
		<style>
			h1{
				text-align: center;
			}
			#left-sidebar{
				float: left;
				width: 10%;
				height: 80%;
				padding: 0;
				margin: 0;
			}
			#message-board{
				float: left;
				width: 80%;
				height: 80%:
				padding: 0;
				margin: 0;
			}
			#right-sidebar{
				float: left;
				width: 10%;
				height: 80%:
				padding: 0;
				margin: 0;
			}
			#bottom-bar{
				width: 100%;
				height: 20%;
				padding: 0;
				margin: 0;
			}
			.message-div{
				min-height: 40px;
				overflow: hidden;
			}
			.message-text{
				display: inline-block;
				width: 60%;
				white-space: normal;
				word-wrap: break-word;
				float: left;
			}
			.message-button{
				display: inline-block;
				float: right;
				padding: 5px;
				margin-right: 5px;
			}
			.icon-x{
				pointer-events: none;
				font-size: 30px;
			}
			.icon-edit{
				pointer-events: none;
				font-size: 30px;
			}
			
			#message-textarea{
				width: 80%;
			}
		</style>	
	</head>
	<body>
		<h1>Messages</h1>
		<div class="container-fluid" id="left-sidebar"></div>
		<div class="container-fluid" id="message-board">
			<?php foreach($messages as $id => $msg):?>
				<div class="container-fluid message-div y-3" id="<?=$id?>">
					<h3 class="message-text my-0"><?=$msg?></h3>
					<button class="message-button delete-button btn btn-danger btn-small"><i class="bi bi-x-circle-fill icon-x"></i></button>
					<button class="message-button edit-button btn btn-warning btn-small"><i class="bi bi-pencil-fill icon-edit"></i></button>
				</div>
				<hr>
			<?php endforeach;?>
		</div>
		<div class="container-fluid" id="right-sidebar"></div>
		<div class="container-fluid" id="bottom-bar">
			<form>
				<textarea id="message-textarea" type="text"></textarea>
				<br>
				<input type="submit">
			</form>
		</div>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>
		<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
		<script src="scripts.js"></script>
		
		<script>
		</script>
	</body>
</html>