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
var countryCodeRegex;

var click2dialBackground = '';
var previewDialog = false; 

window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

function _prepareArray() {
	var tmp="/^XXX";
	for(i in allCountries) {
		tmp += "|^" + i;
	}
	tmp += "/";
	countryCodeRegex = new RegExp(tmp);
}

_prepareArray();

chrome.extension.sendRequest({action: 'getParsingOptions'}, function(res) {
	if(res.parsing == "false") return;
	if(res.color) click2dialBackground = res.color;
	if(res.preview) previewDialog = (res.preview=="true");
	startRendering();
});

// TODO
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
		}
	}
	sendResponse(response);
});

function startRendering()
{
	
	try {
		var doc = document;
		var body = doc.body;
		
		if (!body || body.className.match(/editable/)) {
			return;
		}
		
		var metaItems = doc.getElementsByTagName('meta');  
		for (var i=0; i<metaItems.length; i++)
		{
			if (metaItems[i].getAttribute('name') == "sipgateffx_click2dial") return 1;
		}
		
		var headItems = doc.getElementsByTagName('head');
		if (headItems.length) 
		{
			var ffxmeta = doc.createElement("meta");
			ffxmeta.setAttribute("name","sipgateffx_click2dial");
			ffxmeta.setAttribute("value","enabled");
			headItems[0].appendChild(ffxmeta);
		}
		setTimeout(sipgateffxParseDOM, 0, body, doc);
	} catch(e) {
		alert("sipgategcx: error occured... " + e);
	}
}

function sipgateffxParseDOM(aNode, document)
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
	    		sipgateffxCheckPhoneNumber(cand);
	    	}
        } catch (e) {
        	//alert('*** sipgateffx: sipgateffxCheckPhoneNumber ERROR ' + e);
        }		
    }
	var t1 = new Date().getTime();
	//alert('*** sipgateffx: Time for parsing the page with XPath: ' + (t1-t0));
	return 0;
}

function sipgateffxCheckPhoneNumber(aNode)
{	
    if (aNode.nodeValue.length<7) return 0;
    var text = aNode.nodeValue;
    var offset = 0;

    var i = 0;

    while(1)
    {
	    if(i > 5) {
	    	//alert('sipgateffxCheckPhoneNumber: too many iterations. exiting on "' + text.replace(/^\s+|\s+$/g, "") + '"');
	    	return 1;
	    }
	    
	    text = text.replace(nbspRegExp, ' ');
	    var results = text.match(phoneRegExp);
	    if (!results) {	    
	    	return 0;
	    }
	    
	    var number = results[0];
	    var pos = text.indexOf(number);
	    if (pos == -1) return 0;
	    offset += pos;

	    var done = 0;
	    if (number.replace(/\s/g, "").length > 6) {
		    // the character before the number MUST be " ", ",", ";", ":", ""
		    // otherwise we have a false positive
		    if(pos > 0 && !text.substr(pos-1,1).match(/[\s,;:|]/)) {
		    	//alert('sipgateffxCheckPhoneNumber: possible false negative found "' + text.replace(/^\s+|\s+$/g, "") + '"');
		    	return 1;
		    }
		    
		    var nationalPrefix = new RegExp(internationalPrefixes[userCountryPrefix].join('|')+"|\\D", "g");

		    var intBegin = /^[\(\[]?\+|^[\(\[]?00/;
		    if(userCountryPrefix == "1") {
		    	intBegin = /^[\(\[]?\+|^[\(\[]?00|^011/;
		    }
		    
		    if(number.match(intBegin) && !countryCodeRegex.test(number.replace(nationalPrefix, ""))) {
		    	//alert('sipgateffxCheckPhoneNumber: unknown country code on "' + number.replace(nationalPrefix, "") + '"');
		    	return 1;
		    }
		    
	        var spanNode;
    	
	        if (aNode.nodeValue.length == number.length && aNode.parentNode.childNodes.length == 0) {
                spanNode = aNode.parentNode;
	        }
	        else
	        {
	            spanNode = aNode.ownerDocument.createElement("nobr");
	            var range = aNode.ownerDocument.createRange();
	            range.setStart(aNode, offset);
	            range.setEnd(aNode, offset+number.length);
			    range.surroundContents(spanNode);
			    aNode = spanNode.nextSibling;
	        }
	        
	        var prettyNumber = number.replace(/[^\(\)\[\]0-9]/g,'').replace(/\(0\)|\[0\]/g,'');
	        
	    	var country = allCountries[countryCodeRegex.exec(number.replace(nationalPrefix, ""))];
	        
            var newNodeClick2DialIcon = aNode.ownerDocument.createElement("IMG");
            // newNodeClick2DialIcon.align = "bottom";
            newNodeClick2DialIcon.src = chrome.extension.getURL("skin/icon_click2dial.gif");
            newNodeClick2DialIcon.className = 'sipgateFFXClick2DialBubbleIMG';
            spanNode.appendChild(newNodeClick2DialIcon);
            
            spanNode.className = 'sipgateFFXClick2DialBubble ' + click2dialBackground;
	        spanNode.title = "sipgate Click2Dial for " +  prettyNumber + (country ? ' ('+country+')' : '');
//	        spanNode.style.backgroundColor = click2dialBackground;
	        
	        spanNode.addEventListener("click", sipgateffxCallClick);
	        spanNode.addEventListener("contextmenu", sipgateffxCallClick);	        
	        //spanNode.addEventListener("click", sipgateffxCallClick, true);
	        //spanNode.addEventListener("contextmenu", sipgateffxCallRightClick, true);
	        
        	spanNode.setAttribute("sipgateffx_number", number);

    	    text = text.substr(offset + number.length);
    	    offset = 0;
    	    done = 1;
	    }
	    
	    if(done==0) return 0;
	    
	    i++;
	}
	return 0;	
}

function niceNumber(_number) {
	try {
		var natprefix = userCountryPrefix;
		
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
	} catch (ex) {
		alert("Error in _niceNumber(): "+ex);
	}
	return _number;
};


function sipgateffxCallClick(e)
{
	try {
		e.preventDefault();
		
	    var number = this.getAttribute("sipgateffx_number");
	    if (!number) return;
	    
	    if(previewDialog == true) {
	    	number = prompt(chrome.i18n.getMessage("previewnumber_dialog"), number);
	    	if(!number) return;
	    }

		addClick2dialInfoBubble(e.target, number);
	    
	    chrome.extension.sendRequest({action: 'startClick2dial', number: number});

	} catch (ex) {
		alert("Error in _sipgateffxCallClick(): "+ex);
	}
    return;
}

function sipgateffxCallRightClick(e)
{   
}

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
	var start = +new Date();
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
	
	var start = +new Date();
	var step = function(timestamp) {
		var progress = timestamp - start;
		elements[0].style.opacity = 1 - (Math.min(progress/2, 100) / 100);
		if (progress < 200) {
			window.requestAnimationFrame(step);
		} else {
			elements[0].parentNode.removeChild(elements[0]);
		}
	}
	window.requestAnimationFrame(step);	
}

function createStatusBubble(text, cssclass)
{
    var infoWindow = document.createElement("div");
/*    infoWindow.innerHTML = text;
*/    infoWindow.style.position = "fixed";
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
