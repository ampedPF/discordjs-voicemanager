const { ButtonBuilder, ButtonStyle, Client, CommandInteraction, ActionRowBuilder, UserSelectMenuBuilder } = require("discord.js");


const buttonBuilderData = new ButtonBuilder()
    .setCustomId('channelAccessInviteButton')
    .setLabel("Invite")
    .setStyle(ButtonStyle.Success);

                                    
/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
const buttonFunction = async (client, interaction) => {
    await interaction.reply({
        content: "> Invite users",
        components: [new ActionRowBuilder().addComponents(
            new UserSelectMenuBuilder()
			.setCustomId('inviteUsersSelectMenu')
			.setPlaceholder('Select multiple users.')
			.setMinValues(1)
			.setMaxValues(10)
        )]
    });
}


module.exports = {
    data : buttonBuilderData,
    execute: buttonFunction,
}
