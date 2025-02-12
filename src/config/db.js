const mysql = require('mysql2');
const { HOST, USER, PASSWORD, DATABASE, PORT } = require('./config');


const pool = mysql.createPool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE, // blog management system
    port: PORT,
});

// Convert pool to use Promises
const dbConnection = pool.promise();

const testDBConnection = async () => {
    try {
        await dbConnection.query('SELECT 1');
        console.log('Database connection is successful.');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};


module.exports = { dbConnection, testDBConnection};
