var internationalPrefixes = {
		"1": ["^011","^\\+"],
		"43": ["^00","^\\+"],
		"44": ["^00","^\\+"],
		"49": ["^00","^\\+"]
};
var userCountryPrefix = "49";
var phoneRegExp = /((\+[2-9]\d)|(00[1-9]\d)|(0[1-9]\d|([\(\[][\ \t]*[\d\ \t]+[\ \t]*[)\]])))((((([\ \t]*[\(\[][\ \t]*[\d\ \t]+[)\]][\ \t]*)|([\d\ \t]{1,}[\.]?)))|(\(\d{3,}\)))[\/]?(([\ \t]*[\[(][\-\d\ \t]{3,}[\]\)][\ \t]*)|([\-\d ]{3,}))+)|(\+[1-9][\.\/\-\ \t\d]{4,})|(1[\ \t\.\-\/])?\(?[2-9]\d{2}\)?[\ \t\.\-\/]\d{3}[\ \t\.\-\/]\d{4}/;
var nbspRegExp = new RegExp(String.fromCharCode(0xa0), 'g'); 

var allCountries = {
	"1[2-9]": "North America",
	"7": "Russia",
	"20": "Egypt",
	"27": "South Africa",
	"30": "Greece",
	"31": "Netherlands",
	"32": "Belgium",
	"33": "France",
	"34": "Spain",
	"36": "Hungary",
	"39": "Italy",
	"40": "Romania",
	"41": "Switzerland",
	"43": "Austria",
	"44": "United Kingdom",
	"45": "Denmark",
	"46": "Sweden",
	"47": "Norway",
	"48": "Poland",
	"49": "Germany",
	"51": "Peru",
	"52": "Mexico",
	"53": "Cuba",
	"54": "Argentina",
	"55": "Brazil",
	"56": "Chile",
	"56": "Easter Island",
	"57": "Colombia",
	"58": "Venezuela",
	"60": "Malaysia",
	"61": "Cocos-Keeling Islands",
	"61": "Australia",
	"61": "Christmas Island",
	"62": "Indonesia",
	"63": "Philippines",
	"64": "Chatham Island (New Zealand)",
	"64": "New Zealand",
	"65": "Singapore",
	"66": "Thailand",
	"81": "Japan",
	"82": "South Korea",
	"84": "Vietnam",
	"86": "China",
	"90": "Turkey",
	"91": "India",
	"92": "Pakistan",
	"93": "Afghanistan",
	"94": "Sri Lanka",
	"95": "Myanmar",
	"98": "Iran",
	"212": "Morocco",
	"213": "Algeria",
	"216": "Tunisia",
	"218": "Libya",
	"220": "Gambia",
	"221": "Senegal",
	"222": "Mauritania",
	"223": "Mali",
	"224": "Guinea",
	"225": "Ivory Coast",
	"226": "Burkina Faso",
	"227": "Niger",
	"228": "Togo",
	"229": "Benin",
	"230": "Mauritius",
	"231": "Liberia",
	"232": "Sierra Leone",
	"233": "Ghana",
	"234": "Nigeria",
	"235": "Chad",
	"236": "Central African Republic",
	"237": "Cameroon",
	"238": "Cape Verde",
	"239": "São Tomé and Príncipe",
	"240": "Equatorial Guinea",
	"241": "Gabon",
	"242": "Congo",
	"242": "Congo - Brazzaville",
	"243": "Congo, Dem. Rep. of (Zaire)",
	"243": "Congo - Kinshasa",
	"244": "Angola",
	"245": "Guinea-Bissau",
	"246": "Diego Garcia",
	"246": "British Indian Ocean Territory",
	"247": "Ascension",
	"248": "Seychelles",
	"249": "Sudan",
	"250": "Rwanda",
	"251": "Ethiopia",
	"252": "Somalia",
	"253": "Djibouti",
	"254": "Kenya",
	"255": "Zanzibar",
	"255": "Tanzania",
	"256": "Uganda",
	"257": "Burundi",
	"258": "Mozambique",
	"260": "Zambia",
	"261": "Madagascar",
	"262": "Réunion",
	"262": "Mayotte",
	"263": "Zimbabwe",
	"264": "Namibia",
	"265": "Malawi",
	"266": "Lesotho",
	"267": "Botswana",
	"268": "Swaziland",
	"269": "Comoros",
	"290": "Saint Helena",
	"291": "Eritrea",
	"297": "Aruba",
	"298": "Faroe Islands",
	"299": "Greenland",
	"350": "Gibraltar",
	"351": "Portugal",
	"352": "Luxembourg",
	"353": "Ireland",
	"354": "Iceland",
	"355": "Albania",
	"356": "Malta",
	"357": "Cyprus",
	"358": "Finland",
	"359": "Bulgaria",
	"370": "Lithuania",
	"371": "Latvia",
	"372": "Estonia",
	"373": "Moldova",
	"374": "Armenia",
	"375": "Belarus",
	"376": "Andorra",
	"377": "Monaco",
	"378": "San Marino",
	"379": "Vatican",
	"380": "Ukraine",
	"381": "Serbia",
	"382": "Montenegro",
	"385": "Croatia",
	"386": "Slovenia",
	"387": "Bosnia and Herzegovina",
	"389": "Macedonia",
	"420": "Czech Republic",
	"421": "Slovakia",
	"423": "Liechtenstein",
	"500": "Falkland Islands",
	"500": "South Georgia and the South Sandwich Islands",
	"501": "Belize",
	"502": "Guatemala",
	"503": "El Salvador",
	"504": "Honduras",
	"505": "Nicaragua",
	"506": "Costa Rica",
	"507": "Panama",
	"508": "Saint Pierre and Miquelon",
	"509": "Haiti",
	"590": "Saint Martin",
	"590": "Guadeloupe",
	"590": "Saint Barthélemy",
	"591": "Bolivia",
	"592": "Guyana",
	"593": "Ecuador",
	"594": "French Guiana",
	"595": "Paraguay",
	"596": "Martinique",
	"596": "French Antilles",
	"597": "Suriname",
	"598": "Uruguay",
	"599": "Netherlands Antilles",
	"599": "Curacao",
	"670": "Timor Leste",
	"670": "East Timor",
	"672": "Australian External Territories",
	"672": "Norfolk Island",
	"673": "Brunei",
	"674": "Nauru",
	"675": "Papua New Guinea",
	"676": "Tonga",
	"677": "Solomon Islands",
	"678": "Vanuatu",
	"679": "Fiji",
	"680": "Palau",
	"681": "Wallis and Futuna",
	"682": "Cook Islands",
	"683": "Niue",
	"685": "Samoa",
	"686": "Kiribati",
	"687": "New Caledonia",
	"688": "Tuvalu",
	"689": "French Polynesia",
	"690": "Tokelau",
	"691": "Micronesia",
	"692": "Marshall Islands",
	"800": "International Freephone Service",
	"808": "International Shared Cost Service (ISCS)",
	"808": "Wake Island",
	"850": "North Korea",
	"852": "Hong Kong SAR China",
	"853": "Macau SAR China",
	"855": "Cambodia",
	"856": "Laos",
	"870": "Inmarsat SNAC",
	"878": "Universal Personal Telecommunications (UPT)",
	"880": "Bangladesh",
	"881": "Global Mobile Satellite System (GMSS)",
	"886": "Taiwan",
	"960": "Maldives",
	"961": "Lebanon",
	"962": "Jordan",
	"963": "Syria",
	"964": "Iraq",
	"965": "Kuwait",
	"966": "Saudi Arabia",
	"967": "Yemen",
	"968": "Oman",
	"970": "Palestinian Territory",
	"971": "United Arab Emirates",
	"972": "Israel",
	"973": "Bahrain",
	"974": "Qatar",
	"975": "Bhutan",
	"976": "Mongolia",
	"977": "Nepal",
	"992": "Tajikistan",
	"993": "Turkmenistan",
	"994": "Azerbaijan",
	"995": "Georgia",
	"996": "Kyrgyzstan",
	"998": "Uzbekistan",
	"5399": "Cuba (Guantanamo Bay)",
	"8810": "ICO Global (Mobile Satellite Service)",
	"8812": "Ellipso (Mobile Satellite service)",
	"8816": "Iridium (Mobile Satellite service)",
	"8818": "Globalstar (Mobile Satellite Service)",
	"8811": "ICO Global (Mobile Satellite Service)",
	"8813": "Ellipso (Mobile Satellite service)",
	"8817": "Iridium (Mobile Satellite service)",
	"8819": "Globalstar (Mobile Satellite Service)",
	"88213": "EMSAT (Mobile Satellite service)",
	"88216": "Thuraya (Mobile Satellite service)"
	};

var click2dialBackground = '';
var previewDialog = false; 
var systemArea = "team";
var senderNumberPref = "";
var httpServer = "";

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

var sipgateffx_hightlightnumber = {
	
	regExp: {
		nationalPrefix: null,
		countryCodeRegex: null,
		intBegin: /^[\(\[]?\+|^[\(\[]?00/
	},		
		
	sendingInProgress: false,
	SMSBubble: null,
	callBubble: null,
	
	init: function init() {
		this.prepareCountryRegex();

		this.regExp.nationalPrefix = new RegExp(internationalPrefixes[userCountryPrefix].join('|')+"|\\D", "g");		
		if(userCountryPrefix == "1") { this.regExp.intBegin = /^[\(\[]?\+|^[\(\[]?00|^011/; }		

		chrome.extension.sendRequest({action: 'getParsingOptions'}, function(res) {
			if(res.color) click2dialBackground = res.color;
			if(res.preview) previewDialog = (res.preview=="true");
			if(res.parsing != "false") sipgateffx_hightlightnumber.startRendering();	
			if(res.systemArea) systemArea = res.systemArea;
			if(res.httpServer) httpServer = res.httpServer;
			if(res.smsSender) senderNumberPref = res.smsSender;
		});

		if(document)
		{
			// this event may be used by third party script to reparse this site after some external DOM action (e.g. AJAX requests)
			document.addEventListener('sipgateffxParseNumbers', function() {
				setTimeout(sipgateffx_hightlightnumber.sipgateffxParseDOM.bind(sipgateffx_hightlightnumber), 0, document.body, document);
			});
		}


	},

	prepareCountryRegex: function prepareCountryRegex() {
		var tmp="^XXX";
		for(i in allCountries) {
			tmp += "|^" + i;
		}
		tmp += "";
		this.regExp.countryCodeRegex = new RegExp(tmp);
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
	
	hideBubble: function(bubble, callbackEnd)
	{
		var start = window.performance.now();
		var step = function(timestamp) {
			var progress = timestamp - start;
			bubble.style.opacity = 1 - (Math.min(progress/2, 100) / 100);
			if (progress < 200) {
				window.requestAnimationFrame(step);
			} else {
				if(typeof(callbackEnd) == "function") callbackEnd();
			}
		}.bind(this);
		window.requestAnimationFrame(step);		
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
			  if(systemArea == "team")
			  {
				  chrome.extension.sendRequest({action: 'getVerifiedNumbers'}, this.setVerifiedNumbers.bind(this));
			  } else {
				  var label = document.getElementById("sipgateffx_sender-label");
				  var element = document.getElementById("sipgateffx_sender-element");
				  label.parentNode.removeChild(label);
				  element.parentNode.removeChild(element);
			  }
			  if(typeof(number) != "undefined") {
				  document.getElementById("sipgateffx_rect_number_sms_text-element").innerText = number;
			  }

			  if(typeof(text) != "undefined") {
				  document.getElementById("sipgateffx_message").value = text.substring(0,160);
				  this.bindMessageKeyUp();
			  }
			  document.getElementById("sipgateffx_message").addEventListener("keyup", this.bindMessageKeyUp.bind(this));
			  document.getElementById("sipgateffx_sms_submit_button").addEventListener("click", this.bindSendMessageClick.bind(this));
			  
			  document.getElementById("sipgateffx_sms_submit_cancel").addEventListener("click", this.closeSMSBubble.bind(this));
			  
			  this.changeTranslation(content, 'sms');
		}.bind(this);
		xhr.open("GET", chrome.extension.getURL('/html/sms.html'), true);
		xhr.send();	
	},

	openSMSBubbleOnClick: function(number, evnt) {
		evnt.preventDefault();
				
		this.openSMSBubble(evnt.pageX-18, evnt.pageY, number);
	},
	
	openSMSBubbleCentered: function(number, text) {
		var top = window.getSelection().getRangeAt(0).commonAncestorContainer.offsetTop;
		var center = (document.body.offsetWidth - 240) / 2;
		this.openSMSBubble(center, top, number, text);
	},
	
	openSMSBubble: function(whereX, whereY, number, text) {
		if(this.SMSBubble != null) {
			this.removeSMSBubbleFromDOM();
		}
		
		var sp_wrapper = document.createElement('div');
		this.SMSBubble = sp_wrapper;
		this.SMSBubbleSetPosition(whereX, whereY);
		sp_wrapper.className = "sipgateffx_pointer_wrapper";

		var sp = document.createElement('div');
		sp.className = "sipgateffx_pointer";
			
		var sp_box = document.createElement('div');
		sp_box.className = "sipgateffx_pointer_box";
		
		var content = document.createElement("div");
		sp_box.appendChild(content);
		this.getSMSWindow(content, number, text);
				
		var sp_close_footer = document.createElement('div');
		sp_close_footer.className = "sipgateffx_pointer_close_footer "+click2dialBackground;
		
		var sp_close_footer_link = document.createElement('a');
		sp_close_footer_link.className = "sipgateffx_pointer_close_footer_link";
		sp_close_footer_link.href = "#";
		sp_close_footer_link.innerHTML = chrome.i18n.getMessage("close");
		sp_close_footer.appendChild(sp_close_footer_link);
		sp_box.appendChild(sp_close_footer);
		sp_close_footer.addEventListener("click", this.closeSMSBubble.bind(this));
	
		sp_wrapper.appendChild(sp_box);
		sp_wrapper.appendChild(sp);
	
		document.body.appendChild(sp_wrapper);
		return sp_wrapper;
	},
	
	SMSBubbleSetPosition: function (whereX, whereY) {
		this.SMSBubble.style.left = whereX+"px";
		this.SMSBubble.style.top = whereY+"px";
	},
	
	closeSMSBubble: function(evnt) {
		if(typeof(evnt) != "undefined") evnt.preventDefault();
		this.hideBubble(this.SMSBubble, this.removeSMSBubbleFromDOM.bind(this));
	},
	
	removeSMSBubbleFromDOM: function() {
		this.SMSBubble.parentNode.removeChild(this.SMSBubble);
		this.SMSBubble = null;
	},
	
	setVerifiedNumbers: function(res) {
		if(typeof(res) != "undefined" && res != null && res.length > 0)
		{
			for (var i = 0; i < res.length; i++)
			{
				var entry = res[i];
				document.getElementById("sipgateffx_sender").options.add(new Option('+' + entry.E164, entry.E164, false, false));				

				if(entry.E164 == senderNumberPref) {
					document.getElementById("sipgateffx_sender").value = senderNumberPref;
				}
			}

			if(httpServer.match(/com$/)) {
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
		if(this.sendingInProgress) {
			return;
		}

		var number = document.getElementById("sipgateffx_rect_number_sms_text-element").innerText;
		var text = document.getElementById("sipgateffx_message").value;
		var sender = null;

		if(systemArea == 'classic') {
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
		
		chrome.extension.sendRequest({action: 'sendSMS', number: number, text: text, sender: sender}, function() {
			this.sendingInProgress = true;
			document.getElementById("sipgateffx_sendingInProgress_progressbar").removeAttribute("value");			
			document.getElementById("sipgateffx_sendingInProgress_text").innerText = chrome.i18n.getMessage("smsSendingInProgress");
			document.getElementById("sipgateffx_sendsms").style.display = "none";
			document.getElementById("sipgateffx_sendingInProgress").style.display = "block";
		}.bind(this));

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
	
	onSentSMSSuccess: function onSentSMSSuccess() {
		this.sendingInProgress = false;
		document.getElementById("sipgateffx_sendingInProgress_progressbar").value = "1";
		document.getElementById("sipgateffx_sendingInProgress_text").innerText = chrome.i18n.getMessage("smsSendingSuccess");
		setTimeout(this.closeSMSBubble.bind(this), 5000);		
	},
	
	onSentSMSFailed: function onSentSMSFailed() {
		this.sendingInProgress = false;
		document.getElementById("sipgateffx_sendingInProgress_progressbar").value = "0";
		document.getElementById("sipgateffx_sendingInProgress_text").innerText = chrome.i18n.getMessage("smsSendingFailure");
		setTimeout(function() {
			document.getElementById("sipgateffx_sendsms").style.display = "block";
			document.getElementById("sipgateffx_sendingInProgress").style.display = "none";			
		}, 5000);		
	},
	
	openCallBubbleOnClick: function(number, evnt) {
		evnt.preventDefault();
		this.openCallBubble(evnt.pageX-18, evnt.pageY, number);
	},
	
	openCallBubbleCentered: function(number) {
		var container = window.getSelection().getRangeAt(0).commonAncestorContainer;
		if(container.nodeType == 3) {
			container = container.parentElement;
		}
		var top = container.offsetTop;
		var center = (document.body.offsetWidth - 240) / 2;
		this.openCallBubble(center, top, number);
	},
	
	openCallBubble: function(whereX, whereY, number) {	
		if(this.callBubble != null) {
			this.removeCallBubbleFromDOM();
		}

		var sp_wrapper = document.createElement('div');
		this.callBubble = sp_wrapper;
		this.callBubbleSetPosition(whereX, whereY);
		sp_wrapper.className = "sipgateffx_pointer_wrapper";

		var sp = document.createElement('div');
		sp.className = "sipgateffx_pointer";
			
		var sp_box = document.createElement('div');
		sp_box.className = "sipgateffx_pointer_box";
		
		var content = document.createElement("div");
		sp_box.appendChild(content);
		this.getCallWindow(content, number);

		var sp_close_footer = document.createElement('div');
		sp_close_footer.className = "sipgateffx_pointer_close_footer "+click2dialBackground;
		
		var sp_close_footer_link = document.createElement('a');
		sp_close_footer_link.className = "sipgateffx_pointer_close_footer_link";
		sp_close_footer_link.href = "#";
		sp_close_footer_link.innerHTML = chrome.i18n.getMessage("close");
		sp_close_footer.appendChild(sp_close_footer_link);
		sp_box.appendChild(sp_close_footer);
		sp_close_footer.addEventListener("click", this.closeCallBubble.bind(this));
	
		sp_wrapper.appendChild(sp_box);
		sp_wrapper.appendChild(sp);
	
		document.body.appendChild(sp_wrapper);
		return sp_wrapper;		
	},
	
	closeCallBubble: function(evnt) {
		if(typeof(evnt) != "undefined") evnt.preventDefault();
		this.hideBubble(this.callBubble, this.removeCallBubbleFromDOM.bind(this));
	},
	
	removeCallBubbleFromDOM: function() {
		this.callBubble.parentNode.removeChild(this.callBubble);
		this.callBubble = null;		
	},
	
	callBubbleSetPosition: function (whereX, whereY) {
		this.callBubble.style.left = whereX+"px";
		this.callBubble.style.top = whereY+"px";
	},

	getCallWindow: function(content, number, text) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			
			  if (xhr.readyState != 4) {
				  return;
			  }
			  if(xhr.status != 200) {
				  this.closeCallBubble();
				  return;
			  }
			  content.innerHTML = xhr.responseText;  
			  chrome.extension.sendRequest({action: 'getExtensions'}, this.setExtensions.bind(this));
			  if(typeof(number) != "undefined") {
				  document.getElementById("sipgateffx_call_number").value = number;
			  }
			  document.getElementById("sipgateffx_call_submit_button").addEventListener("click", this.bindStartClick2Dial.bind(this));
			  this.changeTranslation(content, 'call');
		}.bind(this);
		xhr.open("GET", chrome.extension.getURL('/html/call.html'), true);
		xhr.send();	
	},
	
	setExtensions: function(responseData) {
		var extensionList = responseData[0];
		var defaultExtension = responseData[1];
		if(typeof(extensionList) != "undefined" && typeof(extensionList.voice) != "undefined" &&
				extensionList.voice != null && extensionList.voice.length > 0)
		{
			for (var i = 0; i < extensionList.voice.length; i++)
			{
				var entry = extensionList.voice[i];
				var alias = (entry.UriAlias != "" ? entry.UriAlias : entry.SipUri);
				document.getElementById("sipgateffx_call_phone").options.add(new Option(alias, entry.SipUri, false, false));				
			}
		} else {
			  var label = document.getElementById("sipgateffx_call_phone-label");
			  var element = document.getElementById("sipgateffx_call_phone-element");
			  label.parentNode.removeChild(label);
			  element.parentNode.removeChild(element);
		}
		
		if(typeof(defaultExtension) != "undefined" && typeof(defaultExtension.extensionSipUri) != "undefined" &&
				defaultExtension.extensionSipUri != null)
		{
			document.getElementById("sipgateffx_call_phone").value = defaultExtension.extensionSipUri;
		}		
	},
	
	bindStartClick2Dial: function(e) {
		e.preventDefault();
		
		var number;
		var extension;
		
		if(document.getElementById("sipgateffx_call_number")) {
			number = document.getElementById("sipgateffx_call_number").value;
		}
		if(document.getElementById("sipgateffx_call_phone")) {
			extension = document.getElementById("sipgateffx_call_phone").value;
		}
		
		addClick2dialInfoBubble(this.callBubble, number);
		this.removeCallBubbleFromDOM();
	    chrome.extension.sendRequest({action: 'startClick2dial', number: number, extension: extension});		
	},
	
	startRendering: function startRendering(contentDocument)
	{
		var doc;
		try {
			if (typeof contentDocument != 'undefined')
			{
				doc = contentDocument;
			} else {
				doc = document;
			}
			if (!doc.body || doc.body.className.match(/editable/)) {
				return;
			}
			
			if(this.isSiteAlreadyParsed(doc)) return;
			
			this.addAlreadyParsedFlag(doc);

			setTimeout(this.sipgateffxParseDOM.bind(this), 0, doc.body, doc);
			
		} catch(e) {
			console.log(e.stack);
			alert("sipgategcx: error occured... " + e);
		}
	},
	
	isSiteAlreadyParsed: function(doc)
	{
		var metaItems = doc.getElementsByTagName('meta');  
		for (var i=0; i<metaItems.length; i++)
		{
			if (metaItems[i].getAttribute('name') == "sipgateffx_click2dial") return true;
		}
		return false;
	},
	
	addAlreadyParsedFlag: function(doc)
	{
		var headItems = doc.getElementsByTagName('head');
		if (headItems.length) 
		{
			var ffxmeta = doc.createElement("meta");
			ffxmeta.setAttribute("name","sipgateffx_click2dial");
			ffxmeta.setAttribute("value","enabled");
			headItems[0].appendChild(ffxmeta);
		}		
	},
	
	sipgateffxParseDOM: function sipgateffxParseDOM(aNode, document)
	{
		var t0 = new Date().getTime();
		const tagsOfInterest = [ "a", "abbr", "acronym", "address", "applet", "b", "bdo", "big", "blockquote", "body", "caption",
		                         "center", "cite", "code", "dd", "del", "div", "dfn", "dt", "em", "fieldset", "font", "form", "h1", "h2", "h3",
		                         "h4", "h5", "h6", "i", "iframe", "ins", "kdb", "li", "object", "pre", "p", "q", "samp", "small", "span",
		                         "strike", "s", "strong", "sub", "sup", "td", "th", "tt", "u", "var" ];

	 	var xpath = "//text()[(parent::" + tagsOfInterest.join(" or parent::") + ")]";
	 	var candidates = document.evaluate(xpath, aNode, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	    for ( var cand = null, i = 0; (cand = candidates.snapshotItem(i)); i++)
		{
		    try {
		    	if (cand.nodeType == Node.TEXT_NODE) {
		    		this.sipgateffxCheckPhoneNumber(cand);
		    	}
	        } catch (e) {
	        	// alert('*** sipgateffx: sipgateffxCheckPhoneNumber ERROR ' + e);
	        }		
	    }
		var t1 = new Date().getTime();
		
		// TODO: remove this line		
		// console.log((t1-t0));
		
		return 0;
	},
	
	sipgateffxCheckPhoneNumber: function sipgateffxCheckPhoneNumber(aNode)
	{	
	    if (aNode.nodeValue.length<7) return;
	    var text = aNode.nodeValue;
	    var offset = 0;

	    var i = 0;

	    while(1)
	    {
		    if(i > 5) {
		    	// alert('sipgateffxCheckPhoneNumber: too many iterations. exiting
				// on "' + text.replace(/^\s+|\s+$/g, "") + '"');
		    	return;
		    }
		    
		    text = text.replace(nbspRegExp, ' ');
		    var results = text.match(phoneRegExp);
		    if (!results) return;
		    
		    var number = results[0].replace(/\s+$/g, "");
		    
		    var pos = text.indexOf(number);
		    if (pos == -1) return;
		    offset += pos;

		    var done = 0;
		    
		    if (number.length > 6) {
			    // the character before the number MUST be " ", ",", ";", ":", ""
			    // otherwise we have a false positive
			    if(pos > 0 && !text.substr(pos-1,1).match(/[\s,;:|]/)) {
			    	// alert('sipgateffxCheckPhoneNumber: possible false negative
					// found "' + text.replace(/^\s+|\s+$/g, "") + '"');
			    	return;
			    }

			    if(this.isNumberInternationalAndCountryUnknown(number)) return;
			    
			    aNode = this.transformNumberToClick2DialBubble(aNode, number, offset);
			    
	    	    text = text.substr(offset + number.length);
	    	    offset = 0;
	    	    done = 1;
		    }
		    
		    if(done==0) return;
		    
		    i++;
		}
		return 0;	
	},
	
	isNumberInternationalAndCountryUnknown: function(number)
	{
	    if(number.match(this.regExp.intBegin) && !this.regExp.countryCodeRegex.test(number.replace(this.regExp.nationalPrefix, ""))) {
	    	// console.log('sipgateffxCheckPhoneNumber: unknown country code on "' + number.replace(this.regExp.nationalPrefix, "") + '"');
	    	return true;
	    }
	    return false;
	},
	
	getCountryForNumber: function(number)
	{
		return allCountries[this.regExp.countryCodeRegex.exec(number.replace(this.regExp.nationalPrefix, ""))];
	},
	
	transformNumberToClick2DialBubble: function(aNode, number, offset)
	{
        try {
	        var spanNode = aNode.ownerDocument.createElement("nobr");
            var range = aNode.ownerDocument.createRange();
            range.setStart(aNode, offset);
            range.setEnd(aNode, offset+number.length);
		    range.surroundContents(spanNode);
		    aNode = spanNode.nextSibling;
	        
	        
            var newNodeClick2DialIcon = aNode.ownerDocument.createElement("IMG");
            newNodeClick2DialIcon.src = chrome.extension.getURL("skin/icon_click2dial.gif");
            newNodeClick2DialIcon.className = 'sipgateGCXClick2DialBubbleIMG';
            spanNode.appendChild(newNodeClick2DialIcon);
            
	        var prettyNumber = number.replace(/[^\(\)\[\]0-9]/g,'').replace(/\(0\)|\[0\]/g,'');	        
	    	var country = this.getCountryForNumber(number);
            
	        spanNode.title = "sipgate Click2Dial for " +  prettyNumber + (country ? ' ('+country+')' : '');
            spanNode.className = 'sipgateGCXClick2DialBubble ' + click2dialBackground;
	        spanNode.addEventListener("click", this.sipgateffxCallClick.bind(this, number));
	        spanNode.addEventListener("contextmenu", this.openSMSBubbleOnClick.bind(this, number));	        
        } catch(e) {
        	console.log(e);
        }
        
        return aNode;
	},
	
	sipgateffxCallClick: function sipgateffxCallClick(number, evnt)
	{
		try {
			evnt.preventDefault();
					    
		    if(previewDialog == true) {
		    	this.openCallBubbleOnClick(number, evnt);
		    } else {	    
		    	this.sipgateffxInitiateCall(evnt.target, number);
		    }

		} catch (e) {
			console.log(e);
		}
	    return;
	},
	
	sipgateffxInitiateCall: function sipgateffxInitiateCall(target, number)
	{
		addClick2dialInfoBubble(target, number);    
	    chrome.extension.sendRequest({action: 'startClick2dial', number: number});
	}
	
};

sipgateffx_hightlightnumber.init();

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if(!sender.tab) return;
	var response = {};
	if(request.action) {
		switch(request.action) {
			case 'setClick2DialText':
				setStatusBubbleText(request.text, request.cssclass);
				break;
			case 'removeClick2DialBubble':
			    setTimeout(removeClick2dialInfoBubble, 5000);
				break;
			case 'smsSentSuccess':
				sipgateffx_hightlightnumber.onSentSMSSuccess();
				break;
			case 'smsSentFailed':
				sipgateffx_hightlightnumber.onSentSMSFailed();
				break;
			case 'sendTextAsSMS':
				sipgateffx_hightlightnumber.openSMSBubbleCentered(null, request.text);
				break;
			case 'sendSMSToText':
				sipgateffx_hightlightnumber.openSMSBubbleCentered(request.number);
				break;
			case 'callText':
				sipgateffx_hightlightnumber.openCallBubbleCentered(request.number);
				break;
		}
	}
	sendResponse(response);
});

function getPosition( oElement )
{
	var pos = {x: 0, y: 0};
	while( oElement != null ) {
		pos.y += oElement.offsetTop;
		pos.x += oElement.offsetLeft;
		oElement = oElement.offsetParent;
	}
	return pos;
}

function addClick2dialInfoBubble(bubble, number) {	
	var bubblePosition = getPosition(bubble);
    var infoWindow = document.createElement("div");
    infoWindow.style.left = bubblePosition.x + 'px';
    infoWindow.style.top = bubblePosition.y + 'px';
    infoWindow.className = 'sipgateffx_dialBubble ' + click2dialBackground;
    
    var statusText = document.createElement("span");
    statusText.className = 'sipgateffx_dialBubble_stateText';
    statusText.innerHTML = chrome.i18n.getMessage("click2dial_notification", [number]);
    infoWindow.appendChild(statusText);
    
    var statusIcon = document.createElement("div");
    statusIcon.className = 'sipgateffx_dialBubble_stateIcon';
    infoWindow.appendChild(statusIcon);
    
    document.body.appendChild(infoWindow);
    setTimeout(moveClick2dialInfoBubble, 5000);
}

function moveClick2dialInfoBubble() {
	var elements = document.getElementsByClassName('sipgateffx_dialBubble');
	var oldPosition = getPosition(elements[0]);
	var size = {
		x: elements[0].offsetWidth + 20,
		y: elements[0].offsetHeight + 20
	};
	var start = window.performance.now();
	var STEPS = 500;
	var step = function(timestamp) {
		var progress = timestamp - start;
		var windowSize = {
			x: document.body.offsetWidth,
			y: window.innerHeight + document.body.scrollTop
		};
		var posX = ((windowSize.x - size.x - oldPosition.x) / STEPS * progress) + oldPosition.x;
		var posY = ((windowSize.y - size.y - oldPosition.y) / STEPS * progress) + oldPosition.y;
		elements[0].style.left = posX + "px";
		elements[0].style.top = posY + "px";
		if (progress < STEPS) {
			window.requestAnimationFrame(step);
		} else {
			var text = getStatusBubbleText();
			elements[0].parentNode.removeChild(elements[0]);
			createStatusBubble(text);
		}
	}
	window.requestAnimationFrame(step);
}

function removeClick2dialInfoBubble() {
	var elements = document.getElementsByClassName('sipgateffx_dialBubble');
	var dialBubble = elements[0];
	
	sipgateffx_hightlightnumber.hideBubble(dialBubble, function() { dialBubble.parentNode.removeChild(dialBubble); });
}

function createStatusBubble(text, cssclass)
{
    var infoWindow = document.createElement("div");
    infoWindow.style.position = "fixed";
    infoWindow.style.bottom = '10px';
    infoWindow.style.right = '10px';
    infoWindow.className = 'sipgateffx_dialBubble ' + click2dialBackground;
    if(cssclass) {
    	infoWindow.className += ' sipgateffx_state_' + cssclass;
    }
    
    var statusText = document.createElement("span");
    statusText.className = 'sipgateffx_dialBubble_stateText';
    statusText.innerHTML = text;
    infoWindow.appendChild(statusText);    

    var statusIcon = document.createElement("div");
    statusIcon.className = 'sipgateffx_dialBubble_stateIcon sipgateffx_state_' + cssclass;
    infoWindow.appendChild(statusIcon);
      
    document.body.appendChild(infoWindow);
    
    return infoWindow;
}

function getStatusBubbleText() {
	var elements = document.getElementsByClassName('sipgateffx_dialBubble');
	if(elements.length == 0) { return ""; }
	return elements[0].getElementsByClassName('sipgateffx_dialBubble_stateText')[0].innerHTML;
} 

function setStatusBubbleText(text, cssclass) {
	var elements = document.getElementsByClassName('sipgateffx_dialBubble');
	if(elements.length == 0) {
		createStatusBubble(text, cssclass);
		return;
	}
	
	elements[0].getElementsByClassName('sipgateffx_dialBubble_stateText')[0].innerHTML = text;
	
	var statusIcon = elements[0].getElementsByClassName('sipgateffx_dialBubble_stateIcon');
    if(cssclass && statusIcon.length > 0) {
	    statusIcon = statusIcon[0];
    	if(statusIcon.className.match(/sipgateffx_state_/)) {
    		statusIcon.className = statusIcon.className.replace(/(sipgateffx_state_\w*)/, 'sipgateffx_state_' + cssclass);
    	} else {
    		statusIcon.className += ' sipgateffx_state_' + cssclass;
    	}
    }	
}
