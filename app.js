var SlackBot = require('slackbots');
var request = require('request');
var fs = require('fs');
var path = require('path');

['SLACK_TOKEN',].forEach(function (envVar) {
  if (!process.env[envVar]) {
    throw new Error(envVar + ' env var required');
  }
});

var slackbot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: 'PriceBot'
});


function sendWelcomeMessage(user) {
  fs.readFile(path.join(path.dirname(require.main.filename), 'slack-greeting.md'), {encoding: 'utf-8'}, function (error, data) {
    if (!error) {
      slackbot.postMessage(user, data);
    }
  });
};

var pricebot = require('./bots/pricebot');
pricebot.init(process.env.MARKET_TRADING_CHANNEL);


slackbot.on('start', function() {
  slackbot.on('message', function(data) {
    if (data.text) {

      var command = data.text.trim().split(' ')[0];

      if (command === '!help') {
        var helpMsg = "I'm Wunderbot, LBRY's slackbot. Here's what I can do:\n" +
          '`!help` shows this message\n' +
          '`!tip` sends LBC tips to others, and withdraws and deposits credits into the your tipping wallet *(now handled by <@tipbot>)*\n' +
          '`!hash` reports on the LBRY blockchain\n' +
          '_type any of the above commands for more info_\n' +
          '\n' +
          'I also update <#C266N3RMM|content> anytime new content is published on LBRY\n' +
          '\n' +
          'My code is at https://github.com/lbryio/lbry-wunderbot. I love learning new tricks.\n';

        slackbot.postMessage(data.channel, helpMsg, {icon_emoji: ':bulb:'});
      }

      if (command === pricebot.command) {
        pricebot.respond(slackbot, data);
      }
    }
  });
});
