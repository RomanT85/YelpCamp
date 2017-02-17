$(document).ready(function() {

	var uname = "";
	var email = "";
	var password = "";
	var repassword = "";
	var firstname = "";
	var lastname = "";

	var submitBtn = $("#submit-btn");

	$('#username-check').on('change', function() {

		var username = $(this).val();

		if(username == "") {
			$("#usernameInfo").html("Username field can't be left empty.").css("color", "#a10b0b");
			uname = "";
		}
		else if(!/^[a-zA-Z0-9\-\_]+$/.test(username)) {
			$("#usernameInfo").html("Username can contain only letters from a-z, A-Z and numbers from 0 to 9.").css("color", "#a10b0b");
			uname = "";
		}

		else {
		
			$.post("/compareuname", $('#signUpForm').serialize(), function(response) {
				if(response == "success") {
					$("#usernameInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css("color", "#25b70e");
					uname = username;
				}
				else {
					$("#usernameInfo").html("Username \""+username+"\" is already taken.").css("color", "#a10b0b");
					$('#username-check').val('');
				}
			});
		}
	});

	$("#email-check").on('change', function() {

		var Email = $(this).val();

		if(Email == "") {
			$("#emailInfo").html("Please enter your email.").css("color", "#a10b0b");
			email = "";
		}
		else if(!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(Email)) {
			$("#emailInfo").html("\""+Email+"\", is not valid email address.").css("color", "#a10b0b");
			email = "";
		}
		else {
			$.post("/compareemail", $("#signUpForm").serialize(), function(response) {
				if(response == "success") {
					$("#emailInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css("color", "#25b70e");
					email = Email;
				}
				else {
					$("#emailInfo").html("Email \""+Email+"\", is already taken.").css("color", "#a10b0b");
					$("#email-check").val('');
				}
			});
		}
	});

	$("#firstname-check").keyup(function() {

		var firstnameVal = $(this).val();

		if(firstnameVal == "") {
			$("#firstnameInfo").html("Please fill in your firstname.").css("color", "#a10b0b");
			firstname = "";
		}
		else {
			$("#firstnameInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css("color", "#25b70e");
			firstname = firstnameVal;
		}
	});

	$("#lastname-check").keyup(function() {

		var lastnameVal = $(this).val();

		if(lastnameVal == "") {
			$("#lastnameInfo").html("Please fill in your lastname.").css("color", "#a10b0b");
			lastname = "";
		}
		else {
			$("#lastnameInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css("color", "#25b70e");
			lastname = lastnameVal;
		}

	});

	$("#password-check").keyup(function() {

		var passwordVal = $(this).val();

		if(passwordVal == "") {
			$("#passwordInfo").html("Type in your password.").css("color", "#a10b0b");
			password = "";
		}
		else if(!/^[a-zA-Z0-9\-\_]+$/.test(passwordVal)) {
			$("#passwordInfo").html("Password can only contain letters from a-z, A-Z and numbers from 0 to 9.").css("color", "#a10b0b");
			password = "";
		}
		else if(passwordVal.length < 8) {
			$("#passwordInfo").html("Password must be at least 8 characters long.").css("color", "#a10b0b");
			password = "";
		}
		else {
			$("#passwordInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css("color", "#25b70e");
			password = passwordVal;
		}

	});

	$("#confPassword").keyup(function() {

		var confPasswordVal = $("#confPassword").val();

		if(confPasswordVal == "") {
			$("#confPasswordInfo").html("Please confirm your password.").css("color", "#a10b0b");
			confPassword = "";
		}
		else if(confPasswordVal.length < 8) {
			$("#confPasswordInfo").html("Password is too short.").css("color", "#a10b0b");
			confPassword = "";
		}
		else if(password !== confPasswordVal) {
			$("#confPasswordInfo").html("Passwords don't match.").css("color", "#a10b0b");
			confPassword = "";
		}
		else {
			$("#confPasswordInfo").html('<i class="fa fa-check" aria-hidden="true"></i>').css("color", "#25b70e");
			confPassword = confPasswordVal;
		}

	});

	$("#signUpForm").on("submit",function(event) {

		event.preventDefault();

		submitBtn.prop("disabled", true);

		if(email == "" || firstname == "" || lastname == "" || username == "" || password == "" || confPassword == "") {
			$("#submitInfo").html("Please check that all required fields are filled correctly.").css("color", "#a10b0b");
			submitBtn.prop("disabled", false);
		}
		else {

			$.post("/register", $("#signUpForm").serialize(), function(response) {
				if(response == "success") {
					$("#signUpForm input").val("");
					$(".infoSpan").html('');
					window.location = "/profile";
					$("#Message").html('<div class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>Dear '+firstname+ ' '+lastname+' YelpCamp welcomes you!</p></div>');
				}
				else {
					$("#submitInfo").html(response).css("color", "#a10b0b");
				}
				
				submitBtn.prop("disabled", false);
			});
		}

	});


	//here will be all crud operations for user, campground and comment updating and deleting.
	$("#remUser").on('submit', function(event) {
		event.preventDefault();
		var submitBtn = $("#userDeleteBtn");
		submitBtn.prop('disabled', true);

		$.delete('/admin/user/delete', $("#remUser").serialize(), function(response) {
			if(response == "success"){
				$("#adminInfoSpan").html("User has bee removed!");
				submitBtn.prop('disabled', false);
			}
			else {
				$("#adminInfoSpan").html(response);
				submitBtn.prop('disabled', false);
			}
		});

	});


});