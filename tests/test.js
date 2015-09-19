var usbScanner = require('../usbscanner').usbScanner;
var getDevices = require('../usbscanner').getDevices;

var connectedHidDevices = getDevices()
console.log(connectedHidDevices)

var scanner = new usbScanner();
scanner.on("data", function(code){
	console.log("recieved code :" + code);
});