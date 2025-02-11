const { dbConnection } = require('../config/db');

const createCategoryTable = async () => {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
    ) ENGINE=InnoDB;
    `;
        await dbConnection.query(query);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { createCategoryTable };
