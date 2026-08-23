const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    titel: String,
    kategorie: String,
    preis: Number,
    link: String,
    bildUrl: String,
    notiz: String
}, {
    toJSON: {virtuals: true}
});

module.exports = mongoose.model('Wunsch', schema);