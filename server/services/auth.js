const mongoose = require('mongoose');
const passport = require('passport');
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer');
const NODEMAILER_AUTH = require('../nodemailer-auth.js');
const axios = require('axios');

const User = mongoose.model('user');

// SerializeUser is used to provide some identifying token that can be saved
// in the users session.  We traditionally use the 'ID' for this.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// the user object.  This object is placed on 'req.user'.
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Instructs Passport how to authenticate a user using a locally saved email
// and password combination.  This strategy is called whenever a user attempts to
// log in.  We first find the user model in MongoDB that matches the submitted email,
// then check to see if the provided password matches the saved password. There
// are two obvious failure points here: the email might not exist in our DB or
// the password might not match the saved one.  In either case, we call the 'done'
// callback, including a string that messages why the authentication process failed.
// This string is provided back to the GraphQL client.
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false, 'Invalid Credentials'); }
        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, 'Invalid credentials.');
        });
    });
}));

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!
function signup({ email, password, req }) {
    const user = new User({ email, password });
    if (!email || !password) { throw new Error('You must provide an email and password.'); }

    return User.findOne({ email })
        .then(existingUser => {
            if (existingUser) { throw new Error('Email in use'); }
            return user.save();
        })
        .then(user => {
            return new Promise((resolve, reject) => {
                req.logIn(user, (err) => {
                    if (err) { reject(err); }
                    resolve(user);
                });
            });
        });
}

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.
function login({ email, password, req }) {
    return new Promise((resolve, reject) => {
        passport.authenticate('local', (err, user) => {
            if (!user) { reject('Invalid credentials.') }

            req.login(user, () => resolve(user));
        })({ body: { email, password } });
    });
}

//Forgot password. Test unit
const forgot = ({ email, req}) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(20, (err, buf) => {
            if(err) { throw new Error ('no random token');}
            const token = buf.toString('hex');
            resolve(token);
        })
    })
        .then(token => {
            return new Promise((resolve, reject) => {
                User.findOne({ email })
                    .then(existingUser => {
                        if(!existingUser){reject('No account with that email address exists!')}
                        // console.log(existingUser);
                        return existingUser;
                    })
                    .then(existingUser => {
                        console.log('token test ', token);
                        console.log('first time existing user ', existingUser.email);
                        existingUser.resetPasswordToken = token;
                        existingUser.resetPasswordExpires = Date.now() + 3600000;
                        resolve(existingUser.save());
                    })
            })
        })
        .then(existingUser => {
                const { resetPasswordToken, email } = existingUser;
                console.log(resetPasswordToken);
                console.log(email);
                // console.log(req.headers);
                const smtpTransporter = nodemailer.createTransport({
                    service: 'Mailgun',
                    auth: {
                        user: NODEMAILER_AUTH.user,
                        pass: NODEMAILER_AUTH.pass
                    }
                });
                const mailOptions = {
                    from: 'passwordreset@demo.com',
                    to: email,
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + resetPasswordToken + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                return smtpTransporter.sendMail(mailOptions, (error, info) => {
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                });
        })

};

//reset link test unit
const reset = ({ token, req }) => {
    return User.findOne({ token })
        .then(user => {
            return user
        })
};


module.exports = { signup, login, forgot, reset };