var GrovePi = require('node-grovepi').GrovePi

var LCD = require('./lcd');

var Commands = GrovePi.commands
var Board = GrovePi.board

var AccelerationI2cSensor = GrovePi.sensors.AccelerationI2C
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital
var AirQualityAnalogSensor = GrovePi.sensors.AirQualityAnalog
var DHTDigitalSensor = GrovePi.sensors.DHTDigital
var LightAnalogSensor = GrovePi.sensors.LightAnalog

var Analog = GrovePi.sensors.base.Analog;
var Digital = GrovePi.sensors.base.Digital;

var board;
var lcd = new LCD(1);
var alarm, led;
var alarmEnabled = false;

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

                board.pinMode(6, 'input');

                var ultrasonicSensor = new UltrasonicDigitalSensor(3)
                alarm = new Digital(4);
                led = new Digital(2);
                button = new Digital(6);

                lcd.openSync();
                lcd.clear();

                console.log('UltrasonicDigitalSensor (start watch)')
                ultrasonicSensor.on('change', function (res) {

                    lcd.setText('Sensor:\n' + res)

                    if (alarmEnabled) {
                        if (res && res <= 60) {
                            startAlarm();
                        } else {
                            stopAlarm();
                        }
                    }


                    var oldVal = 0;
                    var interval = setInterval(function() {
                        var val = button.read()[0];

                        if (typeof val !== 'undefined' && val !== false && val !== oldVal) {
                            oldVal = val;

                            if (val === 1) {
                                switchAlarm();
                            }

                        }
                    }, 200);

                })


                ultrasonicSensor.watch()
            }
        }
    });
    board.init();
}

function switchAlarm() {
    alarmEnabled = !alarmEnabled;
    console.log('Alarm', alarmEnabled);
}

function startAlarm() {
    console.log('ALARM!');
    led.write(1);
    lcd.setRGB(255, 55, 55)
}

function stopAlarm() {
    console.log('Stop!');
    led.write(0);
    lcd.setRGB(55, 255, 55)
}

function onExit(err) {
    console.log('ending')
    lcd.closeSync()
    board.close()
    process.removeAllListeners()
    process.exit()
    if (typeof err != 'undefined')
        console.log(err)
}

start();

// catches ctrl+c event
process.on('SIGINT', onExit)