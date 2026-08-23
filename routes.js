const express = require('express');
const router = express.Router();
const Wunsch = require('./models/wunsch');

// get all wuensche
router.get('/wuensche', async(req, res) => {
    const allWuensche = await Wunsch.find();
    console.log(allWuensche);
    res.send(allWuensche);
});


module.exports = router;