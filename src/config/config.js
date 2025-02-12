const dotenv = require("dotenv");
dotenv.config();

const config = {
    JWT_SECRET: process.env.JWT_SECRET_KEY || "secret-key",
    HOST: process.env.HOST || "localhost",
    USER: process.env.USER || "rakesh",
    PASSWORD: process.env.PASSWORD || "root",
    DATABASE: process.env.DATABASE || "bms",
    PORT: process.env.PORT || 3306,


}
module.exports = config;