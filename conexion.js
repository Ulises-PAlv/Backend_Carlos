const mysql = require("mysql");
module.exports = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "2709",
 database: "MedicalService"
});