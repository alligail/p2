const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/logout', async(req,res) => {
    req.session.user = undefined; 
    res.redirect('/');
})

router.get('/login', async (req, res) => {
    res.render('login', {hide_signup: true});
});

router.post('/login', async(req,res) => {
    const userName = req.body.username.trim();
    const password = req.body.password.trim();

    const user = await req.db.findUserbyUserName(userName);
    if(user && bcrypt.compareSync(password, user.password)){
        req.session.user = user;
        res.redirect('/');
        return;
    }else{
        res.render('login', {hide_signup: true, message: 'Sorry, could not sign you in...'});
        return;
    }
})

router.get('/signup', async (req, res) => {
    res.render('signup', {hide_signup: true});
});

router.post('/signup', async(req,res) => {
    const fName = req.body.first.trim(); 
    const lName = req.body.last.trim(); 
    const userName = req.body.username.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();

    //Checking that the password and confirm passwaord matches
    if(p1 != p2){
        res.render('signup', {hide_signup: true, message: "Your passwords do not match!"});
        return;
    }

    //Checking that the username entered doesn't already exist 
    const checkUserName = await req.db.findUserbyUserName(userName);
    if(checkUserName){
        res.render('signup', {hide_signup: true, message: 'This account already exists!'});
        return;
    }

    //hashing the password 
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(p1, salt);
    
    //adding the user to the database of users
    const id = await req.db.createUser(fName, lName, userName, hash);
    req.session.user = await req.db.findUserById(id);

    //[TEST] Printing info on user who signed up
    console.log(req.session.user);

    //goes back to the home page 
    res.redirect('/');
})

module.exports = router;