var mysql = require("mysql");
var inquirer = require("inquirer");

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

function incorrectAmount() {
    console.log("Invalid amount. Cannot buy a negative amount of items.");
    connection.end();
}

function insufficientStock(name, stock) {
    console.log("We don't have enough stock of that item to complete this order.");
    console.log("We currently have " + stock + " " + name + "(s) in stock.")
    connection.end();
}

function updateStock(id, amt) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amt + " WHERE item_id = " + id + ";", function (err, res) {
        if (err) throw err;
    });
    connection.end();
}

function managerInput(){
    inquirer.prompt([
        {   
            name:"method",
            type:"list",
            message: "Which action would you like to perform?"

        }
    ]).then(function (answer){

    });
}