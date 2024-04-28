const { ButtonBuilder, ButtonStyle, Client, CommandInteraction } = require("discord.js");
const { setChannelVisibility } = require("../../functions/VoiceUtil");


const buttonBuilderData = new ButtonBuilder()
    .setCustomId('channelVisibilityDisableButton')
    .setLabel("Invisible")
    .setStyle(ButtonStyle.Secondary);

                                    
/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
const buttonFunction = async (client, interaction) => {
    setChannelVisibility(interaction, false);
}


module.exports = {
    data : buttonBuilderData,
    execute: buttonFunction,
}
