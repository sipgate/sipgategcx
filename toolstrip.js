var DisplayManager = {
	notloggedin: function() {
		$('notLoggedIn').removeClass('view_template');
		$('menu').addClass('view_template');	
		$('page_sendSMS').addClass('view_template');	
	},
	menu: function() {
		$('notLoggedIn').addClass('view_template');
		$('menu').removeClass('view_template');	
		$('page_sendSMS').addClass('view_template');		
	},
	smseditor: function() {
		$('notLoggedIn').addClass('view_template');
		$('menu').addClass('view_template');	
		$('page_sendSMS').removeClass('view_template');	
	}
};

var bgr = chrome.extension.getBackgroundPage();

function doOnLoad()
{	
	$('sendSMS').addEvent('click', function() {
		DisplayManager.smseditor();
	    $('sendSMS_number').focus();
	});
	
	$('form_sendSMS').addEvent('submit', function(evnt) {
	    evnt.stop();
	    var number = $('sendSMS_number').get('value');
	    var text = $('sendSMS_text').get('value');
	    if(number.trim() == '' || number.match(/^\d*$/) == null) {
	    	alert("Sie muessen eine gueltige Nummer angeben.\nSMS-Versand abgebrochen.");
	    	return;
	    }
	    if(text.trim() == '') {
	    	alert("Sie muessen Text zum Versenden eingeben.\nSMS-Versand abgebrochen.");
	    	return;
	    }
	    $('form_sendSMS').addClass('view_template');
	    $('sendSMS_sending').removeClass('view_template');
    	bgr.sendSMS(number, text);
	});
	
	$('form_sendSMS_cancel').addEvent('click', DisplayManager.menu);
	$('refresh_balance').addEvent('click', function() {
		$('balance').set('text', '...wait...');
		bgr.getBalance();
	});

	$('login').addEvent('click', function(evnt) {
		evnt.stop();
		if(bgr.username == null || bgr.password == null)
		{
			bgr.username = $('username').get('value');
			bgr.password = $('password').get('value');
			localStorage.setItem('username', bgr.username);
			localStorage.setItem('password', bgr.password);
		}
		bgr.login(true);
	});
	
	$('logout').addEvent('click', function(evnt) {
		evnt.stop();
		localStorage.removeItem('username');
		localStorage.removeItem('password');
		bgr.username = null;
		bgr.password = null;
		bgr.loggedin = false;
		DisplayManager.notloggedin();
		chrome.browserAction.setIcon({path:"skin/icon_sipgate_inactive.gif"});		
	});
	
	
	if(bgr.username != null && bgr.password != null)
	{
		if(bgr.loggedin == true) {
			receiveMessage('loggedin');
			receiveMessage('balance');
		} else {
			bgr.login();
		}
	}
	
}

function receiveMessage(e) {
	switch(e) {
		case 'loggedin': 
			DisplayManager.menu();
			break;
		case 'balance':
			console.log(bgr.curBalance);
			$('balance').set('text', bgr.curBalance[0]);
			
			if(bgr.curBalance[1] < 5.0) {
				$('balance').set('styles', {'color':'red'});
			}
			break;
		case 'smsSentSuccess':
		    $('sendSMS_sending').addClass('view_template');
		    $('sendSMS_success').removeClass('view_template');
		    DisplayManager.menu.delay(2000);
			break;
		case 'smsSentFailed':
		    $('form_sendSMS').removeClass('view_template');
		    $('sendSMS_sending').addClass('view_template');
		    $('sendSMS_failed').removeClass('view_template');
		    break;
		default:
			console.log('Event handling not found for event: ' + e);
			break;
	}
}