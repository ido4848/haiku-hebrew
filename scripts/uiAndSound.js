

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
			$(lineSelector).html(random7syllableLine( getRandomFromArr([0,1,2,3,4,5,6,7,8]) ));
		else
			$(lineSelector).html(random5syllableLine( getRandomFromArr([0,1,2,3,4,5]) ));
	});
	$(buttonSelector).mouseup(function() {
  		$(buttonSelector).attr("src",img);
	});
	$(buttonSelector).mousedown(function() {
  		$( buttonSelector ).attr("src",imgDown);
	});
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
}

$(document).ready(setUiAndSound);
