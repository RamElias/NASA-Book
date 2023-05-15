module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        email: {
            type: type.STRING
        },
        firstName: {
            type: type.STRING
        },
        lastName: {
            type: type.STRING
        },
        password: {
            type: type.STRING
        }
    });
};
