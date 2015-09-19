# node-usb-barcode-scanner
Package to help work with USB HID based barcode scanners in nodejs

## Usage
```javascript
var usbScanner = require('../usbscanner').usbScanner;
var getDevices = require('../usbscanner').getDevices;

//get array of attached HID devices
var connectedHidDevices = getDevices()

//print devices
console.log(connectedHidDevices)

//initialize new usbScanner - takes optional parmeters vendorId and hidMap - check source for details
var scanner = new usbScanner();

//scanner emits a data event once a barcode has been read and parsed
scanner.on("data", function(code){
	console.log("recieved code : " + code);
});

```

* Thanks @hanshuebner for [node-hid](https://github.com/node-hid/node-hid)
