const { Client, CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { setChannelName } = require("../../functions/VoiceUtil");


const modalBuilderData = new ModalBuilder()
    .setCustomId('nameModal')
    .setTitle('Edit channel name')
    .addComponents(new ActionRowBuilder()
        .addComponents(new TextInputBuilder()
            .setCustomId('newNameInput')
            .setLabel("Enter a new name")
            .setStyle(TextInputStyle.Short)
            .setMinLength(3)
            .setMaxLength(32)));


/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
const modalFunction = async (client, interaction) => {
    setChannelName(interaction, interaction.fields.fields.get("newNameInput").value);
}


module.exports = {
    data : modalBuilderData,
    execute: modalFunction,
}
