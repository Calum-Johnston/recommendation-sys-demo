$(function(){
	$('.form-delete-book').hide()
	$('.form-edit-book').hide()
	$('.form-add-book').hide()

	$('.form-delete-rating').hide()
	$('.form-edit-ratings').hide()
	$('.form-add-rating').hide()


	$('#delete_data').click(function(){
		if($("#delete_data_confirm").is(":visible")){
			$('.form-delete-rating').hide()
		}else{
			$('.form-delete-rating').show()
			$('.form-edit-ratings').hide()
			$('.form-add-rating').hide()
		}
	});

	$('.form-delete-rating').on('submit', function(e){
		e.preventDefault();
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
					getUserData();
				}
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});

	$('#add_data').click(function(){
		if($("#add_data_confirm").is(":visible")){
			$('.form-add-rating').hide()
		}else{
			$('.form-add-rating').show()
			$('.form-delete-rating').hide()
			$('.form-edit-ratings').hide()
		}
	});

	$('.form-add-rating').on('submit', function(e){
		e.preventDefault();
		data = {user_id: $('#user_id').text(), book_id: $('#add_book_id').val(),
				rating: $('#add_rating_id').val()}
		$.ajax({
			url: "/adduserdata",
			data: data,
			type: 'POST',  
		  	success:function(response){
				var response = JSON.parse(response);
				if(response.status == 'FAIL'){
					alert("You have already rated that book!");
				}else if(response.status == 'EXISTS'){
					alert("That book does not exist");
				}else{
					getUserData();
				}
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});

	$('#edit_data').click(function(){
		if($("#edit_data_confirm").is(":visible")){
			$('.form-edit-ratings').hide()
		}else{
			$('.form-edit-ratings').show()
			$('.form-delete-rating').hide()
			$('.form-add-rating').hide()
		}
	});

	$('.form-edit-ratings').on('submit', function(e){
		e.preventDefault();
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
					getUserData();
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

	// Gets the user table data
	function getUserData(){
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


	// ******************** //
	// BOOK TABLE FUNCTIONS
	// ******************** //

	// Shows delete inputs when clicked
	$('#delete_book').click(function(){
		if($("#delete_book_confirm").is(":visible")){
			$('.form-delete-book').hide()
		}else{
			$('.form-delete-book').show()
			$('.form-edit-book').hide()
			$('.form-add-book').hide()
		}
	});

	// Deletes book from csv dataframe
	$('.form-delete-book').on('submit', function(e){
		e.preventDefault();
		data = {book_id: $('#delete_book_id').val()}
		console.log(data)
		$.ajax({
			url: "/deletebookdata",
			data: data,
			type: 'POST',  
		  	success:function(response){
				var response = JSON.parse(response)
				if(response.status == "FAIL"){
					alert("That book cannot be deleted as it doesn't exist")
				}else{
					getBookData();
					getUserData();
				}
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});

	// Shows add inputs when clicked
	$('#add_book').click(function(){
		if($("#add_book_confirm").is(":visible")){
			$('.form-add-book').hide()
		}else{
			$('.form-add-book').show()
			$('.form-delete-book').hide()
			$('.form-edit-book').hide()
		}
	});

	// Adds book to csv dataframe
	$('.form-add-book').on('submit', function(e){
		e.preventDefault();
		data = {book_title: $('#add_book_name').val(),
				book_author: $('#add_book_author').val(),
				book_genre: $('#add_book_genre').val()}
		console.log(data)
		$.ajax({
			url: "/addbookdata",
			data: data,
			type: 'POST',  
		  	success:function(response){
				var response = JSON.parse(response);
				if(response.status == 'FAIL'){
					alert("This book already exists");
				}else{
					getBookData();
				}
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});

	// Shows edit inputs when clicked
	$('#edit_book').click(function(){
		if($("#edit_book_confirm").is(":visible")){
			$('.form-edit-book').hide()
		}else{
			$('.form-edit-book').show()
			$('.form-delete-book').hide()
			$('.form-add-book').hide()
		}
	});

	// Edits book in csv dataframe
	$('.form-edit-book').on('submit', function(e){
		e.preventDefault();
		data = {book_id: $('#edit_book_id_').val(),
				book_title: $('#edit_book_title').val(),
				book_author: $('#edit_book_author').val(),
				book_genre: $('#edit_book_genre').val()}
		console.log(data)
		$.ajax({
			url: "/editbookdata",
			data: data,
			type: 'POST',  
		  	success:function(response){
				var response = JSON.parse(response);
				if(response.status == "FAIL"){
					alert("Book cannot be edited")
				}else{
					getBookData();
				}
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});

	// Gets the book table data
	function getBookData(){
		console.log("IN GET DATA")
		$.ajax({
			url: "/getBookData",
			type: "get",
			success: function(response){
				var response= JSON.parse(response)
				buildTable(response, "bookData")
			},
			error: function(error){
				console.log(error)
			}
		});
	}



	// ******************** //
	// JSON to HTML table
	// ******************** //

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

	document.onload = getUserData(), getBookData();
});