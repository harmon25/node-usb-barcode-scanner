var usbScanner = require('../usbscanner').usbScanner;
var getDevices = require('../usbscanner').getDevices;

//get array of attached HID devices
var connectedHidDevices = getDevices()

//print devices
console.log(connectedHidDevices)

//initialize new usbScanner
var scanner = new usbScanner();

//scanner emits a data event once a barcode has been read and parsed
scanner.on("data", function(code){
	console.log("recieved code : " + code);
});