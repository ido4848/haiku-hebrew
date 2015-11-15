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

function getWordDictFiles(k,dict){
	var data=[];
	var filename="";
	fileName="words_"+dict+"/words";
	for(var i=0;i<k;i++){
		var currFile=fileName+i+".json";
		$.getJSON(currFile, function(currData) {
			for(var j=0;j<currData.length;j++){
				data.push(currData[j]);
			}
			localStorage.setItem("words",JSON.stringify(data));
		});
	}
	localStorage.setItem("dict",dict);
}

function getWordFiles(k,nikkudFlag){

	var data=[];
	var fileName="";
	if(nikkudFlag)
		fileName="words_nikkud/words";//AJAX is made out of index.html
	else
		fileName="words/words";//AJAX is made out of index.html

	

	for(var i=0;i<k;i++){
		var currFile=fileName+i+".json";
		$.getJSON(currFile, function(currData) {
			for(var j=0;j<currData.length;j++){
				data.push(currData[j]);
			}
			localStorage.setItem("words",JSON.stringify(data));
		});
	}

}


function main(){
	//var k=1;
	//var nikkudFlag=true;
	//getWordDictFiles(k,"wiki_nikkud");
	//getWordFiles(k,nikkudFlag);

}

function getRandomFromArr(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

function randomHaiku(haikuType){
	localStorage.setItem("haiku-sent","0");
	$("#line1").html(randomLine(5,[0,1,2,3,4,5]));
	$("#line2").html(randomLine(7,[0,1,2,3,4,5,6,7,8]));
	$("#line3").html(randomLine(5,[0,1,2,3,4,5]));
}

function createArrByType(arr,type){
	if(arr.legnth==0)
		return [];
	var arrByType=[];
		for(var index in arr){
			var unit=arr[index];
			if(unit['type']==type){
				arrByType.push(unit);
			}
		}
	return arrByType;
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


function randomLine(syllable,arr){
	var failedFlag=true;
	var line="מספר הברות מאוד מוזר";
	while(failedFlag){
		//console.log("trying in randomLine");
		failedFlag=false;
		var currType=getRandomFromArr(arr);
		if(syllable==5){
			line=random5syllableLine(currType);
		}
		if(syllable==7){
			line=random7syllableLine(currType);
		}
		if(line==""){
			failedFlag=true;
			continue;
		}
	}
	return line;

}



function random5syllableLine(type){
	//console.log("trying in random5syllableLine");
	var line="";
	if(type==0){
		line=createLine(["shem","adje"],5);
	}else if(type==1){
		line=createLine(["shem","verb"],5);
	}else if(type==2){
		line=createLine(["shem","binoni"],5);
	}else if(type==3){
		line=createLine(["shem","verb","shem"],5);
	}else if(type==4){
		line=createLine(["shem","verb"],5);//will increase the probability
	}else if(type==5){
		line=createLine(["shem"],5);//experimental
	}
	else{
		line="חמש הברות";
	}
	return line

}

function random7syllableLine(type){
	//console.log("trying in random7syllableLine");
	//shem can be followed by adje or binoni
	//
	//should consider also line=createLine(["binoni","verb","shem"],7);
	

	var line="";
	if(type==0){
		line=createLine(["shem","adje","verb"],7);
	}else if(type==1){
		line=createLine(["shem","binoni","verb"],7);
	}else if(type==2){
		line=createLine(["shem","verb","shem"],7);
	}else if(type==3){
		line=createLine(["shem","adje","verb","shem"],7);
	}else if(type==4){
		line=createLine(["shem","binoni","verb","shem"],7);
	}else if(type==5){
		line=createLine(["shem","verb","shem","adje"],7);
	}else if(type==6){
		line=createLine(["shem","verb","shem","binoni"],7);
	}else if(type==7){
		line=createLine(["shem","verb"],7);//experimental
	}else if(type==8){
		line=createLine(["shem"],7);//experimental
	}else{
		line="יש פה שבע הברות";
	}
	/*
	if(line!="")
		console.log(type+":"+line);
	*/
	return line
}


function createLine(typeArr,syllablesIn){
	//console.log("trying in createLine");
	words=[];
	syllables=syllablesIn;
	var failedFlag=false;
	var info="";
	for(var i in typeArr){
		if(failedFlag){
			break;
		}
		var currType=typeArr[i];
		var availableWords=JSON.parse(localStorage.getItem("words"));
		if(i==0){
			if(i==typeArr.length-1){
				//only one word
				availableWords=createArrByType(createArrByInfo(createArrBySyllable(availableWords,syllables),info),currType);
				if(availableWords.length==0){
					failedFlag=true;
					continue;
				}
				var wordObj=getRandomFromArr(availableWords);
				syllables-=wordObj['syllable'];
				words.push(wordObj['word']);

			}else{
				availableWords=createArrByType(availableWords,currType);
				if(availableWords.length==0){
					failedFlag=true;
					continue;
				}
				var wordObj=getRandomFromArr(availableWords);
				syllables-=wordObj['syllable'];
				info=wordObj['info'];
				words.push(wordObj['word']);
			}
		}else if(i==typeArr.length-1){
			availableWords=createArrByType(createArrByInfo(createArrBySyllable(availableWords,syllables),info),currType);
			if(availableWords.length==0){
				failedFlag=true;
				continue;
			}
			var wordObj=getRandomFromArr(availableWords);
			syllables-=wordObj['syllable'];
			words.push(wordObj['word']);

		}else{
			availableWords=createArrByType(createArrByInfo(createArrToSyllable(availableWords,syllables),info),currType);
			if(availableWords.length==0){
				failedFlag=true;
				continue;
			}
			var wordObj=getRandomFromArr(availableWords);
			syllables-=wordObj['syllable'];
			words.push(wordObj['word']);
		}

	}//for end

	if(failedFlag){
		return "";
	}

	for(var j in words){
		if(j==0){
			line=words[0];
		}else{
			line+=" "+words[j];
		}
	}

	return line
}


$(document).ready(main);



/*
function random5syllableLine(type){
	//console.log("trying in random5syllableLine");
	var line="";
	if(type==0){
		//shem adje
		line=createLine(["shem","adje"],5);
	}else if(type==1){
		//shem verb
		line=createLine(["shem","verb"],5);
	}else if(type==2){
		//binoni verb
		line=createLine(["binoni","verb"],5);
	}else if(type==3){
		//binoni adje
		line=createLine(["binoni","adje"],5);
	}else if(type==4){
		//shem binoni
		line=createLine(["shem","binoni"],5);
	}else if(type==5){
		//binoni binoni
		line=createLine(["binoni","binoni"],5);
	}
	else{
		line="חמש הברות";
	}
	return line

}
*/

/*
function random7syllableLine(type){
	//console.log("trying in random7syllableLine");
	var line="";
	if(type==0){
		//shem adje verb
		line=createLine(["shem","adje","verb"],7);
	}else if(type==1){
		//shem verb adje
		line=createLine(["shem","verb","adje"],7);
	}else if(type==2){
		//shem verb shem
		line=createLine(["binoni","verb","shem"],7);
	}else if(type==3){
		line=createLine(["shem","verb","binoni"],7);
	}else if(type==4){
		line=createLine(["binoni","verb","binoni"],7);
	}else if(type==5){
		line=createLine(["shem","binoni","verb"],7);
	}else if(type==6){
		line=createLine(["binoni","binoni","verb"],7);
	}else if(type==7){
		line=createLine(["binoni","adje","verb"],7);
	}else if(type==8){
		line=createLine(["shem","verb","binoni"],7);
	}else{
		line="יש פה שבע הברות";
	}
	return line
}
*/