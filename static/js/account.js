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
		  	success:function(data){
				console.log(data)
				location.reload()
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
		  	success:function(data){
				console.log(data)
				location.reload()
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
		console.log(data)
		$.ajax({
			url: "/edituserdata",
			data: data,
			type: 'POST',  
		  	success:function(data){
				console.log(data)
				location.reload()
			},  
			error: function(e){
				console.log("Error: ", e)
			}  
		});
	});
});