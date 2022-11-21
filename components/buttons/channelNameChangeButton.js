const { ButtonBuilder, ButtonStyle, Client, CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const channelNameChangeModal = require("../modals/channelNameChangeModal");


const buttonBuilderData = new ButtonBuilder()
    .setCustomId('channelNameChangeButton')
    .setLabel("Change Name")
    .setStyle(ButtonStyle.Primary);

                                    
/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
const buttonFunction = async (client, interaction) => {
    channelNameChangeModal.data.components[0].components[0].data.placeholder = interaction.member.voice.channel.name;
    await interaction.showModal(channelNameChangeModal.data);
}


module.exports = {
    data : buttonBuilderData,
    execute: buttonFunction,
}
