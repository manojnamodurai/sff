var promotionURL = "http://localhost:1337/promotion";

function fetchPromotionList(){
	$.ajax({
		url : promotionURL,
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
					constructPromotionList(response);
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

function constructPromotionList(promotionList){
	var promotionUI = '';
	for(index=0; index<promotionList.movies.length; index++){
		var promoId = "promo_" + index;
		promotionUI += '<div class="col-xs-12 col-sm-4">';
		promotionUI += '<div class="item" onClick="play(\''+promoId+'\');">';
		promotionUI += '<div class="pos-rlt">';
		promotionUI += '<div class="item-overlay opacity r r-2x bg-black">';
		promotionUI += '<div class="center text-center m-t-n"> <a href="video-detail.html"><i class="fa icon-control-play i-2x"></i></a> </div>';
		promotionUI += '</div>';
		promotionUI += '<div class="top"> <span class="badge bg-dark m-l-sm m-t-sm">screening in '+ Math.round((Date.parse(promotionList.movies[index].releaseDate) - new Date())/(24*60*60*1000)) +' days</span> </div>';
		promotionUI += '<a href="#"><video id="'+promoId+'" src="'+ promotionList.movies[index].trailerLink +'" alt="" class="r r-2x img-full promoVideos"></a>';
		promotionUI += '</div>';
		promotionUI += '<div class="padder-v"> <a href="#" class="text-ellipsis">'+ promotionList.movies[index].title +'</a> <a href="#" class="text-ellipsis text-xs text-muted">'+ promotionList.movies[index].genre +'</a> </div>';
		promotionUI += '</div>';
		promotionUI += '</div>';
	}
	$("#promotionListing").html(promotionUI);	
}

function play(vidId){
	videoElem = $("#"+vidId)[0];
	videoElems = $(".promoVideos");
	videoElems.removeAttr("controls");
	stopAll();
	videoElem.setAttribute("controls","controls")
	videoElem.play();
}

function stopAll() {
    var media = document.getElementsByClassName('promoVideos'),
    index = media.length;
    while (index--) {
        media[index].pause();
    }
}

