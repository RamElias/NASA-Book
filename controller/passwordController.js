const Cookies = require('cookies');
const {User} = require("../models");

async function checkEmailExists(email) {
    // find a user with the email
    return await User.findOne({where: {email}});
}

/* Load registration page */
exports.landing = (req, res, next) => {
    if (req.session.isAuth)
        // Redirect to the profile page if the user is logged in
        res.render('home', {title: "Ex6-home", userName: req.session.userName, includeScript: true});

    else if (req.cookies.email === undefined)
        // Redirect to the register page if the cookie is expired
        res.redirect('/register');
    else
        res.render('password', {title: "Ex6-Register", msg: ''});

}

/* Load password page, and activate cookie timer for password submit */
exports.createPassword = async function (req, res) {
    const cookies = new Cookies(req, res, {});
    const email = req.body.email.trim();
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();

    // Check if a user with the given email already exists
    const existingUser = await checkEmailExists(email)

    const options = {maxAge: 30 * 1000};
    cookies.set("email", email, options);
    cookies.set("firstName", firstName, options);
    cookies.set("lastName", lastName, options);

    if (existingUser) {
        // User already exists, return an error message
        return res.render('register', {
            title: "Ex6-Register",
            email: email,
            firstName: firstName,
            lastName: lastName,
            usedEmail: true,
            expired: false
        });
    } else {
        return res.render('password', {title: "Ex6-Register", msg: ''});
    }
};