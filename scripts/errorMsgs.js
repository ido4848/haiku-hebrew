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


function sendErrorMsg(){
	if(localStorage.getItem("haiku-sent")==="1"){
		alert("הודעת השגיאה עבור ההייקו הזה כבר נשלחה.");
		return;
	}
	var currHaiku1=$("#line1").text();
	var currHaiku2=$("#line2").text();
	var currHaiku3=$("#line3").text();
	var date = checkDate()+", "+checkTime(); 

	var subject="Error Msg in HaikuHeb, "+date;
	var htmlMsg="This is the problematic haiku: <br>"+currHaiku1+"<br>"+currHaiku2+"<br>"+currHaiku3+"<br>Sent on the: "+date;

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
	   alert("תודה על פנייתך, הודעת השגיאה נשלחה.");
	   localStorage.setItem("haiku-sent","1");
	 });
	
}


function setErrorMsgsSend(){
	$("#error").click(sendErrorMsg);
}

$(document).ready(setErrorMsgsSend);