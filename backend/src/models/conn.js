//cria a conexão com o banco de dados

 const Sequelize = require('sequelize');

 const DBNAME = process.env.DBNAME;
 const ROOT = process.env.ROOT;
 const PASSWORD = process.env.PASSWORD;
 const HOST = process.env.HOST;

 
const sequelize = new Sequelize(DBNAME, ROOT, PASSWORD, {
    host: HOST,
    dialect: 'mysql',
});


module.exports = sequelize;