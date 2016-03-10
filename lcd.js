var i2c = require('i2c-bus');
var sleep = require('sleep');

var DISPLAY_RGB_ADDR = 0x62;
var DISPLAY_TEXT_ADDR = 0x3e;

//Public
module.exports = LCD;

function LCD(port) {
    this.port = port;
}

LCD.prototype.openSync = function() {
    this.i2c1 = i2c.openSync(this.port);
}

LCD.prototype.closeSync = function() {
    this.i2c1.closeSync();
}

LCD.prototype.setRGB = function(r, g, b) {
    this.i2c1.writeByteSync(DISPLAY_RGB_ADDR,0,0)
    this.i2c1.writeByteSync(DISPLAY_RGB_ADDR,1,0)
    this.i2c1.writeByteSync(DISPLAY_RGB_ADDR,0x08,0xaa)
    this.i2c1.writeByteSync(DISPLAY_RGB_ADDR,4,r)
    this.i2c1.writeByteSync(DISPLAY_RGB_ADDR,3,g)
    this.i2c1.writeByteSync(DISPLAY_RGB_ADDR,2,b)
}

LCD.prototype.textCommand = function(cmd) {
    this.i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x80, cmd);
}

LCD.prototype.setText = function(text) {
    this.textCommand(0x01) // clear display
    sleep.usleep(50000);
    this.textCommand(0x08 | 0x04) // display on, no cursor
    this.textCommand(0x28) // 2 lines
    sleep.usleep(50000);
    var count = 0;
    var row = 0;
    for(var i = 0, len = text.length; i < len; i++) {
        if(text[i] === '\n' || count === 16) {
            count = 0;
            row ++;
            if(row === 2)
                break;
            this.textCommand(0xc0)
            if(text[i] === '\n')
                continue;
        }
        count++;
        this.i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x40, text[i].charCodeAt(0));
    }
}
