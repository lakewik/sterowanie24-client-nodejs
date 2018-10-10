/* Client daemon for Sterowanie24.
   It needs to be running one for one controlling
   Copyright (C) 2018 Wiktor Jezioro
   GNU GPL
*/

var io = require('socket.io-client');
const path = require('path');
var fs = require('fs');
const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const xa = require('xa');
var colors = require("colors/safe");
//const Gpio = require('pigpio').Gpio;

var socketIOServerAddress = "";
var socketIOServerPort = "";

var GPIOsObjectsArray = [];
var ControlsArray = [];

var configsPath = ".config/Sterowanie24";
var usedConfig = process.argv[2];
var homePath = process.env.HOME;

console.log(
  colors.rainbow(
    figlet.textSync('Sterowanie24', { horizontalLayout: 'fit' })
  )
);

// TEMPLATE CONFIGRATION FILES STRUCTURES //

/* Types descriptions
                         * 1 - standard on/off button
                         * 2 - color picker button
                         * 3 - range slider
                         * 4 - select list
                         */

var roomDataTEMPLATE = {
    id: 1,
    name: "Kotek",
    gpio_numbering_type: "BCM",
    control_items: [
        { // Type standard button
          id: 1,
          internal_id: 0,
          type: 1,
          gpio_binding: 1
        },
        { // Type range slider
          id: 2,
          internal_id: 1,
          type: 3,
          pwm_gpio_binding: 2
        },
        { // Type colorpicker
          id: 3,
          internal_id: 2,
          type: 2,
          pwm_gpio_binding: 3
        },
        { // Type combobox
          id: 4,
          internal_id: 3,
          type: 4,
          combobox_gpios_bindings: [
            {
              4:{"state":1,"type":"binary"},
              5:{"state":254,"type":"pwm"}
            },{
              6:{"state":0,"type":"binary"},
              7:{"state":120,"type":"pwm"},
            }
          ]
        },
    ],


}

////////////////////////////////////////////


//var userAuthenticationData = JSON.parse(fs.readFileSync(path.join(homePath, configsPath, "user.json"), 'utf8'));
//var roomData = JSON.parse(fs.readFileSync(path.join(homePath, configsPath, usedConfig+".json"), 'utf8'));
//var clientConfiguration = JSON.parse(fs.readFileSync(path.join(homePath, configsPath, "configuration.json"), 'utf8'));



function getFullRoomControlsArray(roomID) {

}

function init() {
  if(clientConfiguration.roomGpioBindingsPriority == "local") {

  } else if(clientConfiguration.roomGpioBindingsPriority == "server") {

  }
}

function locateAndSetupAllUsedGpiosArrayAndControlsArray() {
  for (var attr in roomDataTEMPLATE.control_items) {
      ControlsArray[roomDataTEMPLATE.control_items[attr].internal_id] = roomDataTEMPLATE.control_items[attr];
      if (roomDataTEMPLATE.control_items[attr].type == 1) {// type onoff or pwm
          //GPIOsObjectsArray[roomDataTEMPLATE.control_items[attr].gpio_binding] = new Gpio(roomDataTEMPLATE.control_items[attr].gpio_binding, {mode: Gpio.OUTPUT});
          GPIOsObjectsArray[roomDataTEMPLATE.control_items[attr].gpio_binding] = 1;
      } else if (roomDataTEMPLATE.control_items[attr].type == 3) {
          GPIOsObjectsArray[roomDataTEMPLATE.control_items[attr].pwm_gpio_binding] = 1;
      } else if (roomDataTEMPLATE.control_items[attr].type == 4) { // it is combobox type
          for (var y in roomDataTEMPLATE.control_items[attr].combobox_gpios_bindings) {
              for (var z in roomDataTEMPLATE.control_items[attr].combobox_gpios_bindings[y]) {
                  //GPIOsObjectsArray[roomDataTEMPLATE.control_items[attr].combobox_gpios_bindings[y][z]] = new Gpio(roomDataTEMPLATE.control_items[attr].combobox_gpios_bindings[y][z], {mode: Gpio.OUTPUT});
                  GPIOsObjectsArray[z] = 1;
              }
          }
      }
   }
}
locateAndSetupAllUsedGpiosArrayAndControlsArray();
console.log(GPIOsObjectsArray);
console.log(ControlsArray);
const socket = io('http://localhost');

// Switch room to specified
//socket.emit('switchRoom', roomData.id, {targetListenerClient: true, targetListenerToken: userAuthenticationData.targetListenerToken});


socket.on('connect', function(){
    xa.loading('INFO', dateTime.create().format('Y-m-d H:M:S') + ` [WS] Connected to websocket server`);
});

socket.on('updateState', function(data){
    if (ControlsArray[data.control_item].type == 1 ) {
        GPIOsObjectsArray[ControlsArray[data.control_item].gpio_binding].digitalWrite(parseInt(data.new_state));
    } else if (ControlsArray[data.control_item].type == 3) {
        GPIOsObjectsArray[ControlsArray[data.control_item].pwm_gpio_binding].pwmWrite(parseInt(data.new_state));
    } else if (ControlsArray[data.control_item].type == 4) {
        for (var GPIO in ControlsArray[data.control_item].combobox_gpios_bindings[data.new_state]) {
          var type = ControlsArray[data.control_item].combobox_gpios_bindings[data.new_state][GPIO].type;
          var newLogicState = ControlsArray[data.control_item].combobox_gpios_bindings[data.new_state][GPIO].state;
          if (type == "binary") {
              GPIOsObjectsArray[ControlsArray[data.control_item].pwm_gpio_binding].digitalWrite(parseInt(newLogicState));
          } else if (type == "pwm") {
              GPIOsObjectsArray[ControlsArray[data.control_item].pwm_gpio_binding].pwmWrite(parseInt(newLogicState));
          } else if (type == "rgb") {

          }
       }
    } else if (ControlsArray[data.control_item].type == 2) {

    }
});

socket.on('disconnect', function(){
    xa.loading('INFO', dateTime.create().format('Y-m-d H:M:S') + ` [WS] Disconnected from websocket server`);
});
