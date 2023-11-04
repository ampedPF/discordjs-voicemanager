const { Events, VoiceState, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { generateName } = require("../../functions/NameUtil");
const { getName } = require("../../functions/VoiceUtil");
const joinToCreateChannelIds = process.env.JOIN_TO_CREATE_CHANNEL_IDS.split(" ");
const moderatorsRoleId = process.env.MODERATORS_ROLE_ID;


module.exports = {
    name: Events.VoiceStateUpdate,
    description: "Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.",
    once: false,
    /**
     *
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    async execute(client, oldState, newState) {

        //////////////////////////////////////////////////////////////////
        // Start of 'joinToCreate'
        //////////////////////////////////////////////////////////////////
        // Create a voice channel when a user enters the specific channel
        // from config file and move them to the newly created channel.

        const { member, guild } = newState;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        
        // Delete owned channel
        const ownedChannelId = client.voiceGenerator.get(member.id);
        
        if (ownedChannelId && oldChannel.id == ownedChannelId && (!newChannel || newChannel.id !== ownedChannelId)) {
            client.voiceGenerator.set(member.id, null);
            oldChannel.delete().catch((err) => { console.log(err)} );
            console.log(`Voice channel "${oldChannel.name}" created by ${getName(member)} (${member.user.username}) has been deleted.`);
        }
        
        // Create owned channel
        if (oldChannel !== newChannel && newChannel && joinToCreateChannelIds.includes(newChannel.id)) {
            //console.log("member:", member);
            const voiceChannel = await guild.channels.create({
                //name: member.displayName,
                name: generateName(),
                type: ChannelType.GuildVoice,
                parent: newChannel.parent,
                permissionOverwrites: [
                    { id: moderatorsRoleId, allow: [PermissionFlagsBits.Connect] },
                    { id: moderatorsRoleId, allow: [PermissionFlagsBits.ManageChannels] },
                    { id: moderatorsRoleId, allow: [PermissionFlagsBits.ManageMessages] },
                    
                    { id: member.id, allow: [PermissionFlagsBits.Connect] },
                    { id: member.id, allow: [PermissionFlagsBits.SendMessages] },
                    { id: member.id, allow: [PermissionFlagsBits.UseApplicationCommands] },
                    
                    { id: guild.id, allow: [PermissionFlagsBits.Connect] },
                    { id: guild.id, allow: [PermissionFlagsBits.ReadMessageHistory] }
                ]
            });
            
            client.voiceGenerator.set(member.id, voiceChannel.id);
            
            await newChannel.permissionOverwrites.edit(member, { Connect: false });
            setTimeout(() => newChannel.permissionOverwrites.delete(member), 30 * 1000);
            
            console.log(`Voice channel "${voiceChannel.name}" created by ${getName(member)} (${member.user.username}).`);
            setTimeout(() => member.voice.setChannel(voiceChannel), 500);
            
            voiceChannel.send( {
                content: "> Change channel name",
                components: [new ActionRowBuilder().addComponents(client.buttons.get("channelNameChangeButton").data)]
            });

            const accessButtons = [...client.buttons.keys()]
                                    .filter((key) => key.includes('channelAccess'))
                                    .map(set => client.buttons.get(set).data);
            
            voiceChannel.send( {
                content: "> Change channel access",
                components: [new ActionRowBuilder().addComponents(accessButtons)]
            });
        }
        
        //////////////////////////////////////////////////////////////////
        // End of 'joinToCreate'
        //////////////////////////////////////////////////////////////////
    }
};