var url = require('url');
var fs = require('fs');
var path = require('path');
var platform = require('os').platform();

module.exports = function(type, localizationObject) {
    if (type == "login") {
        return {
          properties: {
            username: {
              description: localizationObject.translate('Enter your Sterowanie24 username: '),
              required: true,
              default: '',

              message: 'Please provide username',
              conform: function(value) {
                //console.log(value);
                if (value == "") {
                  return false;
                } else {
                  return true;
                }
              }
            },
            password: {
              description: localizationObject.translate('Enter your Sterowanie24 password: '),
              required: true,
              default: '',
      hidden: true,
      replace: '*',
              message: 'Please provide username',
              conform: function(value) {
                //console.log(value);
                if (value == "") {
                  return false;
                } else {
                  return true;
                }
              }
            },
          }
        };
    } else if (type == "mainmenu_select_option") {
      return {
        properties: {
          username: {
            description: localizationObject.translate('Select menu position number: '),
            required: true,
            default: '',

            message: 'Please select menu position number',
            conform: function(value) {
              //console.log(value);
              if (value == "") {
                return false;
              } else {
                return true;
              }
            }
          },
          password: {
            description: localizationObject.translate('Enter your Sterowanie24 password: '),
            required: true,
            default: '',
    hidden: true,
    replace: '*',
            message: 'Please provide username',
            conform: function(value) {
              //console.log(value);
              if (value == "") {
                return false;
              } else {
                return true;
              }
            }
          },
        }
      };
    }
};
