var userURL = "http://localhost:1337/user";
var sessionVal;

function signin(){
	var username = $("#username").val();
	var password = $("#password").val();
	if(username && password){
		$.ajax({
			url : userURL,
			cache : false,
			type : "put",
			dataType : "json",
			data: ({
				"username" : username,
				"password" : password
			}),
			beforeSend : function(xhr) {
				xhr.setRequestHeader("accept", "application/json");
			},
			success : function(response) {
				if (response.status != '' || response.status != undefined
						|| response.status != null) {
					if (response.status == 'SUCCESS') {
						if(response.isValid){
							sessionVal = response.sessionVal;
							loadHome();
						} else {
							alert("Sorry, unrecognized username or password!!!");
						}
					} else if (response.status == 'FAILURE') {
						alert("Something went wrong!!!");
					}
				}
			},
			error : function(xhr, status, thrown) {
				alert("Something terribly wrong!!!");
			},
		    timeout : 600000
		});
	} else {
		alert("Username & Password are required!!!");
	}
}

function signup(){
	var name = $("#name").val();
	var email = $("#email").val();
	var password = $("#password").val();
	if(name && email && password){
		$.ajax({
			url : userURL,
			cache : false,
			type : "post",
			dataType : "json",
			data: ({
				"name" : name,
				"email" : email,
				"password" : password
			}),
			beforeSend : function(xhr) {
				xhr.setRequestHeader("accept", "application/json");
			},
			success : function(response) {
				if (response.status != '' || response.status != undefined
						|| response.status != null) {
					if (response.status == 'SUCCESS') {
						window.location = "./signin.html";
					} else if (response.status == 'FAILURE') {
						alert(response.message);
					}
				}
			},
			error : function(xhr, status, thrown) {
				alert("Something terribly wrong!!!");
			},
		    timeout : 600000
		});
	} else {
		alert("Name, Email & Password are required!!!");
	}
}

function loadHome(){
	if(sessionVal){
		document.cookie="sessionVal=" + sessionVal;
		window.location = "./video-detail.html";
	}
}