var fetchUserURL = "http://localhost:1337/session/:sessionVal/user";
var logoutURL = "http://localhost:1337/session/:sessionVal";
var publicReleasesURL = "http://localhost:1337/movies";
var criticReleasesURL = "http://localhost:1337/user/:userId/movies";
var movieUploadURL = "http://localhost:1337/user/:userId/movie";
var trailerUploadURL = "http://localhost:1337/movie/:movieId/trailer";
var thumbnailUploadURL = "http://localhost:1337/";
var saveMovieURL = "http://localhost:1337/movie/:movieId/details";

var userData;
var publicReleases;
var criticReleases;
var uploadedMovie;
var uploadedTrailer;
var uploadedThumbnail;
var savedMovieDetails;
var uploadTabPage=1;

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = month + ' ' + date + ', ' + year;
  return time;
}

function swapScreen(){
	var tempSession = getCookie("sessionVal");
	if(tempSession){
		fetchUser(tempSession);
	} else {
		window.location = "./index.html";
	}
}

function nextTab(){
	if(uploadTabPage != 4){
		uploadTabPage++;
		$("#previous_btn").removeClass("disabled");
		if(uploadTabPage == 4){
			$("#next_btn").addClass("disabled");
		}
		$(".tab-pane").removeClass("active");
		$("#step"+uploadTabPage).addClass("active");
	}
}

function previousTab(){
	if(uploadTabPage != 1){
		uploadTabPage--;
		$("#next_btn").removeClass("disabled");
		if(uploadTabPage == 1){
			$("#previous_btn").addClass("disabled");
		}
		$(".tab-pane").removeClass("active");
		$("#step"+uploadTabPage).addClass("active");
	}
}

function movieUploadInitialization(){
	$('#movie_upload').fileupload({
			url: movieUploadURL.replace(":userId",userData.id),
		    beforeSend : function(xhr) {
						xhr.setRequestHeader("SessionVal", getCookie("sessionVal"));
					},
		    progressall: function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        $('#movie_progress').css(
		            'width',
		            progress + '%'
		        );
		    },
		    done: function (err, response) {
		    	if(response._response.result && response._response.result.status=="SUCCESS"){
		    		uploadedMovie = response._response.result.movie;
		    		trailerUploadInitialization();
		    	} else {
		    		alert("Something went wrong!!!");
		    	}
	        }
		});
}

function trailerUploadInitialization(){
	$('#trailer_upload').fileupload({
			url: trailerUploadURL.replace(":movieId",uploadedMovie.id),
		    beforeSend : function(xhr) {
						xhr.setRequestHeader("SessionVal", getCookie("sessionVal"));
					},
		    progressall: function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        $('#trailer_progress').css(
		            'width',
		            progress + '%'
		        );
		    },
		    done: function (err, response) {
		    	if(response._response.result && response._response.result.status=="SUCCESS"){
		    		uploadedTrailer = response._response.result.movie;
		    	} else {
		    		alert("Something went wrong!!!");
		    	}
	        }
		});
}

function toggleContent(content){
	$(".content_box").hide();
	if(content == 'upload') {
		$("#uploadForm").show();
	} else if(content == 'movie'){
		$("#content").show();
	}
}

function toggleView(){
	loadUserData();
	if(userData && userData.isCritic){
		fetchCriticReleases();
	} else {
		$("#criticPane").remove();
		fetchPublicReleases();
	}
}

function loadUserData(){
	$("#name").html(userData.name);
}

function logout(){
	var tempSession = getCookie("sessionVal");
	deleteSession(tempSession);
}

function loadPublicScreen(){
	var screenUI = '';
	if(publicReleases && publicReleases.length > 0){
		loadCurrentScreening(publicReleases[0]);
		for(index=0; index < publicReleases.length; index++){
			screenUI += '<article class="media" onClick="loadCurrentPublicMovie(\''+index+'\')">';
			screenUI += '<a href="#" class="pull-left thumb-lg m-t-xs"> <img src="images/m40.jpg"> </a>';
			screenUI += '<div class="media-body"> <a href="#" class="font-semibold">'+ publicReleases[index].title +'</a>';
			screenUI += ' <div class="text-xs block m-t-xs"><a href="#">'+publicReleases[index].genre+'</a> <br/>'+Math.round((new Date() - Date.parse(publicReleases[index].releaseDate))/(24*60*60*1000)) +' days ago</div>';
			screenUI += '</div>';
			screenUI += '</article>';
		}
		$("#screen").html(screenUI);
	} else {
		$("#screen").html("We will get back with more movies soon!!!");
	}
}

function loadCurrentPublicMovie(index){
	loadCurrentScreening(publicReleases[index]);
}

function loadCurrentCriticMovie(index){
	loadCurrentScreening(criticReleases[index]);
}

function loadCurrentScreening(movie){
	$("#jplayer_1").attr("src", movie.movieLink);
	$("#screening_title").html(movie.title);
	$("#screening_description").html(movie.description);
	$("#screening_maker").html("maker");
	$("#screening_release_date").html(" " + timeConverter(Date.parse(movie.releaseDate)));
	$("#screening_critic_rating").html(" " + movie.criticRating);
	$("#screening_public_rating").html(" " + movie.userRating);
}

function loadCriticScreen(){
	var screenUI = '';
	if(criticReleases && criticReleases.length > 0){
		loadCurrentScreening(criticReleases[0]);
		for(index=0; index < criticReleases.length; index++){
			screenUI += '<article class="media" onClick="loadCurrentCriticMovie(\''+index+'\')">';
			screenUI += '<a href="#" class="pull-left thumb-lg m-t-xs"> <img src="images/m40.jpg"> </a>';
			screenUI += '<div class="media-body"> <a href="#" class="font-semibold">'+ criticReleases[index].title +'</a>';
			screenUI += ' <div class="text-xs block m-t-xs"><a href="#">'+criticReleases[index].genre+'</a> <br/> Hitting screens in '+Math.round((Date.parse(criticReleases[index].releaseDate) - new Date())/(24*60*60*1000)) +' days</div>';
			screenUI += '</div>';
			screenUI += '</article>';
		}
		$("#screen").html(screenUI);
	} else {
		$("#screen").html("We will get back with more movies soon!!!");
	}
}

function fetchUser(session){
		$.ajax({
			url : fetchUserURL.replace(":sessionVal", session),
			cache : false,
			type : "get",
			dataType : "json",
			beforeSend : function(xhr) {
				xhr.setRequestHeader("accept", "application/json");
			},
			success : function(response) {
				if (response.status != '' || response.status != undefined
						|| response.status != null) {
					if (response.status == 'SUCCESS') {
						userData = response.user;
						toggleView();
						movieUploadInitialization();
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
}

function fetchPublicReleases(){
	$.ajax({
			url : publicReleasesURL,
			cache : false,
			type : "get",
			dataType : "json",
			beforeSend : function(xhr) {
				xhr.setRequestHeader("accept", "application/json");
				xhr.setRequestHeader("SessionVal", getCookie("sessionVal"));
			},
			success : function(response) {
				if (response.status != '' || response.status != undefined
						|| response.status != null) {
					if (response.status == 'SUCCESS') {
						publicReleases = response.movies;
						loadPublicScreen();
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
}

function fetchCriticReleases(){
	$.ajax({
			url : criticReleasesURL.replace(":userId", userData.id),
			cache : false,
			type : "get",
			dataType : "json",
			beforeSend : function(xhr) {
				xhr.setRequestHeader("accept", "application/json");
				xhr.setRequestHeader("SessionVal", getCookie("sessionVal"));
			},
			success : function(response) {
				if (response.status != '' || response.status != undefined
						|| response.status != null) {
					if (response.status == 'SUCCESS') {
						criticReleases = response.movies;
						loadCriticScreen();
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
}

function deleteSession(session){
	$.ajax({
			url : logoutURL.replace(":sessionVal", session),
			cache : false,
			type : "delete",
			dataType : "json",
			beforeSend : function(xhr) {
				xhr.setRequestHeader("accept", "application/json");
			},
			success : function(response) {
				if (response.status != '' || response.status != undefined
						|| response.status != null) {
					if (response.status == 'SUCCESS') {
						if(response.isLoggedOut){
							deleteCookie("sessionVal");
							window.location = "./index.html";
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
}

function saveMovieDetails(){
	var title = $("#title_input").val();
	var description = $("#description_input").val();
	var price = $("#price_input").val();
	var genre = $("#genre_input").val();
	var releaseDate = $("#release_date_input").val();
	if(title && description && price && genre && releaseDate){
		$.ajax({
			url : saveMovieURL.replace(":movieId", uploadedMovie.id),
			cache : false,
			type : "put",
			dataType : "json",
			data : {
				"title" : title,
				"description" : description,
				//"price" : price,
				"genre" : genre,	
				"releaseDate" : releaseDate
			},
			beforeSend : function(xhr) {
				xhr.setRequestHeader("accept", "application/json");
				xhr.setRequestHeader("SessionVal", getCookie("sessionVal"));
			},
			success : function(response) {
				if (response.status != '' || response.status != undefined
						|| response.status != null) {
					if (response.status == 'SUCCESS') {
						savedMovieDetails = response.movie;
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
		alert("Provide all info!!!")
	}
}