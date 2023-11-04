const { ButtonBuilder, ButtonStyle, Client, CommandInteraction, ActionRowBuilder, UserSelectMenuBuilder } = require("discord.js");


const buttonBuilderData = new ButtonBuilder()
    .setCustomId('channelAccessDenyButton')
    .setLabel("Deny")
    .setStyle(ButtonStyle.Danger);

                                    
/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
const buttonFunction = async (client, interaction) => {
    await interaction.reply({
        content: "> Deny users",
        components: [new ActionRowBuilder().addComponents(
            new UserSelectMenuBuilder()
			.setCustomId('denyUsersSelectMenu')
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
