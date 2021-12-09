var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '1234',
    database: 'dbproject'
});

module.exports = pool;