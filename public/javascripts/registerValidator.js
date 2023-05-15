"use strict";

/**
 * module to validate the register names
 * @type {{validateForm: (function())}}
 */
let Validator = (() => {
    /**
     * checks if the name is not empty/contain only letters
     * @param name
     * @returns {boolean} true if valid, false otherwise
     */
    function checkName(name) {
        const input = document.getElementById(`${name}`).value.trim();
        const element = document.getElementById(`Invalid${name}`).classList;
        if (input !== "" && /^[a-zA-Z]+$/.test(input)) {
            element.add("d-none");
            return true;
        }
        element.remove("d-none"); //show the error
        return false;
    }

    /**
     * gets the register form and checks validation
     * @returns {*|boolean}
     */
    function validateForm() {
        const first = checkName("firstName");
        const last = checkName("lastName");
        return first && last;
    }

    return {
        validateForm: validateForm
    }
})();

/**
 * event listener for registration and password inputs
 */
document.addEventListener('DOMContentLoaded', function () {
    let regForm = document.getElementById('registerForm');

    regForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const isValid = Validator.validateForm();
        if (!isValid) {// validation failed
            event.stopPropagation();
        }
        else {
            regForm.submit();
        }
    });
});