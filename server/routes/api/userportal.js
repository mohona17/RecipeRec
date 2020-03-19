const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    //Get user session
    app.get('/api/usersession', (req, res, next) => {
        const { query } = req;
        const { usersession } = query;
        UserSession.findById(usersession, (err, session) => {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                res.send(session);
            }
        });
    });

    //Sign Up
    app.post('/api/account/signup', (req, res, next) => {
        //need items required in model 
        const { body } = req;
        const {
            firstName,
            lastName,
            password
        } = body;
        let {
            username
        } = body;
        let error = [];

        //Verifying all needed fields are present
        if (!firstName) error.push('First name cannot be blank. ')
        if (!lastName) error.push('Last name cannot be blank. ')

        if (!username) error.push('Username cannot be blank. ')
        if (!password) error.push(' Password cannot be blank. ')


        if (error.length != 0) {
            let message = '';
            error.forEach(element => {
                message = message.concat(element)
            });
            return res.send({ message: message });
        }

        username = username.toLowerCase();

        //Verify username does not already exist 
        User.find({
            username: username
        }, (err, previousUsers) => {
            if (err) return res.send({ message: 'Server error.' });
            //is a previous user with same username
            else if (previousUsers.length > 0) return res.send({ message: 'Account already exists with this username.' })
            else {
                //Save new user 
                const newUser = new User();

                newUser.firstName = firstName;
                newUser.lastName = lastName;
                newUser.username = username;
                newUser.password = newUser.generateHash(password);

                newUser.save((err, user) => {
                    if (!err) res.send({ message: 'success' });
                });
            }
        });


    });

    //Sign In
    app.post('/api/account/signin', (req, res, next) => {
        //need items required in model 
        const { body } = req;
        const {
            password
        } = body;
        let {
            username
        } = body;
        let error = [];

        //Checking if null
        if (!username) error.push('Username cannot be blank. ');
        if (!password) error.push('Password cannot be blank. ');

        if (error.length != 0) {
            let message = '';
            error.forEach(element => {
                message = message.concat(element)
            });
            return res.send({ message: message });
        }

        username = username.toLowerCase();

        //Verification
        User.find({
            username: username
        }, (err, users) => {
            if (err) {
                return res.send({ message: 'Error: Server error' });
            }
            // console.log(users);

            if (users.length != 1) {
                return res.send({ message: 'Invalid username' });
            }

            const user = users[0];
            // console.log(user.password);
            if (!user.validPassword(password)) {
                return res.send({ message: 'Invalid password' });
            }

            console.log("Login valid");

            //Login was valid!!
            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err) return res.send(err)
                return res.send({
                    message: 'success',
                    token: doc._id,
                });
            })
        })
    });

    //Verification 
    app.get('/api/account/verify', (req, res, next) => {
        //get token 
        const { query } = req;
        const { token } = query;

        //verify unique 
        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            //TODO a server error occurs when login session does not work

            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            // console.log(sessions)
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: No session found'
                });
            }
            else {
                return res.send({
                    success: true,
                    message: 'Session found'
                });
            }
        });
    });

    app.get('/api/account/logout', (req, res, next) => {
        const { query } = req;
        const { token } = query;

        console.log('request token', token);
        UserSession.findOneAndUpdate({
            _id: token,
            isDeleted: false
        }, { $set: { isDeleted: true } }, null, (err, sessions) => {
            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            // if (sessions._id == null) {
            if (sessions == null) {

                return res.send({
                    success: false,
                    message: 'Error: No session found'
                });
            }
            else {
                return res.send({
                    success: true,
                    message: 'Session found'
                });
            }
        });
    });

};