(function(w) {
	w.domReady(function() {
		var obfuscatedLinks = document.querySelectorAll('a[data-obfuscated-mlink]');

		[].forEach.call(obfuscatedLinks, function(obfuscatedLink) {
			var obfuscatedText = obfuscatedLink.getAttribute('data-obfuscated-mlink');
			obfuscatedText = obfuscatedText.replace(/%/g, '');
			var decodedText = hex2a(obfuscatedText);
			obfuscatedLink.setAttribute('href', 'mailto:' + decodedText);
			obfuscatedLink.innerHTML = decodedText;
		});
	})
})(window);