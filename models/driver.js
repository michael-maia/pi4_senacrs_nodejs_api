const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
    fullName: String,
    nationality: String,
    carNumber: Number,
    championshipsVictories: Number,
    raceVictories: Number,
    teams: {type: 'ObjectId', ref: 'Team'}
});

module.exports = mongoose.model('Driver', DriverSchema);
