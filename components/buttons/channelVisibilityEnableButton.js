const { ButtonBuilder, ButtonStyle, Client, CommandInteraction } = require("discord.js");
const { setChannelVisibility } = require("../../functions/VoiceUtil");


const buttonBuilderData = new ButtonBuilder()
    .setCustomId('channelVisibilityEnableButton')
    .setLabel("Visible")
    .setStyle(ButtonStyle.Primary);

                                    
/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
const buttonFunction = async (client, interaction) => {
    setChannelVisibility(interaction, null);
}


module.exports = {
    data : buttonBuilderData,
    execute: buttonFunction,
}
