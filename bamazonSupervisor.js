/**
 * Created by maade on 4/16/17.
 */
var mysql = require("mysql");
require("console.table");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'maade',
    database: 'Bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log('connected as id ' + connection.threadId);
});


askUser();

function askUser() {

    inquirer.prompt([

        {
            type: 'list',
            message: 'Select an action from the list below?',
            choices: [
                'View Product Sales by Department', 'Create New Department'
            ],
            name: 'action'
        }
    ]).then(function (user) {
        action = user.action;

        callSwitch();
        // console.log(JSON.stringify(user, null, 2));

    });
}

function callSwitch() {
    switch (action) {
        case 'View Product Sales by Department':
            sales();
            break;

        case 'Create New Department':
            create();
            break;

    }

}

function sales() {

// display all.
    connection.query('SELECT *, total_sales - over_head_costs AS total_profit FROM departments', function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log('---------------------------------------------------------');
        askUser();
    });
}

function create() {

    inquirer.prompt([


        {
            type: 'input',
            message: 'Enter the new Department Name:',
            name: 'department'
        },

        {
            type: 'input',
            message: 'Enter the Over Head Cost:',
            name: 'cost'
        },

        {
            type: 'input',
            message: 'Enter the Total Sales to date:',
            name: 'sales'
        }
    ]).then(function (user) {
        department = user.department;
        cost = user.cost;
        sales = user.sales;

        connection.query("INSERT INTO departments SET ?", {
            department_name: department,
            over_head_costs: cost,
            total_sales: sales
        }, function (err, res) {
        });

        connection.query("SELECT * FROM departments ORDER BY id DESC LIMIT 1", function (err, res) {
            if (err) throw err;
            console.log('This Department has been added.');
            console.table(res);
            console.log('---------------------------------------------------------');
            askUser();
        });

    });
}
