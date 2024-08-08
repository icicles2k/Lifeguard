const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const { loadEvents } = require('./handlers/events');
const { handleMessage } = require('./listeners/messageCreate');
const { join } = require('path');
const loadCommands = require('./handlers/commands');
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

mongoose.connect(process.env.DATABASE_URL, {
}).then(() => {
    console.log('Connected to MongoDB.');
}).catch(err => {
    console.log(err);
});

loadCommands(client);
loadEvents(join(__dirname, './listeners'), client);

client.on('messageCreate', async (message) => {
    await handleMessage(message, client);
});

client.on('ready', () => {
    console.log(`Loaded ${client.commands.size} command${client.commands.size > 1 ? 's' : ''}.`);
    console.log('Connected to Discord.');
});

client.login(process.env.TOKEN);