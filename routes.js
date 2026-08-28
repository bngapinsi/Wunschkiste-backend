const express = require('express');
const router = express.Router();
const Wunsch = require('./models/wunsch');
const User = require('./models/user');

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
    const newUser = new User({
        benutzername: req.body.benutzername,
        vorname: req.body.vorname,
        nachname: req.body.nachname,
        passwort: req.body.passwort
    })
    await newUser.save();
    res.send(newUser);
});

//anmelden
router.post('/anmelden', async(req, res) => {
    const user = await User.findOne({
        benutzername: req.body.benutzername,
        passwort: req.body.passwort
    });
    if (user) {
        res.status(200);
        res.send(user);
    } else {
        res.status(401);
        res.send({ error: "Benutzername oder Passwort falsch."});
    }
});


module.exports = router;