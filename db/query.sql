USE company_db;

-- view all departments
SELECT departments.id AS id, 
departments.department_name AS department FROM departments;

-- view all roles
SELECT roles.id, roles.title, roles.salary, departments.department_name AS department
FROM roles
INNER JOIN departments ON roles.department_id = departments.id;

-- view all employees with title, department, salary and manager
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
ORDER BY id;