[![NPM](https://nodei.co/npm/discord-giveaway.png)](https://nodei.co/npm/discord-giveaway/)

# discord-giveaway
A package for giveaways and drops.
# Examples
[![Giveaway](/examples/giveaway.png)](/examples/giveaway.png) [![Drop](/examples/drop.png)](/examples/drop.png)
# Start
Start by creating a new GiveawayCreator.
```js
const { Client } = require('discord.js');
const client = new Client();
const { GiveawayCreator } = require('discord-giveaway');
const Creator = new GiveawayCreator(client, 'mongodb://...');

client.giveaways = Creator; // Access the Creator from anywhere.
```
# All Methods
##### startGiveaway(options)
Creates a giveaway. **Example**:
```js
client.on('message', async message => {
    if (message.content.startsWith('!create')) {
        const channel = message.mentions.channels.first();
        await client.giveaways.startGiveaway({
            prize: 'Discord Nitro Classic',
            channelId: channel.id,
            guildId: message.guild.id,
            duration: 30000, // 30 Seconds
            winners: 1, // 1 winner
            hostedBy: message.author.id
        });
    }
});
```

##### endGiveaway(messageId)
Ends a giveaway. **Example**:
```js
client.on('message', async message => {
    if (message.content.startsWith('!end')) {
        const args = message.content.split(' ').slice(1);
        const ended = await client.giveaways.endGiveaway(args.join(' '));
        
        if (!ended) {
            return message.channel.send('This giveaway has already ended');
        }
        else {
            message.channel.send('Ended the giveaway');
        }
    }
});
```

##### rerollGiveaway(messageId)
Rerolls a giveaway. **Example**:
```js
client.on('message', async message => {
    if (message.content.startsWith('!end')) {
        const args = message.content.split(' ').slice(1);
        const rerolled = await client.giveaways.rerollGiveaway(args.join(' '));
        
        if (!rerolled) {
            return message.channel.send('This giveaway hasn\'t ended');
        }
        else {
            message.channel.send('Rerolled the giveaway');
        }
    }
});
```

##### listGiveaways(guildId)
```js
const prettyMilliseconds = require('pretty-ms'); // npm i pretty-ms

client.on('message', async message => {
    if (message.content.startsWith('!list')) {
        const list = await client.giveaways.listGiveaways(message.guild.id);
        
        if (!list) {
            return message.channel.send('No active giveaways.');
        } else {
            message.channel.send(`${list.map(i => `\`${i.messageId}\` - **${i.prize}** | ${prettyMilliseconds(i.timeRemaining)} | Host: **${i.hostedBy}**`).join('\n')}`)
        }
    }
});```
