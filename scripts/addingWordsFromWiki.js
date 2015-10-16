

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

function parse_data(data) {
	var word = {};
	var str = data.data;

	var hebword = str.replace(/[\s\S]*<title>(.*) - [\s\S]*/g, "$1");
	hebword = hebword.replace("-", " ");
	word.hebword = hebword;

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
		getWord(word_callback);
		return;
	}
	
	var sex_str = str.replace(/[\s\S]*?(<b>מין<\/b><\/td>\n<td>.*?<\/td>)[\s\S]*/g, "$1");
	if (sex_str.match("<b>מין<\/b><\/td>\n<td>זכר<\/td>")) word.sex = "יחיד";
	else if (sex_str.match("<b>מין<\/b><\/td>\n<td>נקבה<\/td>")) word.sex = "יחידה";
	else {
		// Bad word
		getWord(word_callback);
		return;
	}

	var pronounciation = str.replace(/[\s\S]*?הגייה[\s\S]*?ltr;">([\s\S]*?)<\/td>[\s\S]*/g, "$1");
	pronounciation = pronounciation.replace(/,.*/g, "");

	if (pronounciation.match(/^<!DOCTYPE/)) {
		// Bad word
		getWord(word_callback);
		return;
	}
	pronounciation = pronounciation.replace(/<.*?>/g, "");
	if (pronounciation.replace(/\s/g, "") == "") {
		// Bad word
		getWord(word_callback);
		return;
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

	word_callback(word);	
}


var word_callback;
function getWord(callback) {
	word_callback = callback;

	// activate jsonp
	script = document.createElement('script');
 	script.src = 'http://jsonp.afeld.me/?callback=parse_data&url=https%3A%2F%2Fhe.wiktionary.org%2Fwiki%2F%25D7%259E%25D7%2599%25D7%2595%25D7%2597%25D7%2593%3A%25D7%2590%25D7%25A7%25D7%25A8%25D7%2590%25D7%2599';
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
	var count=parseInt(JSON.parse(localStorage.getItem("count")));
	stats.found+=1;count-=1;
	var newWordObj={};
	newWordObj.word=wordObj['hebword'];
	newWordObj.syllable=String(countSyllables(wordObj['pronounciation']));
	newWordObj.info=wordObj['sex'];
	stats.infos[newWordObj.info]=parseInt(stats.infos[newWordObj.info])+1;
	stats.avg=(parseFloat(stats.avg)*(parseFloat(stats.found)-1)+parseFloat(newWordObj.syllable))/(parseFloat(stats.found));

	if(wordObj['type']=="shem"){
		stats.types["shem"]=parseInt(stats.types["shem"])+1;
		var arr=JSON.parse(localStorage.getItem("added-shmes"));
		arr.push(newWordObj);
		localStorage.setItem("added-shmes",JSON.stringify(arr));
	}else if(wordObj['type']=="adje"){
		stats.types["adje"]=parseInt(stats.types["adje"])+1;
		var arr=JSON.parse(localStorage.getItem("added-adjes"));
		arr.push(newWordObj);
		localStorage.setItem("added-adjes",JSON.stringify(arr));
	}else if(wordObj['type']=="verb"){
		stats.types["verb"]=parseInt(stats.types["verb"])+1;
		var arr=JSON.parse(localStorage.getItem("added-verbs"));
		arr.push(newWordObj);
		localStorage.setItem("added-verbs",JSON.stringify(arr));
	}
	
	var pluralObj={};
	if(wordObj['plural']!=="unknown"){
		stats.found+=1;count-=1;
		stats.hasPlural+=1;
		pluralObj.word=wordObj['plural'];
		pluralObj.syllable=String(parseInt(newWordObj.syllable)+ wordObj.n_of_words);
		stats.avg=(parseFloat(stats.avg)*(parseFloat(stats.found)-1)+parseFloat(pluralObj.syllable))/(parseFloat(stats.found));
		if(newWordObj.info==="יחיד"){
			pluralObj.info="רבים";
			stats.infos["רבים"]=parseInt(stats.infos["רבים"])+1;
		}else{
			pluralObj.info="רבות";
			stats.infos["רבות"]=parseInt(stats.infos["רבות"])+1;
		}

		if(wordObj['type']=="shem"){
			stats.types["shem"]=parseInt(stats.types["shem"])+1;
			var arr=JSON.parse(localStorage.getItem("added-shmes"));
			arr.push(pluralObj);
			localStorage.setItem("added-shmes",JSON.stringify(arr));
		}else if(wordObj['type']=="adje"){
			stats.types["adje"]=parseInt(stats.types["adje"])+1;
			var arr=JSON.parse(localStorage.getItem("added-adjes"));
			arr.push(pluralObj);
			localStorage.setItem("added-adjes",JSON.stringify(arr));
		}else if(wordObj['type']=="verb"){
			stats.types["verb"]=parseInt(stats.types["verb"])+1;
			var arr=JSON.parse(localStorage.getItem("added-verbs"));
			arr.push(pluralObj);
			localStorage.setItem("added-verbs",JSON.stringify(arr));
		}
	}

	localStorage.setItem("stats",JSON.stringify(stats));
	localStorage.setItem("count",JSON.stringify(count));
	displayStats(stats);
	displayJSONdata();



}


function displayJSONdata(){
	var shemsJSON=localStorage.getItem("added-shmes");
	var adjesJSON=localStorage.getItem("added-adjes");
	var verbsJSON=localStorage.getItem("added-verbs");
	disp="Shems:<br>"+shemsJSON+"<br><br>Adjes:<br>"+adjesJSON+"<br><br>Verbs:<br>"+verbsJSON;
	$("#data").html(disp);
}

function displayStats(statsObj){
	var disp=statsObj['found']+" out of "+statsObj['originCount']+" words found";
	disp+="<br>"+statsObj['hasPlural']+" words has a plural form available";
	disp+="<br>Average syllables for a word is "+(statsObj.avg);
	disp+="<br>"+statsObj['types']['shem']+" shems | "+statsObj['types']['adjes']+" adjes | "+statsObj['types']['verbs']+" verbs";
	disp+="<br>"+statsObj['infos']['יחיד']+" male | "+statsObj['infos']['יחידה']+" female | "+statsObj['infos']['רבים']+" plural male | "+statsObj['infos']['רבות']+" plural female";
	$("#stats").html(disp);
}
	
function writeToFile2(){
	var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "hello_world.txt",false);
}

function main(){
	localStorage.setItem("added-shmes",JSON.stringify([]));
	localStorage.setItem("added-verbs",JSON.stringify([]));
	localStorage.setItem("added-adjes",JSON.stringify([]));
	$("#mail").click(mailMeTheArrays);

	$("#submit").click(function(){
		var count=parseInt($("#num-words").val());

		localStorage.setItem("count",JSON.stringify(count));
		$("#menu").addClass("hidden");
		$("#stats-heading").removeClass("hidden");
		var delay=parseInt($("#delay").val())*1000;
		console.log(delay);

		var stats={};
		stats.originCount=count;
		stats.found=0;
		stats.types={"shem":"0","adje":"0","verb":"0"};
		stats.infos={"יחיד":"0","יחידה":"0","רבים":"0","רבות":"0"};
		stats.hasPlural=0;
		stats.avg=0;

		localStorage.setItem("stats",JSON.stringify(stats));
		displayStats(stats);

		for(var i=0;i<count;i++){
			setTimeout(function(){
		 		getWord(addWordToLocalStorageAndEditStatsAndDisplay);
			 }, delay*i);
			count=parseInt(JSON.parse(localStorage.getItem("count")));

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
	var shemsJSON=localStorage.getItem("added-shmes");
	var adjesJSON=localStorage.getItem("added-adjes");
	var verbsJSON=localStorage.getItem("added-verbs");
	var date = checkDate()+", "+checkTime(); 

	var subject="Word Array, "+date;
	var htmlMsg="These are the words arrays: <br><br>Shems:<br><br>"+shemsJSON+"<br><br>Adjes:<br><br>"+adjesJSON+"<br><br>Verbs:<br><br>"+verbsJSON+"<br><br>Sent on the: "+date;

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