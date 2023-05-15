/* Load registration page */
exports.landing = (req, res, next) => {
    if (req.session.isAuth)
        // Redirect to the profile page if the user is logged in
        res.render('home', {title: "Ex6-home", userName: req.session.userName, includeScript: true});

    else {
        let email = req.cookies.email || '';
        let firstName = req.cookies.firstName || '';
        let lastName = req.cookies.lastName || '';
        return res.render('register', {
            title: "Ex6-Register",
            email: email,
            firstName: firstName,
            lastName: lastName,
            usedEmail: false,
            expired: false
        });
    }
}

/*Load password page, and activate cookie timer for password submit*/
exports.backFromPassword = (req, res, next) => {
    const email = req.cookies.email;
    const firstName = req.cookies.firstName;
    const lastName = req.cookies.lastName;
    return res.render('register', {
        title: "Ex6-Register",
        email: email,
        firstName: firstName,
        lastName: lastName,
        usedEmail: false,
        expired: false
    });
}