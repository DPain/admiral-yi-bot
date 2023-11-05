const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('love')
        .setDescription('Sends a love message to the user.')
        .addUserOption(option => 
            option.setName("recipient")
            .setDescription("The person who will be receiving the love message.")
            .setRequired(true)
        )
    , execute: async function (interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        
        let user = interaction.user;
        let recipient = interaction.options.getUser('recipient')
        await interaction.reply(`<@${user.id}> sends a love message to <@${recipient.id}>.`);
    }
}