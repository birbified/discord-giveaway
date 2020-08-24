const scheduler = require('node-schedule');
const GiveawayModel = require('../models/GiveawayModel');

function getWinner(users, max) {
    if (users.length <= max) return users;

    const numbers = new Set();
    const array = [];
    let i = 0;
    while(i < max) {
        const random = Math.floor(Math.random() * users.length);

        const selected = users[random];
        if (!numbers.has(random)) {
            array.push(selected);
            i++
        }
    }
    return array;
}

async function schedule(client, giveawayArray) {
    for(let i = 0; i < giveawayArray.length; i++) {
        let { messageId, channelId, endsOn, hostedBy, prize, winners } = giveawayArray[i];

        scheduler.scheduleJob(`${messageId}`, endsOn, async () => {
            const channel = client.channels.cache.get(channelId);

            if (channel) {
                const message = await channel.messages.fetch(messageId);
                
                if (message) {
                    const { embeds, reactions } = message;
                    const reaction = reactions.cache.get('🎉');
                    const users = await reaction.users.fetch();
                    const entries = users.filter(user => !user.bot).array();

                    if (embeds.length === 1) {
                        const embed = embeds[0];
                        const winner = getWinner(entries, winners);
                        const finalWinners = winner.map(user => user.toString()).join(', ');
                        embed.setDescription(`🎖️ Winner(s): ${finalWinners}`);
                        embed.setFooter(client.user.username, client.user.displayAvatarURL({ format: 'png', size: 512 }));
                        await message.edit(embed);
                        message.channel.send(`Congratulations ${winner}, you won the **${prize}**!\n**ID**: \`${messageId}\`\n${message.url}`);
                        endGiveaway(messageId);
                    }
                }
            }
        });
    }
}

async function endGiveaway(messageId) {
    let data = await GiveawayModel.findOne({ messageId: messageId });

    data.hasEnded = 'True';

    await data.save();
}

module.exports = {
    getWinner,
    schedule,
    endGiveaway
}