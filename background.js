var TOSMapping = {
	call: "voice",
	sms: "text",
	fax: "foobar"
};

var backgroundProcess = {
	tosList: [
        "voice",
        "text",
        "fax",
    ],
	ownUriList: {"voice": [], "text": [], "fax": []},
    defaultExtension: {},
    
    currentSessionID: null,
    currentSessionData: null,
    currentSessionTime: null,
    
	receiveRequest: function(request, sender, sendResponse) {
		if(!sender.tab) return;
		var response = {};
		if(request.action) {
			switch(request.action) {
				case 'startClick2dial':
					backgroundProcess.startClick2Dial(request.number);
					break;
			}
		}
		sendResponse(response);
	},
	
	startClick2Dial: function(number) {
		console.log("Starting with click2dial for number: " + number);
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

		var from = this.defaultExtension[TOSMapping.call];		
		if(from == null) {
			alert(chrome.i18n.getMessage("click2dial_noDefaultExtension"));
			return;
		}
		
		var to = niceNumber(number);
		this.currentSessionData = {'to': to, 'from': from['alias']};

		console.log("Starting with click2dial with currentSessionData: " + JSON.encode(this.currentSessionData));
		
		var params = { 
				'LocalUri': from['extensionSipUri'],
				'RemoteUri': "sip:"+ to +"\@sipgate.net",
				'TOS': "voice",
				'Content': ''		
			};
		
		console.log("Starting with click2dial with params: " + JSON.encode(params));
		
    	var onSuccess = function(res) {
    		console.log("SessionInitiate result: " + JSON.encode(res));
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
	

	getClick2DialStatus: function() {
		console.log(this);
		if(this.currentSessionID == null) {
			console.log('click2dial is not initiated.');
			return;
		}
		
		var endStati = ['FAILED', 'HUNGUP', 'CALL_1_BUSY', 'CALL_1_FAILED', "CALL_2_BUSY", 'CALL_2_FAILED'];
		
		var params = {'SessionID': this.currentSessionID};		

		var onSuccess = function(res) {
			try	{
				if (res.StatusCode && res.StatusCode == 200) {
					
					var state = res.SessionStatus.toUpperCase().replace(/ /g,"_");
					console.log('sipgateffx (click2dial): Status: ' + state);
					
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
					
					console.log(text);
					
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
					console.log(msg);
					this.currentSessionID = null;
					this.currentSessionTime = null;
					
					this.changeIcon.delay(5000, this, ['skin/icon_sipgate_active.gif']);
				}
			} catch(ex) {
				console.log('!$§§%$@@@ Exception: ' + ex);
			}
		}.bind(this);

		_rpcCall("samurai.SessionStatusGet", params, onSuccess);		
	},
	
	changeIcon: function(toWhat) {
		try {
			chrome.browserAction.setIcon({path: toWhat});
		} catch (e) {
			console.log('§&1!!: Exception: ' + e);
		}
	}
};

var backgroundHelper = {
    // Converts a UTF-8 encoded string to ISO-8859-1  
    // 
    // version: 905.3122
    // discuss at: http://phpjs.org/functions/utf8_decode
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Norman "zEh" Fuchs
    // +   bugfixed by: hitwork
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: utf8_decode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'
	utf8decode: function(str_data) {
	    var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
	    
	    str_data += '';
	    
	    while ( i < str_data.length ) {
	        c1 = str_data.charCodeAt(i);
	        if (c1 < 128) {
	            tmp_arr[ac++] = String.fromCharCode(c1);
	            i++;
	        } else if ((c1 > 191) && (c1 < 224)) {
	            c2 = str_data.charCodeAt(i+1);
	            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
	            i += 2;
	        } else {
	            c2 = str_data.charCodeAt(i+1);
	            c3 = str_data.charCodeAt(i+2);
	            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	            i += 3;
	        }
	    }
	
	    return tmp_arr.join('');
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
	}
	
	function login(force)
	{
		if(loggedin == true) {
			return;
		}
		chrome.browserAction.setIcon({path:"skin/throbber_anim.gif"});
		
		var onSuccess = function(res) {
			if (res.StatusCode && res.StatusCode == 200) {
				loggedin = true;
				getBalance();
				getTosList();
				getRecommendedIntervals();
				getOwnUriList();

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
		
		_rpcCall("samurai.ServerdataGet", {}, onSuccess);
	}

	function clientIdentify() {
		var params = {
			'ClientName': 'sipgateFFX',
			'ClientVersion': this.version,
			'ClientVendor': 'sipgate (michael.rotmanov)'
		};
		
		dumpJson(params);
		
        var result = function(ourParsedResponse, aXML){
		};

		try {
			this._rpcCall("samurai.ClientIdentify", params, result);
		} catch(e) {
			this.log('Exception in xmlrpc-request: ' + e);
			this.log('Request sent: ' + request);
		}
		
		this.log("*** clientIdentify *** END ***");		
		
	};	
	
	
	function getTosList()
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
	}
	
	function getRecommendedIntervals()
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
	}
	

	function getOwnUriList() {

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
	}
	
	function getBalance() {

		var onSuccess = function(res) {
			console.log('### getBalance. Result received.');
			
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
				console.log(curBalance);
	    		notifyViews('balance');
			}
			
			/*
			if (_sgffx.getPref("extensions.sipgateffx.polling", "bool")) {
				// set update timer
				var delay = _sgffx.recommendedIntervals["samurai.BalanceGet"];
				
				_sgffx.getBalanceTimer.initWithCallback({
					notify: function(timer) {
						_sgffx.curBalance = null;
						_sgffx.getBalance();
					}
				}, delay * 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
				
				_sgffx.log("getBalance: polling enabled. set to " + delay + " seconds");
			}
			*/
		};		
		
		_rpcCall("samurai.BalanceGet", null, onSuccess);
	}		
	
	
	function sendSMS(number, text)
	{
		var remoteUri = "sip:"+ niceNumber(number) +"\@sipgate.net";
		var params = { 'RemoteUri': remoteUri, 'TOS': "text", 'Content': text };
		
    	var onSuccess = function(res) {
    		console.log(res);
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
		var msg = new XmlRpcRequest('', method);
		if(typeof params != 'undefined' && params != null)
		{
			msg.addParam(params);
		}
//		var server = "https://api.sipgate.net/RPC2";
		var server = "http://api.dev.sipgate.net/RPC2";
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
						console.log("BAD" + xhr.status);
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
			
			console.log("_niceNumber(): number before: "+_number);
			
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
			console.log("_niceNumber(): number after: "+_number);
		} catch (ex) {
		    	console.log("Error in _niceNumber(): "+ex);
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
