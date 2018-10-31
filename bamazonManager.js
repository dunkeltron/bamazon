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

function printLowInv() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;

        console.log("item_id | Name | Quantity");
        res.forEach(element => {
            console.log(element.item_id + " | " + element.product_name + " | " + element.stock_quantity);
        });
        connection.end();
    })
}
function addInventory(){
    inquirer.prompt([
        {
            message:"What is the item ID of the item you would like to restock?",
            name:"id"
        },
        {
            message:"How much stock are you adding to inventory?",
            name:"amount"
        }
    ]).then(function (answer){
        var intID = parseInt(answer.id);
        var intAmt = parseInt(answer.amount);
        if(intAmt<0){
            console.log("Resupply amount cannot be less than zero.");
            return;
        }
        else{
            var queryString = "UPDATE products SET stock_quantity = stock_quantity + " + intAmt + " WHERE item_id = " + intID + ";";
            connection.query(queryString,function(err,res){
                if (err) throw err;

                console.log("Stock updated!");
            })
        }
        connection.end();
    });
}
function validatePrice(price){
    if(isNaN(price)){
        console.log();
        console.log("Price must be number.")
        return false;
    }
    else if (parseInt(price) <0 ){
        console.log();
        console.log("Price must be a positive integer.")
        return false;
    }
        return true;
}
function validateAmount(amt){
    if(isNaN(amt) || parseInt(amt)<0){
        console.log("Amount of product must be a number larger than zero.");
        return false;
    }
    return true;
}
function addNewProduct(){
    inquirer.prompt([
        {
            message:"What is the name of the product you would like to add?",
            name:"name"
        },
        {
            message:"What department does the new product belong in?",
            name:"deptName"
        },
        {
            message:"What is the price of the new product?",
            name:"price"
        },
        {
            message:"How many units of the new product are there for sale?",
            name:"amount"
        }
    ]).then(function (answer){
        if(validatePrice(answer.price) && validateAmount(answer.amount)){
            var queryString = "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (\'"+
            answer.name.toUpperCase()+"\', \'"+answer.deptName.toUpperCase()+"\', "+ answer.price +", "+answer.amount+");";
            console.log(queryString);
            connection.query(queryString,function(err,res){
                if (err) throw err;
                console.log("product added!");
            })
        }
        connection.end();
        console.log(answer.name,answer.price, answer.amount);
    });
}

function managerInput() {
    inquirer.prompt([{
        name: "method",
        type: "list",
        message: "Which action would you like to perform?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (answer) {
        if (answer.method.toUpperCase() === "VIEW PRODUCTS FOR SALE") {
            printProducts();
        } else if (answer.method.toUpperCase() === "VIEW LOW INVENTORY") {
            printLowInv();
        } else if (answer.method.toUpperCase() === "ADD TO INVENTORY") {
            addInventory();
        } else if (answer.method.toUpperCase() === "ADD NEW PRODUCT") {
            addNewProduct();
        } else {
            console.err("Unexpected selection.");
        }
    });

}
managerInput();