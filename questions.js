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

module.exports = {
    menuOptions: menuOptions
};