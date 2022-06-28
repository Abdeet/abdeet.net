<?php
require_once 'constants.php';

class MySql{
	private $conn;
	
	//constructor - runs when we first start a new connection
	function __construct(){
		$this->conn = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
		if($this->conn->connect_error){
			die("Connection failed: " . $this->conn->connect_error);
		}
		$tableCreated = $this->createMessageTable();
		if(!$tableCreated) return $tableCreated;
	}
	
	function createMessageTable(){
		$query = "CREATE TABLE IF NOT EXISTS messages(
			id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			message TEXT NOT NULL
		)";
		$stmt = $this->conn->prepare($query);
		if(!$stmt->execute()){
			return $stmt->error;
		}
		return true;
	}
	
	function setMessage($message){
		$query = "INSERT INTO messages
			(message)
			VALUES (?)";
			
		if(!($stmt = $this->conn->prepare($query))) return "prepare failed";
		if(!$stmt->bind_param('s', $message)) return "bind failed";
		if(!$stmt->execute()) return "execute failed";
		return true;
	}
	
	function getMessages(){
		$query = "SELECT * FROM messages";
		if(!($stmt = $this->conn->prepare($query))) return "prepare failed";
		if(!$stmt->execute()) return "execute failed";
		$messageArray = array();
		$stmt->bind_result($id, $message);
		while($stmt->fetch()){
			$messageArray[$id] = $message;
		}
		$stmt->close();
		return $messageArray;
	}
	
	function deleteMessage($id){
		$query = "DELETE FROM messages WHERE id=?";
		if(!($stmt = $this->conn->prepare($query))) return "prepare failed";
		if(!$stmt->bind_param('i', intval($id))) return "bind failed";
		if(!$stmt->execute()) return "execute failed";
		return true;
	}
	
	function updateMessage($id, $message){
		$query = "UPDATE messages SET message=? WHERE id=?";
		if(!($stmt = $this->conn->prepare($query))) return "prepare failed";
		if(!$stmt->bind_param('si', $message, intval($id))) return "bind failed";
		if(!$stmt->execute()) return "execute failed";
		return true;
	}
}