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
  promptMainContent();
};

// prompt main content
const promptMainContent = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          { name: "View All Departments", value: "viewAllDepartments" },
          { name: "Add Department", value: "addDepartment" },
          { name: "View All Roles", value: "viewAllRoles" },
          { name: "Add Role", value: "addRole" },
          { name: "View All Employees", value: "viewAllEmployees" },
          { name: "Add Employee", value: "addEmployee" },
          { name: "Update Employee Role", value: "updateEmployeeRole" },
          { name: "Finish!", value: "quit" },
        ],
      },
    ])
    .then((answer) => {
      if (answer.choices === "viewAllDepartments") {
        viewAllDepartments();
      }
      if (answer.choices === "addDepartment") {
        addDepartment();
      }
      if (answer.choices === "viewAllRoles") {
        viewAllRoles();
      }
      if (answer.choices === "addRole") {
        addRole();
      }
      if (answer.choices === "viewAllEmployees") {
        viewAllEmployees();
      }
      if (answer.choices === "addEmployee") {
        addEmployee();
      }
      if (answer.choices === "updateEmployeeRole") {
        updateEmployeeRole();
      }
      if (answer.choices === "quit") {
        db.end();
      }
    });
};

// function to view all departments
viewAllDepartments = () => {
  const sql = `SELECT departments.id AS id, 
  departments.department_name AS department 
  FROM departments;`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptMainContent();
  });
};

// function to add department

// function to view all roles
viewAllRoles = () => {
  const sql = `
  SELECT roles.id, roles.title, roles.salary, departments.department_name AS department 
  FROM roles 
  INNER JOIN departments ON roles.department_id = departments.id;`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptMainContent();
  });
};

// function to add role

// function to view all employees
viewAllEmployees = () => {
  const sql = `
SELECT employees.id, 
employees.first_name, 
employees.last_name, 
roles.title, 
departments.department_name AS department,
roles.salary, 
CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employees
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees manager ON employees.manager_id = manager.id
ORDER BY id;`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptMainContent();
  });
};

// function to add employee

// function to update employee role
