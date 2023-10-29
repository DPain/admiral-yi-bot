const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const singleton = require('./singleton.js');
/**
 * Directory of where to scan for plugins.
 * @const {string}
 */
const PLUGIN_DIR = path.join(__dirname, 'plugins');

/** Class representing a Bot. */
module.exports = class Bot {
    /**
     * Creates a Bot.
     * @param {string} token - The discord bot's token.
     * @param {string} clientId - The discord bot's client id.
     * @param {string} guildId - Where the bot will register it's slash commands.
     */
    constructor(token, clientId, guildId) {
        this.token = token;
        this.clientId = clientId;
        this.guildId = guildId;
    }

    /**
     * Registers commands located in the /src/plugins folder as a discord bot command.
     */
    registerPlugins() {
        console.log('Registering Plugins!');
        let commands = [];
        // Grab all the command folders from the commands directory you created earlier
        const foldersPath = PLUGIN_DIR;
        console.log(`foldersPath: ${foldersPath}`);
        const commandFolders = fs.readdirSync(foldersPath);
    
        for (const folder of commandFolders) {
            // Grab all the command files from the commands directory you createda earlier
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                console.log(filePath);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "dataS" or "execute" property.`);
                }
            }
        }
    
        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(this.token);
    
        // and deploy your commands!
        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(this.clientId, this.guildId),
                    { body: commands },
                );
    
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();
    }

    /**
     * Starts the bot.
     */
    start() {
        // Create a new client instance
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

        this.client.commands = new Collection();
        const foldersPath = PLUGIN_DIR;
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    this.client.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }

        // When the client is ready, run this code (only once)
        // We use 'c' for the event parameter to keep it separate from the already defined 'client'
        this.client.once(Events.ClientReady, c => {
            console.log(`Ready! Logged in as ${c.user.tag}`);
        });

        this.client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;
            console.log(this.client.commands);

            const command = this.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        });

        //Log in to Discord with your client's token
        this.client.login(this.token);

        // Share client as singleton.
        singleton.client = this.client;
    }
}