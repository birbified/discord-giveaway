const mongoose = require('mongoose');

const DropSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    prize: String,
    createdBy: String,
    timeCreated: Date
});

module.exports = mongoose.model('Drop', DropSchema);