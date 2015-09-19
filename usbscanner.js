var HID = require('node-hid');
var _ = require('underscore')
var events = require('events');
var util = require("util");

/*
options:
{vendorId:Int, hidMap: Obj}
defaults:
{vendorId:1534, hidMap:{30: '1', 31: '2', 32: '3', 33: '4',34: '5',35: '6', 36: '7', 37: '8', 38: '9',39: '0',40: 'e'}}
*/
function usbScanner(options){
	var opts = options || {}
	this.init(opts);
	events.EventEmitter.call(this);
}

//enherit event emitter
util.inherits(usbScanner, events.EventEmitter);

function getDevices(){
	var devices = HID.devices()
	return devices
}

usbScanner.prototype.init = function(options){
	var vendorId =  options.vendorId || 1534
	var allDevices = getDevices();
	//hidMap defining keyboard code to coresponding string value
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

usbScanner.prototype.startScanning = function(device){
	var hidMap = this.hidMap
	//empty array for barcode bytes
	var bcodeBuff = [];
	//string variable to hold barcode string
	var aBarcode = "";
	//event emitter for when newCode is read from scanner
	var getCode = function(code){
		this.emit("data", code)
	}.bind(this)

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
            //emit newCode event
           	getCode(aBarcode)
        }
    }
});
}

module.exports = {usbScanner:usbScanner, getDevices:getDevices}




