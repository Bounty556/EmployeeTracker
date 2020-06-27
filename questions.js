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
                name: 'View all Employees',
                value: 'viewEmpls'
            },
            {
                name: 'View Employees by Department',
                value: 'viewDepts'
            },
            {
                name: 'View Employees by Role',
                value: 'viewRoles'
            },
            {
                name: 'Update Employee Role',
                value: 'updEmplRole'
            },
            {
                name: 'Exit',
                value: 'exit'
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

const viewByRoleQuestions = [
    {
        type: 'list',
        name: 'role',
        message: 'What Role would you like to view the Employee\'s for?'
    }
];

const viewByDepartmentQuestions = [
    {
        type: 'list',
        name: 'dept',
        message: 'What Department would you like to view the Employee\'s for?'
    }
];

const updateEmployeeRoleQuestions = [
    {
        type: 'list',
        name: 'employee',
        message: 'Which Employee\'s role would you like to update?'
    },
    {
        type: 'list',
        name: 'role',
        message: 'What would you like to change this Employee\'s role to?'
    }
];

// We need to first query the departments from the database, since the user needs
// to choose an existing department
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

// Queries all of the roles from the database
function getRoles(connection) {
    return new Promise((resolve, reject) => {
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

            resolve(roleList);
        });
    });
}

function getDepartments(connection) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM departments", (err, depts) => {
            if (err) reject(err);

            if (!depts.length) {
                resolve(null);
            }

            // Parse into the proper format for inquirer
            const deptList = depts.map(x => {
                let val = { name: x.name, value: x.id };
                return val;
            });

            resolve(deptList);
        });
    });
}

function getEmployees(connection) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employees", (err, employees) => {
            if (err) reject(err);

            // Parse into proper format for inquirer
            const employeeList = employees.map(x => {
                let val = { name: `${x.first_name} ${x.last_name}`, value: x.id };
                return val;
            });

            resolve(employeeList);
        });
    });
}

function getViewByRoleQuestions(connection) {
    return new Promise((resolve, reject) => {
        getRoles(connection).then(roleList => {
            viewByRoleQuestions[0].choices = roleList;
            resolve(viewByRoleQuestions);
        });
    });
}

function getViewByDepartmentQuestions(connection) {
    return new Promise((resolve, reject) => {
        getDepartments(connection).then(deptList => {
            viewByDepartmentQuestions[0].choices = deptList;
            resolve(viewByDepartmentQuestions);
        });
    });
}

// We need to first query the roles from the database, since the user needs
// to choose an existing role for the employee
function getEmployeeQuestions(connection) {
    return new Promise((resolve, reject) => {
        // Get roles list
        getRoles(connection).then(roleList => {
            // Get employees list
            getEmployees(connection).then(employeeList => {

                employeeList.unshift({ name: 'None', value: null });

                addEmployeeQuestions[2].choices = roleList;
                addEmployeeQuestions[3].choices = employeeList;

                resolve(addEmployeeQuestions);
            });
        });
    });
}

function getUpdateEmployeeRoleQuestions(connection) {
    return new Promise((resolve, reject) => {
        getEmployees(connection).then(employeeList => {
            updateEmployeeRoleQuestions[0].choices = employeeList;
            getRoles(connection).then(roleList => {
                updateEmployeeRoleQuestions[1].choices = roleList;
                resolve(updateEmployeeRoleQuestions);
            });
        });
    });
}

module.exports = {
    menuOptions,
    addDeptQuestions,
    getRoleQuestions,
    getEmployeeQuestions,
    getViewByRoleQuestions,
    getViewByDepartmentQuestions,
    getUpdateEmployeeRoleQuestions
};