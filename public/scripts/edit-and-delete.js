$(document).ready(function() {

	//here will be all crud operations for user, campground and comment updating and deleting.
	$("#remUser").on('submit', function(event) {
		event.preventDefault();
		var submitBtn = $("#userDeleteBtn");

		submitBtn.prop('disabled', true);

		$.post('/admin/user/:id', $("#remUser").serialize(), function(response) {
			if(response == "success"){
				$("#adminInfoSpan").html("User has bee removed!");
			}
			else {
				
			}
		});

	});

});