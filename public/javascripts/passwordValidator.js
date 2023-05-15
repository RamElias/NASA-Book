"use strict";

/**
 * module to validate the password validation
 * @type {{validatePasswords: (function())}}
 */
let Validator = (() => {
    /**
     * checks if the passwords are the same
     * @param p1
     * @param p2
     * @returns {boolean}
     */
    function matchingPasswords(p1, p2) {
        const element = document.getElementById("notMatching").classList;
        if (p1 === p2) {
            element.add("d-none");
            return true;
        }
        element.remove("d-none"); //show the error
        return false;
    }

    /**
     * checks if the passwords are long enough (8+)
     * @param p1
     * @param p2
     * @returns {boolean}
     */
    function moreThen8(p1, p2) {
        const minLength = 8;
        const element = document.getElementById("shortPassword").classList;

        if (p1.length >= minLength && p2.length >= minLength) {
            element.add("d-none");
            return true;
        }
        element.remove("d-none"); //show the error
        return false;
    }

    /**
     * gets the password form and checks if it is valid
     * @returns {*|boolean}
     */
    function validatePasswords() {
        const pas1 = document.getElementById("password").value;
        const pas2 = document.getElementById("password2").value;

        const match = matchingPasswords(pas1, pas2);
        const length = moreThen8(pas1, pas2);

        return match && length;
    }

    return {
        validatePasswords: validatePasswords
    }
})();

/**
 * event listener for registration and password inputs
 */
document.addEventListener('DOMContentLoaded', function () {
    let pasForm = document.getElementById('passwordForm');
    pasForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const isValid = Validator.validatePasswords();
        if (!isValid) {
            event.stopPropagation();
        }
        else {
            pasForm.submit();
        }
    });
});