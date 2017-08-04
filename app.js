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

var pricebot = require('./bots/pricebot');
pricebot.init(process.env.MARKET_TRADING_CHANNEL);


slackbot.on('start', function() {
  slackbot.on('message', function(data) {
    if (data.text) {

      var command = data.text.trim().split(' ')[0];

      if (command === '!help') {
        var helpMsg = "I'm PriceBot, district0x's prime bot. Here's what I can do:\n" +
          '`!help` shows this message\n' +
          '`!price` shows the price\n' +
          '`!price btc` shows the price in BTC\n' +
          '_type any of the above commands for more info_\n' +
          '\n' +
          '\n' +
          'My code is at https://github.com/98farhan94/district0x-bot. I like hashes.\n';

        slackbot.postMessage(data.channel, helpMsg, {icon_emoji: ':bulb:'});
      }

      if (command === pricebot.command) {
        pricebot.respond(slackbot, data);
      }
    }
  });
});
