const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
require('dotenv').config();
const path = require('node:path');
global.appRoot = path.resolve(__dirname);


// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel],
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.voiceGenerator = new Collection();


// Load commands and events. ('ready' event send the commands to the discord server) | 'CommandUtil' removed to clear application commands
['ComponentUtil', 'EventUtil'].forEach(handler => require(path.join(appRoot, "handlers", handler))(client));


// Handle process errors
process.on('exit', code => { console.log(`Process stopped with code: ${code}`) });
process.on('uncaughtException', (err, origin) => { console.log(`Uncaught Exception: ${err}`, `Origin: ${origin}`) });
process.on('unhandledRejection', (reason, promise) => { console.log(`Unhandled Rejection: ${reason}\n-----\n`, `Promise: ${promise}`) });
process.on('warning', (...args) => { console.log(...args) });


// Log in to Discord with you client's token
client.login(process.env.TOKEN);
