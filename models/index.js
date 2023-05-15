const Sequelize = require('sequelize');
const db = {};

// set up sequelize with the sqlite dialect for user
db.sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'path/userDatabase.sqlite'
});

// import user model
db.User = require('./user')(db.sequelize, Sequelize);

// set up sequelize with the sqlite dialect for comment
db.commentSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'path/commentsDatabase.sqlite'
});

// import comment model
db.Comment = require('./comments')(db.commentSequelize, Sequelize);

// syncing the sequelize instances
db.sequelize.sync();
db.commentSequelize.sync();

module.exports = db;
