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
pricebot.init();
//pricebot.init(process.env.MARKET_TRADING_CHANNEL); //PMs only


slackbot.on('start', function() {
  slackbot.on('message', function(data) {
    if (data.text) {

      var command = data.text.trim().split(' ')[0];

      if (command === '!help') {
        var helpMsg = "I'm Price Bot, district0x's ~CEO~ market alert bot. \nHere's what I can do:\n" +
          '`!help` shows this message\n' +
          '`!stats` shows the latest market prices and marketcap in #dnt_trader channel\n' +
          '`!price` (PM only) shows the latest market price\n' +
          '`!price <currency>` (PM only) shows the price in USD\n' +
            'Supported currencies: USD/GBP/BTC/ETH\n' +
          '`!price <currency> <amount>` (PM only) shows the total price of the given amount in chosen currency\n' +
          '_type any of the above commands to try me out_\n' +
          '\n' +
          '\n' +
          'My code is at https://github.com/98farhan94/district0x-bot.\nI will take over the world some day.\n';

        slackbot.postMessage(data.channel, helpMsg, {icon_emoji: ':bulb:'});
      }
      if (command === '!prediction') {
        var helpMsg = "The prediction for DNT price is:\n" +
          ':dnt: :rocket: :moon: \n TO THE MOON! HODL, DON\,T SELL!';

        slackbot.postMessage(data.channel, helpMsg, {icon_emoji: ':crystal_ball:'});
      }

      if (command === pricebot.command) {
        pricebot.respond(slackbot, data);
      }
      if (command === statbot.command) {
        statbot.respond(slackbot, data);
      }
      if (command === '!faq') {
        var faqMsg = '*Where to buy?*\n' +
          '>district0x is listed on the following exchanges:\n' +
          '>https://liqui.io/#/exchange/DNT_ETH\n' +
          '>https://liqui.io/#/exchange/DNT_BTC\n' +
          '>https://liqui.io/#/exchange/DNT_USDT\n' +
          '>https://etherdelta.github.io/#DNT-ETH\n' +
          '\n' +
          '*How / Where to store DNT tokens?*\n' +
          '>Any ERC20 wallet' +
          '\n' +
          '*What was the DNT ICO price?*\n' +
          '>1 :dnt: = 0.0000719 ETH\n' +
          '\n' +
          '*When will DNT get listed on Bittrex?*\n' +
          '>Read the following post: https://district0x.slack.com/files/joe/F6JUAT8TT/Bittrex_Update\n' +
          '>In short: Bittrex’s ‘compliance review’ requires a payment of a minimum of $5000, with no guarantee of listing after payment.\n' +
          '>The team has said all along that they will not be paying to be listed on any exchanges.';

        slackbot.postMessage(data.channel, faqMsg, {icon_emoji: ':question:'});
      }
    }
  });
});
