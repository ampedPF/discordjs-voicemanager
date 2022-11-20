const { Events, VoiceState, ChannelType, PermissionFlagsBits } = require("discord.js");
const joinToCreateChannelIds = process.env.JOIN_TO_CREATE_CHANNEL_IDS.split(" ");


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
            console.log(`Voice channel "${oldChannel.name}" created by ${member.user.tag} has been deleted.`);
        }
        
        // Create owned channel
        if (oldChannel !== newChannel && newChannel && joinToCreateChannelIds.includes(newChannel.id)) {
            const voiceChannel = await guild.channels.create({
                name: member.user.tag,
                type: ChannelType.GuildVoice,
                parent: newChannel.parent,
                permissionOverwrites: [
                    { id: member.id, allow: [PermissionFlagsBits.Connect] },
                    { id: guild.id, deny: [PermissionFlagsBits.Connect] }
                ]
            });

            client.voiceGenerator.set(member.id, voiceChannel.id);
            
            await newChannel.permissionOverwrites.edit(member, { Connect: false });
            setTimeout(() => newChannel.permissionOverwrites.delete(member), 30 * 1000);
            
            console.log(`Voice channel ${voiceChannel.name} created by ${member.user.tag}.`);
            setTimeout(() => member.voice.setChannel(voiceChannel), 500);
        }
        
        //////////////////////////////////////////////////////////////////
        // End of 'joinToCreate'
        //////////////////////////////////////////////////////////////////
    }
};