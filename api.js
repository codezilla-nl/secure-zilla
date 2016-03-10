var hue = require('node-hue-api'),
    HueApi = hue.HueApi,
    lightState = hue.lightState;

var displayResult = function(result) {
    console.log('result', JSON.stringify(result, null, 2));
};

var host = '10.1.2.244',
    username = '7585823c3515f0212baf183779d9ad60',
    api = new HueApi(host, username),
    alarmState = lightState.create().hue(0).on(),
    secureState = lightState.create().hue(25500).on(),
    offState = lightState.create().off();

module.exports = API;

function API() {

}

API.prototype.setGroupLightState = function (state) {

    console.log(state);
    if(state === 1) {
        lightState = alarmState;
    } else {
        lightState = secureState;
    }
    console.log(lightState);

    api.setLightState(2, lightState, function(err, lights) {
        console.log('lightstate');
        console.log(err);
        if (err) throw err;
        displayResult(lights);
    });
};

