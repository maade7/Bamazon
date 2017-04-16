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


// display all of the items available for sale. Include the ids, names, and prices of products for sale.
connection.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        console.log('ID: ' + res[i].id + ' | ' + 'Name: ' + res[i].product_name + ' | ' + 'Price: ' + (res[i].price).toFixed(2));
    }
    userBuy();
});


function userBuy() {

    inquirer.prompt([

        {
            type: 'input',
            message: 'Enter the ID number of the item you would like to buy:',
            name: 'id'
        },
        {
            type: 'input',
            message: 'How many units of this product would you like to buy:',
            name: 'units'
        }
    ]).then(function (user) {
        id = user.id;
        units = user.units;

        connection.query('SELECT * FROM products WHERE id=?', [id], function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                // console.log(JSON.stringify(res[i], null, 2));
                if (res[i].stock_quantity >= units) {
                    var unitsLeft = res[i].stock_quantity - units;
                    var charge = parseFloat(units * res[i].price).toFixed(2);
                    var newSales = parseFloat(parseFloat(res[i].product_sales) + parseFloat(charge)).toFixed(2);
                    var department = res[i].department_name;
                    var totalDepartmentSales;
// step 3  update total sales
                        connection.query('UPDATE products SET product_sales=? WHERE id=?', [newSales, id], function (err, res) {
                            if (err) throw err;
                        });
                    connection.query('SELECT total_sales FROM departments WHERE department_name=?', [department], function (err, res) {
                        if (err) throw err;
                        for (var i = 0; i < res.length; i++) {
                            totalDepartmentSales = parseFloat(parseFloat(res[i].total_sales) + parseFloat(charge)).toFixed(2);
                        }
                        connection.query('UPDATE departments SET total_sales=? WHERE department_name=?', [totalDepartmentSales, department], function (err, res) {
                            if (err) throw err;
                        });
                    });

// step 1 update quantity
                    connection.query("UPDATE products SET stock_quantity=? WHERE id=?", [unitsLeft, id], function (err, res) {
                        if (err) throw err;
                    });
                    console.log("Your order id complete.  You have been charged $" + charge + ". Thank you for shopping with" +
                        " Bamozon!");
                } else {
                    console.log('Insufficient quantity!  Only ' + res[i].stock_quantity + ' avalable.');
                }
            }
            userBuy();
        });
    });
}

