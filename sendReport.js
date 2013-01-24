var page = {
	logAsString: "",
	bgr: null,
	filepath: '',

	init: function() {
		this.bgr = chrome.extension.getBackgroundPage();		
		this.appendToLog("app: " + navigator.appVersion + "\n");
		this.appendToLog("username: " + this.bgr.username + "\n");
		this.appendPreferencesToLog();
//		this.appendAddonInfoToLog();
		this.appendReportToLog();

	},

	appendPreferencesToLog: function() {
		this.appendToLog("\npreferences:\n");
		this.appendToLog("SystemArea -> " + this.bgr.backgroundProcess.systemArea + "\n");
		this.appendToLog("AddOn-Version -> " + this.bgr.backgroundProcess.version + "\n");
		
		for(var _prefName in localStorage) {
			if(_prefName == "password") continue;
			this.appendToLog(_prefName+" -> "+ localStorage[_prefName] +"\n");
		}
	},

	appendAddonInfoToLog: function() {
		if(this.bgr.addOnInfo !== null) {
			this.appendToLog("\naddOnInfo:\n");
			for(var key in this.bgr.addOnInfo) {
				try {
					if(typeof this.bgr.addOnInfo[key] != 'object' && typeof this.bgr.addOnInfo[key] != 'function') {
						this.appendToLog("  '"+key+"' -> " + this.bgr.addOnInfo[key] + "\n");
					}
				} catch (e) {}
			}
		}
	},

	appendReportToLog: function() {
		var logArray = this.bgr.logBuffer.buffer;
		this.appendToLog("\nreport:\n");
		for (var i=0; i < logArray.length; i++) {
			this.appendToLog(logArray[i]+"\n");
		}
	},

	appendToLog: function(txt) {
		this.logAsString += txt;
	},

	displayLog: function() {
		this.logAsString = this.logAsString.replace(/</g, '&lt;');
		this.logAsString = this.logAsString.replace(/>/g, '&gt;');	
		document.getElementById('fileContent').innerHTML = this.logAsString;
	},

	showLocalizedFileInfo: function() {
		if (navigator.language.match(/^de/)) {
			document.getElementById('redBox').innerHTML = 'Bitte senden Sie diesen Bericht <b>nicht</b>, wenn Sie sipgateGCX erwartungsgemäß funktioniert. Dieser Report dient ausschließlich der Fehlerbehebung!';

			var msg = "";
			msg += "Bitte schicken Sie den Inhalt des grauen Kastens per E-Mail an: <a href=\"mailto:support@support.sipgate.de?subject=" + escape("Statusbericht sipgateGCX") + "\">support@support.sipgate.de</a><BR>\n";
			document.getElementById('userMessage').innerHTML = msg;

		} else {
			document.getElementById('redBox').innerHTML = 'Please do <b>not</b> send this report, if you don\'t encounter any problems with sipgateGCX. This report is for troubleshooting purposes only!';

			var msg = "";
			msg += "Please send the content of the gray box via email to <a href=\"mailto:support@support.sipgate.de?subject=" + escape("Status report sipgateGCX") + "\">support@support.sipgate.de</a><BR>\n";
			document.getElementById('userMessage').innerHTML = msg;

		}
	},

	foo: function() {}
};

document.addEventListener('DOMContentLoaded', function () {
	try {
		page.init();
		page.showLocalizedFileInfo();
		page.displayLog();
	} catch (e) {
		alert(e);
	}
});