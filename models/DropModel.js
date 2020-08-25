const mongoose = require('mongoose');

const DropSchema = new mongoose.Schema({
    guildId: String,
    channelId: String,
    prize: String,
    createdBy: String
});

module.exports = mongoose.model('Drop', DropSchema);