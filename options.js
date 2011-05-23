var page = {
	bgr: chrome.extension.getBackgroundPage(),
	init: function() {
		$$('#l .tabHead')[0].addClass('active');
		$$('#r .tab')[0].removeClass('hidden').addClass('active');
		
		$$('#l .tabHead').addEvent('click', function(evnt) {
			var clickedOn = $(evnt.target);
			$("l").getElement('.tabHead.active').removeClass('active');
			$("r").getElement('.tab.active').removeClass('active').addClass('hidden');

			clickedOn.addClass('active');
			$(clickedOn.id.replace('switch', 'tab')).removeClass('hidden').addClass('active');
			
			if(clickedOn.id == 'switch_whatsnew') {
				$('whatsnewframe').src = 'firststart/welcome_'+ (navigator.language.match(/^de/) ? 'de' : 'en') +'.html';
				$('whatsnewframe').height = ($('r').getSize().y-$('whatsnewframe').getPosition().y)  +'px';
			}
		}.bindWithEvent());
		
		$$('.setting').each(function(el) {
			if(["text","password", "select"].indexOf(el.type) != -1) {
				var storageValue = localStorage.getItem(el.name);
				if(storageValue) {
					el.value = storageValue;
				}
			} else if(["radio", "checkbox"].indexOf(el.type) != -1) {
				var storageValue = localStorage.getItem(el.name);
				if(["true", "false"].indexOf(storageValue) != -1) {
					el.setProperty("checked", storageValue);
				}
			}
		});
		
		$('savesetting').addEvent('click', function(evnt) {
			var newSettings = new Hash({});
			$$('.setting').each(function(el) {
				if(["text","password", "select"].indexOf(el.type) != -1) {
					var storageValue = localStorage.getItem(el.name);
					localStorage.setItem(el.name, el.value);
					if(storageValue != el.value) {
						newSettings.set(el.name, el.value);
					}
				} else if(["radio", "checkbox"].indexOf(el.type) != -1) {
					localStorage.setItem(el.name, el.getProperty("checked"));
				}
			});
			if(newSettings.getLength() != 0)
			{
				page.onStorage(newSettings);
			}				
		});
		
		$('closesetting').addEvent('click', function(evnt) {
			window.close();
		});
	},
	
	onStorage: function(settings)
	{
		if(settings.has("username") || settings.has("password"))
		{
			var username = settings.get("username") || localStorage.getItem("username");
			var password = settings.get("password") || localStorage.getItem("password");
			this.bgr.backgroundProcess.setCredentials(username, password);
		}		
	}
};


window.addEvent('domready', function() {
	page.init();
});