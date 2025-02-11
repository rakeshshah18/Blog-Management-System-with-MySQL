const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'rakesh',
    password: 'root',
    database: 'bms',
    port: 3306,
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
