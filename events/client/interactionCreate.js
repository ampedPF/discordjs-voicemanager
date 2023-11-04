const { Events, InteractionType, MessageInteraction, Client } = require('discord.js');
const { allowMembersInChannel, denyMembersInChannel } = require("../../functions/VoiceUtil");


module.exports = {
    name: Events.InteractionCreate,
    description: "Emitted when the client becomes ready to start working.",
    once: false,
    /**
     * 
     * @param { Client } client 
     * @param { MessageInteraction } interaction 
     * @returns 
     */
    async execute(client, interaction) {
        if(interaction.type == InteractionType.ApplicationCommand) {
            const command = client.commands.get(interaction.commandName);
            
            if (!command) return interaction.reply('This command does not exist.');
    
            command.execute(client, interaction);
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            
            if (!button) return interaction.reply('This button does not exist.');
    
            button.execute(client, interaction);
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            
            if (!modal) return interaction.reply('This modal does not exist.');
    
            modal.execute(client, interaction);
        } else if (interaction.isUserSelectMenu()) {
            if (interaction.customId == 'inviteUsersSelectMenu') {
                const fetchedMembers = await interaction.guild.members.fetch( { user: interaction.values});
                allowMembersInChannel(interaction, fetchedMembers);
            }
            else if (interaction.customId == 'denyUsersSelectMenu') {
                const fetchedMembers = await interaction.guild.members.fetch( { user: interaction.values});
                denyMembersInChannel(interaction, fetchedMembers);
            }
        }
    },
};
