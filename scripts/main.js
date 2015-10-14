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


function main(){
	getWordFiles();

}

function getRandomFromArr(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

function randomHaiku(haikuType){
	localStorage.setItem("haiku-sent","0");
	$("#line1").html(random5syllableLine( getRandomFromArr([0,1])  ));
	$("#line2").html(random7syllableLine( getRandomFromArr([0,1,2]) ));
	$("#line3").html(random5syllableLine( getRandomFromArr([0,1])  ));
}

function createArrByInfo(arr,info){
	if(arr.legnth==0)
		return [];
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
	if(arr.legnth==0)
		return [];
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
	if(arr.legnth==0)
		return [];
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
		line=createLine(["shem","adje"],5);
	}else if(type==1){
		//shem verb
		line=createLine(["shem","verb"],5);
	}else{
		line="חמש הברות";
	}
	return line
}

function random7syllableLine(type){
	var line="";
	if(type==0){
		//shem adje verb
		line=createLine(["shem","adje","verb"],7);
	}else if(type==1){
		//shem verb adje
		line=createLine(["shem","verb","adje"],7);
	}else if(type==2){
		//shem verb shem
		line=createLine(["shem","verb","shem"],7);
	}else{
		line="יש פה שבע הברות";
	}
	return line
}




function createLine(typeArr,syllablesIn){
	var flag=true;
	while(flag){
		words=[];
		syllables=syllablesIn;
		flag=false;
		var info="";
		for(var i in typeArr){
			if(flag){
				break;
			}
			var currType=typeArr[i];
			var availableWords=JSON.parse(localStorage.getItem(currType+"s"));
			if(i==0){
				if(availableWords.length==0){
					flag=true;
					continue;
				}
				var wordObj=getRandomFromArr(availableWords);
				syllables-=wordObj['syllable'];
				info=wordObj['info'];
				words.push(wordObj['word']);

			}else if(i==typeArr.length-1){
				availableWords=createArrByInfo(createArrBySyllable(availableWords,syllables),info);
				if(availableWords.length==0){
					flag=true;
					continue;
				}
				var wordObj=getRandomFromArr(availableWords);
				syllables-=wordObj['syllable'];
				words.push(wordObj['word']);

			}else{
				availableWords=createArrByInfo(createArrToSyllable(availableWords,syllables),info);
				if(availableWords.length==0){
					flag=true;
					continue;
				}
				var wordObj=getRandomFromArr(availableWords);
				syllables-=wordObj['syllable'];
				words.push(wordObj['word']);
			}

		}//for end

		if(flag){
			continue;
		}

		for(var j in words){
			if(j==0){
				line=words[0];
			}else{
				line+=" "+words[j];
			}
		}

	}//while end
	return line
}




$(document).ready(main);

