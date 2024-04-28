const { EmbedBuilder, PermissionsBitField  } = require("discord.js");

module.exports = {
    allowMembersInChannel: (interaction, targetMembers) => {
        setMembersAccessToChannel(interaction, targetMembers, true);
    },
    denyMembersInChannel: (interaction, targetMembers) => {
        if(checkInteractionUserIsNotIn(interaction, targetMembers)) {
            interaction.reply({ embeds: [createEmbed(`You cannot deny your access to your own channel.`, "Red")], ephemeral: true  });
            return;
        }
        setMembersAccessToChannel(interaction, targetMembers, false);
    },
    
    setChannelAccess: (interaction, access) => {
        const voiceChannel = interaction.member.voice.channel;
        voiceChannel.permissionOverwrites.edit(interaction.guild.id, { Connect: access })
        .then(vc => {
            const status = access == false ? "private" : "public";
            console.log(`${getName(interaction.member)} (${interaction.user.username}) has made channel "${voiceChannel.name}" ${status}.`)
            interaction.reply({ embeds: [createEmbed(`This channel is now ${status}.`, "Green")], ephemeral: true});
        })
        .catch(console.error);
    },

    setChannelName: (interaction, newName) => {
        const voiceChannel = interaction.member.voice.channel;
        const oldName = voiceChannel.name;
        if (newName != oldName) {                            
            voiceChannel.edit({ name: newName })
            .then(vc => {
                    console.log(`${getName(interaction.member)} (${interaction.user.username}) has changed the channel name from "${oldName}" to "${newName}".`)
                    interaction.reply({ embeds: [createEmbed(`Channel has been set to \`${newName}\`.`, "Green")], ephemeral: true});
                })
                .catch(console.error);
        } else {
            console.log(`${getName(interaction.member)} (${interaction.user.username}) tried to change the channel name but it was already set to "${oldName}".`)
            interaction.reply({ embeds: [createEmbed(`Channel name already set to \`${oldName}\`.`, "Red")], ephemeral: true });
        }

    },

    getName: (member) => {
        return getName(member);
    }
}
    

function createEmbed(description, color) {
    return new EmbedBuilder().setDescription(description).setColor(color);
}

function setMembersAccessToChannel(interaction, targetMembers, access) {
    const voiceChannel = interaction.member.voice.channel;
    const modal = targetMembers.size > 1 ? "have" : "has";
    const action = access == false ? "denied" : "granted";
    let targetMembersStr = "";

    for (const [key, targetMember] of targetMembers) {
        targetMembersStr += targetMembersStr.length > 0 ? " " + targetMember.toString() : targetMember.toString();
        voiceChannel.permissionOverwrites.edit(targetMember.id, { Connect: access })
            .then(vc => {
                console.log(`${getName(interaction.member)} (${interaction.user.username}) has ${action} ${getName(targetMember)} (${targetMember.user.username}) access to channel "${voiceChannel.name}".`);
        
                if (targetMember.voice.channel && targetMember.voice.channel.id == voiceChannel.id) {
                    targetMember.voice.setChannel(null)
                        .then(tm => {
                            console.log(`${getName(targetMember)} (${targetMember.user.username}) has been removed from channel "${voiceChannel.name}" by ${getName(interaction.member)} (${interaction.user.username}).`)
                        })
                        .catch(console.error);   
                }
            })
            .catch(console.error);
    };
    voiceChannel.send({ embeds: [createEmbed(`${targetMembersStr} ${modal} been ${action} access to this channel.`, "Green")], ephemeral: true  });
    interaction.message.delete();
}

function checkInteractionUserIsNotIn(interaction, targetMembers) {
    for (const [key, targetMember] of targetMembers) {
        if(interaction.member == targetMember) {
            return true
        }
    }
    return false
}

function getName(member) {
    return member.nickname ? member.nickname : member.displayName
}
