		var bgr = chrome.extension.getBackgroundPage();
//		var data = bgr.data;
		
		function doOnLoad()
		{
			if(bgr.username != null && bgr.password != null)
			{
				login();
			}
		}
		
		function login(force)
		{
			if(force || bgr.username == null || bgr.password == null)
			{
				bgr.username = $('username').get('value');
				bgr.password = $('password').get('value');
				localStorage.setItem('username', bgr.username);
				localStorage.setItem('password', bgr.password);
			}
			
			if(bgr.curBalance !== null) {
					$('notLoggedIn').addClass('view_template');
					$('loggedIn').removeClass('view_template');
					$('loggedIn').addEvent('click', function() { window.open('http://' + bgr.sipgateCredentials.HttpServer ); });
					$('balance').set('text', bgr.curBalance[0]);
				
					if(bgr.curBalance[1] < 5.0) {
						$('balance').set('styles', {'color':'red'});
					}
			}
		
			// $('msg').set('text', JSON.encode(res));
		}