const Sequelize = require("sequelize")

const connection = new Sequelize("guia_perguntas", "root", "dbfec300487", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
})

// // Microsoft SQL Server
// const connection = new Sequelize("guia_perguntas", "admin", "fec86453", {
//   host: "localhost",
//   port: 1433,
//   dialect: "mssql",
// })

module.exports = connection
