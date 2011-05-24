var logBuffer = {
	capacity: 10000,
	buffer: [],
	logToConsole: true,
	
	_getTime: function() {
		var t = new Date();
		return '['+	[
		 t.getUTCFullYear(),
		 t.getUTCMonth(),
		 t.getUTCDate(),
		 t.getUTCHours(),
		 t.getUTCMinutes(),
		 t.getUTCSeconds()].join('-')
		 + ']';
	},
	
	append: function(item)
	{
		if(typeof(item) == "object")
		{
			item = JSON.encode(item);
		}
		
		if(typeof(item) != "string")
		{
			return;
		}
	
		if(logBuffer.logToConsole) console.log(this._getTime() +' '+ item);
		
		this.buffer.push(this._getTime() +' '+ item);
		
		if(this.buffer.length > this.capacity)
		{
			this.buffer.pop();
		}
	}	
};


var TOSMapping = {
	call: "voice",
	sms: "text",
	fax: "foobar"
};

var backgroundProcess = {
	extensionInfo: {},
	tosList: [
        "voice",
        "text",
        "fax"
    ],
    
    samuraiServer: {'team': "https://api.sipgate.net/RPC2", 'classic': "https://samurai.sipgate.net/RPC2"},
    systemAreaRegEx: new RegExp(/^.+@.+\.[a-z]{2,6}$/),

	ownUriList: {"voice": [], "text": [], "fax": []},
    defaultExtension: {},
    
    currentSessionID: null,
    currentSessionData: null,
    currentSessionTime: null,

    init: function() {
    	this.getVersionInfo(function(versionInfo) { this.extensionInfo = versionInfo }.bind(this));
    },
    
    getVersionInfo: function(callback) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                callback(JSON.decode(xhr.responseText));
            }
        };
        xhr.open("GET", chrome.extension.getURL('/manifest.json'));

        try {
            xhr.send();
        } catch(e) {
        	logBuffer.append('Couldn\'t load manifest.json');
        }
    },
    
    /**
     * function that receives requests from content pages
     */
	receiveRequest: function(request, sender, sendResponse) {
		if(!sender.tab) return;
		var response = {};
		if(request.action) {
			switch(request.action) {
				case 'startClick2dial':
					backgroundProcess.startClick2Dial(request.number);
					break;
				case 'getParsingOptions':
					response = {
							parsing: localStorage.getItem("c2denabled"),
							color: localStorage.getItem("c2dcolor"),
							preview: localStorage.getItem("previewnumber")
					};
					break;
			}
		}
		sendResponse(response);
	},
	
	startClick2Dial: function(number) {
		logBuffer.append("Starting with click2dial for number: " + number);
		if(typeof(number) == "undefined" || !number) {
			alert(chrome.i18n.getMessage("click2dial_missingNumber"));
			return;
		}
		
		if(this.tosList.indexOf(TOSMapping.call) == -1) {
			alert(chrome.i18n.getMessage("click2dial_unavailableTos"));
			return;
		}
		
		if(this.currentSessionID != null) {
			alert(chrome.i18n.getMessage("click2dial_running"));
			return;
		}

		var from = this.getClick2DialFromExtension();
		
		if(from == null) {
			alert(chrome.i18n.getMessage("click2dial_noDefaultExtension"));
			return;
		}
		
		var to = niceNumber(number);
		this.currentSessionData = {'to': to, 'from': from['alias']};

		logBuffer.append("Starting with click2dial with currentSessionData: " + JSON.encode(this.currentSessionData));
		
		var params = { 
				'LocalUri': from['extensionSipUri'],
				'RemoteUri': "sip:"+ to +"\@sipgate.net",
				'TOS': "voice",
				'Content': ''		
			};
		
		logBuffer.append("Starting with click2dial with params: " + JSON.encode(params));
		
    	var onSuccess = function(res) {
    		logBuffer.append("SessionInitiate result: " + JSON.encode(res));
			if (res.StatusCode && res.StatusCode == 200) {
				this.currentSessionID = res.SessionID;
				chrome.browserAction.setIcon({path:"skin/c2d_wait.gif"});		
				this.getClick2DialStatus.delay(1000,this);
			} else {
				this.currentSessionID = null;
				chrome.browserAction.setIcon({path:"skin/c2d_failed.gif"});		
			}
		}.bind(this);

		_rpcCall("samurai.SessionInitiate", params, onSuccess);		
	},

	getClick2DialFromExtension: function()
	{
		var from = this.defaultExtension[TOSMapping.call];
		
		// check for custom defaultExtension
	    var voiceList = this.ownUriList[TOSMapping.call];
		var uriList = [];
		var defaultExtensionPref = localStorage.getItem("defaultExtension");
		
		// make a list of all available voice uris
	    for (var i = 0; i < voiceList.length; i++) {
			uriList.push(voiceList[i].SipUri);
		}
		
		// check if option's defaultExtension is in the list of available extensions
		if(uriList.indexOf(defaultExtensionPref) == -1) {
			localStorage.setItem("defaultExtension", from.extensionSipUri);
		} else {
			from = {
				'alias': defaultExtensionPref,
				'extensionSipUri': defaultExtensionPref
			};
		}
		
		return from;
	},
	
	getClick2DialStatus: function() {
		logBuffer.append(this);
		if(this.currentSessionID == null) {
			logBuffer.append('click2dial is not initiated.');
			return;
		}
		
		var endStati = ['FAILED', 'HUNGUP', 'CALL_1_BUSY', 'CALL_1_FAILED', "CALL_2_BUSY", 'CALL_2_FAILED'];
		
		var params = {'SessionID': this.currentSessionID};		

		var onSuccess = function(res) {
			try	{
				if (res.StatusCode && res.StatusCode == 200) {
					
					var state = res.SessionStatus.toUpperCase().replace(/ /g,"_");
					logBuffer.append('sipgateffx (click2dial): Status: ' + state);
					
					switch(state) {
						case 'ESTABLISHED':
							this.changeIcon('skin/c2d_established.gif');
							break;
						case 'FAILED':
							this.changeIcon('skin/c2d_failed.gif');
							break;
						case 'HUNGUP':
							this.changeIcon('skin/c2d_hungup.gif');
							break;
						case 'CALL_1_BUSY':
							this.changeIcon('skin/c2d_line1busy.gif');
							break;
						case 'CALL_1_FAILED':
							this.changeIcon('skin/c2d_line1fail.gif');
							break;
						case 'CALL_2_BUSY':
							this.changeIcon('skin/c2d_line2busy.gif');
							break;
						case 'CALL_2_FAILED':
							this.changeIcon('skin/c2d_line2fail.gif');
							break;
						case 'FIRST_DIAL':
							this.changeIcon('skin/c2d_pickup.gif');
							break;
						default:
							this.changeIcon('skin/c2d_wait.gif');
							break;
					}
					
					// click2dial.status.
					var key = "click2dial_status_" + state;
					
					var text = '';
					// 			alert(chrome.i18n.getMessage("click2dial_missingNumber"));

					if (state == 'ESTABLISHED') {
						if (this.currentSessionTime == null) {
							this.currentSessionTime = new Date().getTime();
						}
						text = parseInt((new Date().getTime() - _sgffx.currentSessionTime) / 1000);
					} else {
						text = chrome.i18n.getMessage(key);
					}
					
					logBuffer.append(text);
					
					if (endStati.indexOf(state) == -1) {
						backgroundProcess.getClick2DialStatus.delay(1000, this);
					} else {
						this.currentSessionID = null;
						this.currentSessionTime = null;
						
						this.changeIcon.delay(5000, this, ['skin/icon_sipgate_active.gif']);

						if (state == 'CALL_1_FAILED') {
							alert(chrome.i18n.getMessage('click2dial_status_CALL_1_FAILED_detail'));
						}
					}
		
				} else {
					var msg = '### sipgateffx (click2dial): FAILED';
					if(res.faultCode && res.faultString) {
						msg = msg + ' (faultCode: '+res.faultCode+' / faultString: '+res.faultString+')';
					}
					logBuffer.append(msg);
					this.currentSessionID = null;
					this.currentSessionTime = null;
					
					this.changeIcon.delay(5000, this, ['skin/icon_sipgate_active.gif']);
				}
			} catch(ex) {
				logBuffer.append('!$§§%$@@@ Exception: ' + ex);
			}
		}.bind(this);

		_rpcCall("samurai.SessionStatusGet", params, onSuccess);		
	},
	
	changeIcon: function(toWhat) {
		try {
			chrome.browserAction.setIcon({path: toWhat});
		} catch (e) {
			logBuffer.append('§&1!!: Exception: ' + e);
		}
	},

	setCredentials: function(_username, _password) {
		if(_username.trim() != "" && _password.trim() != "") {
			username = _username;
			password = _password;
			loggedin = false;
			login();
			logBuffer.append("Credentials set");
			logBuffer.append(loggedin);
		}
	},
	

	clientIdentify: function clientIdentify() {
		var params = {
			'ClientName': 'sipgateGCX',
			'ClientVersion': this.version,
			'ClientVendor': 'sipgate (michael.rotmanov)'
		};
		
        var result = function(ourParsedResponse, aXML){
		};

		_rpcCall("samurai.ClientIdentify", params, result);
	},	
	
	getTosList: function getTosList()
	{
		var onSuccess = function(res) {
			if (res.StatusCode && res.StatusCode == 200) {
				if(res.TosList) {
					backgroundProcess.tosList = res.TosList; 
				}				
			}
		};
			
		var params = {};			
		
		_rpcCall("samurai.TosListGet", params, onSuccess);		
	},
	
	getRecommendedIntervals: function getRecommendedIntervals()
	{
		var onSuccess = function(res) {
			if (res.StatusCode && res.StatusCode == 200) {
				if (res.IntervalList.length > 0) {
					for (var i = 0; i < res.IntervalList.length; i++) {
						recommendedIntervals[res.IntervalList[i].MethodName] = res.IntervalList[i].RecommendedInterval;
					}
				}
			}
		};
			
		var params = {
			'MethodList': ["samurai.RecommendedIntervalGet", "samurai.BalanceGet", "samurai.EventSummaryGet"]
		};			
		
		_rpcCall("samurai.RecommendedIntervalGet", params, onSuccess);
	},	

	getOwnUriList: function getOwnUriList() {

		var onSuccess = function(res) {
			if (res.StatusCode && res.StatusCode == 200) {
				if (res.OwnUriList.length > 0) {
					// clear old list
					var uriList = [];
					backgroundProcess.ownUriList = {"voice": [], "text": [], "fax": []};
										
					
					for (var i = 0; i < res.OwnUriList.length; i++) {
						uriList.push(res.OwnUriList[i].SipUri);
                        for (var k = 0; k < res.OwnUriList[i].TOS.length; k++) {
							var tmp = backgroundHelper.utf8decode(res.OwnUriList[i].UriAlias);
                            var extensionInfo = {
                                'UriAlias': tmp,
                                'DefaultUri': res.OwnUriList[i].DefaultUri,
                                'E164In': res.OwnUriList[i].E164In,
                                'E164Out': res.OwnUriList[i].E164Out,
                                'SipUri': res.OwnUriList[i].SipUri
                            };
                            var tosType = res.OwnUriList[i].TOS[k];
                            backgroundProcess.ownUriList[tosType].push(extensionInfo);
                            
                            if (res.OwnUriList[i].DefaultUri === true) {
                            	var defaultInfo = {
                                        'alias': (res.OwnUriList[i].UriAlias!='' ? res.OwnUriList[i].UriAlias : res.OwnUriList[i].SipUri),
                                        'extensionSipUri': res.OwnUriList[i].SipUri
                            	};
                            	backgroundProcess.defaultExtension[tosType] = defaultInfo;
                            }
                        }
					}
					
					/**
					 * TODO Set default extension to preferences
					 */
				}
			}
		};
			
		var params = {};			
		
		_rpcCall("samurai.OwnUriListGet", params, onSuccess);
	},
	
	getBalance: function getBalance() {

		var onSuccess = function(res) {
			logBuffer.append('### getBalance. Result received.');
			
			if (res.StatusCode && res.StatusCode == 200) {
				var balance = res.CurrentBalance;
				var currency = balance.Currency;
				var balanceValueDouble = balance.TotalIncludingVat;
				
				var balanceValueString = balanceValueDouble;
				
				// dirty hack to localize floats:
				if (navigator.language == "de") {
					// german floats use "," as delimiter for mantissa:
					balanceValueString = balanceValueDouble.toFixed(2).toString();
					balanceValueString = balanceValueString.replace(/\./, ",");
				} else {
					balanceValueString = balanceValueDouble.toFixed(2).toString();
				}
				
				curBalance = [balanceValueString + " " + currency, balanceValueDouble];
				logBuffer.append(curBalance);
	    		notifyViews('balance');
	    		chrome.browserAction.setTitle({title: balanceValueString});
			}
			
			var delay = recommendedIntervals["samurai.BalanceGet"];
			backgroundProcess.getBalance.delay(delay * 1000);
			logBuffer.append("getBalance: polling enabled. set to " + delay + " seconds");			
		};		
		
		_rpcCall("samurai.BalanceGet", null, onSuccess);
	},		

    get systemArea() {
    	return this.systemAreaRegEx.test(this.username) ? 'team' : 'classic';
    },
    
    get version() {
    	var version = "NOTYETKNOWN";
    	if(this.extensionInfo && this.extensionInfo.version) {
    		version = this.extensionInfo.version;
    	}
    	return version;
    }
        
};

var restApi = {
	url: 'http://api.dev.sipgate.net',
	
	voicemail: {
		url: 'my/events/voicemails',
		version: "2.30",
		interval: 180 * 1000,
		lastId: null
	},
	
	getNewVoicemails: function() {
		var callback = this.response.parseVoicemailResult;
		if(this.voicemail.lastId == null) {
		//	callback = this.response.setInitialVoicemailId;
		}
		this._get(this.voicemail.url, this.voicemail.version, callback.bind(this));
	},
	
	response: {
		setInitialVoicemailId: function(res) {
			if(!res || !res['events'] || !res['events']['voicemails']) return;
			if(res['events']['voicemails'].length > 0) {
				this.voicemail.lastId = res['events']['voicemails'][0].id;
			} else {
				this.voicemail.lastId = 1;
			}
			this.getNewVoicemails.delay(this.voicemail.interval);
		},
		
		parseVoicemailResult: function(res) {
			if(!res || !res['events'] || !res['events']['voicemails']) return;
			if(res['events']['voicemails'].length > 0 && res['events']['voicemails'][0].id > this.voicemail.lastId) {
				var counter = 0;
				for (var i = 0, l = res['events']['voicemails'].length; i < l; i++) {
					logBuffer.append(res['events']['voicemails'][i]);
					if(res['events']['voicemails'][i].id > this.voicemail.lastId) {
						counter++;
					} else {
						break;
					}
				}
				this.voicemail.lastId = res['events']['voicemails'][0].id;
				var title = "You have " + counter + " new voicemails";
				var text = "To read it, go to sipgate.com!";
				if(counter == 1 && res['events']['voicemails'][0].transcription) {
					text = res['events']['voicemails'][0].transcription;
				}
				webkitNotifications.createNotification(
						  'skin/sipgateffx_logo.png',
						  title,
						  text
				).show();
			}
			this.getNewVoicemails.delay(this.voicemail.interval);
		}
	},
	
	_get: function _restCall(url, version, successCallback, failureCallback)
	{
		var server = "http://api.dev.sipgate.net/"+ url +"/?version="+ version +"&complexity=full";
		new Request.JSON({ 
			method: 'get',
			url: server, 
			headers: {
				'Authorization': 'Basic ' + btoa(username + ':' + password)
			},
			onSuccess: function(res) {
				if(typeof successCallback == 'function')
				{
					successCallback(res);
				}						
			},
			onFailure: function(xhr) {
				logBuffer.append("BAD" + xhr.status);
				if(typeof failureCallback == 'function')
				{
					failureCallback(xhr);
				}							
			}
		}).send();
	}
};

	var username = null;
	var password = null;
	var loggedin = false;
	var userCountryPrefix = '49';
	var internationalPrefixes = {
		"1": ["^011","^\\+"],
		"43": ["^00","^\\+"],
		"44": ["^00","^\\+"],
		"49": ["^00","^\\+"]
	};
	
	var sipgateCredentials = {
		"SipRegistrar": "sipgate.de",
		"NtpServer": "ntp.sipgate.net",
		"HttpServer": "www.live.sipgate.de",
		"SipOutboundProxy": "proxy.sipgate.de",
		"XmppServer": "",
		"StunServer": "stun.sipgate.net",
		"SamuraiServer": "api.sipgate.net",
		"SimpleServer": ""
	};

	var recommendedIntervals = {
		"samurai.BalanceGet": 60,
		"samurai.RecommendedIntervalGet": 60,
		"samurai.EventSummaryGet": 60
	};
	
	var curBalance;
		
	function doOnLoad()
	{
//		chrome.browserAction.setBadgeText({text: "foo"});
    	username = localStorage.getItem('username');
		password = localStorage.getItem('password');
		if(username != null && password != null)
		{
			login();
		}
		backgroundProcess.init();
	}
	
	function login(force)
	{
		if(loggedin == true && !force) {
			return;
		}
		chrome.browserAction.setIcon({path:"skin/throbber_anim.gif"});
		
		var onSuccess = function(res) {
			if (res.StatusCode && res.StatusCode == 200) {
				loggedin = true;
				backgroundProcess.getBalance();
				backgroundProcess.getTosList();
				backgroundProcess.getRecommendedIntervals();
				backgroundProcess.getOwnUriList();

	    		chrome.browserAction.setIcon({path:"skin/icon_sipgate_active.gif"});
	    		notifyViews('loggedin');
  		
				sipgateCredentials = res;
			} else {
				notifyViews('loggedinFailed');
			}
		};
		
		var onFail = function(xhr) {
			chrome.browserAction.setIcon({path:"skin/icon_sipgate_inactive.gif"});
		};
		
		_rpcCall("samurai.ServerdataGet", {}, onSuccess, onFail);
	}
	
	function sendSMS(number, text)
	{
		var remoteUri = "sip:"+ niceNumber(number) +"\@sipgate.net";
		var params = { 'RemoteUri': remoteUri, 'TOS': "text", 'Content': text };
		
    	var onSuccess = function(res) {
    		logBuffer.append(res);
			if (res.StatusCode && res.StatusCode == 200) {
				notifyViews('smsSentSuccess');
			} else {
				notifyViews('smsSentFailed');
			}
		};

		_rpcCall("samurai.SessionInitiate", params, onSuccess);
	}		

	function _rpcCall(method, params, successCallback, failureCallback)
	{
		logBuffer.append(method);
		var msg = new XmlRpcRequest('', method);
		if(typeof params != 'undefined' && params != null)
		{
			msg.addParam(params);
		}
		
//		var server = "https://api.sipgate.net/RPC2";
		var server = backgroundProcess.samuraiServer[backgroundProcess.systemArea];

		var xml = msg.parseXML();
		new Request({ 
					url: server, 
					headers: {
						'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
						'Content-Type': 'text/xml; charset=UTF-8',
						'Authorization': 'Basic ' + btoa(username + ':' + password)
					},
					data: xml,
					onSuccess: function(resText, resXML) {
						var ourParsedResponse = new XmlRpcResponse(resXML).parseXML();
						if(typeof successCallback == 'function')
						{
							successCallback(ourParsedResponse);
						}
					},
					onFailure: function(xhr) {
						logBuffer.append("BAD" + xhr.status);
						if(typeof failureCallback == 'function')
						{
							failureCallback(xhr);
						}							
					}
					}).send();
	}
	
	function niceNumber (_number) {
		try {
			var natprefix = userCountryPrefix;
			
			logBuffer.append("_niceNumber(): number before: "+_number);
			
			// -----------------------------------------------------
			
			var removeCandidates = [
				"\\s",						// whitespaces
				"-",						// dashes
				"\\[0\\]",					// smth like 49 [0] 211 to 49 211
				"\\(0\\)",					// smth like 49 (0) 211 to 49 211
				"\\.",						// all points
				"\\/",						// all points
				"\\[",						// bracket [
				"\\]",						// bracket ]
				"\\(",						// bracket (
				"\\)",						// bracket )
				String.fromCharCode(0xa0)	// &nbsp;
			];
			var removeRegEx = new RegExp(removeCandidates.join('|'), 'g');
			
			_number = _number.toString().replace(removeRegEx, "");
			
			if(!_number.match(/^0|^\+/)) {
				_number = natprefix + _number;
			} else {
				_number = _number.toString().replace(new RegExp(internationalPrefixes[natprefix].join('|')), "");
			}

			// -----------------------------------------------------			

			var nationalPrefixCandidates = [
				'^0([1-9]\\d+)'				// prefix like "0211 ..."
			];

			var nationalPrefixRegEx = new RegExp(nationalPrefixCandidates.join('|'));

			_number = _number.toString().replace(nationalPrefixRegEx, natprefix + "$1");

			// -----------------------------------------------------	

			_number = _number.toString().replace(/[^\d]/g, "");
			logBuffer.append("_niceNumber(): number after: "+_number);
		} catch (ex) {
		    	logBuffer.append("Error in _niceNumber(): "+ex);
		}
		return _number;
	}

	function notifyViews(evnt) {
		chrome.extension.getViews().forEach(function(view) {
	        if(typeof(view['receiveMessage']) == 'function') {
		        view.receiveMessage(evnt);
	        }
		});
	}
	
	chrome.extension.onRequest.addListener(backgroundProcess.receiveRequest);
