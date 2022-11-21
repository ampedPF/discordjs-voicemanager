const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { setChannelAccess, setChannelName } = require("../../functions/VoiceUtil");


const slashCommandData = new SlashCommandBuilder()
        .setName('voice')
        .setDescription("Control your own voice channel.")
        .addSubcommand(subCommand => 
            subCommand.setName("allow")
                    .setDescription("Allow a member to connect to your channel.")
                    .addUserOption(option => 
                        option.setName("member")
                                .setDescription("Select the member to allow.")
                                .setRequired(true)))
        .addSubcommand(subCommand => 
            subCommand.setName("deny")
                    .setDescription("Deny a member from accessing to your channel.")
                    .addUserOption(option => 
                        option.setName("member")
                                .setDescription("Select the member to deny.")
                                .setRequired(true)))
        .addSubcommandGroup(subCommandGroup => 
            subCommandGroup.setName("set")
                    .setDescription("Configure your voice channel.")
                    .addSubcommand(subCommand =>
                        subCommand.setName("access")
                                .setDescription("Set Private or Public.")
                                .addStringOption(option => 
                                    option.setName("turn")
                                            .setDescription("Select access.")
                                            .setRequired(true)
                                            .addChoices(
                                                { name: 'Private', value: 'private' },
                                                { name: 'Public', value: 'public' },
                                            )))
                    .addSubcommand(subCommand => 
                        subCommand.setName("name")
                                .setDescription("Change the name your channel.")
                                .addStringOption(option =>
                                    option.setName("text")
                                            .setDescription("Provide the name.")
                                            .setRequired(true)
                                            .setMaxLength(32)))
                    .addSubcommand(subCommand => 
                        subCommand.setName("userlimit")
                                .setDescription("Change the user limit of your channel.")
                                .addIntegerOption(option => 
                                    option.setName("number")
                                            .setDescription("Provide the user limit ('0': Unlimited).")
                                            .setRequired(true)
                                            .setMinValue(0)
                                            .setMaxValue(100)))
                    .addSubcommand(subCommand => 
                        subCommand.setName("visibility")
                                .setDescription("Make your channel visible to others or not.")
                                .addStringOption(option => 
                                    option.setName("turn")
                                            .setDescription("Set visibility.")
                                            .setRequired(true)
                                            .addChoices(
                                                { name: 'Show', value: 'show' },
                                                { name: 'Hide', value: 'hide' },
                                            )))
    );


/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
 const slashCommandFunction = async (client, interaction) => {
    const { options, member, guild } = interaction;
    const subCommandGroup = options._group;
    const subCommand = options._subcommand;
    const voiceChannel = member.voice.channel;
    const ownedChannelId = client.voiceGenerator.get(member.id);

    if (!voiceChannel)
        return interaction.reply({ embeds: [createEmbed("You're not in a voice channel.", "Red")], ephemeral: true });
    if (!ownedChannelId)
        return interaction.reply({ embeds: [createEmbed("You do not own any voice channel.", "Red")], ephemeral: true });
    if (voiceChannel.id !== ownedChannelId)
        return interaction.reply({ embeds: [createEmbed("You do not own this voice channel.", "Red")], ephemeral: true });
        
    switch(subCommandGroup) {
        case null: {
            switch(subCommand){
                case "allow": {
                    const targetMember = options.getMember("member");
                    voiceChannel.permissionOverwrites.edit(targetMember.id, { Connect: true })
                        .then(vc => {
                            console.log(`${interaction.user.tag} has granted ${targetMember.user.tag} access to channel "${voiceChannel.name}".`)
                            interaction.reply({ embeds: [createEmbed(`${targetMember} has been granted access to this channel.`, "Green")], ephemeral: true  });
                        })
                        .catch(console.error);
                }
                break;
                case "deny": {
                    const targetMember = options.getMember("member");

                    if(targetMember == member) {
                        interaction.reply({ embeds: [createEmbed(`You cannot deny your access to your own channel.`, "Red")], ephemeral: true  });
                        return;
                    }

                    voiceChannel.permissionOverwrites.edit(targetMember, { Connect: false })
                        .then(vc => {
                            console.log(`${interaction.user.tag} has denied ${targetMember.user.tag} access to channel "${voiceChannel.name}".`)
                            interaction.reply({ embeds: [createEmbed(`${targetMember} has been denied access to this channel.`, "Green")], ephemeral: true  });
                        })
                        .catch(console.error);
                    
                    if (targetMember.voice.channel && targetMember.voice.channel.id == voiceChannel.id) {
                        targetMember.voice.setChannel(null)
                            .then(tm => {
                                console.log(`${targetMember.user.tag} has been removed from channel "${voiceChannel.name}" by ${interaction.user.tag}.`)
                                interaction.reply({ embeds: [createEmbed(`${targetMember} has been removed from this channel.`, "Green")], ephemeral: true  });
                            })
                            .catch(console.error);   
                    }
                }
                break;
            }
        }
        break;

        case "set": {
            switch(subCommand) {
                case "access": {
                    const turnChoice = options.getString("turn");
                    switch(turnChoice) {
                        case "private": {
                            setChannelAccess(interaction, false);
                        }
                        break;
                        case "public": {
                            setChannelAccess(interaction, null);
                        }
                        break;
                    }
                }
                break;
                case "name": {
                    const newName = options.getString("text");
                    setChannelName(interaction, newName);
                }
                break;
                case "userlimit": {
                    const oldSlots = voiceChannel.userLimit;
                    var newSlots = options.getInteger("number");
                    const slotsChanged = newSlots != oldSlots;
                    if(newSlots == 0) newSlots = "Unlimited";

                    if (slotsChanged) {
                        voiceChannel.setUserLimit(newSlots)
                            .then(vc => {
                                console.log(`${interaction.user.tag} has changed the channel "${voiceChannel.name}" user limit from "${oldSlots}" to "${newSlots}".`)
                                interaction.reply({ embeds: [createEmbed(`Channel user limit has been set to \`${newSlots}\`.`, "Green")], ephemeral: true });
                            })
                            .catch(console.error);
                    } else {
                        console.log(`${interaction.user.tag} tried to change the channel "${voiceChannel.name}" user limit but it was already set to "${newSlots}".`)
                        interaction.reply({ embeds: [createEmbed(`Channel user limit already set to \`${newSlots}\`.`, "Red")], ephemeral: true });
                    }
                }
                break;
                case "visibility": {
                    const turnChoice = options.getString("turn");
                    switch(turnChoice) {
                        case "hide": {
                            voiceChannel.permissionOverwrites.edit(guild.id, { ViewChannel: false })
                            .then(vc => {
                                console.log(`${interaction.user.tag} has made channel "${voiceChannel.name}" invisible.`)
                                interaction.reply({ embeds: [createEmbed("This channel is now invisible.", "Green")], ephemeral: true  });
                            })
                            .catch(console.error);
                        }
                        break;
                        case "show": {
                            voiceChannel.permissionOverwrites.edit(guild.id, { ViewChannel: null })
                            .then(vc => {
                                console.log(`${interaction.user.tag} has made channel "${voiceChannel.name}" visible.`)
                                interaction.reply({ embeds: [createEmbed("This channel is now visible.", "Green")], ephemeral: true  });
                            })
                            .catch(console.error);
                        }
                        break;
                    }
                }
                break;
            }
        }
    }
}

function createEmbed(description, color){
    return new EmbedBuilder().setDescription(description).setColor(color);
}


module.exports = {
    data: slashCommandData,
    execute: slashCommandFunction,
}