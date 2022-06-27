// import packages
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const colors = require("colors");

// connect with database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    password: "",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`.bgGray)
);

// prompt manager message
db.connect(function (err) {
  if (err) throw err;
  managerMsg();
});

// manager message
managerMsg = () => {
  console.log(".-----------------------------------.".bgGray);
  console.log("|                                   |".bgGray);
  console.log("|          EMPLOYEE MANAGER         |".bgGray);
  console.log("|                                   |".bgGray);
  console.log(".-----------------------------------.".bgGray);
  // promptMainContent();
};

// prompt main content

// functions to view, add, and update db
