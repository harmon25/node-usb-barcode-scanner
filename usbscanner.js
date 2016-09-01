var HID = require('node-hid');
var _ = require('underscore');
var events = require('events');
var util = require("util");

/*
 options:
 {vendorId:Int, hidMap: Obj}
 defaults:
 {vendorId:1534, hidMap:{30: '1', 31: '2', 32: '3', 33: '4',34: '5',35: '6', 36: '7', 37: '8', 38: '9',39: '0',40: 'e'}, escapeChar:40}
 */
function usbScanner(options) {
	var opts = options || {};
	this.init(opts);
	events.EventEmitter.call(this);
}

//enherit event emitter
util.inherits(usbScanner, events.EventEmitter);

function getDevices() {
	return HID.devices();
}

usbScanner.prototype.init = function (options) {
	var vendorId = options.vendorId || 1534;
	var allDevices = getDevices();
	//hidMap defining keyboard code to coresponding string value
	this.hidMap = options.hidMap || {
			4: "A", 5: "B", 6: "C", 7: "D", 8: "E",
			9: "F", 10: "G", 11: "H", 12: "I", 13: "J",
			14: "K", 15: "L", 16: "M", 17: "N", 18: "O",
			19: "P", 20: "Q", 21: "R", 22: "S", 23: "T",
			24: "U", 25: "V", 26: "W", 27: "X", 28: "Y",
			29: "Z", 30: '1', 31: '2', 32: '3', 33: '4',
			34: '5', 35: '6', 36: '7', 37: '8', 38: '9',
			// enter - barcode escape char
			39: '0', 40: 'enter', 44: " ", 45: "-", 55: ".", 56: "/",
			85: "*", 87: "+"
		};

	this.escapeChar = options.escapeChar || 40;

	var scanner = _.find(allDevices, function (device) {
		return (device.vendorId === vendorId)
	});

	var device = new HID.HID(scanner.path);
	// start waiting for scan events
	this.startScanning(device)
};

usbScanner.prototype.startScanning = function (device) {
	var hidMap = this.hidMap;

	var escapeChar = this.escapeChar;

	//empty array for barcode bytes
	var bcodeBuff = [];
	//string variable to hold barcode string
	var aBarcode = "";
	//event emitter for when newCode is read from scanner
	var getCode = function (code) {
		this.emit("data", code)
	}.bind(this)

	var getError = function (er) {
		this.emit('error', er)
	}.bind(this)

	device.on("data", function (chunk) {
		//second byte of buffer is all that contains data
		if (hidMap[chunk[2]]) {
			//if not bcodeBuff escape char (40)
			if (chunk[2] !== escapeChar) {
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
	device.on('error', function (er) {
		getError(er);
	});
};

module.exports = {usbScanner: usbScanner, getDevices: getDevices};
