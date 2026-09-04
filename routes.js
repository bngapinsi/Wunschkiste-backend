const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const Wunsch = require('./models/wunsch');
const User = require('./models/user');
var jwt = require('jsonwebtoken');

// get all wuensche
router.get('/wuensche', async(req, res) => {
    const allWuensche = await Wunsch.find();
    console.log(allWuensche);
    res.send(allWuensche);
});

// post one wunsch
router.post('/wuensche', async(req, res) => {
    const newWunsch = new Wunsch({
        titel: req.body.titel,
        kategorie: req.body.lastname,
        preis: req.body.email,
        link: req.body.ipaddress,
        bildUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        notiz: req.body.notiz
    })
    await newWunsch.save();
    res.send(newWunsch);
});

// get one wunsch via id
router.get('/wuensche/:id', async(req, res) => {
    try {
            const wunsch = await Wunsch.findOne({ _id: req.params.id });
            console.log('parameter: ', req.params);
            res.status(200)
            res.send(wunsch);
    } catch {
        res.status(404);
        res.send({
            error: "Wunsch does not exist!"
        });
    }
})

// update one wunsch
router.patch('/wuensche/:id', async(req, res) => {
    try {
        const wunsch = await Wunsch.findOne({ _id: req.params.id })

        if (req.body.titel) wunsch.titel = req.body.titel
        if (req.body.kategorie)  wunsch.kategorie = req.body.kategorie
        if (req.body.preis !== undefined)     wunsch.preis = req.body.preis
        if (req.body.link) wunsch.link = req.body.link
        if (req.file) wunsch.bildUrl = `/uploads/${req.file.filename}`
        if (req.body.notiz) wunsch.notiz = req.body.notiz

        await Wunsch.updateOne({ _id: req.params.id }, wunsch);
        res.send(wunsch)
    } catch {
        res.status(404)
        res.send({ error: "Wunsch does not exist!" })
    }
});

// delete one wunsch via id
router.delete('/wuensche/:id', async(req, res) => {
    try {
        const result = await Wunsch.deleteOne({ _id: req.params.id })
        res.status(204)
        res.send()
    } catch {
        res.status(404)
        res.send({ error: "Wunsch does not exist!" })
    }
});

//registrieren
router.post('/registrieren', async(req, res) => {
    const check = await User.findOne({ benutzername: req.body.benutzername });
    if (check) {
        res.status(401);
        res.send({ error:`Benutzername ${req.body.benutzername} existiert bereits. `});
    }
    else {
        const hashPasswort = await bcrypt.hash(req.body.passwort, 10);

        const newUser = new User({
        benutzername: req.body.benutzername,
        vorname: req.body.vorname,
        nachname: req.body.nachname,
        passwort: hashPasswort
    });
    await newUser.save();
    res.status(201);
    res.send(newUser);
    }
    
});

//anmelden
router.post('/anmelden', async(req, res) => {
    const user = await User.findOne({
        benutzername: req.body.benutzername
    });
    if (user) {
        const match = await bcrypt.compare(req.body.passwort, user.passwort);
        if (match) {
            const userOhnePasswort = {
                id: user._id,
                benutzername: user.benutzername,
                vorname: user.vorname,
                nachname: user.nachname
            };
            const token = jwt.sign(userOhnePasswort, user.benutzername);
            res.status(200);
            res.send({ token: token, user: userOhnePasswort});
        } else {
            res.status(401);
        res.send({ error: "Benutzername oder Passwort falsch."});
        }
    } else {
        res.status(401);
        res.send({ error: "Benutzername oder Passwort falsch."});
    }
});


module.exports = router;