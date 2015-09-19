var HID = require('node-hid');
var _ = require('underscore')
var events = require('events');
var util = require("util");

function usbScanner(options){
	this.init(options);
	events.EventEmitter.call(this);
}

util.inherits(usbScanner, events.EventEmitter);

usbScanner.prototype.init = function(options){
	var vendorId =  options.vendorId || 1534
	var allDevices = this.allDevices();
	this.hidMap = options.hidMap || {
    30: '1', 31: '2', 32: '3', 33: '4',34: '5',
    35: '6', 36: '7', 37: '8', 38: '9',39: '0',
    // 'e' or enter? - barcode escape char
    40: 'e'
	};

	var scanner = _.find(allDevices, function(device) {
    	return (device.vendorId === vendorId)
	});

	var device = new HID.HID(scanner.path);
	// start waiting for scan events
	this.startScanning(device)
}

usbScanner.prototype.allDevices = function(){
	return HID.devices();
}

usbScanner.prototype.printDevices = function(){
	console.log(HID.devices());
}

usbScanner.prototype.startScanning = function(device){
	var self = this;
	var hidMap = this.hidMap
	var bcodeBuff = [];
	var aBarcode = null;
	
	function recievedCode(code){
		self.emit("newCode", code)
	}	
	
	device.on("data", function(chunk) {
    //second byte of buffer is all that contains data
    if (hidMap[chunk[2]]) {
        //if not bcodeBuff escape char (40)
        if (chunk[2] !== 40) {
            bcodeBuff.push(hidMap[chunk[2]])
        } else {
        //revieved escape code, join bCodebuff array and
            aBarcode = bcodeBuff.join("")
            bcodeBuff = []
           	recievedCode(aBarcode)
        }
    }
});
}

module.exports = usbScanner
//
//var scanner = new usbScanner({});
//scanner.on("newCode", function(code){
//	console.log("recieved code :" + code)
//})

//scanner.on('newBarcode', function(){
//	console.log(scanner.aBarcode)
//})




