const menuOptions = [
    {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: [
            {
                name: 'Add new Department',
                value: 'addDept'
            },
            {
                name: 'Add new Role',
                value: 'addRole'
            },
            {
                name: 'Add new Employee',
                value: 'addEmpl'
            },
            {
                name: 'View Departments',
                value: 'viewDepts'
            },
            {
                name: 'View Roles',
                value: 'viewRoles'
            },
            {
                name: 'View Employees',
                value: 'viewEmpls'
            },
            {
                name: 'Update Employee Role',
                value: 'updEmplRole'
            }
        ]
    }
];

const addDeptQuestions = [
    {
        type: 'input',
        name: 'deptName',
        message: 'What is the name of the department you would like to add?'
    }
];

const addRoleQuestions = [
    {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role you would like to add?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is this role\'s salary?'
    },
    {
        type: 'list',
        name: 'department',
        message: 'Which department does this role belong to?'
    }
];

const addEmployeeQuestions = [
    {
        type: 'input',
        name: 'employeeFirst',
        message: 'What is the first name of the Employee'
    },
    {
        type: 'input',
        name: 'employeeLast',
        message: 'What is the last name of the Employee'
    },
    {
        type: 'list',
        name: 'employeeRole',
        message: 'What role does this Employee have?'
    },
    {
        type: 'list',
        name: 'employeeManager',
        message: 'Who is this Employee\'s Manager?'
    }
];

function getRoleQuestions(connection) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM departments", (err, data) => {
            if (err) reject(err);

            if (data.length) {
                const list = data.map(x => {
                    let val = { name: x.name, value: x.id };
                    return val;
                });

                addRoleQuestions[2].choices = list;

                resolve(addRoleQuestions);
            } else {
                resolve(null);
            }
        });
    });
}

function getEmployeeQuestions(connection) {
    return new Promise((resolve, reject) => {
        // Get roles list
        connection.query("SELECT * FROM roles", (err, roles) => {
            if (err) reject(err);

            if (!roles.length) {
                resolve(null);
            }

            // Parse into the proper format for inquirer
            const roleList = roles.map(x => {
                let val = { name: x.title, value: x.id };
                return val;
            });

            // Get employees list
            connection.query("SELECT * FROM employees", (err, employees) => {
                if (err) reject(err);

                // Parse into proper format for inquirer
                const employeeList = employees.map(x => {
                    let val = { name: `${x.first_name} ${x.last_name}`, value: x.id };
                    return val;
                });

                employeeList.unshift({ name: 'None', value: null });

                addEmployeeQuestions[2].choices = roleList;
                addEmployeeQuestions[3].choices = employeeList;

                resolve(addEmployeeQuestions);
            });
        });
    });
}

module.exports = {
    menuOptions,
    addDeptQuestions,
    getRoleQuestions,
    getEmployeeQuestions
};