const mongoose = require('mongoose');
const Discord = require('discord.js');
const DropModel = require('../models/DropModel');

mongoose.set('useFindAndModify', false);

class DropCreator {
    /**
     * 
     * @param {Discord.Client} client - A discord.js client.
     * @param {string} url - A MongoDB connection string.
     */

    constructor(client, url = '') {
        if (!client) throw new Error("A client wasn't provided.");
        if (!url) throw new Error("A connection string wasn't provided.");

        this.client = client;

        this.mongoUrl = url;

        mongoose.connect(this.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.client.on('message', async message => {
            if (message.author.bot) return;
            if (message.channel.type === 'dm') return;

            const randomNumber = Math.round(Math.random() * 50);

            if (randomNumber === 25) {
                let Drops = await DropModel.find({ guildId: message.guild.id, channelId: message.channel.id });

                if (Drops.length < 1) return;

                const { guildId, channelId, prize, createdBy } = Drops[0];

                const guild = this.client.guilds.cache.get(guildId);
                const channel = guild.channels.cache.get(channelId);

                const DropEmbed = new Discord.MessageEmbed()
                .setTitle(`${prize}`)
                .setDescription(`First to React with 🎉 wins the prize.`)
                .setFooter(this.client.user.tag, this.client.user.displayAvatarURL({ size: 512, format: 'png' }))
                .setColor(guild.me.roles.highest.hexColor)
                .setTimestamp();

                const msg = await channel.send(DropEmbed);

                const filter = (reaction, user) => !user.bot && '🎉'.includes(reaction.emoji.name);
                const reaction = new Discord.ReactionCollector(msg, filter, { max: 1 });

                reaction.on('collect', (reaction, user) => {
                    const { embeds } = msg;

                    const embed = embeds[0];

                    embed.setTitle(`🎉 Drop Winner!`);
                    embed.setDescription(`${user.toString()} won \`${prize}\`.
                    Please contact ${this.client.users.cache.get(createdBy).toString()} to claim your prize!`);
                    
                    await msg.edit(embed);

                    await DropModel.findOneAndRemove({ guildId: message.guild.id, channelId: message.channel.id });
                });
            }
        });
    }
}

module.exports = DropCreator;