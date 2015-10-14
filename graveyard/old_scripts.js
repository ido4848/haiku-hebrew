
/*
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
*/



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

/*


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

 */

