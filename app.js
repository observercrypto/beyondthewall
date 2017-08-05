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
  name: 'Price Bot'
});

var statbot = require('./bots/statbot');
statbot.init(process.env.MARKET_TRADING_CHANNEL);

var pricebot = require('./bots/pricebot');
pricebot.init(process.env.MARKET_TRADING_CHANNEL);


slackbot.on('start', function() {
  slackbot.on('message', function(data) {
    if (data.text) {

      var command = data.text.trim().split(' ')[0];

      if (command === '!help') {
        var helpMsg = "I'm Price Bot, district0x's ~CEO~ market alert bot. \nHere's what I can do:\n" +
          '`!help` shows this message\n' +
          '`!price` shows the latest market prices\n' +
          '`!price usd` shows the price in USD\n' +
          '`!price eth` shows the price in ETH\n' +
          '`!price btc` shows the price in BTC\n' +
          '_type any of the above commands to try me out_\n' +
          '\n' +
          '\n' +
          'My code is at https://github.com/98farhan94/district0x-bot.\nI will take over the world some day.\n';

        slackbot.postMessage(data.channel, helpMsg, {icon_emoji: ':bulb:'});
      }

      if (command === pricebot.command) {
        pricebot.respond(slackbot, data);
      }
      if (command === statbot.command) {
        pricebot.respond(slackbot, data);
      }
    }
  });
});
