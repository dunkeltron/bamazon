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
function printProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("item_id  |  Name  |  Price  |  Quantity");
        res.forEach(element => {
            console.log(element.item_id + " | " + element.product_name + " | " + element.price + "  |  " + element.stock_quantity);
        });
        connection.end();
    });
}
function printLowInv(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res){
        if (err) throw err;
        
        console.log("item_id | Name | Quantity");
        res.forEach(element => {
            console.log(element.item_id + " | " + element.product_name + " | " + element.stock_quantity);
        });
        connection.end();
    })
}
function managerInput(){
    inquirer.prompt([
        {   
            name:"method",
            type:"list",
            message: "Which action would you like to perform?",
            choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
        }
    ]).then(function (answer){
        if(answer.method.toUpperCase() === "VIEW PRODUCTS FOR SALE"){
            printProducts();
        }
        else if(answer.method.toUpperCase() === "VIEW LOW INVENTORY"){
            printLowInv();
        }
        else if(answer.method.toUpperCase() === "ADD TO INVENTORY"){
            addInventory();
        }
        else if(answer.method.toUpperCase() === "ADD NEW PRODUCT"){
            addNewProduct();
        }
        else{
            console.err("Unexpected selection.");
        }
    });
}