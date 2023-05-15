const {User, Comment} = require('../models');
const bcrypt = require('bcrypt');
const fetch = require("isomorphic-fetch");
const APIKEY = 'B5iZwVm6HcOzzg5DPqaSFmZsymzMgAowzH2QGF8h';
const APIURL = `https://api.nasa.gov/planetary/apod`;
let index = 0;

/**
 * checks if the user exist
 * @param email
 * @param password
 * @returns {Promise<boolean|{match: boolean, userName: string}>}
 */
async function checkUserExists(email, password) {
    // find a user with the email
    const user = await User.findOne({where: {email: email}});
    if (user) {
        // email already exists, now check the password
        const match = await bcrypt.compare(password, user.password);
        if (match)
            return {userName: `${user.firstName} ${user.lastName}`, match: true};
        return false;
    } else
        // email doesn't exist
        return false;
}


/*User first land in the website, if the user it authorized he will move to homepage,
 *otherwise he will lang in landing page for registration*/
exports.landing = (req, res, next) => {
    if (req.session.isAuth) {
        // Redirect to the profile page if the user is logged in
        res.render('home', {title: "Ex6-home", userName: req.session.userName, includeScript: true});
    } else {
        // Render the login page if the user is not logged in
        res.render('login', {title: "Ex6-login", registerSuccess: false, loginFailed: false, logOut: false});
    }
}

/**
 * handle the login
 */
exports.login = async (req, res) => {
    const email = req.body.email;
    const loginPassword = req.body.loginPassword;

    // Check if a user with the given email already exists
    const result = await checkUserExists(email, loginPassword)
    if (result.match) {
        req.session.isAuth = true;
        req.session.email = email
        req.session.userName = result.userName
        return res.render('home', {title: "Ex6-home", userName: result.userName, includeScript: true});
    } else {
        return res.render('login', {title: "Ex6-login", registerSuccess: false, loginFailed: true, logOut: false});
    }
}

/**
 * get the image from nasa
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getImage = async (req, res) => {
    const start_date = req.params.start_date;
    const end_date = req.params.end_date;
    // Use the start_date and end_date variables in your API fetch call
    const response = await fetch(`${APIURL}?api_key=${APIKEY}&start_date=${start_date}&end_date=${end_date}`)
    const data = await response.json()
    res.json(data)
}

/**
 * load the modal
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.loadModel = async (req, res) => {
    if (!req.session.isAuth) {
        res.json({sessionExpired: true});
    } else {

        const date = req.params.date;

        // Use the start_date and end_date variables in your API fetch call
        const response = await fetch(`${APIURL}?api_key=${APIKEY}&date=${date}`)
        const data = await response.json()
        res.json(data)
    }
}

/**
 * get comments and return them in res
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getComments = async (req, res) => {
    const key = req.params.id;
    if (!key)
        res.status("400").json("Error was not found");
    else {
        const comments = await Comment.findAll({
            where: {
                date: key
            }
        });
        res.json(comments)
    }
}

/**
 * create a comment and add it to the DB
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.createComments = async (req, res) => {
    if (!req.session.isAuth) {
        res.json({sessionExpired: true});
    } else {
        // to extract the resource info (for example "name") sent by the client, use
        let email = req.session.email
        let com = req.body.comment;
        let launchDate = req.body.date;
        try {
            const user = await User.findOne({where: {email}});

            console.log("user.firstName: ", user.firstName)

            const userName = user.firstName + " " + user.lastName

            const comment = await Comment.create({
                email: email,
                comment: com,
                imgId: index,
                date: launchDate,
                userName: userName
            });
            index++;
            res.json(comment);

        } catch (err) {
            console.log(err);
        }
    }
}

/**
 * delete the wanted comment
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.deleteComments = async (req, res) => {
    if (!req.session.isAuth) {
        res.json({sessionExpired: true});
    } else {
        const id = Number(req.params.id);
        const toDel = await Comment.findOne({where: {imgId: id}});
        if (toDel) {
            await Comment.destroy({where: {imgId: id}});
            res.status(200).json({success: true});
        } else {
            res.status(404).json({Message: "Comment with this imgId does not exist"});
        }
    }
}

/**
 * get email address
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getEmail = async (req, res) => {
    res.json({email: req.session.email});
}
