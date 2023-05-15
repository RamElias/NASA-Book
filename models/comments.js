module.exports = (sequelize, type) => {
    return sequelize.define('comment', {
        email: {
            type: type.STRING
        },
        comment: {
            type: type.STRING
        },
        imgId: {
            type: type.INTEGER
        },
        date: {
            type: type.STRING
        },
        userName: {
            type: type.STRING
        }
    });
};
