const { Events } = require('discord.js');

const moveWebhookId = process.env.MOVE_WEBHOOK_ID;
const moveFromChannelId = process.env.MOVE_FROM_CHANNEL_ID;
const moveToChannelId = process.env.MOVE_TO_CHANNEL_ID;


module.exports = {
    name: Events.MessageCreate,
    description: "Emitted when a new message has been sent in a channel.",
    once: false,
    async execute(client, message) {
        
        // Move members in moveFromChannel to moveToChannel on message from webhook
        if (message.webhookId == moveWebhookId && message.channelId == moveFromChannelId) {
            console.log(`A message from ${message.author.username} in channel ${message.channel.name}`);            
            message.guild.channels.fetch(moveToChannelId)
                .then(moveToChannel => {
                    message.channel.members.forEach(member => {
                        console.log(`Moving ${member.user.username} to channel: ${moveToChannel.name}`);
                        setTimeout(() => member.voice.setChannel(moveToChannel), 100);
                    });
                })
                .catch(console.error);
                
            message.delete()
                .then(msg => console.log(`Deleted message from ${msg.author.username}`))
                .catch(console.error);
        }
    },
};
