const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    allowMemberInChannel: (interaction, voiceChannel, targetMember) => {
    voiceChannel.permissionOverwrites.edit(targetMember.id, { Connect: true })
                        .then(vc => {
                            console.log(`${interaction.user.tag} has granted ${targetMember.user.tag} access to channel "${voiceChannel.name}".`)
                            interaction.reply({ embeds: [createEmbed(`${targetMember} has been granted access to this channel.`, "Green")], ephemeral: true  });
                        })
                        .catch(console.error);
    },
    
    setChannelAccess: (interaction, access) => {
        const voiceChannel = interaction.member.voice.channel;
        voiceChannel.permissionOverwrites.edit(interaction.guild.id, { Connect: access })
        .then(vc => {
            const status = access == false ? "private" : "public";
            console.log(`${interaction.user.tag} has made channel "${voiceChannel.name}" ${status}.`)
            interaction.reply({ embeds: [createEmbed(`This channel is now ${status}.`, "Green")], ephemeral: true  });
        })
        .catch(console.error);
    }
}
    

function createEmbed(description, color){
    return new EmbedBuilder().setDescription(description).setColor(color);
}