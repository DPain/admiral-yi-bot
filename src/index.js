const fs = require('node:fs');
const path = require('node:path');
const singleton = require('./singleton.js');
const Bot = require('./bot.js');

const discordConfig = require('./config/discord.json');
const PLUGIN_DIR = path.join(__dirname, 'plugins');

console.log(`Using token: ${discordConfig.token}`)

const args = process.argv.slice(2);

singleton.bot = new Bot(discordConfig.token, discordConfig.clientId, discordConfig.guildId);

if (args.includes('registerPlugins')) {
    singleton.bot.registerPlugins();
}

singleton.bot.start();