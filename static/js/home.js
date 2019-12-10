$(function(){

	$(".div-signup").hide()

	$('#signup-call-button').click(function(e){
		e.preventDefault();
		$(".div-signup").show();
		$(".div-signin").hide();
		$("#signup-call-button").hide()
	});

	// Gets the next user ID (for account creation)
	$.get('/getNextUserID', function(result){
		console.log(result)
		$('#signup-username').val(result)
	});

	// Validates whether the login was successful
	$(".form-signin").on('submit', function(e){
		e.preventDefault()
		var user = $('#signin-username').val();
		var pass = $('#signin-password').val();
		console.log(user, pass)
		$.ajax({
			url: '/signInUser',
			data: $('.form-signin').serialize(),
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



	$(".form-signup").on("submit", function(e){
		e.preventDefault()
		var user = $('#signup-username').val();
		var password = $('#signup-password').val();
		console.log(user, password)
		$.ajax({
			url: '/signUpUser',
			data: $('.form-signup').serialize(),
			type: 'POST',
			success: function(response){
				var response = JSON.parse(response)
				if(response.status == "OK"){
					alert("Account created - redirecting to account page")
					window.location.replace("/account?user_id=" + $('#signup-username').val())
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