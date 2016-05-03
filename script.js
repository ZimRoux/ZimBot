'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Processing...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say(`Hello! Please choose your language. Bonjour ! Choisissez votre langue, s'il vous plait.\n%[English](postback:english) %[Français](postback:francais)`)
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    var didntUnderstandArray = ['![didnt_understand_1](https://raw.githubusercontent.com/ZimRoux/ZimBot/master/img/didnt-understand-1.jpg)', '![didnt_understand_2](https://raw.githubusercontent.com/ZimRoux/ZimBot/master/img/didnt-understand-2.jpg)', '![didnt_understand_3](https://raw.githubusercontent.com/ZimRoux/ZimBot/master/img/didnt-understand-3.jpg)', '![didnt_understand_4](https://raw.githubusercontent.com/ZimRoux/ZimBot/master/img/didnt-understand-4.jpg)', '![didnt_understand_5](https://raw.githubusercontent.com/ZimRoux/ZimBot/master/img/didnt-understand-5.jpg)', '![didnt_understand_6](https://raw.githubusercontent.com/ZimRoux/ZimBot/master/img/didnt-understand-6.jpg)', '![didnt_understand_7](https://raw.githubusercontent.com/ZimRoux/ZimBot/master/img/didnt-understand-7.jpg)', '![didnt_understand_8](https://raw.githubusercontent.com/ZimRoux/ZimBot/master/img/didnt-understand-8.jpg)', '![didnt_understand_9](https://raw.githubusercontent.com/ZimRoux/ZimBot/master/img/didnt-understand-9.jpg)'];
                    var randDidntUnderstand = didntUnderstandArray[Math.floor(Math.random() * didntUnderstandArray.length)];
                    return bot.say(randDidntUnderstand).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return wait(50).then(function() {
                            return bot.say(line);
                        });
                    });
                });

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
