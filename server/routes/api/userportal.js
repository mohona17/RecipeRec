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
            email
        } = body;
        let error = [];

        //Verifying all needed fields are present
        if (!firstName) error.push('First name cannot be blank. ')
        if (!lastName) error.push('Last name cannot be blank.')

        //TODO: handle valid email
        if (!email) error.push('Email cannot be blank.')
        if (!password) error.push(' Password cannot be blank.')

        if (error.length != 0) {
            let message = '';
            error.forEach(element => {
                message = message.concat(element)
            });
            return res.send(message);
        }

        email = email.toLowerCase();

        //Verify email does not already exist 
        User.find({
            email: email
        }, (err, previousUsers) => {
            if (err) return res.send('Server error.');
            //is a previous user with same email
            else if (previousUsers.length > 0) return res.send('Account already exists with this email.')

            else {
                //Save new user 
                const newUser = new User();

                newUser.firstName = firstName;
                newUser.lastName = lastName;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);

                newUser.save((err, user) => {
                    if (!err) res.send('success');
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
            email
        } = body;

        console.log("password", password)
        //Checking if null
        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        };
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        };

        email = email.toLowerCase();

        //Verification
        User.find({
            email: email
        }, (err, users) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            // console.log(users);

            if (users.length != 1) {
                console.log("No account")
                return res.send({
                    success: false,
                    message: 'Error: Invalid email'
                });
            }

            const user = users[0];
            // console.log(user.password);
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid password'
                });
            }

            console.log("Login valid");

            //Login was valid!!
            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Server error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Sign in is valid',
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
        //get token 
        const { query } = req;
        const { token } = query;

        //I believe this works, but I had problems when I would delete an already deleted session
        //delete session
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
            if (sessions._id == null) {
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