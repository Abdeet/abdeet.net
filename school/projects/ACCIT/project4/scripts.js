class Node {
	constructor(id, content, img){
		this.id = id;
		this.content = content;
		this.img = img;
	}
	
	getID(){
		return this.id;
	}
	
	getText(){
		return this.content;
	}
	
	getImg(){
		return this.img;
	}
	
	getNextID(){
		
	}
	
	getNextText(){
	}
	
	getType(){
	}
}

class Decision extends Node {
	constructor(id, content, img, decision1Text, decision1ID, decision2Text, decision2ID){
		super(id, content, img);
		this.decision1 = {
			"text": decision1Text,
			"id" : decision1ID
		}
		this.decision2 = {
			"text": decision2Text,
			"id" : decision2ID
		}
	}
	
	getNextID(decisionNum){
		var a = "this.decision" + decisionNum;
		var thisDecision = eval(a);
		return thisDecision["id"];
	}
	
	getNextText(decisionNum){
		var thisDecision = eval("this.decision" + decisionNum);
		return thisDecision["text"];
	}
	
	getType(){
		return "decision";
	}
	
	
}

class Clicker extends Node {
	constructor(id, content, img, clickText, numClicks, time, successID, failureID){
		super(id, content, img);
		this.clickText = clickText;
		this.numClicks = numClicks;
		this.time = time;
		this.successID = successID;
		this.failureID = failureID;
	}
	
	getTime(){
		return this.time;
	}
	
	getNumClicks(){
		return this.numClicks;
	}
	
	getNextID(success){
		if(success){
			return this.successID;
		}
		return this.failureID;
	}
	
	getNextText(){
		return this.clickText;
	}
	
	getType(){
		return "clicker";
	}
	
	isSuccess(clicks){
		if(clicks > this.numClicks){
			return true;
		}
		return false;
	}
	
	
}

class Page extends Node {
	constructor(id, content, img, nextID, nextText){
		super(id, content, img);
		this.next = {
			"text": nextText,
			"id": nextID
		}
	}
	
	getNextID(){
		return this.next["id"];
	}
	
	getNextText(){
		return this.next["text"];
	}
	
	getType(){
		return "page";
	}
}

class Story {
	
	constructor(title, author, blurb, nodes){
		this.title = title;
		this.author = author;
		this.blurb = blurb;
		this.nodes = nodes;
		this.titleNode = new Page(0, blurb, "images/0.png", 1, "Start Story");
		this.nodes.push(this.titleNode);
		this.currentNode = this.titleNode;
		this.one = "one";
	}
	
	getTitle(){
		return this.title;
	}
	
	getAuthor(){
		return this.author;
	}
	
	getCurrentNode(){
		return this.currentNode;
	}
	
	addNode(node){
		this.nodes.push(node);
	}
	
	getNodeByID(id){
		for(var i = 0; i < this.nodes.length; i++){
			if(this.nodes[i].getID() == id){
				return this.nodes[i];
			}
		}
	}
	
	getNextNode(num){
		return this.getNodeByID(this.currentNode.getNextID(num));
	}	
	
	proceedToNextNode(num){
		var nextNode = this.getNextNode(num);
		this.currentNode = nextNode;
	}
}

var myStory = new Story("My Cousin Slenderman", "Abdeet", "A man wakes up in front of an abandoned mineshaft. He has to make the choice, go in or get out.", []);

myStory.addNode(new Decision(1, "You wake up in front of an abandoned mineshaft with no recollection of how you got there.", "images/1.png", "Go inside", 2, "Leave", 3));
myStory.addNode(new Decision(2, "You go into the mineshaft. In front of you are two paths", "images/2.jpg", "Head left", 4, "Head right", 5));
myStory.addNode(new Decision(3, "You decide to leave the mineshaft. The sun is setting quickly", "images/3.jpg", "Leave in the night", 6, "Go to sleep and wait for the morning", 7));
myStory.addNode(new Page(4, "You head down the left path. It is so dark you can't see your own hands, but you forge on.", "images/4.jpg", 8, "Continue"));
myStory.addNode(new Page(5, "You head down the left path. In front of you there is a bright light that seems to draw you in.", "images/5.jpg", 9, "Continue"));
myStory.addNode(new Page(6, "You leave in the night. It is dark which makes it hard to see", "images/6.png", 10, "Continue"));
myStory.addNode(new Page(7, "You wait for the morning. In the meantime, you drift away to sleep", "images/7.jpg", 11, "Continue"));
myStory.addNode(new Page(8, "As you stumble through the dark, you suddenly feel your feet step into nothingness. You start to fall, only to be interrupted by hitting the ground. You are all alone in a huge hole. THE END", "images/8.jpg", 0, "Try Again"));
myStory.addNode(new Page(9, "You discover an ancient temple. However, it looks as if people have been here recently", "images/9.jpg", 12, "Continue"));
myStory.addNode(new Page(10, "You sprint through the woods trying to get as far away from the mineshaft as possible and towards civilization.", "images/10.jpg", 13, "Continue"));
myStory.addNode(new Page(11, "You wake up and rub the sleep out of your eyes. You look to the left and see a business card. It has three shapes on it and a number. THE END", "images/11.jpg", 0, "Try again"));
myStory.addNode(new Page(12, "In front of you lies a cornucopia full of food. It's been a while since you last saw food, and it contains all of your favorites.", "images/12.jpg", 14, "Continue"));
myStory.addNode(new Decision(13, "You come to a sudden stop. There is a very tall man in front of you, wearing a suit. He is looking away and doesn't seem aware of your presence.", "images/13.jpg", "Attack", 15, "Run", 16));
myStory.addNode(new Page(14, "You reach out and touch the food. It feels real. You take a bite.", "images/14.jpg", 17, "Continue"));
myStory.addNode(new Clicker(15, "You attack him with all your might.", "images/15.jpg", "Attack", 25, 5, 19, 18));
myStory.addNode(new Page(16, "You start to run.", "images/16.jpg", 20, "Continue"));
myStory.addNode(new Page(17, "Out of the shadows, twenty people appear. They are hooded, wearing goat masks and red robes.", "images/17.jpg", 21, "Continue"));
myStory.addNode(new Page(18, "You don't manage to kill him. You barely even make a mark. He turns around and it turns out it's just a totally normal guy.", "images/18.jpg", 22, "Continue"));
myStory.addNode(new Page(19, "You manage to kill him. When you turn him around he is just a totally normal guy.", "images/19.jpg", 23, "Continue"));
myStory.addNode(new Page(20, "You trip over a rock. Your head slams against the ground. At least it was painless? THE END", "images/20.jpg", 0, "Try again"));
myStory.addNode(new Page(21, "They start chanting your name, with greater and greater intensity. They hail you as their god.", "images/21.jpg", 24, "Continue"));
myStory.addNode(new Page(22, "The man takes you to his cabin and listens to your story. He offers to let you stay for a week. You fall in love and a year later, get married. THE END", "images/22.jpg", 0, "Try Again"));
myStory.addNode(new Page(23, "The police soon arrive and arrest you for murder. THE END", "images/23.jpg", 0, "Try Again"));
myStory.addNode(new Page(24, "The camera pans up to reveal you are merely a doll in a child's game. THE END", "images/24.jpg", 0, "Try Again"));

var myStory2 = new Story("The time I went to Zimbabwe", "Abhi Senthilkumar", "This story is about the time I went to Zimbabwe.", []);
myStory2.addNode(new Decision(1, "Page 1", "images/1.png", "fdajfsd;lkfjsdk", 2, "fsdfjsdl", 3));
myStory2.addNode(new Page(2, "Page 1", "images/1.png", 1, "restart"));
myStory2.addNode(new Page(3, "Page 1", "images/1.png", 1, "restart"));


var storyImg = $("#story-img");
var storyText = $("#story-text");
var leftButton = $("#left-button");
var centerButton = $("#center-button");
var rightButton = $("#right-button");
var body = $("body");
var timer = $("#timer");
var story = myStory;

$("#title").text(story.title);
$("#author").text(story.author);
storyImg.attr("src", story.getCurrentNode().getImg());
storyText.text(story.getCurrentNode().getText());

prepareScreen(story.getCurrentNode());

leftButton.on("click", function(e){
	story.proceedToNextNode(1);
	prepareScreen();
});

centerButton.on("click", function(e){
	if(story.getCurrentNode().getType() == "page"){
		story.proceedToNextNode(1);
		prepareScreen();
	}
});

rightButton.on("click", function(e){
	story.proceedToNextNode(2);
	prepareScreen();
});

var countClicks = false;
var numClicks = 0;

body.on("click", function(e){
	if(countClicks){
		numClicks++;
	}
});

function prepareScreen(){
	let node = story.getCurrentNode();
	storyImg.attr("src", node.getImg());
	storyText.text(node.getText());
	if(node.getType() == "page"){
		leftButton.css("visibility", "hidden");
		centerButton.css("visibility", "visible");
		centerButton.text(node.getNextText());
		rightButton.css("visibility", "hidden");
		timer.text("");
	}
	else if(node.getType() == "decision"){
		leftButton.css("visibility", "visible");
		leftButton.text(node.getNextText(1));
		centerButton.css("visibility", "hidden");
		rightButton.css("visibility", "visible");
		rightButton.text(node.getNextText(2));
		timer.text("");
	}
	else if(node.getType() == "clicker"){
		leftButton.css("visibility", "hidden");
		centerButton.css("visibility", "visible");
		centerButton.text(node.getNextText());
		rightButton.css("visibility", "hidden");
		countClicks = true;
		numClicks = 0;
		let time = node.getTime();
		timer.text(time);
		var decrementTimer = setInterval(function(){
			time--;
			timer.text(time);
		}, 1000);
		setTimeout(function(){
			clearInterval(decrementTimer);
			countClicks = false;
			if(node.isSuccess(numClicks)){
				myStory.proceedToNextNode(1);
				prepareScreen();
			}
			else{
				myStory.proceedToNextNode(0);
				prepareScreen();
			}
		}, node.getTime() * 1000);
	}
}



