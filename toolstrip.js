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
	initialized: false,
	systemArea: null,
	senderNumberPref: null,
	httpServer: null,
	
	init: function() {
		this.senderNumberPref = localStorage.getItem('smsSender');
		chrome.runtime.sendMessage({action: 'getParsingOptions'}, function(res) {
			if(res.systemArea) this.systemArea = res.systemArea;
			if(res.httpServer) this.httpServer = res.httpServer;
			
			if(this.initialized) return;
			this.getSMSWindow($('smsArea'), null, null);
			this.initialized = true;
		}.bind(this));
	},
	
	changeTranslation: function(bubble, prefix) {
		var allElements = bubble.getElementsByTagName('*');
		for (var i = 0; i < allElements.length; i++)
		{
			var value = allElements[i].getAttribute("translation");
			if (value) {
				allElements[i].innerHTML = chrome.i18n.getMessage(prefix +'_' +value.trim());
			}
		}
	},
	
	getSMSWindow: function(content, number, text) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			  if (xhr.readyState != 4) {
				  return;
			  }
			  if(xhr.status != 200) {
				  this.closeSMSBubble();
				  return;
			  }
			  content.innerHTML = xhr.responseText;
			  if(this.systemArea == "team")
			  {
				  chrome.runtime.sendMessage({action: 'getVerifiedNumbers'}, this.setVerifiedNumbers.bind(this));
			  } else {
				  var label = document.getElementById("sipgateffx_sender-label");
				  var element = document.getElementById("sipgateffx_sender-element");
				  label.parentNode.removeChild(label);
				  element.parentNode.removeChild(element);
			  }
			  
			  if(typeof(number) != "undefined" && number != null) {
				  document.getElementById("sipgateffx_rect_number_sms_text-element").innerText = number;
			  } else {
				  document.getElementById("sipgateffx_recipient").addEventListener("blur", this.onNumberFieldLeave.bind(this));
			  }
			  
			  if(typeof(text) != "undefined" && text != null) {
				  document.getElementById("sipgateffx_message").value = text.substring(0,160);
				  this.bindMessageKeyUp();
			  }
			  document.getElementById("sipgateffx_message").addEventListener("keyup", this.bindMessageKeyUp.bind(this));
			  document.getElementById("sipgateffx_sms_submit_button").addEventListener("click", this.bindSendMessageClick.bind(this));
			  
			  document.getElementById("sipgateffx_sms_submit_cancel").addEventListener("click", this.close.bind(this));
			  
			  
			  this.changeTranslation(content, 'sms');
		}.bind(this);
		xhr.open("GET", chrome.extension.getURL('/html/sms.html'), true);
		xhr.send();	
	},

	setVerifiedNumbers: function(res) {
		if(typeof(res) != "undefined" && res != null && res.length > 0)
		{
			for (var i = 0; i < res.length; i++)
			{
				var entry = res[i];
				document.getElementById("sipgateffx_sender").options.add(new Option('+' + entry.E164, entry.E164, false, false));				

				if(entry.E164 == this.senderNumberPref) {
					document.getElementById("sipgateffx_sender").value = this.senderNumberPref;
				}
			}

			if(this.httpServer.match(/com$/)) {
				document.getElementById("sipgateffx_sender").remove(0);
				document.getElementById("sipgateffx_sender").selectedIndex = 0;
			}			
		}
	},
	
	bindMessageKeyUp: function(evnt) {
		var textLength = document.getElementById("sipgateffx_message").value.length;
		var smsLength = 160;
		document.getElementById("sipgateffx_remainingchars_counter").innerText = (smsLength - textLength);		
	},

	bindSendMessageClick: function(evnt) {
		var number = this.getNumber();
		var text = this.getText();
		var sender = this.getSender();

		if(this.systemArea == 'classic') {
			text = text.replace(/\n|\r/g, ' ');
		}

		if(number == "") {
			alert(chrome.i18n.getMessage("smsMissingNumber"));
			return;
		}
		if(text == "") {
			alert(chrome.i18n.getMessage("smsMissingText"));
			return;
		}
		// set sender
		if(document.getElementById("sipgateffx_sender") && document.getElementById("sipgateffx_sender").value) {
			sender = document.getElementById("sipgateffx_sender").value;
		}
		
		bgr.sendSMS(number, text, sender);
		
		document.getElementById("sipgateffx_sendingInProgress_progressbar").removeAttribute("value");			
		document.getElementById("sipgateffx_sendingInProgress_text").innerText = chrome.i18n.getMessage("smsSendingInProgress");
		document.getElementById("sipgateffx_sendsms").style.display = "none";
		document.getElementById("sipgateffx_sendingInProgress").style.display = "block";

		// set if scheduled
		/*
		 * TODO: Must be implemented in HTML form and here
		 * 
		if(document.getElementById("sipgate_sms_schedule_check").checked) {
			var date = document.getElementById("sipgate_sms_schedule_date").dateValue;
			var time = document.getElementById("sipgate_sms_schedule_time");	
			date.setHours(time.hour);
			date.setMinutes(time.minute);		
			params.Schedule	= date;
		}
		*/
	},
	
	getNumber: function() {
		var number = '';
		if(document.getElementById("sipgateffx_recipient"))
		{
			number = document.getElementById("sipgateffx_recipient").value;
		} else {
			number = document.getElementById("sipgateffx_rect_number_sms_text-element").innerText;
		}
		return number.trim();
	},
	
	getText: function() {
		return document.getElementById("sipgateffx_message").value.trim();
	},
	
	getSender: function()
	{
		var sender = null;
		if(document.getElementById("sipgateffx_sender") && document.getElementById("sipgateffx_sender").value)
		{
			sender = document.getElementById("sipgateffx_sender").value;
		}
		return sender;
	},
	
	onNumberFieldLeave: function() {
		var number = this.getNumber();
		if(number != "" && number.length > 4)
		{
			chrome.runtime.sendMessage({action: 'formatNumber', number: number}, function(formatted) {
				if(formatted && formatted[number] && formatted[number]['local']) {
					$('sipgateffx_recipient').set('value', formatted[number]['local']);
				}
			}.bind(this));
		}		
	},
	
	onSentSuccess: function() {
		document.getElementById("sipgateffx_sendingInProgress_progressbar").value = "1";
		document.getElementById("sipgateffx_sendingInProgress_text").innerText = chrome.i18n.getMessage("smsSendingSuccess");
	    DisplayManager.menu.delay(2000);
	},
	
	onSentFail: function() {
		document.getElementById("sipgateffx_sendingInProgress_progressbar").value = "0";
		document.getElementById("sipgateffx_sendingInProgress_text").innerText = chrome.i18n.getMessage("smsSendingFailure");
		setTimeout(function() {
			document.getElementById("sipgateffx_sendsms").style.display = "block";
			document.getElementById("sipgateffx_sendingInProgress").style.display = "none";			
		}, 5000);		
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
	url: {
			'team': {
			    "history": "/#filter_inbox",
			    "historycall": "/#type_call",
			    "historyfax": "/#type_fax",
			    "historysms": "/#type_sms",
			    "credit": "/settings/account/creditaccount",
			    "voicemail": "/#type_voicemail",
			    "fax": "/fax",
			    "phonebook": "/contacts",
			    "itemized": "/settings/account/evn",
			    "default": "/"
			},
			'classic': {
			    "history": "/user/calls.php",
			    "credit": "/user/kontoaufladen.php",
			    "voicemail": "/user/voicemail.php",
			    "fax": "/user/fax/index.php",
			    "phonebook": "/user/phonebook.php",
			    "itemized": "/user/konto_einzel.php?show=all",
			    "default": "/user/index.php"
			}
	},

	init: function() {
		this.changeTranslation();
		this.addLoginEvent();
		this.addToolstripMenuEvents();
		this.checkForLogin();
	},
	
	changeTranslation: function() {
		$$('*[translation]').each(function(el) {
			var key = "toolstrip_" + el.get('translation').trim();
			el.set('text', chrome.i18n.getMessage(key));
		});
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
		
		if($('preferences')) {
			$('preferences').addEvent('click', this.preferencesAction.bind(this));
		}
		
		$$('li.showSitePage').addEvent('click', this.onStatusbarCommand.bind(this));
	},
	
	preferencesAction: function() {
		chrome.tabs.create({
			url: chrome.extension.getURL('/options.html')
		});
	},
	
	onStatusbarCommand: function(evnt) {
		var clickedOn = $(evnt.target);
		var param = clickedOn.id;
		
		if(typeof(this.url[bgr.backgroundProcess.systemArea][param]) == 'undefined') {
			bgr.logBuffer.append("*** ->showSitePage: no url for action");
			return;
		}
		
		var protocol = 'https://';
		var httpServer = bgr.sipgateCredentials.HttpServer.replace(/^www/, 'secure');
		var siteURL = protocol + httpServer + this.url[bgr.backgroundProcess.systemArea][param];
		bgr.logBuffer.append("*** sipgateffx->showSitePage: link = " + siteURL);

		this.websiteSessionLogin(protocol + httpServer, bgr.username, bgr.password, function(res) {
			chrome.tabs.create({
				url: siteURL
			});				
		});
			
	},
	
	websiteSessionLogin: function(baseurl, user, pass, callback) {
		var urlSessionLogin = baseurl;
		if (bgr.backgroundProcess.systemArea == 'classic') {
			urlSessionLogin += "/user/slogin.php";
		}
		
		new Request({
			'url': urlSessionLogin,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			data: {username: user, password: pass},
			onComplete: callback
		}).post();		
	},
	
	loginAction: function(evnt) {
		evnt.stop();
		if($('username').get('value').trim() == "" && $('password').get('value').trim() == "")
		{
			alert(chrome.i18n.getMessage("enterCredentials"));
			return;
		}
		
		bgr.username = $('username').get('value');
		bgr.password = $('password').get('value');
		localStorage.setItem('username', bgr.username);
		localStorage.setItem('password', bgr.password);

		bgr.login(true);		
	},
	
	logoutAction: function(evnt) {
		evnt.stop();
		bgr.backgroundProcess.logout();
		DisplayManager.notloggedin();
		chrome.browserAction.setIcon({path:"skin/icon_sipgate_inactive.gif"});		
	},
	
	showBalance: function(balance) {
		bgr.logBuffer.append(balance);
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
		bgr.backgroundProcess.getBalance();
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
			bgr.logBuffer.append('Event handling not found for event: ' + e);
			break;
	}
}

document.addEventListener('DOMContentLoaded', function () {
	doOnLoad();
});