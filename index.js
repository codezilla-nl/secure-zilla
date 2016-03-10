var GrovePi = require('node-grovepi').GrovePi

var LCD = require('./lcd');

var Commands = GrovePi.commands
var Board = GrovePi.board

var AccelerationI2cSensor = GrovePi.sensors.AccelerationI2C
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital
var AirQualityAnalogSensor = GrovePi.sensors.AirQualityAnalog
var DHTDigitalSensor = GrovePi.sensors.DHTDigital
var LightAnalogSensor = GrovePi.sensors.LightAnalog

var board;
var lcd = new LCD(1);




function start() {
    board = new Board({
        debug: true,
        onError: function (err) {
            console.log('Something wrong just happened')
            console.log(err)
        },
        onInit: function (res) {
            console.log('hallo');
            if (res) {
                console.log('GrovePi Version :: ' + board.version())

                var ultrasonicSensor = new UltrasonicDigitalSensor(3)
                console.log('UltrasonicDigitalSensor (start watch)')
                ultrasonicSensor.on('change', function (res) {
                    console.log('Ultrasonic onChange value=' + res)

                    lcd.openSync();
                    lcd.setText('Ultrasonic value ' + res)
                    lcd.setRGB(res && res < 255 ? res : 255, 55, 55)
                    lcd.closeSync();


                })
                ultrasonicSensor.watch()
            }
        }
    });
    board.init();
}

function onExit(err) {
    console.log('ending')
    board.close()
    process.removeAllListeners()
    process.exit()
    if (typeof err != 'undefined')
        console.log(err)
}

start();

// catches ctrl+c event
process.on('SIGINT', onExit)