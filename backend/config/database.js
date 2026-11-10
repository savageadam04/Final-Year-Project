//Import the mysql2/promise module and dotenv to manage environment variables
const mysql = require("mysql2/promise");
require("dotenv").config();
//Create a connection pool to the MySQL database using environment variables for configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;



