/**
 * Created by maade on 4/15/17.
 */

var mysql = require("mysql");
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
                'View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'
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
        case 'View Products for Sale':
            forSale();
            break;

        case 'View Low Inventory':
            viewInventory();
            break;

        case 'Add to Inventory':
            addInventory();
            break;

        case 'Add New Product':
            addProduct();
            break;

    }

}

function forSale() {

// display all of the items available for sale. Include the ids, names, and prices of products for sale.
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('ID: ' + res[i].id + ' | ' + 'Name: ' + res[i].product_name + ' | ' + 'Price: ' + (res[i].price).toFixed(2) + ' | ' + 'Quantity: ' + res[i].stock_quantity);
        }
        console.log('---------------------------------------------------------');
        askUser();
    });
}

function viewInventory() {

    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log('ID: ' + res[i].id + ' | ' + 'Name: ' + res[i].product_name + ' | ' + 'Price: ' + (res[i].price).toFixed(2) + ' | ' + 'Quantity: ' + res[i].stock_quantity);
        }
        console.log('---------------------------------------------------------');
        askUser();
    });
}

function addInventory() {

    inquirer.prompt([

        {
            type: 'input',
            message: 'Enter the ID number of the item you would like to add to:',
            name: 'id'
        },
        {
            type: 'input',
            message: 'How many units of this product would you like to add:',
            name: 'units'
        }
    ]).then(function (user) {
        id = user.id;
        units = parseInt(user.units);
        var newUnits;
        connection.query('SELECT stock_quantity FROM products WHERE id=?', [id], function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                newUnits = res[i].stock_quantity + units;
            }

            connection.query('UPDATE products SET stock_quantity=? WHERE id=?', [newUnits, id], function (err, res) {

                console.log('You now have ' + newUnits + ' units of Item: ' + id + '.');
                console.log('---------------------------------------------------------');
                askUser();
            });
        });
    });
}

function addProduct() {

    inquirer.prompt([

        {
            type: 'input',
            message: 'Enter the Name of the product you would like to add:',
            name: 'name'
        },
        {
            type: 'input',
            message: 'Enter the Department Name of the product:',
            name: 'department'
        },

        {
            type: 'input',
            message: 'Enter the Price per unit:',
            name: 'price'
        },

        {
            type: 'input',
            message: 'Enter the number of units in stock:',
            name: 'quantity'
        }
    ]).then(function (user) {
        name = user.name;
        department = user.department;
        price = user.price;
        quantity = user.quantity;

        connection.query("INSERT INTO products SET ?", {
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: quantity
        }, function (err, res) {
        });

        connection.query("SELECT * FROM products ORDER BY id DESC LIMIT 1", function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log('This Item has been added to inventory.');

                console.log('ID: ' + res[i].id + ' | ' + 'Name: ' + res[i].product_name + ' | ' + 'Department Name: ' + res[i].department_name + ' | ' + 'Price: ' + (res[i].price).toFixed(2) + ' | ' + 'Quantity: ' + res[i].stock_quantity);

                console.log('---------------------------------------------------------');
                askUser();
            }
        });

    });
}