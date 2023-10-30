const fs = require('node:fs');
const path = require('node:path');
const singleton = require('./singleton_manager.js');
const Bot = require('./bot.js');
const log = require('./log.js');

const discordConfig = require('./config/discord.json');

log.info(`Using token: ${discordConfig.token}`);

const args = process.argv.slice(2);

let bot = new Bot(discordConfig.token, discordConfig.clientId, discordConfig.guildId);

if (args.includes('registerPlugins')) {
    bot.registerPlugins();
}

bot.start();