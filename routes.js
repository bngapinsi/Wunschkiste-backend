const express = require('express');
const router = express.Router();
const Wunsch = require('./models/wunsch');

// get all wuensche
router.get('/wuensche', async(req, res) => {
    const allWuensche = await Wunsch.find();
    console.log(allWuensche);
    res.send(allWuensche);
});

// post one wunsch
router.post('/members', async(req, res) => {
    const newWunsch = new Wunsch({
        titel: req.body.titel,
        kategorie: req.body.lastname,
        preis: req.body.email,
        link: req.body.ipaddress,
        bildUrl: req.body.bildUrl,
        notiz: req.body.notiz
    })
    await newWunsch.save();
    res.send(newWunsch);
});


module.exports = router;