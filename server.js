const mysql = require("mysql");
const inquirer = require("inquirer");
const questions = require("./questions.js");

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
            case 'viewDepts':
                break;
            case 'viewRoles':
                break;
            case 'viewEmpls':
                break;
            case 'updEmplRole':
                break;
            default:
                break;
        }
    });
}

function addDepartment() {
}

function addRole() {
    // Get departments from database first 
    questions.getRoleQuestions(connection).then(prompts => {
        if (prompts) {
            inquirer.prompt(prompts)
            .then((answers) => {
                console.log('Answers');
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
        if (prompts) {
            inquirer.prompt(prompts)
            .then((answers) => {
                console.log(answers);
            });
        } else {
            console.log('You will need to create a Role first before you can add an Employee');
            start();
        }
    });
}