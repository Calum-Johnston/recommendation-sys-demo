$(function(){

	// Gets the next user ID (for account creation)
	$.get('/getNextUserID', function(result){
		console.log(result)
		$('#signup_username').val(result)
	});

	// Validates whether the login was successful
	$("#signin_form").on('submit', function(e){
		e.preventDefault()
		var user = $('#signin_username').val();
		var pass = $('#signin-password').val();
		$.ajax({
			url: '/signInUser',
			data: $('#signin_form').serialize(),
			type: 'POST',
			success: function(response){
				var response = JSON.parse(response)
				if(response.status == "OK"){
					window.location.replace("/account?user_id=" + response.user)
				}else{
					alert("Incorrect username/password")
				}			
			},
			error: function(error){
				console.log(error);
			}
		});
	});

	$("#signup_form").on("submit", function(e){
		e.preventDefault()
		var user = $('#signup_username').val();
		var password = $('#signup-password').val();
		$.ajax({
			url: '/signUpUser',
			data: $('#signup_form').serialize(),
			type: 'POST',
			success: function(response){
				var response = JSON.parse(response)
				if(response.status == "OK"){
					alert("Account created - you may now sign in")
					window.location.replace("/account?user_id=" + $('#signup_username').val())
				}else{
					alert("User already exists - please try again")
				}			
			},
			error: function(error){
				console.log(error);
			}
		});
	});
});