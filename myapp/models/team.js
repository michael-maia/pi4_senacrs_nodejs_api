// Importando biblioteca Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definindo o formato do Schema
const TeamSchema = new Schema({
    fullName: String,
    country: String,
    firstYearEntry: Number,
    racesEntered: Number,
    raceVictories: Number,
    constructorsChampionships: Number
});

// Exportar o Schema para ser utilizado em outros arquivos
module.exports = mongoose.model('Team', TeamSchema);
