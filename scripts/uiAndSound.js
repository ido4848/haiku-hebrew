

function playGong() {
	var state=parseInt(localStorage.getItem("sound-state"));
	if(state==1){
		var audio = $("#audio_bg")[0];
		audio.volume = 0.1;
		var audio_gong = $("#gong")[0];
		audio_gong.volume=1.0;
		audio_gong.play();

		setTimeout(function(){
		audio.volume = 0.2; }, 900);
		setTimeout(function(){
		audio.volume = 0.3; }, 1000);
		setTimeout(function(){
		audio.volume = 0.4; }, 1100);
		setTimeout(function(){
		audio.volume = 0.5; }, 1200);
		setTimeout(function(){
		audio.volume = 0.6; }, 1300);
		setTimeout(function(){
		audio.volume = 0.7; }, 1400);
		setTimeout(function(){
		audio.volume = 0.8; }, 1500);
		setTimeout(function(){
		audio.volume = 0.9; }, 1600);
		setTimeout(function(){
		audio.volume = 1.0; }, 1700);

		
	}
}


function toggleSound(){
	var state=parseInt(localStorage.getItem("sound-state"));
	if(state==0){
		var audio = $("#audio_bg")[0];
		audio.play();
		localStorage.setItem("sound-state","1");
		$("#toggle-sound").attr("src","../img/audio_sound.jpg");
	}else if(state==1){
		var audio = $("#audio_bg")[0];
		audio.pause();
		localStorage.setItem("sound-state","0");
		$("#toggle-sound").attr("src","../img/audio_mute.jpg");
	}
}


function setClickAndMouseHandlersLine(num){
	var buttonSelector="#random-line"+num;
	var lineSelector="#line"+num;
	var img="../img/random_line"+num+".jpg";
	var imgDown="../img/random_line"+num+"_down.jpg";
	$(buttonSelector).click(function(){
		localStorage.setItem("haiku-sent","0");
		playGong();
		if(num==2)
			$(lineSelector).html(randomLine(7,[0,1,2,3,4,5,6,7,8]));
		else
			$(lineSelector).html(randomLine(5,[0,1,2,3,4,5]));
	});
	$(buttonSelector).mouseup(function() {
  		$(buttonSelector).attr("src",img);
	});
	$(buttonSelector).mousedown(function() {
  		$( buttonSelector ).attr("src",imgDown);
	});
}

function changeGui(){
 	/*
 	
 	DEVICE: W,H
	
	PHONES:
 	nexus 5: 360,640 980,1416?
 	nexus 4: 384,640
 	iphone 5: 320,568
 	iphone 6: 375,667
 	G4: 360,640

 	(320->400),(346->660)

 	PHABLETS:
 	nexus 6: 412,690

 	(360->414),(650->740)

 	TABLETS:
 	(480->800[1024]),(800->1440)



	galaxy note 10.1: 
	 */
	
 	var win = $(this); //this = window
 	//alert(win.width()+","+win.height());
 	//alert(win.width()+","+win.height());
	

 	if(win.width()>=win.height()){
 		desktopGui();
 	}else{
 		phoneGui();
 	}

 	/*
	if(win.width()<=450 && win.height()<=760){
		//phone or phablet
		//w<h
		phoneGui();
	}else if(450<win.width() && win.width()<=850 && 760<win.height() && win.height()<=1330 ){
		//tablet
		//w>h
		tabletGui();
	}else{
		//desktop
		//w>h
		desktopGui();
	}
	*/
 	
}

function phoneGui(){

	$(".possible-brs-de").addClass("hidden");
	$(".possible-brs-ta").addClass("hidden");
	$(".possible-brs-ph").removeClass("hidden");

	$(".logo").width("12vw");
	$("#logo-middle").width("35vw");
	$("#logo-middle").height("10vh");

	$(".haiku-line").css("font-size","5.5vh");

	$("#toggle-sound").css("width","7vw");
	$("#toggle-sound").css("height","3vh");

	$("#random-haiku").css("width","36vw");
	$("#random-haiku").css("height","14vh");

	$(".random-line").css("width","22vw");
	$(".random-line").css("height","4.2vh");

	$("#error").css("width","20vw");
	$("#error").css("height","3vh");

	$("#rights").css("font-size","2.5vw");
	
}

function tabletGui(){
	phoneGui();
	
}

function desktopGui(){
	$(".possible-brs-ph").addClass("hidden");
	$(".possible-brs-ta").addClass("hidden");
	$(".possible-brs-de").removeClass("hidden");

	$(".logo").width("7vw");
	$("#logo-middle").width("25vw");
	$("#logo-middle").height("18vh");

	$(".haiku-line").css("font-size","6vh");

	$("#toggle-sound").css("width","4vw");
	$("#toggle-sound").css("height","2vh");

	$("#random-haiku").css("width","27vw");
	$("#random-haiku").css("height","20vh");

	$(".random-line").css("width","18vw");
	$(".random-line").css("height","6vh");

	$("#error").css("width","12vw");
	$("#error").css("height","4vh");

	$("#rights").css("font-size","2.5vh");
	
}


function setUiAndSound(){
	var audio = $("#audio_bg")[0];
	audio.play();
	localStorage.setItem("sound-state","1");
	$("#toggle-sound").click(toggleSound);


	$("#random-haiku").click(function(){
		playGong();
		randomHaiku(0);
	});
	$( "#random-haiku" ).mouseup(function() {
  		$( "#random-haiku" ).attr("src","../img/random_haiku.jpg");
	});
	$( "#random-haiku" ).mousedown(function() {
  		$( "#random-haiku" ).attr("src","../img/random_haiku_down.jpg");
	});
	

	setClickAndMouseHandlersLine(1);
	setClickAndMouseHandlersLine(2);
	setClickAndMouseHandlersLine(3);

	changeGui();

	
	$(window).on('resize', function(){
		changeGui();
	});


}

$(document).ready(setUiAndSound);
