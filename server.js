const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table')
const questions = require('./questions.js');

// Create mysql connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'employees_db',
    password: 'password'
});

start();
 
function start() {
    inquirer.prompt(questions.menuOptions)
    .then(answers => {
        const {option} = answers;

        switch (option) {
            case 'addDept':
                addDepartment();
                break;
            case 'addRole':
                addRole();
                break;
            case 'addEmpl':
                addEmployee();
                break;
            case 'viewEmpls':
                viewAllEmployees();
                break;
            case 'viewDepts':
                viewEmployeesByDepartment();
                break;
            case 'viewRoles':
                viewEmployeesByRole();
                break;
            case 'updEmplRole':
                updateEmployeeRole();
                break;
            case 'exit':
                connection.end();
                break;
        }
    });
}

function addDepartment() {
    inquirer.prompt(questions.addDeptQuestions).then(answers => {
        insertIntoTable('departments', {name: answers.deptName});
        console.log(answers.deptName + ' department successfully added!');
        start();
    });
}

function addRole() {
    // Get departments from database first 
    questions.getRoleQuestions(connection).then(prompts => {
        if (prompts) {
            inquirer.prompt(prompts).then(answers => {
                insertIntoTable('roles', {title: answers.roleName, salary: answers.salary, department_id: answers.department});
                console.log(answers.roleName + ' role successfully added!');
                start();
            });
        } else {
            console.log('You will need to create a department first before you can add a Role');
            start();
        }
    });
}

function addEmployee() {
    // Get employees and roles from database first
    questions.getEmployeeQuestions(connection).then(prompts => {
        if (prompts[2].choices) {
            inquirer.prompt(prompts).then(answers => {
                insertIntoTable('employees', {first_name: answers.employeeFirst, last_name: answers.employeeLast, role_id: answers.employeeRole, manager_id: answers.employeeManager});
                console.log('Employee ' + answers.employeeFirst + ' ' + answers.employeeLast + ' successfully added!');
                start();
            });
        } else {
            console.log('You will need to create a Role first before you can add an Employee');
            start();
        }
    });
}

function viewAllEmployees() {
    const query = 'SELECT t1.id, t1.first_name, t1.last_name, roles.title, departments.name AS department, roles.salary, t2.first_name || " " || t2.last_name AS manager ' + 
    'FROM employees t1 LEFT JOIN employees t2 ON t1.manager_id = t2.id LEFT JOIN roles ON t1.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id';

    runQuery(query);
}

function viewEmployeesByDepartment() {
    questions.getViewByDepartmentQuestions(connection).then(prompts => {
        if (prompts[0].choices) {
            inquirer.prompt(prompts).then(answers => {
                const query = 'SELECT t1.id, t1.first_name, t1.last_name, roles.title, departments.name AS department, roles.salary, t2.first_name || " " || t2.last_name AS manager ' + 
                'FROM employees t1 LEFT JOIN employees t2 ON t1.manager_id = t2.id LEFT JOIN roles ON t1.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id ' + 
                'WHERE departments.id = ' + answers.dept;

                runQuery(query);
            });
        } else {
            console.log('It looks like there are no Departments just yet!');
            start();
        }
    });
}

function viewEmployeesByRole() {
    questions.getViewByRoleQuestions(connection).then(prompts => {
        if (prompts[0].choices) {
            inquirer.prompt(prompts).then(answers => {
                const query = 'SELECT t1.id, t1.first_name, t1.last_name, roles.title, departments.name AS department, roles.salary, t2.first_name || " " || t2.last_name AS manager ' + 
                'FROM employees t1 LEFT JOIN employees t2 ON t1.manager_id = t2.id LEFT JOIN roles ON t1.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id ' + 
                'WHERE roles.id = ' + answers.role;

                runQuery(query);
            });
        } else {
            console.log('It looks like there are no Roles just yet!');
            start();
        }
    });
}

function updateEmployeeRole() {
    questions.getUpdateEmployeeRoleQuestions(connection).then(prompts => {
        if (prompts[0].choices && prompts[1].choices) {
            inquirer.prompt(prompts).then(answers => {
                updateWhere('employees', 't1.role_id = ' + answers.role, 't1.id = ' + answers.employee);
            });
        } else {
            console.log('It looks like there are no Employees and/or Roles just yet!');
            start();
        }
    });
}

function insertIntoTable(table, valuesObj) {
    connection.query('INSERT INTO ?? SET ?', [table, valuesObj], err => {
        if (err) {
            console.log(err);
            connection.end();
        }
    });
}

function updateWhere(table, value, condition) {
    const query = `UPDATE ${table} t1 SET ${value} WHERE ${condition}`;
    connection.query(query, (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
        } else {
            console.log('Employee role updated!');
            start();
        }
    });
}

function runQuery(query) {
    connection.query(query, (err, results) => {
        if (err) {
            console.log(err);
            connection.end();
            start();
        } else {
            console.table(results);
            start();
        }
    });
}