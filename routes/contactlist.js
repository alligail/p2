const express = require('express')
const router = express.Router();

const logged_in = (req,res,next) => {
    if(req.session.user){
        next();
    }else{
        res.status(401).send("Not Authorized");
    }
}

router.get('/', async (req, res) => {
    const userId = req.session.user ? req.session.user.id : -1;

    const list = await req.db.findContactList();

    if(list != undefined){
        res.render('home', {contacts: list});
        return;
    }

    res.render('home');

});

router.post('/', async(req,res) => {
    
})

router.get('/create', async (req, res) => {
    //display the home page of the website
    res.render('create');
});

router.post('/create', async(req,res) => {
    const firstname = req.body.first.trim(); 
    const lastname = req.body.last.trim(); 
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const street = req.body.street.trim();
    const city = req.body.city.trim();
    const state = req.body.state.trim();
    const zip = req.body.zip.trim(); 
    const country = req.body.country.trim();
    const byPhone = (req.body.contact_by_phone !== undefined) ? 1 : 0; 
    const byEmail = (req.body.contact_by_email !== undefined) ? 1 : 0; 
    const byMail = (req.body.contact_by_mail !== undefined) ? 1 : 0; 

    const id = await req.db.createContact(firstname, lastname, phone, email, city, street, state, zip, country, byEmail, byPhone, byMail);
    console.log(req.db.findContactById(id));

    const list = await req.db.findContactList();
    //[TEST]
    console.log(list);

    res.redirect('/');
})

router.get('/:id', async(req,res) => {
    //When id isn't a number
    if(req.params.id === 'favicon.ico'){
        console.log(req.params.id);
        return;
    }

    const id = await req.db.findContactById(req.params.id);
    res.render('contactinfo', {contact: id});
})
router.post('/:id', async(req,res) => {
    const id = await req.db.findContactById(req.params.id);
    res.render('contactinfo', {contact: id});
})

router.get('/:id/edit', logged_in, async(req,res) => {
    const id = await req.db.findContactById(req.params.id); 
    console.log(id);
    res.render('edit', {contact: id});
})

router.post('/:id/edit', logged_in, async(req,res) => {
    //Editing a contact 
    console.log('inside post(/:id/edit)');
    
    const id = await req.db.findContactById(req.params.id);
    console.log(id);

    //check which input fields have changed
    const firstname = req.body.first.trim(); 
    const lastname = req.body.last.trim(); 
    const phone = req.body.phone.trim();
    const email = req.body.email.trim();
    const street = req.body.street.trim();
    const city = req.body.city.trim();
    const state = req.body.state.trim();
    const zip = req.body.zip.trim(); 
    const country = req.body.country.trim();
    const byPhone = (req.body.contact_by_phone !== undefined) ? 1 : 0; 
    const byEmail = (req.body.contact_by_email !== undefined) ? 1 : 0; 
    const byMail = (req.body.contact_by_mail !== undefined) ? 1 : 0; 

    //Comparing value of the textbox to the value stored in the database
    if(firstname !== id.firstname){
        const changeFirst = await req.db.updateContact(req.params.id, 'firstname', firstname);
    }
    if(lastname !== id.lastname){
        const changeLast = await req.db.updateContact(req.params.id, 'lastname', lastname);
    }
    if(phone !== id.phonenumber){
        const changePhone = await req.db.updateContact(req.params.id, 'phonenumber', phone);
    }
    if(email !== id.email){
        const changeEmail = await req.db.updateContact(req.params.id, 'email', email);
    }
    if(street !== id.street){
        const changeStreet= await req.db.updateContact(req.params.id, 'street', street);
    }
    if(city !== id.city){
        const changeCity = await req.db.updateContact(req.params.id, 'city', city);
    }
    if(state !== id.state){
        const changeState = await req.db.updateContact(req.params.id, 'state', state);
    }
    if(zip !== id.zip){
        const changeZip = await req.db.updateContact(req.params.id, 'zip', zip);
    }
    if(country !== id.country){
        const changeCountry = await req.db.updateContact(req.params.id, 'country', country);
    }
    if(byPhone !== id.contactbyphone){
        const changeByPhone = await req.db.updateContact(req.params.id, 'contactbyphone', byPhone);
    }
    if(byEmail !== id.contactbyemail){
        const changeByPhone = await req.db.updateContact(req.params.id, 'contactbyemail', byEmail);
    }
    if(byMail !== id.contactbymail){
        const changeByPhone = await req.db.updateContact(req.params.id, 'contactbymail', byMail);
    }

    //Retrieving the newly updated user
    const newId = await req.db.findContactById(req.params.id);
    res.render('contactinfo', {contact: newId});
})

router.get('/:id/delete', logged_in, async(req,res) => {
    const id = await req.db.findContactById(req.params.id);
    res.render('delete', {contact:id});
})

router.post('/:id/delete', logged_in, async(req,res) => {
    const id = await req.db.findContactById(req.params.id);
    const deletedContact = await req.db.deleteContact(req.params.id);
    res.redirect('/');
})

module.exports = router;