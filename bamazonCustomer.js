var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
//table array used for cli-table package
var table = new Table({
    head: ['item id', 'name', "price", "quantity"],
    colWidths: [10, 30, 10, 10]
});
//create table flag so that we only have to build the table once
var tableBuilt = false;
var numProducts = 0;
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "productsDB"
});

function printProducts() {
    if (tableBuilt == false) {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;

            // Log all results of the SELECT statement
            numProducts = 0;
            res.forEach(element => {
                table.push([element.item_id, element.product_name, element.price, element.stock_quantity]);
                numProducts++;
            });
            tableBuilt = true;

            console.log(table.toString());
            customerInput();
        });
    }
    else{
        console.log(table.toString());
        customerInput();
    }
    
}

function customerInput() {
    inquirer.prompt([{
            name: "id",
            message: "What is the item_id of the product you would like to buy?"
        },
        {
            name: "amount",
            message: "How many items do you want to buy?"
        }
    ]).then(function (answer) {
        if (!validateAmount(answer.amount)) {} else if (!validateID(answer.id)) {} else {
            connection.query("SELECT * FROM products WHERE item_id = " + answer.id, function (err, res) {
                if (err) throw err;
                if (!hasEnoughStock(res[0].stock_quantity, answer.amount)) {
                    insufficientStock(res[0].product_name, res[0].stock_quantity);
                } else {
                    updateStock(answer.id, answer.amount, -1);
                    printOrder(res[0], parseInt(answer.amount));
                }
            })
        }

    });
}

function validateID(id) {
    if (isNaN(id) || parseInt(id) > numProducts || parseInt(id) < 1) {
        console.log();
        console.log("Item ID given doesn't match a product in our database.");
        return false;
    }
    return true;
}

function validateAmount(amt) {
    if (isNaN(amt) || parseInt(amt) <= 0) {
        console.log("Amount of product to purchase must be a number larger than zero.");
        connection.end();
        return false;
    }
    return true;
}

function hasEnoughStock(stockQty, purchaseQty) {
    //
    if (parseInt(stockQty) < parseInt(purchaseQty) || stockQty == 0) {

        return false;
    }
    return true;
}

function insufficientStock(name, stock) {
    console.log("We don't have enough stock of that item to complete this order.");
    console.log("We currently have " + stock + " " + name + "(s) in stock.");
    connection.end();

}

//id = item_id in sql database
//amt = amount to update item by
//sign = 1 for add amt and -1 for subtract amt
function updateStock(id, amt, sign) {
    if (sign == -1) {
        connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amt + " WHERE item_id = " + id + ";", function (err, res) {
            if (err) throw err;
            console.log("Stock Updated.");
            connection.end();
        });
    } else {
        connection.query("UPDATE products SET stock_quantity = stock_quantity + " + amt + " WHERE item_id = " + id + ";", function (err, res) {
            if (err) throw err;
            console.log("Stock Updated.");
            connection.end();
        });
    }
}

function printOrder(res, amount) {
    console.log("Purchase made! You bought " + amount + " " + res.product_name + "(s) for $" + (res.price * amount) + ".");

}
printProducts();
