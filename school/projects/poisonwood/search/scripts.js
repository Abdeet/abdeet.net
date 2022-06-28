$("#submit-button").on("click", function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: 'search.php',
		data: {
			'request': 'search',
			'query': $("#search-field").val()
		},
		success: function(response){
			$("#search-results-header").text("Search results for " + $("#search-field").val());
			$("#search-field").val("");
			$("#search-output").html("");
			var searchResults = JSON.parse(response);
			for(var i = 0; i < searchResults['results'].length; i++){
				var result = searchResults['results'][i]
				$("#search-output").html($("#search-output").html() + "<br>\n<h3><a href='"+result['href'] + "'>" + result['name'] + "</a></h3>");
			}
		},
		error: function(error){
			alert("Error communicating with the server");
		}
	});
});
