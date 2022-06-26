INSERT INTO departments (department_name)
VALUES  ("IT"),
        ("Human Resources"),
        ("Accounting and Finance"),
        ("Marketing");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Senior Developer", 80000, 1),
        ("Full-Stack Developer", 60000, 1),
        ("Recruiting Manager", 50000, 2),
        ("Payroll Administrator", 30000, 2),
        ("Accounting Manager", 65000, 3),
        ("Accountant", 40000, 3),
        ("Marketing Manager", 55000, 4),
        ("Social Media Coordinator", 35000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Tom", "Smith", 1, null),
        ("Mary", "Jones", 2, 1),
        ("Peter", "Taylor", 3, null),
        ("Betty", "Brown", 4, 3),
        ("John", "Williams", 5, null),
        ("Jenny", "Wilson", 6, 5),
        ("Keith", "Johnson", 7, null),
        ("Angel", "Davies", 8, 7);
 