

/*
TODO: 
	Add duplicate check
	verbs: only present tense
 */

function countSyllables(word) {
	//argument is a word in phonetic hebrew->english
	var count = 0;
	/*  This part of the code is debatable. If the words עיט, מים have one syllable, uncomment this. If they have two, leave this commented.
		Come on... Leave it commented.
	word = word.replace(/ayi/g, function() {
		count += 1;
		return "";
	}); */
	word = word.replace(/[aeiou]+/g, function() {
		count += 1;
		return "";
	});
	return count;
}


function countSyllablesVerb(info,binyan) {
	// info is in {"יחיד","יחידה","רבים","רבות"}
	//  binyan is in {0,...,6}
	//  it is assumed the GIZRA is SHLEMIM
	
	if(info=="יחיד"){
		if(binyan==0)
			return 2;
		if(binyan==1)
			return 3;//adding מ
		if(binyan==2)
			return 2;//used as adje
		if(binyan==3)
			return 2;//used as adje
		if(binyan==4)
			return 3;
		if(binyan==5)
			return 3;//used as adje
		if(binyan==6)
			return 3;//used as adje



	}
	

	return 0;
}

function to_ktiv_hasser(word) {
	word = word.replace(/\u05BB/g, "ו"); // kubbutz turns into vav
	word = word.replace(/\u05BC/g, ""); // bye dagesh
	word = word.replace(/\uFB31/g, "ב"); // bye dagesh
	word = word.replace(/\uFB3B/g, "כ"); // bye dagesh
	word = word.replace(/\uFB44/g, "פ"); // bye dagesh
	word = word.replace(/\u05B4([^י])/g, "י$1"); // hirik hasser
	word = word.replace(/([^ו])\u05B9/g, "$1ו"); // holam hasser
	word = word.replace(/[\uFB2B\uFB2A]/g, "ש"); // shin sin
	word = word.replace(/[\u05B0-\u05BE]/g, ""); // delete all other nikkud
	return word;
}


function parse_noun_adje(data) {
	var word = {};
	var str = data.data;

	var hebword = str.replace(/[\s\S]*<title>(.*) - [\s\S]*/g, "$1");
	hebword = hebword.replace("-", " ");
	word.hebword = hebword;

	if (word.hebword.match(/a-zA-Z/g)) {
		// Bad word
		return undefined;
	}

	var n_of_words = 1;
	for (var i = 0; i < word.hebword.length; i++)
		if (word.hebword[i] == ' ') n_of_words++;
	word.n_of_words = n_of_words;

	var type = str.replace(/[\s\S]*?<b>חלק דיבר<\/b><\/td>[\s]*<td>(.*?)<\/td>[\s\S]*/g, "$1");
	if (type == "שם־עצם") word.type = "shem";
	else if (type == "שם-תואר") word.type = "adje";
	else if (type == "פעל") word.type = "verb"; // fuck. this never happens.
	else {		
		// Bad word
		return undefined;
	}
	
	var sex_str = str.replace(/[\s\S]*?(<b>מין<\/b><\/td>\n<td>.*?<\/td>)[\s\S]*/g, "$1");
	if (sex_str.match("<b>מין<\/b><\/td>\n<td>זכר<\/td>")) word.sex = "יחיד";
	else if (sex_str.match("<b>מין<\/b><\/td>\n<td>נקבה<\/td>")) word.sex = "יחידה";
	else {
		// Bad word
		return undefined;
	}

	var pronounciation = str.replace(/[\s\S]*?הגייה[\s\S]*?ltr;">([\s\S]*?)<\/td>[\s\S]*/g, "$1");
	pronounciation = pronounciation.replace(/,.*/g, "");

	if (pronounciation.match(/^<!DOCTYPE/)) {
		// Bad word
		return undefined;
	}
	pronounciation = pronounciation.replace(/<.*?>/g, "");
	if (pronounciation.replace(/\s/g, "") == "") {
		// Bad word
		return undefined;
	}
	word.pronounciation = pronounciation;

	var plural = str.replace(/[\s\S]*?נטיות<\/b><\/td>\n<td>ר' ([^<]*)[\s\S]*/g, "$1");
	var n_of_words_left = word.n_of_words;
	for (var i = 0; i < str.length; i++) {
		if (plural[i] == ' ') {
			if (n_of_words_left == 1) {
				plural = plural.slice(0, i);
				break;
			}
			n_of_words_left -= 1;
		}
	}
	plural = plural.replace("-", " ");
	plural = plural.replace(/[^אבגדהוזחיטכלמנסעפצקרשתםןץף ]/g, "");
	word.plural = "unknown";
	if (plural.replace(/\s/g, '').length > 0 && plural.length < 25)
		word.plural = plural;

	return word;	
}

function parse_verb(data) {
	var word = {};
	var str = data.data;

	var hebword = str.replace(/[\s\S]*<title>(.*) - [\s\S]*/g, "$1");
	hebword = hebword.replace("-", " ");
	word.hebword = hebword;

	if (!word.hebword.match(/(שורש)/g)) return undefined;
	if (!str.match(' הוא שורש מ<a href="/wiki/%D7%A0%D7%A1%D7%A4%D7%97:%D7%92%D7%96%D7%A8%D7%AA_%D7%94%D7%A9%D7%9C%D7%9E%D7%99%D7%9D"')) {
		if (!str.match(' הוא שורש מ<a href="/wiki/%D7%92%D7%96%D7%A8%D7%AA_%D7%94%D7%A9%D7%9C%D7%9E%D7%99%D7%9D"')) {
			return undefined;
		}
	}

	word.type = "verb";
	word.binyanim = [];

	var table = str.match(/<table border="1" style="border-collapse: collapse; border: solid 1px black; text-align: center;" cellpadding="3" cellspacing="0">[\s\S]*?<\/table>/g);
	if (table) table = table[0];
	else return undefined;

	var table_rows = table.match(/<tr>[\s\S]*?<\/tr>/g);
	for (var i = 0; i < table_rows.length; i++) {
		var table_cells = table_rows[i].match(/<td>[\s\S]*?<\/td>/g);
		var word_str = table_cells[1].replace(/<.*?>/g, "").replace(" ", "");
		if (!word_str.match(/[-\.,]/g) && !word_str.match("או") && !word_str.match("פעול") && word_str != "")
			word.binyanim[i] = to_ktiv_hasser(word_str);
	}

	return word;
}

function parse_data(data) {
	var skip_shems=JSON.parse(localStorage.getItem("skip-shems"));
	if(skip_shems){
		word = parse_verb(data); 		// try once
		if (word == undefined) {
			// Bad word
			getWord(word_callback);
			return;
		}
		word_callback(word);
	}else{
		word = parse_noun_adje(data); 		// try once
		if (word == undefined)
			word = parse_verb(data);	// try twice
		if (word == undefined) {
			// Bad word
			getWord(word_callback);
			return;
		}
		word_callback(word);
	}

}

var word_callback;
function getWord(callback) {
	if (!callback) {
		console.error("getWord must recieve a callback function.");
		return undefined;
	}
	word_callback = callback;

	// activate jsonp
	script = document.createElement('script');
	url = 'https%3A%2F%2Fhe.wiktionary.org%2Fwiki%2F%25D7%259E%25D7%2599%25D7%2595%25D7%2597%25D7%2593%3A%25D7%2590%25D7%25A7%25D7%25A8%25D7%2590%25D7%2599';
 	script.src = 'http://jsonp.afeld.me/?callback=parse_data&url=' + url;
	script.src += '&version=' + Math.random(); // prevent caching

	document.getElementsByTagName('head')[0].appendChild(script);
}


function printWord(word) {
	console.log(word);
}

function printWordToScreen(wordObj) {
	var word=wordObj['hebword'];
	var syllables=countSyllables(wordObj['pronounciation']);
	var type=wordObj['type'];
	var info=wordObj['sex'];
	var plural=wordObj['plural'];
	var pluralSyllables=parseInt(syllables) + wordObj.n_of_words;
	var pluralInfo="unknown";
	if(info==="יחיד")
		pluralInfo="רבים";
	if(info==="יחידה")
		pluralInfo="רבות";

	var str="המילה: "+word+"<br>מהסוג: "+type+"<br>מהמין: "+info+"<br>בת "+syllables+" הברות"
	if(plural!=="unknown"){
		str+="<br><br>צורת הרבים: "+plural+"<br>מהסוג: "+type+"<br>מהמין: "+pluralInfo+"<br>צורת הרבים בת "+pluralSyllables+" הברות";
	}
	
	$("#word").html(str);

}


function addWordToLocalStorageAndEditStatsAndDisplay(wordObj){
	var stats=JSON.parse(localStorage.getItem("stats"));
	
	if(wordObj['type']=="verb"){
		var binyanim=wordObj['binyanim'];
		for(var i in binyanim){
			var binyan=binyanim[i];
			if(binyan==undefined)
				continue;

			stats.found+=1;
			var currWordObj={};
			currWordObj.word=binyan;
			currWordObj.info="יחיד";
			currWordObj.syllable=String(countSyllablesVerb("יחיד",i));

			stats.infos[currWordObj.info]=parseInt(stats.infos[currWordObj.info])+1;
			stats.avg=(parseFloat(stats.avg)*(parseFloat(stats.found)-1)+parseFloat(currWordObj.syllable))/(parseFloat(stats.found));


			//and now for the female and plurals

			stats.found+=3;
			var femaleObj={};femaleObj.info="יחידה";femaleObj.syllable=String(parseInt(currWordObj.syllable)+1);
			var malePluralObj={};malePluralObj.info="רבים";malePluralObj.syllable=currWordObj.syllable;
			var femalePluralObj={};femalePluralObj.info="רבות";femalePluralObj.syllable=currWordObj.syllable;

			stats.infos[femaleObj.info]=parseInt(stats.infos[femaleObj.info])+1;
			stats.infos[malePluralObj.info]=parseInt(stats.infos[malePluralObj.info])+1;
			stats.infos[femalePluralObj.info]=parseInt(stats.infos[femalePluralObj.info])+1;
			

			var up=parseFloat(stats.avg)*(parseFloat(stats.found)-3);
			up+=parseInt(femaleObj.syllable)+parseInt(malePluralObj.syllable)+parseInt(femalePluralObj.syllable);
			stats.avg=parseFloat(up)/(parseFloat(stats.found));

			
			var str=currWordObj.word;
			var charsEnd = ['ם','ן','ץ','ף','ך'];
			var lastCharIdx = charsEnd.indexOf(str[str.length-1]); 
			if(lastCharIdx!=-1){
				var str=str.substring(0, str.length - 1);
				if(lastCharIdx==0)
					str+="מ";
				if(lastCharIdx==1)
					str+="נ";
				if(lastCharIdx==2)
					str+="צ";
				if(lastCharIdx==3)
					str+="פ";
				if(lastCharIdx==4)
					str+="כ";

			}

			femaleObj.word=str+"ת";
			malePluralObj.word=str+"ים";
			femalePluralObj.word=str+"ות";

			
			if(i==0||i==4||i==1){
				stats.types["verb"]=parseInt(stats.types["verb"])+4;
				currWordObj['type']="verb";
				femaleObj['type']="verb";
				malePluralObj['type']="verb";
				femalePluralObj['type']="verb";
				if(i==1){
					continue;//better be safe, not sorry
					currWordObj.word=currWordObj.word+" מ";//it is debateable
				}
			}
			if(i==2||i==3||i==5|i==6){
				stats.types["adje"]=parseInt(stats.types["adje"])+4;
				currWordObj.type="adje";
				femaleObj.type="adje";
				malePluralObj.type="adje";
				femalePluralObj.type="adje";				
			}

			
			var arr=JSON.parse(localStorage.getItem("added-words"));
			arr.push(currWordObj);
			arr.push(femaleObj);
			arr.push(malePluralObj);
			arr.push(femalePluralObj);
			localStorage.setItem("added-words",JSON.stringify(arr));

			

		}

	}else{
		stats.found+=1;
		var newWordObj={};
		newWordObj.word=wordObj['hebword'];
		newWordObj.syllable=String(countSyllables(wordObj['pronounciation']));
		newWordObj.info=wordObj['sex'];
		newWordObj['type']=wordObj['type'];

		stats.types[newWordObj.type]=parseInt(stats.types[newWordObj.type])+1;
		stats.infos[newWordObj.info]=parseInt(stats.infos[newWordObj.info])+1;
		stats.avg=(parseFloat(stats.avg)*(parseFloat(stats.found)-1)+parseFloat(newWordObj.syllable))/(parseFloat(stats.found));



		var arr=JSON.parse(localStorage.getItem("added-words"));
		arr.push(newWordObj);
		localStorage.setItem("added-words",JSON.stringify(arr));


		var pluralObj={};
		if(wordObj['plural']!=="unknown"){
			stats.found+=1;
			stats.hasPlural+=1;
			pluralObj.word=wordObj['plural'];
			pluralObj.syllable=String(parseInt(newWordObj.syllable)+ wordObj.n_of_words);
			pluralObj['type']=wordObj['type'];

			stats.types[newWordObj.type]=parseInt(stats.types[newWordObj.type])+1;
			stats.avg=(parseFloat(stats.avg)*(parseFloat(stats.found)-1)+parseFloat(pluralObj.syllable))/(parseFloat(stats.found));
			
			if(newWordObj.info==="יחיד"){
				pluralObj.info="רבים";
				stats.infos["רבים"]=parseInt(stats.infos["רבים"])+1;
			}else{
				pluralObj.info="רבות";
				stats.infos["רבות"]=parseInt(stats.infos["רבות"])+1;
			}

			var arr=JSON.parse(localStorage.getItem("added-words"));
			arr.push(pluralObj);
			localStorage.setItem("added-words",JSON.stringify(arr));
		}

	}

	localStorage.setItem("stats",JSON.stringify(stats));
	displayStats(stats);
	displayJSONdata();

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

function displayJSONdata(){
	var wordsJSON=JSON.parse(localStorage.getItem("added-words"));
	var types=JSON.parse(localStorage.getItem("types"));
	disp=""
	for(var i=0;i<types.length;i++){
		if(i==0){
			disp=disp+types[i]+"s:<br>"+JSON.stringify(createArrByType(wordsJSON,types[i]));
		}else{
			disp=disp+"<br><br>"+types[i]+"s:<br>"+JSON.stringify(createArrByType(wordsJSON,types[i]));
		}
	}
	disp=disp+"<br><br><br>All Words:<br>"+JSON.stringify(wordsJSON);
	$("#data").html(disp);
}

function displayStats(statsObj){
	var disp=statsObj['found']+" out of "+statsObj['originCount']+" words found";
	disp+="<br>"+statsObj['hasPlural']+" words has a plural form available";
	disp+="<br>Average syllables for a word is "+(statsObj.avg);

	disp+="<br>"
	var types=JSON.parse(localStorage.getItem("types"));
	for(var i=0;i<types.length;i++){
		if(i==types.length-1){
			disp+=statsObj['types'][types[i]]+" "+types[i]+"s";
		}else{
			disp+=statsObj['types'][types[i]]+" "+types[i]+"s | ";
		}
		
	}
	disp+="<br>"+statsObj['infos']['יחיד']+" male | "+statsObj['infos']['יחידה']+" female | "+statsObj['infos']['רבים']+" plural male | "+statsObj['infos']['רבות']+" plural female";
	$("#stats").html(disp);
}
	
function writeToFile2(){
	var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "hello_world.txt",false);
}

function main(){
	localStorage.setItem("added-words",JSON.stringify([]));
	localStorage.setItem("types",JSON.stringify(["shem","adje","verb"]));
	$("#mail").click(mailMeTheArrays);

	$("#submit").click(function(){
		$("#menu").addClass("hidden");
		$("#stats-heading").removeClass("hidden");

		var count=parseInt($("#num-words").val());
		var delay=parseInt($("#delay").val());
		var checked=document.getElementById('skip-shems').checked;

		localStorage.setItem("skip-shems",JSON.stringify(checked));

		var stats={};
		var types=JSON.parse(localStorage.getItem("types"));
		stats.types={};
		for(var i=0;i<types.length;i++)
			stats.types[types[i]]=0;

		stats.infos={"יחיד":"0","יחידה":"0","רבים":"0","רבות":"0"};
		stats.originCount=count;
		stats.found=0;
		stats.hasPlural=0;
		stats.avg=0;

		localStorage.setItem("stats",JSON.stringify(stats));
		displayStats(stats);

		var func=addWordToLocalStorageAndEditStatsAndDisplay;
		for(var i=0;i<count;i++){
			setTimeout(function(){
		 		getWord(func);
			 }, delay*i);

		}
		
	});




	/*
	$("#get-word-button").click(function(){
		getWord(printWordToScreen);
	});

				if(i==count-2){
				setTimeout(function(){ 
					var shemsJSON=localStorage.getItem("added-shmes");
					var adjesJSON=localStorage.getItem("added-adjes");
					var verbsJSON=localStorage.getItem("added-verbs");
					console.log(shemsJSON);
					console.log(adjesJSON);
					console.log(verbsJSON);
				 }, 3000*i);
			}
	*/
}


function checkTime_util(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function checkTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime_util(m);
    s = checkTime_util(s);
    var time= h + ":" + m + ":" + s;
    return time;
}

function checkDate(){
	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    var date = dd+'/'+mm+'/'+yyyy;
    return date;
}


function mailMeTheArrays(){
	var wordsJSON=localStorage.getItem("added-words");

	var date = checkDate()+", "+checkTime(); 

	var subject="Word Array, "+date;
	var htmlMsg="This is the words array: <br><br>All Words:<br><br>"+wordsJSON+"<br><br>Sent on the: "+date;

	$.ajax({
	  type: "POST",
	  url: "https://mandrillapp.com/api/1.0/messages/send.json",
	  data: {
	    'key': 'LKnQV8kj9K4Iu1EEqHIqPg',
	    'message': {
	      'from_email': 'ido.aizenbud@gmail.com',
	      'to': [
	          {
	            'email': 'ido.aizenbud@gmail.com',
	            'name': 'me',
	            'type': 'to'
	          }
	        ],
	      'autotext': 'true',
	      'subject': subject,
	      'html': htmlMsg
	    }
	  }
	 }).done(function(response) {
	   console.log(response); // if you're into that sorta thing
	 });
	
}



$(document).ready(main);