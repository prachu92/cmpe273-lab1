var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100,
    host:'localhost',
    user:'admin',
    password:'admin',
    database:'db',
    port: 3306,
    debug: false,
    multipleStatements: true
});

module.exports = pool;