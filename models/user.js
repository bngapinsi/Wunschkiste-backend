const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    benutzername: String,
    vorname: String,
    nachname: String,
    passwort: String
}, {
    toJSON: {virtuals: true}
});

module.exports = mongoose.model('User', schema);