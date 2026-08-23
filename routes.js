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
router.post('/wuensche', async(req, res) => {
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


module.exports = router;