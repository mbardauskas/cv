/**
 The content of data-email is just the hexadecimal version of your email address
 "tj@vision-media.ca".

 It is a sequence of hexadecimal characters, where each character is of the
 form %XY, where X and Y are hexadecimal digits (0-f). For example,
 the first two hexadecimal characters in your case are %66 and %69.
 If you look at the ASCII table (http://en.wikipedia.org/wiki/ASCII),
 the symbol that corresponds to ASCII with hexadecimal number 66 is "f",
 while for hexadecimal number 69 is "i".

 You can use play around with this tool http://www.asciitohex.com/.
*/

function hex2a(hexx) {
	var hex = hexx.toString();//force conversion
	var str = '';
	for (var i = 0; i < hex.length; i += 2)
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	return str;
}

