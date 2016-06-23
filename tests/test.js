var usbScanner = require('../usbscanner').usbScanner;
var getDevices = require('../usbscanner').getDevices;

//get array of attached HID devices
var connectedHidDevices = getDevices()

//print devices
console.log(connectedHidDevices)

//initialize new usbScanner
var scanner = new usbScanner();

//initial custom scanner
// scanner = new usbScanner({
// 	vendorId: 3389,
// 	hidMap: {"4": "A", "5": "B", "6": "C", "7": "D", "8": "E",
// 		"9": "F", "10": "G", "11": "H", "12": "I", "13": "J",
// 		"14": "K", "15": "L", "16": "M", "17": "N", "18": "O",
// 		"19": "P", "20": "Q", "21": "R", "22": "S", "23": "T",
// 		"24": "U", "25": "V", "26": "W", "27": "X", "28": "Y",
// 		"29": "Z", "30": "1", "31": "2", "32": "3", "33": "4",
// 		"34": "5", "35": "6", "36": "7", "37": "8", "38": "9",
// 		// enter - barcode escape char
// 		"39": "0", "49": "enter", "44": " ", "45": "-", "55": ".", "56": "-",
// 		"85": "*", "87": "+"},
// 	escapeChar: 49
// });

//scanner emits a data event once a barcode has been read and parsed
scanner.on("data", function(code){
	console.log("recieved code : " + code);
});