/**
 * Wrapper class for the database 
 */

require('dotenv').config();
//[testing]
// console.log(process.env.DBPATH);
const Database = require('dbcmps369');

class ContactDB{
    constructor() {
        this.db = new Database();
    }

    async initialize() {
        await this.db.connect();

        await this.db.schema('Users', [
            {name: 'id', type: 'INTEGER'},
            {name: 'firstname', type: 'TEXT'},
            {name: 'lastname', type: 'TEXT'},
            {name: 'username', type: 'TEXT'},
            {name: 'password', type: 'TEXT'}
        ], 'id');

        await this.db.schema('Contact', [
            {name: 'id', type: 'TEXT'},
            {name: 'firstname', type:'TEXT'},
            {name: 'lastname', type: 'TEXT'},
            {name: 'phonenumber', type: 'TEXT'},
            {name: 'email', type: 'TEXT'},
            {name: 'street', type: 'TEXT'},
            {name: 'city', type: 'TEXT'},
            {name: 'state', type: 'TEXT'},
            {name: 'zip', type: 'TEXT'},
            {name: 'country', type: 'TEXT'},
            {name: 'contactbyemail', type: 'INTEGER'},
            {name: 'contactbyphone', type: 'INTEGER'},
            {name: 'contactbymail', type: 'INTEGER'}
        ], 'id')
    }

    async findContactByEmail(email){
        const cEmail = await this.db.read('Contact', [{column: 'Email', value: email}]);
        if(cEmail.length > 0){
            return cEmail[0];
        }else{
            return undefined;
        }
    }

    async findUserbyUserName(username){
        const uName = await this.db.read('Users', [{column: 'username', value: username}]);
        if(uName.length > 0){
            return uName[0];
        }else{
            return undefined; 
        }
    }

    async findUserById(id) {
        const us = await this.db.read('Users', [{ column: 'id', value: id }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async createUser(fName, lName, username, password){
        const id = await this.db.create('Users', [
            { column: 'firstname', value: fName },
            { column: 'lastname', value: lName },
            { column: 'username', value: username },
            { column: 'password', value: password }
        ])
        return id;
    }

    async createContact(fName, lName, phoneNum, email, city, street, state, zip, country, byEmail, byPhone, byMail){
        const id = await this.db.create('Contact', [
            {column: 'firstname', value: fName},
            {column: 'lastname', value: lName},
            {column: 'phonenumber', value: phoneNum},
            {column: 'email', value: email},
            {column: 'street', value: street},
            {column: 'city', value: city},
            {column: 'state',value: state},
            {column: 'zip', value: zip},
            {column: 'country', value: country},
            {column: 'contactbyemail', value: byEmail},
            {column: 'contactbyphone', value: byPhone},
            {column: 'contactbymail', value: byMail}
        ])
    }

    async findContactById(id) {
        const us = await this.db.read('Contact', [{ column: 'id', value: id }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async findContactList(){
        const list = await this.db.read('Contact', []);
        return list;
    }

    async deleteContact(id){
        const deletedContact = await this.db.delete('Contact', [{ column: 'id', value: id}]);
        return deletedContact;
    }

    async updateContact(id, col, val){
        const changeData = await this.db.update('Contact',[{column: col, value: val}], [{ column: 'id', value: id}]);
        return changeData;
    }
}

module.exports = ContactDB;