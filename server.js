const mysql = require("mysql");
const inquirer = require("inquirer");

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
    inquirer.prompt(menuOptions)
    .then(answers => {
        const {option} = answers;

        switch (option) {
            case 'addDept':
                addDepartment();
                break;
            case 'addRole':
                break;
            case 'addEmpl':
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


    inquirer.prompt({
        type: input
    });
}