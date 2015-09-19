var usbScanner = require('../index');

var scanner = new usbScanner({});
scanner.on("newCode", function(code){
	console.log("recieved code :" + code);
});