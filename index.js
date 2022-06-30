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
          { name: "Update Employee Manager", value: "updateEmployeeManagers" },
          {
            name: "View Employees by Manager",
            value: "viewEmployeesByManager",
          },
          {
            name: "View Employees by Department",
            value: "viewEmployeesByDepartment",
          },
          { name: "Delete Department", value: "deleteDepartment" },
          { name: "Delete Role", value: "deleteRole" },
          { name: "Delete Employee", value: "deleteEmployee" },
          {
            name: "View Budget in Department",
            value: "viewBudgetInDepartment",
          },
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
      if (answer.choices === "updateEmployeeManagers") {
        updateEmployeeManagers();
      }
      if (answer.choices === "viewEmployeesByManager") {
        viewEmployeesByManager();
      }
      if (answer.choices === "viewEmployeesByDepartment") {
        viewEmployeesByDepartment();
      }
      if (answer.choices === "deleteDepartment") {
        deleteDepartment();
      }
      if (answer.choices === "deleteRole") {
        deleteRole();
      }
      if (answer.choices === "deleteEmployee") {
        deleteEmployee();
      }
      if (answer.choices === "viewBudgetInDepartment") {
        viewBudgetInDepartment();
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

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
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
        (err, results) => {
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
  SELECT roles.id, 
  roles.title, 
  roles.salary, 
  departments.department_name AS department 
  FROM roles 
  INNER JOIN departments ON roles.department_id = departments.id;`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    mainContent();
  });
};

// function to add role
addRole = () => {
  db.query(`SELECT * FROM departments;`, (err, results) => {
    if (err) throw err;
    let departments = results.map((departments) => ({
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
          (err, results) => {
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

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    mainContent();
  });
};

// function to add employee
addEmployee = () => {
  db.query(`SELECT * FROM employees;`, (err, results) => {
    if (err) throw err;
    let managers = results.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    db.query(`SELECT * FROM roles;`, (err, results) => {
      if (err) throw err;
      let roles = results.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));
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
            (err, results) => {
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
  db.query(`SELECT * FROM employees;`, (err, results) => {
    if (err) throw err;
    let employees = results.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    db.query(`SELECT * FROM roles;`, (err, results) => {
      if (err) throw err;
      let roles = results.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));
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
            (err, results) => {
              if (err) throw err;
              console.log(`Updated employee's role.`.bgGrey);
              mainContent();
            }
          );
        });
    });
  });
};

// extra functions
// update employee managers
updateEmployeeManagers = () => {
  db.query(`SELECT * FROM employees;`, (err, results) => {
    if (err) throw err;
    let employees = results.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    db.query(`SELECT * FROM employees;`, (err, results) => {
      if (err) throw err;
      let managers = results.map((employees) => ({
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeList",
            message: "Which employee's manager do you want to update?",
            choices: employees,
          },
          {
            type: "list",
            name: "newManager",
            message:
              "Which manager do you want to assign the selected employee?",
            choices: managers,
          },
        ])
        .then((answer) => {
          db.query(
            `UPDATE employees SET ? WHERE ?;`,
            [
              {
                manager_id: answer.newManager,
              },
              {
                id: answer.employeeList,
              },
            ],
            (err, results) => {
              if (err) throw err;
              console.log(`Updated employee's manager.`.bgGrey);
              mainContent();
            }
          );
        });
    });
  });
};

// view employees by manager
viewEmployeesByManager = () => {
  db.query(
    `SELECT id, first_name, last_name FROM employees;`,
    (err, results) => {
      if (err) throw err;
      let managers = results.map((employees) => ({
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "manager",
            message: "Select a manager and view employees by the manager.",
            choices: managers,
          },
        ])
        .then((answer) => {
          db.query(
            `SELECT CONCAT (manager.first_name, " ", manager.last_name) AS manager,
          employees.id AS employee_id, 
          employees.first_name, 
          employees.last_name, 
          roles.title, 
          departments.department_name AS department, 
          roles.salary 
          FROM employees 
          LEFT JOIN employees manager ON employees.manager_id = manager.id 
          LEFT JOIN roles ON employees.role_id = roles.id 
          LEFT JOIN departments ON departments.id = roles.department_id 
          WHERE employees.manager_id = ${answer.manager};`,
            (err, results) => {
              if (err) throw err;
              console.table(results);
              mainContent();
            }
          );
        });
    }
  );
};

// view employees by department
viewEmployeesByDepartment = () => {
  db.query(`SELECT id, department_name FROM departments;`, (err, results) => {
    if (err) throw err;
    let departments = results.map((departments) => ({
      name: departments.department_name,
      value: departments.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Select a department and view employees by the department.",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query(
          `SELECT departments.department_name AS department, 
          employees.id AS employee_id, 
          employees.first_name, 
          employees.last_name, 
          roles.title, 
          roles.salary, 
          CONCAT (manager.first_name, " ", manager.last_name) AS manager
          FROM employees 
          LEFT JOIN employees manager ON employees.manager_id = manager.id 
          LEFT JOIN roles ON employees.role_id = roles.id 
          LEFT JOIN departments ON departments.id = roles.department_id 
          WHERE departments.id = ${answer.department};`,
          (err, results) => {
            if (err) throw err;
            console.table(results);
            mainContent();
          }
        );
      });
  });
};

// delete department
deleteDepartment = () => {
  db.query(`SELECT * FROM departments;`, (err, results) => {
    if (err) throw err;
    let departments = results.map((departments) => ({
      name: departments.department_name,
      value: departments.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Select the department you would like to delete.",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query(
          `DELETE FROM departments WHERE ?`,
          [
            {
              id: answer.department,
            },
          ],
          (err, results) => {
            if (err) throw err;
            console.log(`Deleted the department from the database.`.bgGrey);
            mainContent();
          }
        );
      });
  });
};

// delete role
deleteRole = () => {
  db.query(`SELECT * FROM roles;`, (err, results) => {
    if (err) throw err;
    let roles = results.map((roles) => ({
      name: roles.title,
      value: roles.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Select the role you would like to delete.",
          choices: roles,
        },
      ])
      .then((answer) => {
        db.query(
          `DELETE FROM roles WHERE ?`,
          [
            {
              id: answer.role,
            },
          ],
          (err, results) => {
            if (err) throw err;
            console.log(`Deleted the role from the database.`.bgGrey);
            mainContent();
          }
        );
      });
  });
};

// delete employee
deleteEmployee = () => {
  db.query(`SELECT * FROM employees;`, (err, results) => {
    if (err) throw err;
    let employees = results.map((employees) => ({
      name: employees.first_name + " " + employees.last_name,
      value: employees.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Select the employee you would like to delete.",
          choices: employees,
        },
      ])
      .then((answer) => {
        db.query(
          `DELETE FROM employees WHERE ?`,
          [
            {
              id: answer.employee,
            },
          ],
          (err, results) => {
            if (err) throw err;
            console.log(`Deleted the employee from the database.`.bgGrey);
            mainContent();
          }
        );
      });
  });
};

// view the combined salaries of all employees in a department
viewBudgetInDepartment = () => {
  db.query(`SELECT * FROM departments;`, (err, results) => {
    if (err) throw err;
    let departments = results.map((departments) => ({
      name: departments.department_name,
      value: departments.id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Select the department to view its total utilized budget.",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query(
          `SELECT department_id, 
          SUM(roles.salary) AS total_budget 
          FROM roles WHERE ?;`,
          [
            {
              department_id: answer.department,
            },
          ],
          (err, results) => {
            if (err) throw err;
            console.table(results);
            mainContent();
          }
        );
      });
  });
};
