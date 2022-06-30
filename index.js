// import packages
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const colors = require("colors");
const figlet = require("figlet");

// connect with database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    password: "",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`.green)
);

// prompt manager message
db.connect(function (err) {
  if (err) throw err;
  managerMsg();
});

// manager message
managerMsg = () => {
  console.log(figlet.textSync("Employee").green);
  console.log(figlet.textSync("Manager").green);

  mainContent();
};

// prompt main content
const mainContent = () => {
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
    mainContent();
  });
};

// function to add department
addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
        validate: async (answer) => {
          if (!answer) {
            return "Please enter the name of the department.";
          }
          return true;
        },
      },
    ])
    .then(function (answer) {
      db.query(
        `INSERT INTO departments (department_name) 
         VALUES ("${answer.department}")`,
        (err, rows) => {
          if (err) throw err;
          console.log(`Added ${answer.department} to the database.`.bgGrey);
          mainContent();
        }
      );
    });
};

// function to view all roles
viewAllRoles = () => {
  const sql = `
  SELECT roles.id, roles.title, roles.salary, departments.department_name AS department 
  FROM roles 
  INNER JOIN departments ON roles.department_id = departments.id;`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    mainContent();
  });
};

// function to add role
addRole = () => {
  db.query(`SELECT * FROM departments;`, (err, res) => {
    if (err) throw err;
    let departments = res.map((departments) => ({
      name: departments.department_name,
      value: departments.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "role",
          message: "What is the name of the role?",
          validate: async (answer) => {
            if (!answer) {
              return "Please enter the name of the role.";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
          validate: async (answer) => {
            if (!answer || isNaN(answer)) {
              return "Please enter the amount of salary.";
            }
            return true;
          },
        },
        {
          type: "list",
          name: "department",
          message: "Which department does the role belong to?",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO roles SET ?;`,
          {
            title: answer.role,
            salary: answer.salary,
            department_id: answer.department,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`Added ${answer.role} to the database.`.bgGrey);
            mainContent();
          }
        );
      });
  });
};

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
LEFT JOIN employees manager ON employees.manager_id = manager.id;`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    mainContent();
  });
};

// function to add employee
addEmployee = () => {
  db.query(`SELECT * FROM employees;`, (err, res) => {
    if (err) throw err;
    let managers = res.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    db.query(`SELECT * FROM roles;`, (err, res) => {
      if (err) throw err;
      let roles = res.map((roles) => ({ name: roles.title, value: roles.id }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
            validate: async (answer) => {
              if (!answer) {
                return "Please enter the first name of the employee.";
              }
              return true;
            },
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
            validate: async (answer) => {
              if (!answer) {
                return "Please enter the last name of the employee.";
              }
              return true;
            },
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roles,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: managers,
          },
        ])
        .then((answer) => {
          db.query(
            `INSERT INTO employees SET ?;`,
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.role,
              manager_id: answer.manager,
            },
            (err, res) => {
              if (err) throw err;
              console.log(
                `Added ${answer.firstName} ${answer.lastName} to the database.`
                  .bgGrey
              );
              mainContent();
            }
          );
        });
    });
  });
};

// function to update employee role
updateEmployeeRole = () => {
  db.query(`SELECT * FROM employees;`, (err, res) => {
    if (err) throw err;
    let employees = res.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    db.query(`SELECT * FROM roles;`, (err, res) => {
      if (err) throw err;
      let roles = res.map((roles) => ({ name: roles.title, value: roles.id }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeList",
            message: "Which employee's role do you want to update?",
            choices: employees,
          },
          {
            type: "list",
            name: "newRole",
            message: "Which role do you want to assign the selected employee?",
            choices: roles,
          },
        ])
        .then((answer) => {
          db.query(
            `UPDATE employees SET ? WHERE ?`,
            [
              {
                role_id: answer.newRole,
              },
              {
                id: answer.employeeList,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log(`Updated employee's role.`.bgGrey);
              mainContent();
            }
          );
        });
    });
  });
};

// BONUS TODO:
// Update employee managers.
updateEmployeeManagers = () => {};

// View employees by manager.
// View employees by department.
// Delete departments, roles, and employees.
// View the total utilized budget of a department, the combined salaries of all employees in that department.
