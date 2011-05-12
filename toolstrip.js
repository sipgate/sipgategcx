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
		SMSEditor.init();
	}


};

var SMSEditor = {
	eventsAdded: false,
	
	init: function() {
	    $('sendSMS_number').focus();
	    if(this.eventsAdded) return;
	    
	    if($('sendSMS_number')) {
	    	$('sendSMS_number').addEvent('blur', this.onNumberFieldLeave.bind(this));
	    }
	    
		if($('form_sendSMS')) {
			$('form_sendSMS').addEvent('submit', this.onSendClick.bind(this));
		}

		if($('form_sendSMS_cancel')) {
			$('form_sendSMS_cancel').addEvent('click', this.close.bind(this));				
		}

		this.eventsAdded = true;
		
	},
	
	getNumber: function() {
		return $('sendSMS_number').get('value').trim();
	},
	
	getText: function() {
		return $('sendSMS_text').get('value').trim();
	},
	
	onNumberFieldLeave: function() {
		var number = this.getNumber();
		if(number != "" && number.length > 4)
		{
			formatNumber(number, function(formatted) {
				if(formatted && formatted[number] && formatted[number]['local']) {
					$('sendSMS_number').set('value', formatted[number]['local']);
				}
			});
		}		
	},
	
	onSendClick: function(evnt) {
	    evnt.stop();
	    var number = this.getNumber();
	    var text = this.getText();
	    if(number == '' || number.match(/^[\d_\-\(\)\ ]*$/) == null) {
			alert(chrome.i18n.getMessage("smsMissingNumber"));
	    	return;
	    }
	    if(text == '') {
			alert(chrome.i18n.getMessage("smsMissingText"));
	    	return;
	    }
	    $('form_sendSMS').addClass('view_template');
	    $('sendSMS_sending').removeClass('view_template');
    	bgr.sendSMS(number, text);			
	},
	
	onSentSuccess: function() {
	    $('sendSMS_sending').addClass('view_template');
	    $('sendSMS_success').removeClass('view_template');
	    DisplayManager.menu.delay(2000);
	},
	
	onSentFail: function() {
	    $('form_sendSMS').removeClass('view_template');
	    $('sendSMS_sending').addClass('view_template');
	    $('sendSMS_failed').removeClass('view_template');
	},
	
	close: function() {
		DisplayManager.menu();
	}
};

var toolStripEvents = {
	sendSMS: function() {
		DisplayManager.smseditor();
	}
};

var page = {
	init: function() {
		this.addLoginEvent();
		this.addToolstripMenuEvents();
		this.checkForLogin();
	},
	
	checkForLogin: function() {
		if(bgr.username != null && bgr.password != null)
		{
			if(bgr.loggedin == true) {
				receiveMessage('loggedin');
				receiveMessage('balance');
			} else {
				bgr.login();
			}
		}
	},
	
	addLoginEvent: function() {
		if($('login')) {
			$('login').addEvent('click', this.loginAction.bind(this));
		}
	},
	
	addToolstripMenuEvents: function() {
		if($('sendSMS')) {
			$('sendSMS').addEvent('click', toolStripEvents.sendSMS);
		}
		if($('logout')) {
			$('logout').addEvent('click', this.logoutAction.bind(this));
		}
	},
	
	loginAction: function(evnt) {
		evnt.stop();
		if($('username').get('value').trim() == "" && $('password').get('value').trim() == "")
		{
			alert(chrome.i18n.getMessage("enterCredentials"));
			return;
		}
		
		if(bgr.username == null || bgr.password == null)
		{
			bgr.username = $('username').get('value');
			bgr.password = $('password').get('value');
			localStorage.setItem('username', bgr.username);
			localStorage.setItem('password', bgr.password);
		}
		bgr.login(true);		
	},
	
	logoutAction: function(evnt) {
		evnt.stop();
		localStorage.removeItem('username');
		localStorage.removeItem('password');
		bgr.username = null;
		bgr.password = null;
		bgr.loggedin = false;
		DisplayManager.notloggedin();
		chrome.browserAction.setIcon({path:"skin/icon_sipgate_inactive.gif"});		
	},
	
	showBalance: function(balance) {
		console.log(balance);
		$('balance').set('text', balance[0]);
		
		if(balance[1] < 5.0) {
			$('balance').set('styles', {'color':'red'});
		}		
	}
};


var bgr = chrome.extension.getBackgroundPage();

function doOnLoad()
{
	page.init();
	
	$('refresh_balance').addEvent('click', function() {
		$('balance').set('text', '...wait...');
		bgr.getBalance();
	});
	
}

function receiveMessage(e) {
	switch(e) {
		case 'loggedin': 
			DisplayManager.menu();
			break;
		case 'balance':
			page.showBalance(bgr.curBalance);
			break;
		case 'smsSentSuccess':
			SMSEditor.onSentSuccess();
			break;
		case 'smsSentFailed':
			SMSEditor.onSentFail();
		    break;
		case 'c2dStartSuccess':
			chrome.browserAction.setIcon({path:"skin/c2d_wait.gif"});		
			break;
		case 'c2dStartFail':
			chrome.browserAction.setIcon({path:"skin/c2d_failed.gif"});		
			break;
		case 'c2dEnd':
    		chrome.browserAction.setIcon({path:"skin/icon_sipgate_active.gif"});
			break;
		default:
			console.log('Event handling not found for event: ' + e);
			break;
	}
}

function formatNumber(number, callback) {
	// https://secure.live.sipgate.de/format/do/info/
	if(!number.match(/\d/)) {
		if(typeof(callback) == 'function') {
			callback({'error':true});
		}
		return;
	}
	number = encodeURIComponent(number.trim());
	var url = bgr.sipgateCredentials.HttpServer.replace(/^www/, 'secure');
	url = 'https://' + url + '/format/do/info/domain/sipgate.de/number/'+number;
	new Request.JSON({
		'url': url,
		onSuccess: function(data) {
			if(typeof(callback) == 'function') {
				callback(data);
			} else {
//				console.log(data);
			}
		}.bind(this),
		onFailure: function(data) {
			if(typeof(callback) == 'function') {
				callback({'error':true});
			} else return data;
		} 
	}).get();		
}