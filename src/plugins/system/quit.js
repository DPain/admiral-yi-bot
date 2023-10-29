const { SlashCommandBuilder } = require('discord.js');
const singleton = require('./../../singleton.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quit')
		.setDescription('Quits the bot.')
	, execute: async function (interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply('Shutting down the bot!');
		singleton.client.destroy();
		process.exit(0);
	}
}