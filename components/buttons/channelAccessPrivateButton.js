const { ButtonBuilder, ButtonStyle, Client, CommandInteraction } = require("discord.js");
const { setChannelAccess } = require("../../functions/VoiceUtil");


const buttonBuilderData = new ButtonBuilder()
    .setCustomId('channelAccessPrivateButton')
    .setLabel("Private")
    .setStyle(ButtonStyle.Secondary);

                                    
/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
const buttonFunction = async (client, interaction) => {
    setChannelAccess(interaction, false);
}


module.exports = {
    data : buttonBuilderData,
    execute: buttonFunction,
}
