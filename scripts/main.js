/*

TODO:
	MUSIC
		mute,gong,china_music2
 */

/*
word types:
verbs
shem
adj
kishor=[של,על,ב,ו,ל,ה]
 */

function getWordFiles(){
	$.getJSON("../words/verbs.json", function(json) {
	//console.log(json); // this will show the info it in firebug console
	localStorage.setItem("verbs",JSON.stringify(json));
	});

	$.getJSON("../words/shems.json", function(json) {
	//console.log(json); // this will show the info it in firebug console
	localStorage.setItem("shems",JSON.stringify(json));
	});

	$.getJSON("../words/adjes.json", function(json) {
	//console.log(json); // this will show the info it in firebug console
	localStorage.setItem("adjes",JSON.stringify(json));
	});
}


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
/*
function playGong() {
	var state=parseInt(localStorage.getItem("sound-state"));
	if(state==1){
		var audio = $("#audio_bg")[0];
		audio.pause();
		var audio_gong = $("#gong")[0];
		audio_gong.play();
		setTimeout(function(){
		 audio.play(); }, 1500);
		
	}
}
 */

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

function main(){

	var audio = $("#audio_bg")[0];
	audio.play();
	localStorage.setItem("sound-state","1");
	$("#toggle-sound").click(toggleSound);

	getWordFiles();
	

	$("#random-haiku").click(function(){
		playGong();
		randomHaiku(0);
	});
	/*
	$( "#random-haiku" ).mouseup(function() {
  		$( "#random-haiku" ).attr("src","../img/random_haiku.jpg");
	});
	$( "#random-haiku" ).mousedown(function() {
  		$( "#random-haiku" ).attr("src","../img/random_haiku_down.jpg");
	});
	*/


	$("#random-line1").click(function(){
		playGong();
		$("#line1").html(random5syllableLine(Math.round(Math.random())));
	});
	$( "#random-line1" ).mouseup(function() {
  		$( "#random-line1" ).attr("src","../img/random_line1.jpg");
	});
	$( "#random-line1" ).mousedown(function() {
  		$( "#random-line1" ).attr("src","../img/random_line1_down.jpg");
	});

	$("#random-line2").click(function(){
		playGong();
		$("#line2").html(random7syllableLine(Math.round(Math.random())));
	});
	$( "#random-line2" ).mouseup(function() {
  		$( "#random-line2" ).attr("src","../img/random_line2.jpg");
	});
	$( "#random-line2" ).mousedown(function() {
  		$( "#random-line2" ).attr("src","../img/random_line2_down.jpg");
	});

	$("#random-line3").click(function(){
		playGong();
		$("#line3").html(random5syllableLine(Math.round(Math.random())));
	});
	$( "#random-line3" ).mouseup(function() {
  		$( "#random-line3" ).attr("src","../img/random_line3.jpg");
	});
	$( "#random-line3" ).mousedown(function() {
  		$( "#random-line3" ).attr("src","../img/random_line3_down.jpg");
	});	

}

function getRandomFromArr(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

function randomHaiku(haikuType){
	$("#line1").html(random5syllableLine( Math.round(Math.random()) ));
	$("#line2").html(random7syllableLine( Math.round(Math.random()) ));
	$("#line3").html(random5syllableLine( Math.round(Math.random()) ));
}

function createArrByInfo(arr,info){
	var arrByInfo=[];
		for(var index in arr){
			var unit=arr[index];
			if(unit['info']==info){
				arrByInfo.push(unit);
			}
		}
	return arrByInfo;
}

function createArrBySyllable(arr,syllable){
	var arrBySyllable=[];
		for(var index in arr){
			var unit=arr[index];
			if(unit['syllable']==syllable){
				arrBySyllable.push(unit);
			}
		}
	return arrBySyllable;
}

function createArrToSyllable(arr,syllable){
	var arrBySyllable=[];
		for(var index in arr){
			var unit=arr[index];
			if(unit['syllable']<syllable){
				arrBySyllable.push(unit);
			}
		}
	return arrBySyllable;
}

function random5syllableLine(type){
	var line="";
	if(type==0){
		//shem adje
		flag=true;
		while(flag){
			flag=false;
			var syllableLeft=5;
			var info="";

			var shems=JSON.parse(localStorage.getItem("shems"));
			var word1=getRandomFromArr(shems);
			syllableLeft-=word1['syllable'];
			info=word1['info'];
			word1=word1['word'];
			//console.log(word1+" "+info+" "+syllableLeft);


			var adjes=JSON.parse(localStorage.getItem("adjes"));
			var adjesBy=createArrBySyllable(adjes,syllableLeft);
			adjesBy=createArrByInfo(adjesBy,info);
			if(adjesBy.length==0){
				flag=true;
				continue;
			}
			
			var word2=getRandomFromArr(adjesBy);
			word2=word2['word'];
			line=word1+" "+word2;

		}


	}
	else if(type==1){
		//shem verb
		flag=true;
		while(flag){
			flag=false;
			var syllableLeft=5;
			var info="";

			var shems=JSON.parse(localStorage.getItem("shems"));
			var word1=getRandomFromArr(shems);
			syllableLeft-=word1['syllable'];
			info=word1['info'];
			word1=word1['word'];
			//console.log(word1+" "+info+" "+syllableLeft);


			var verbs=JSON.parse(localStorage.getItem("verbs"));
			var verbsBy=createArrBySyllable(verbs,syllableLeft);
			verbsBy=createArrByInfo(verbsBy,info);
			if(verbsBy.length==0){
				flag=true;
				continue;
			}
			
			var word2=getRandomFromArr(verbsBy);
			word2=word2['word'];

			line=word1+" "+word2;
		}


	}
	else{
		line="חמש הברות";
	}

	return line;
}

function random7syllableLine(type){
	var line="";
	if(type==0){
		//shem adje verb
		flag=true;
		while(flag){
			flag=false;
			var syllableLeft=7;
			var info="";

			var shems=JSON.parse(localStorage.getItem("shems"));
			var word1=getRandomFromArr(shems);
			syllableLeft-=word1['syllable'];
			info=word1['info'];
			word1=word1['word'];
			//console.log(word1+" "+info+" "+syllableLeft);

			var adjes=JSON.parse(localStorage.getItem("adjes"));
			var adjesBy=createArrToSyllable(adjes,syllableLeft);
			adjesBy=createArrByInfo(adjesBy,info);
			if(adjesBy.length==0){
				flag=true;
				continue;
			}
			
			var word2=getRandomFromArr(adjesBy);
			syllableLeft-=word2['syllable'];
			word2=word2['word'];
			//console.log(word2+" "+info+" "+syllableLeft);


			var verbs=JSON.parse(localStorage.getItem("verbs"));
			var verbsBy=createArrBySyllable(verbs,syllableLeft);
			verbsBy=createArrByInfo(verbsBy,info);
			if(verbsBy.length==0){
				flag=true;
				continue;
			}
			
			var word3=getRandomFromArr(verbsBy);
			word3=word3['word'];

			line=word1+" "+word2+" "+word3 ;
		}


	}
	if(type==1){
		//shem verb adje
		flag=true;
		while(flag){
			flag=false;
			var syllableLeft=7;
			var info="";

			var shems=JSON.parse(localStorage.getItem("shems"));
			var word1=getRandomFromArr(shems);
			syllableLeft-=word1['syllable'];
			info=word1['info'];
			word1=word1['word'];
			//console.log(word1+" "+info+" "+syllableLeft);

			var verbs=JSON.parse(localStorage.getItem("verbs"));
			var verbsBy=createArrToSyllable(verbs,syllableLeft);
			verbsBy=createArrByInfo(verbsBy,info);
			if(verbsBy.length==0){
				flag=true;
				continue;
			}
			
			var word2=getRandomFromArr(verbsBy);
			syllableLeft-=word2['syllable'];
			word2=word2['word'];
			//console.log(word2+" "+info+" "+syllableLeft);


			var adjes=JSON.parse(localStorage.getItem("adjes"));
			var adjesBy=createArrBySyllable(adjes,syllableLeft);
			adjesBy=createArrByInfo(adjesBy,info);
			if(adjesBy.length==0){
				flag=true;
				continue;
			}
			
			var word3=getRandomFromArr(adjesBy);
			word3=word3['word'];

			line=word1+" "+word2+" "+word3 ;	
		}


	}
	return line;
}


$(document).ready(main);





/*

		if(syllableLeft==1){
			var word2=word1;
			var word1=getRandomFromArr(["ב","ה"]);
			if(word1.length==1)
				line=word1+""+word2;
			else
				line=word1+" "+word2;
		}else{
			var verbs=JSON.parse(localStorage.getItem("verbs"));
			var verbsBy=createArrBySyllable(verbs,syllableLeft);
			verbsBy=createArrByInfo(verbsBy,info);
			console.log(verbsBy);
			
			var word2=getRandomFromArr(verbsBy);
			word2=word2['word'];

			line=word1+" "+word2;
		}


		if(syllableLeft==1){
			var word2=word1;
			var word1=getRandomFromArr(["ב","ה"]);
			if(word1.length==1)
				line=word1+""+word2;
			else
				line=word1+" "+word2;
		}else{
			var verbs=JSON.parse(localStorage.getItem("verbs"));
			var verbsBy=createArrBySyllable(verbs,syllableLeft);
			verbsBy=createArrByInfo(verbsBy,info);
			console.log(verbsBy);
			
			var word2=getRandomFromArr(verbsBy);
			word2=word2['word'];

			line=word1+" "+word2;
		}

function main_old2(){
	request = new XMLHttpRequest();
	request.open('GET', 'test.json', true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400){
	    // Success!
	    data = (request.responseText);
	    console.log(data);
    	data=JSON.parse(data);
		console.log(data);

	  } else {
	    // We reached our target server, but it returned an error

	  }
	};

	request.onerror = function() {
	  // There was a connection error of some sort
	};

	request.send()
}

 */