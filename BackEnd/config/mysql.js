require('dotenv').config() //para usar variables de entorno
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {   
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT,
        timezone: '-05:00'
    }
);

module.exports = sequelize;