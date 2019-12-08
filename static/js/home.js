$(function(){
	$("#login_form").on('submit', function(e){
		e.preventDefault()
		var user = $('#login_username').val();
		var pass = $('#login-password').val();
		$.ajax({
			url: '/signInUser',
			data: $('#login_form').serialize(),
			type: 'POST',
			success: function(response){
				var response = JSON.parse(response)
				if(response.status == "OK"){
					console.log("hi")
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
});