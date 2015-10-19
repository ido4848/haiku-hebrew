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


function getWordFiles(k){

	var data=[]

	for(var i=0;i<k;i++){
		var currFile="../words/words"+i+".json";
		$.getJSON(currFile, function(currData) {
			for(var j=0;j<currData.length;j++){
				data.push(currData[j])
			}
			localStorage.setItem("words",JSON.stringify(data));
		});
	}

}


function main(){
	var k=4;
	getWordFiles(k);

}

function getRandomFromArr(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

function randomHaiku(haikuType){
	localStorage.setItem("haiku-sent","0");
	$("#line1").html(random5syllableLine( getRandomFromArr([0,1,2,3,4,5])  ));
	$("#line2").html(random7syllableLine( getRandomFromArr([0,1,2,3,4,5,6,7,8]) ));
	$("#line3").html(random5syllableLine( getRandomFromArr([0,1,2,3,4,5])  ));
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


function random5syllableLine(type){
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

	binoni
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
			var availableWords=JSON.parse(localStorage.getItem("words"));
			if(i==0){
				if(availableWords.length==0){
					flag=true;
					continue;
				}
				availableWords=createArrByType(availableWords,currType);
				var wordObj=getRandomFromArr(availableWords);
				syllables-=wordObj['syllable'];
				info=wordObj['info'];
				words.push(wordObj['word']);

			}else if(i==typeArr.length-1){
				availableWords=createArrByType(createArrByInfo(createArrBySyllable(availableWords,syllables),info),currType);
				if(availableWords.length==0){
					flag=true;
					continue;
				}
				var wordObj=getRandomFromArr(availableWords);
				syllables-=wordObj['syllable'];
				words.push(wordObj['word']);

			}else{
				availableWords=createArrByType(createArrByInfo(createArrToSyllable(availableWords,syllables),info),currType);
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

