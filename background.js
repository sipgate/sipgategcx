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
		"SipOutboundProxy": "proxy.dev.sipgate.de",
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
		var onSuccess = function(res) {
			if (res.StatusCode && res.StatusCode == 200) {
				loggedin = true;
				getBalance();
				// getTosList();
				getRecommendedIntervals();

	    		chrome.browserAction.setIcon({path:"skin/icon_sipgate_active.gif"});
	    		notifyViews('loggedin');
  		
				sipgateCredentials = res;
			} else {
				notifyViews('loggedinFailed');
			}
		};
		
		_rpcCall("samurai.ServerdataGet", {}, onSuccess);
	}

	function getRecommendedIntervals() {

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
		var xml = msg.parseXML();
		new Request({ 
					//url: 'https://' + encodeURIComponent(username) + ":" + encodeURIComponent(password) + '@api.sipgate.net/RPC2', 
					url: 'http://' + encodeURIComponent(username) + ":" + encodeURIComponent(password) + '@api.dev.sipgate.net/RPC2', 
					headers: {
						'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
						'Content-Type': 'text/xml; charset=UTF-8'
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
			console.log("_niceNumber(): bla: "+_number);
			
			if(!_number.match(/^0|^\+/)) {
				_number = natprefix + _number;
			} else {
				_number = _number.toString().replace(new RegExp(internationalPrefixes[natprefix].join('|')), "");
			}
			console.log("_niceNumber(): bla: "+_number);

			// -----------------------------------------------------			

			var nationalPrefixCandidates = [
				'^0([1-9]\\d+)'				// prefix like "0211 ..."
			];

			var nationalPrefixRegEx = new RegExp(nationalPrefixCandidates.join('|'));

			_number = _number.toString().replace(nationalPrefixRegEx, natprefix + "$1");
			console.log("_niceNumber(): bla: "+_number);

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
	
	