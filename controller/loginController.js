const {User} = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10; // number of rounds for generating the salt

async function checkEmailExists(email) {
    // find a user with the email
    return await User.findOne({where: {email}});
}

exports.landing = (req, res, next) => {
    // Check if the user is logged in
    if (req.session.isAuth)
        // Redirect to the profile page if the user is logged in
        res.render('home', {title: "Ex6-home", userName: req.session.userName, includeScript: true});
    else
        // Render the login page if the user is not logged in
        res.render('login', {title: "Ex6-login", registerSuccess: false, loginFailed: false, logOut: false});
}

/* handle the logout */
exports.logOut = (req, res, next) => {
    res.render('login', {title: "Ex6-login", registerSuccess: false, loginFailed: false, logOut: true});
    req.session.destroy();
}

/* handle finished register */
exports.finishRegister = async function (req, res) {
    const email = req.cookies.email;
    const firstName = req.cookies.firstName;
    const lastName = req.cookies.lastName;
    const password = req.body.password;

    if (!email) {
        return res.render('register', {
            title: "Ex6-register",
            email: email,
            firstName: firstName,
            lastName: lastName,
            usedEmail: false,
            expired: true
        });
    } else if (await checkEmailExists(email))
        return res.render('register', {
            title: "Ex6-register",
            email: email,
            firstName: firstName,
            lastName: lastName,
            usedEmail: true,
            expired: false
        });
    else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.log(err);
                return res.render('register', {
                    title: "Ex6-register",
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    usedEmail: false,
                    expired: false
                });
            } else {
                try {
                    // Save the hashed password to the database
                    await User.create({
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: hash
                    });
                    res.render('login', {title: "Ex6-login", registerSuccess: true, loginFailed: false, logOut: false});
                } catch (err) {
                    console.log(err);
                    res.render('login', {
                        title: "Ex6-login",
                        registerSuccess: false,
                        loginFailed: false,
                        logOut: false
                    });
                }
            }
        });
    }
};
