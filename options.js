var page = {
	bgr: chrome.extension.getBackgroundPage(),
	init: function() {
		this.changeTranslation();
		
		$$('#l .tabHead')[0].addClass('active');
		$$('#r .tab')[0].removeClass('hidden').addClass('active');
		
		$$('#l .tabHead').addEvent('click', function(evnt) {
			var clickedOn = $(evnt.target);
			$("l").getElement('.tabHead.active').removeClass('active');
			$("r").getElement('.tab.active').removeClass('active').addClass('hidden');

			clickedOn.addClass('active');
			$(clickedOn.id.replace('switch', 'tab')).removeClass('hidden').addClass('active');
			
			if(clickedOn.id == 'switch_whatsnew') {

				var whatsnewFile = '/whatsnew_'+ (navigator.language.match(/^de/) ? 'de' : 'en') +'.html';
				var req = new Request({
					url: chrome.extension.getURL(whatsnewFile),
					onSuccess: function(data) {
						$('whatsnew').set('html',data);
					}
				}).send();
			} else if(clickedOn.id == 'switch_log') {
				$('logframe').src = 'sendReport.html';
			}
			
			// do not show save button in different tabs
			if(["switch_account", "switch_c2d"].indexOf(clickedOn.id) == -1)
			{
				$('savesetting').removeClass('active').addClass('hidden');
			} else {
				$('savesetting').removeClass('hidden').addClass('active');
			}
			
		}.bind());
		
		$$('.setting').each(function(el) {
			if(["text","password", "select"].indexOf(el.type) != -1) {
				var storageValue = localStorage.getItem(el.name);
				if(storageValue) {
					el.value = storageValue;
				}
			} else if(["radio", "checkbox"].indexOf(el.type) != -1) {
				var storageValue = localStorage.getItem(el.name);
				if(storageValue == "true") {
					el.setProperty("checked", "checked");
				} else if(storageValue == "false") {
					el.removeProperty("checked");
				}
			}
		});
		
		if($$('ul.c2dBox')[0]) {
			var storageValue = localStorage.getItem('c2dcolor');
			if(storageValue && storageValue.match(/^scheme/)) {
				$$('ul.c2dBox nobr.' + storageValue).getParent('li').addClass('active');
			} else {
				$$('ul.c2dBox nobr.default').getParent('li').addClass('active');
			}
			$$('ul.c2dBox li').addEvent('click', function(evnt) {
				var clickedOn = evnt.target;
				if(clickedOn.get('tag') != 'li') {
					clickedOn = clickedOn.getParent('li');
				}
				$$('ul.c2dBox li.active').removeClass('active');
				clickedOn.addClass('active');
				var value = clickedOn.getElement('nobr').get('class').split(' ').filter(function(v) { return v.match(/^scheme/); })[0];
				localStorage.setItem('c2dcolor', value);
			});
		}
		
		$('savesetting').addEvent('click', function(evnt) {
			var newSettings = {};
			$$('.setting').each(function(el) {
				if(["text","password", "select-one"].indexOf(el.type) != -1) {
					var storageValue = localStorage.getItem(el.name);
					localStorage.setItem(el.name, el.value);
					if(storageValue != el.value) {
						newSettings[el.name] = el.value;
					}
				} else if(["radio", "checkbox"].indexOf(el.type) != -1) {
					localStorage.setItem(el.name, el.getProperty("checked"));
				}
			});
			page.onStorage(newSettings);
			alert(chrome.i18n.getMessage("options_saved"));
		});
		
		$('closesetting').addEvent('click', function(evnt) {
			window.close();
		});
		
		this.fillExtensionSelect();
	},
	
	changeTranslation: function() {
		$$('*[translation]').each(function(el) {
			var key = "options_" + el.get('translation').trim();
			el.set('text', chrome.i18n.getMessage(key));
		});
	},
		
	onStorage: function(settings)
	{
		if(typeof(settings.username) != "undefined" || typeof(settings.password) != "undefined")
		{
			var username = settings.username || localStorage.getItem("username");
			var password = settings.password || localStorage.getItem("password");
			this.bgr.backgroundProcess.setCredentials(username, password);
		}		
	},
	
	fillExtensionSelect: function()
	{
        var voiceList = this.bgr.backgroundProcess.ownUriList.voice;
		var uriList = [];
		var defaultExtensionPref = localStorage.getItem("defaultExtension");
		
        for (var i = 0; i < voiceList.length; i++) {
        	$('click2DialList').appendChild(new Option(
    				(voiceList[i].UriAlias != '' ? voiceList[i].UriAlias : voiceList[i].SipUri),
    				voiceList[i].SipUri
        	));

			uriList.push(voiceList[i].SipUri);
        }

		if(uriList.indexOf(defaultExtensionPref) == -1) {
			this.bgr.logBuffer.append('options: defaultExtensionPref is not in uriList. Looking for new defaultExtension');
			var defaultExtension;
			if(this.bgr.backgroundProcess.defaultExtension && this.bgr.backgroundProcess.defaultExtension.voice && this.bgr.backgroundProcess.defaultExtension.voice.extensionSipUri)
			{
				defaultExtension = this.bgr.backgroundProcess.defaultExtension.voice.extensionSipUri;
			} else if(this.bgr.backgroundProcess.ownUriList && this.bgr.backgroundProcess.ownUriList.voice && this.bgr.backgroundProcess.ownUriList.voice.length > 0) {
				defaultExtension = this.bgr.backgroundProcess.ownUriList.voice[0].SipUri;
			}
			if(defaultExtension)
			{
				this.bgr.logBuffer.append('options: new defaultExtension found. setting to ' + defaultExtension); 
				$('click2DialList').value = defaultExtension;
				localStorage.setItem("defaultExtension", defaultExtension);
			}
		} else {
			$('click2DialList').value = defaultExtensionPref;
		}
 
	}
};

document.addEventListener('DOMContentLoaded', function () {
	page.init();
});