const mysql = require('mysql');

// See setup.sql for instructions on setting up mysql database
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'user',
    password: 'password',
    database: 'nextline',
    connectionLimit: 10,
    insecureAuth:  true
});

module.exports = pool;