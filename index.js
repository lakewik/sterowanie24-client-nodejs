const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
var Localize = require('localize');
var emoji = require('node-emoji')
var prompt = require('prompt');
  var colors = require("colors/safe");
var WizardSchema = require('./resources/ConfigWizard.js');
const ora = require('ora');


var myLocalize = new Localize({
    "Welcome to Sterowanie24 Receiver Listener Client! - Configuration and options": {
        "pl": "Witaj w Sterowanie24 - Konfiguracja klienta sterowania"
      },
      "Enter your Sterowanie24 username: " : {
        "pl" : "Twoja nazwa użytkownika na Sterowanie24.pl: "
      },
      "Enter your Sterowanie24 password: " : {
        "pl" : "Twoje hasło do konta na Sterowanie24.pl: "
      },
      "Logging in..." : {
        "pl" : "Logowanie..."
      },

});

myLocalize.setLocale("pl");

console.log(
  colors.rainbow(
    figlet.textSync('Sterowanie24', { horizontalLayout: 'fit' })
  )
);


console.log(
   "  " + chalk.green(emoji.get('star') + "  " +
  myLocalize.translate("Welcome to Sterowanie24 Receiver Listener Client! - Configuration and options") +  "  " + emoji.get('star')
  )
);

console.log();
console.log();


prompt.message = colors.rainbow("##### --->>>> ");
 prompt.delimiter = colors.green("");

console.log(emoji.get('warning') + "  " + colors.magenta("Pierwsze logowanie. Aby rozpocząć, zaloguj się do swojego konta na Sterowanie24.pl"));

 prompt.start();
 prompt.get(WizardSchema("login", myLocalize), function(err, result) {
       if (err) {
         return console.log(err.message);
       }


       var config = {
         username: result.username
       };

       const spinner = ora( myLocalize.translate('Logging in...')).start();


       setTimeout(() => {
        spinner.succeed("Logged in successfully!");

        console.log();
        console.log();
        printAccountInfo();
        doMainMenuPrompt();
       }, 1000);
      // console.log(

        // 'Setup complete!'
       //);

});

function printAccountInfo() {
  console.log(
    colors.black(colors.bgGreen(
        "--->   Your account data   <---"
    ))
  );
  console.log();
  console.log(
    colors.green(
        "Username: "
    ) + "lakewik"+" "   + colors.green(
       "Name: "
    ) + "Wiktor" +" "  + colors.green(
        "Surname: "
    ) + "Jezioro"
  );
}

function doMainMenuPrompt() {
  console.log(
    colors.black(colors.bgCyan(
        "--->   Main menu   <---"
    ))
  );

  console.log(
    colors.green(
        "1. "
    ) + "Your controlling rooms list" + "\n" + colors.green(
        "2. "
    ) + "Konfiguracja wybranego sterowania na tym urządzeniu"
  );
}

//console.log("Test");
