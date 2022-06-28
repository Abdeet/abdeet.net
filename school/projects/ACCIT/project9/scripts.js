var editing = false;
var editId = 0;

$("form").on("submit", function(e){
	e.preventDefault();
	var message = $("#message-textarea").val();
	console.log(message);
	$("#message-textarea").val("");
	if(!editing){
		$.ajax({
			type: 'POST',
			url: 'backend.php',
			data: {'reason': 'create', 'message': message},
			success: function(response){
				location.reload();
			},
			error: function(error){
				alert('error communicating with the server');
			}
		});
	}
	else{
		$.ajax({
			type: 'POST',
			url: 'backend.php',
			data: {'reason': 'update', 'id': editId, 'message': message},
			success: function(response){
				location.reload();
			},
			error: function(error){
				alert('error communicating with the server');
			}
		});
	}
});

$(".delete-button").on("click", function(e){
	e.preventDefault();
	var deleteId = $(e.target).parent().attr("id");
	$.ajax({
		type: 'POST',
		url: 'backend.php',
		data: {'reason': 'delete', 'id': deleteId},
		success: function(response){
			location.reload();
		},
		error: function(error){
			alert('error communicating with the server');
		}
	});
});

$(".edit-button").on("click", function(e){
	e.preventDefault();
	if(!editing){
		editing = true;
		editId = $(e.target).parent().attr("id");
		$("#message-textarea").val($(e.target).parent().children(".message-text").text());
	}
	else{
		editing = false;
		$("#message-textarea").val("");
	}
});