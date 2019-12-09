$(function(){
	$("#delete_id").hide()
	$("#delete_data_confirm").hide()
	$("#delete_label").hide()

	$("#add_rating_label").hide()
	$("#add_rating_id").hide()
	$("#add_book_label").hide()
	$("#add_book_id").hide()
	$("#add_data_confirm").hide()

	$("#edit_rating_label").hide()
	$("#edit_rating_id").hide()
	$("#edit_book_label").hide()
	$("#edit_book_id").hide()
	$("#edit_data_confirm").hide()

	$('#delete_data').click(function(){
		if($("#delete_data_confirm").is(":visible")){
			$("#delete_id").hide()
			$("#delete_data_confirm").hide()
			$("#delete_label").hide()
		}else{
			$("#delete_id").show()
			$("#delete_data_confirm").show()
			$("#delete_label").show()
		}
	});

	$('#delete_data_confirm').click(function(){
		data = {user_id: $('#user_id').text(), book_id: $('#delete_id').val()}
		console.log(data)
		$.ajax({
			url: "/deleteuserdata",
			data: data,
			type: 'POST',  
		  	success:function(response){
				var response = JSON.parse(response)
				if(response.status == "FAIL"){
					console.log("hi")
					alert("That book cannot be deleted as it hasn't been rated")
				}else{
					getData();
				}
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});

	$('#add_data').click(function(){
		if($("#add_data_confirm").is(":visible")){
			$("#add_rating_label").hide()
			$("#add_rating_id").hide()
			$("#add_book_label").hide()
			$("#add_book_id").hide()
			$("#add_data_confirm").hide()
		}else{
			$("#add_rating_label").show()
			$("#add_rating_id").show()
			$("#add_book_label").show()
			$("#add_book_id").show()
			$("#add_data_confirm").show()
		}
	});

	$('#add_data_confirm').click(function(){
		data = {user_id: $('#user_id').text(), book_id: $('#add_book_id').val(),
				rating: $('#add_rating_id').val()}
		console.log(data)
		$.ajax({
			url: "/adduserdata",
			data: data,
			type: 'POST',  
		  	success:function(response){
				var response = JSON.parse(response);
				if(response.status == 'FAIL'){
					alert("You have already rated that book!");
				}else{
					getData();
				}
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});

	$('#edit_data').click(function(){
		if($("#edit_data_confirm").is(":visible")){
			$("#edit_rating_label").hide()
			$("#edit_rating_id").hide()
			$("#edit_book_label").hide()
			$("#edit_book_id").hide()
			$("#edit_data_confirm").hide()
		}else{
			$("#edit_rating_label").show()
			$("#edit_rating_id").show()
			$("#edit_book_label").show()
			$("#edit_book_id").show()
			$("#edit_data_confirm").show()
		}
	});

	$('#edit_data_confirm').click(function(){
		data = {user_id: $('#user_id').text(), book_id: $('#edit_book_id').val(),
				rating: $('#edit_rating_id').val()}
		$.ajax({
			url: "/edituserdata",
			data: data,
			type: 'POST',  
		  	success:function(response){
				var response = JSON.parse(response);
				if(response.status == "FAIL"){
					alert("You cannot edit a book you have not yet rated")
				}else{
					getData();
				}
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});

	// Gets recommendations
	$('#recommend_data').click(function(){
		data = {user_id: $('#user_id').text()}
		$.ajax({
			url: "/recommend",
			data: data,
			type: 'POST',  
		  	success:function(response){
				var response = JSON.parse(response);
				buildTable(response, "userRecommendations")
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});

	// Gets the data to fill the table in with
	function getData(){
		console.log("IN GET DATA")
		$.ajax({
			url: "/getUserRatings",
			type: "get",
			data: {
				user_id: $('#user_id').text(),
			},
			success: function(response){
				var response= JSON.parse(response)
				buildTable(response, "userData")
			},
			error: function(error){
				console.log(error)
			}
		});
	}

	function buildTable(data, tableName){
		//https://www.encodedna.com/javascript/populate-json-data-to-html-table-using-javascript.htm
		// EXTRACT VALUE FOR HTML HEADER
		var col = [];
		for (var i = 0; i < data.length; i++) {
			for (var key in data[i]) {
				if (col.indexOf(key) === -1) {
					col.push(key);
				}
			}
		}

		// CREATE DYNAMIC TABLE.
		var table = document.createElement("table");

		// CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
		var tr = table.insertRow(-1);                   // TABLE ROW.

		for (var i = 0; i < col.length; i++) {
			var th = document.createElement("th");      // TABLE HEADER.
			th.innerHTML = col[i];
			tr.appendChild(th);
		}

		// ADD JSON DATA TO THE TABLE AS ROWS.
		for (var i = 0; i < data.length; i++) {
			tr = table.insertRow(-1);
			for (var j = 0; j < col.length; j++) {
				var tabCell = tr.insertCell(-1);
				tabCell.innerHTML = data[i][col[j]];
			}
		}

		// FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
		var divContainer = document.getElementById(tableName);
		divContainer.innerHTML = "";
		divContainer.appendChild(table);
	}

	document.onload = getData();
});