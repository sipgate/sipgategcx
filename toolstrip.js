var bgr = chrome.extension.getBackgroundPage();

function doOnLoad()
{
	
	$('sendSMS').addEvent('click', function() {
	    $('menu').addClass('view_template');
	    $('page_sendSMS').removeClass('view_template');
	    $('sendSMS_number').focus();
//	    var b = chrome.extension.getURL('image.html');
//	    console.log(b);
	});
	
	$('form_sendSMS').addEvent('submit', function(evnt) {
	    evnt.stop();
	    var number = $('sendSMS_number').get('value');
	    var text = $('sendSMS_text').get('value');
	    console.log(number);
	    console.log(text);
	    try {
		bgr.sendSMS(number, text);
	    } catch (e) {
		    console.log(e);
	    }
	}.bindWithEvent());

	if(bgr.username != null && bgr.password != null)
	{
		login();
	}
	
}

function login(force)
{
	if(force || bgr.username == null || bgr.password == null)
	{
		bgr.username = $('username').get('value');
		bgr.password = $('password').get('value');
		localStorage.setItem('username', bgr.username);
		localStorage.setItem('password', bgr.password);
	}
	
	if(bgr.curBalance !== null) {
			$('notLoggedIn').addClass('view_template');
			$('menu').removeClass('view_template');
//			$('loggedIn').addEvent('click', function() { window.open('http://' + bgr.sipgateCredentials.HttpServer ); });
			console.log(bgr.curBalance);
			$('balance').set('text', bgr.curBalance[0]);
		
			if(bgr.curBalance[1] < 5.0) {
				$('balance').set('styles', {'color':'red'});
			}
	}
}