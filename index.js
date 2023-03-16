const pug = require('pug');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

//Database setup 
const Database = require('./ContactDB');
const db = new Database();
db.initialize();

const app = express();
app.locals.pretty = true;
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'pug');
app.use((req, res, next) => {
    req.db = db;
    next();
})

app.use(session({
    secret: 'cmps369',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.use((req,res,next) => {
    if(req.session.user){
        res.locals.user = {
            fName: req.session.user.firstname,
            lName: req.session.user.lastname
        }
    }
    next();
})

app.use(async (req, res, next) => {
    const username = 'cmps369';
    console.log('Checking for username: cmps369...');
    const user = await req.db.findUserbyUserName(username);
    if(user === undefined){
        //Creating the username if it doesn't exist
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync('rcnj', salt);
        const fName = 'admin(cmps369)';
        const lName = 'admin';
        const createUser = await req.db.createUser(fName, lName, username, password);
    }
    next();
});

app.use('/', require('./routes/accounts'));
app.use('/', require('./routes/contactlist'));


app.listen(3000, () => {
    console.log("Program is running...");
})