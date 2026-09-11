const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const Wunsch = require('./models/wunsch');
const User = require('./models/user');
var jwt = require('jsonwebtoken');

// get all wuensche
router.get('/wuensche', async(req, res) => {
    /* ------------------ check if caller is logged in    ---- start --------------------- */
    console.log('request headers: ', req.headers)
    const token = req.headers['authorization'];
    const callerusername = req.headers['username'];

    if(!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, callerusername)
        console.log('decoded : ', decoded)

    } catch(err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    /* ------------------ check if caller is logged in    ---- end --------------------- */

    /* ------- if caller is logged in , then do the following --------------------------- */

    const allWuensche = await Wunsch.find();
    console.log(allWuensche);
    res.send(allWuensche);
});

// post one wunsch
router.post('/wuensche', async(req, res) => {
        /* ------------------ check if caller is logged in    ---- start --------------------- */
    console.log('request headers: ', req.headers)
    const token = req.headers['authorization'];
    const callerusername = req.headers['username'];

    if(!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, callerusername)
        console.log('decoded : ', decoded)

    } catch(err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    /* ------------------ check if caller is logged in    ---- end --------------------- */

    /* ------- if caller is logged, then do the following --------------------------- */
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
        /* ------------------ check if caller is admin    ---- start --------------------- */
    console.log('request headers: ', req.headers)
    const token = req.headers['authorization'];
    const callerusername = req.headers['username'];

    if(!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, callerusername)
        console.log('decoded : ', decoded)

    } catch(err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    /* ------------------ check if caller is admin    ---- end --------------------- */

    /* ------- if caller is admin, then do the following --------------------------- */
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
        /* ------------------ check if caller is admin    ---- start --------------------- */
    console.log('request headers: ', req.headers)
    const token = req.headers['authorization'];
    const callerusername = req.headers['username'];

    if(!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, callerusername)
        console.log('decoded : ', decoded)

    } catch(err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    /* ------------------ check if caller is admin    ---- end --------------------- */

    /* ------- if caller is admin, then do the following --------------------------- */
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
        /* ------------------ check if caller is admin    ---- start --------------------- */
    console.log('request headers: ', req.headers)
    const token = req.headers['authorization'];
    const callerusername = req.headers['username'];

    if(!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, callerusername)
        console.log('decoded : ', decoded)

    } catch(err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    /* ------------------ check if caller is admin    ---- end --------------------- */

    /* ------- if caller is admin, then do the following --------------------------- */
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

// get all users
router.get('/user', async(req, res) => {

    /* ------------------ check if caller is admin    ---- start --------------------- */
    console.log('request headers: ', req.headers)
    const token = req.headers['authorization'];
    const callerusername = req.headers['username'];

    if(!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, callerusername)
        console.log('decoded : ', decoded)

        const check = await User.findOne({ benutzername: decoded.benutzername})
        console.log('check ', check)
        if(check.role!='admin') {
            return res.status(401).send({ message: 'you are not an admin' });
        }

    } catch(err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    /* ------------------ check if caller is admin    ---- end --------------------- */

    /* ------- if caller is admin, then do the following --------------------------- */
    const query = {};

    try {
        const result = await User.find(query)
        console.log(result)
        res.status(200)
        res.send(result);
    } catch (err) {
        console.log(err.stack)
    }
});

// get one user bei username
router.get('/user/:benutzername', async(req, res) => {

    /* ------------------ check if caller is admin    ---- start --------------------- */
    console.log('request headers: ', req.headers)
    const token = req.headers['authorization'];
    const callerusername = req.headers['username'];

    if(!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, callerusername)
        console.log('decoded : ', decoded)

        const check = await User.findOne({ benutzername: decoded.benutzername})
        console.log('check ', check)
        if(check.role !='admin') {
            return res.status(401).send({ message: 'you are not an admin' });
        }

    } catch(err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    /* ------------------ check if caller is admin    ---- end --------------------- */

    /* ------- if caller is admin, then do the following --------------------------- */
    const query = `SELECT * FROM users WHERE username = $1`;

    try {
        const benutzername = req.params.benutzername;
        const result = await User.findOne({ benutzername: benutzername})
        if(user) {
            res.status(200)
            res.send(user);
        } else {
            res.status(404)
            res.send({message: `user with benutzername ${benutzername} does not exist`});
        }
    } catch (err) {
        console.log(err.stack)
    }
});

// put ({username, oldpassword, newpassword}) - changepassword
router.put('/changepassword', async(req, res) => {
    let benutzername = req.body.benutzername;
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;

    let hashPassword = await bcrypt.hash(newpassword, 10);
    console.log('hash : ', hashPassword)

    const user = await User.findOne({ benutzername: benutzename}); 
    if(user) {
        const match = await bcrypt.compare(oldpassword, user.passwort);
        if(match) {
            user.benutzername = benutzername;
            user.passwort = hashPasswort;

            const updateresult = await user.save();
            console.log('updateresult : ', updateresult)
            res.status(200)
            res.send(updateresult)
        }
        else {
            res.status(401)
            res.send({ message: "benutzername/passwort falsch"})
        }
    } else {
        res.status(401)
        res.send({ message: "benutzername/passwort falsch"})
    }
})

router.put('/setadmin', async(req, res) => {

    /* ------------------ check if caller is admin    ---- start --------------------- */
    console.log('request headers: ', req.headers)
    const token = req.headers['authorization'];
    const callerusername = req.headers['username'];

    if(!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, callerusername)
        console.log('decoded : ', decoded)

        const check = await User.findOne({benutzername: decoded.benutzername})
        console.log('check ', check)
        if(check.role!='admin') {
            return res.status(401).send({ message: 'you are not an admin' });
        }

    } catch(err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    /* ------------------ check if caller is admin    ---- end --------------------- */

    /* ------- if caller is admin, then do the following --------------------------- */
    let benutzername = req.body.benutzername;

    const user= await User.findOne({ benutzername: benutzername }); 
    user.role='admin';
     
    

    const updateresult = await user.save();
    console.log('updateresult : ', updateresult)
    res.status(200)
    res.send(updateresult)
})

// delete one user via id
router.delete('/:id', async(req, res) => {

    /* ------------------ check if caller is admin    ---- start --------------------- */
    console.log('request headers: ', req.headers)
    const token = req.headers['authorization'];
    const callerusername = req.headers['username'];

    if(!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, callerusername)
        console.log('decoded : ', decoded)

        const check = await db.query({ benutzername: decoded.benutzername })
        console.log('check ', check)
        if(check.role!='admin') {
            return res.status(401).send({ message: 'you are not an admin' });
        }

    } catch(err) {
        return res.status(401).send({ message: 'Invalid token' });
    }
    /* ------------------ check if caller is admin    ---- end --------------------- */

    /* ------- if caller is admin, then do the following --------------------------- */
    try {
        const id = req.params.id;
        const result = await User.deleteOne({_id: id})
        console.log(result)
        if (result.deletedCount == 1)
            res.send({ message: "User with id=" + id + " deleted" });
        else {
            res.status(404)
            res.send({ message: "No user found with id=" + id });
        }
    } catch (err) {
        console.log(err.stack)
    } 
});


module.exports = router;