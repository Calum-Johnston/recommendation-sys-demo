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
				console.log(response);
			},
			error: function(error){
				console.log(error);
			}
		});
	});
});