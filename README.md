[![NPM](https://nodei.co/npm/discord-giveaway.png)](https://nodei.co/npm/discord-giveaway/)

# discord-giveaway
A package for giveaways and drops.
# Drops
Go [here](https://github.com/Gav-King/discord-giveaway/blob/master/README.md#how-to-use-drops) to see how to use the drops.
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
});
```

# How to Use Drops
First, you need to create a new DropCreator.
```js
const Discord = require('discord.js');
const client = new Discord.Client();
const Giveaway = require('discord-giveaway');
const DropCreator = new Giveaway.DropCreator(client, 'mongodb://...');
```

# Drop Methods
##### createDrop(options)
Creates a drop. **Example**:
```js
const channel = message.mentions.channels.first();
const newDrop = await DropCreator.createDrop({
    prize: 'Discord Nitro',
    guildId: message.guild.id,
    channelId: channel.id,
    createdBy: message.author.id
});

message.channel.send(`Created a drop in ${channel}. The prize is **${newDrop.prize}**`);
```

##### deleteDrop(guildId, position)
Deletes a drop. Find the position by using the listDrops() method.
```js
const args = message.content.split(' ').slice(1);

const deleted = await DropCreator.deleteDrop(message.guild.id, parseInt(args[0]));

if (!deleted) {
    return message.channel.send('Doesn\'t exist :/');
}

message.channel.send('Deleted the Drop');
```

##### listDrops(guildId)
Lists all the drops in a guild.
```js
const { MessageEmbed } = require('discord.js');
const list = await DropCreator.listDrops(message.guild.id);

if (!list) {
    return message.channel.send('No Drops :/');
}

const mapped = list.map(i => `**${i.position}.** Channel: ${i.channel} | Prize: ${i.prize}`);

const embed = new MessageEmbed()
.setTitle('List of Drops')
.setDescription(`${mapped.join('\n')}`)
.setColor(message.guild.me.roles.highest.hexColor)
.setFooter(client.user.tag, client.user.displayAvatarURL({ format: 'png', size: 512 }));

message.channel.send(embed);
```
