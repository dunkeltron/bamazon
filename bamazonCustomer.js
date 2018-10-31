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

function printProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("item_id  |  Name  |  Price  |  Quantity");
        var arr = [];
        numProducts = 0;
        res.forEach(element => {
            console.log(element.item_id + " | " + element.product_name + " | " + element.price + "  |  " + element.stock_quantity);
            numProducts++;
        });
        customerInput();
    });
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
        if (!validateAmount(answer.amount)) {
            console.log("Number of items to purchase must be greater than 0.");
        } else if (!validateID(answer.id)) {
            console.log("Item ID given doesn't match an item in our database!");
        } else {
            connection.query("SELECT * FROM products WHERE item_id = " + answer.id, function (err, res) {
                if (err) throw err;
                if (!hasEnoughStock(res[0].stock_quantity,answer.amount)) {
                    insufficientStock(res[0].product_name, res[0].stock_quantity);
                } 
                else if (!validateAmount(answer.amount) ) {
                    incorrectAmount();
                } 
                else {
                    updateStock(parseInt(answer.id), parseInt(answer.amount));
                    printOrder(res[0], parseInt(answer.amount));
                }
            })
        }
        connection.end();
    })
}
function validateID(id){
    if(parseInt(id) > numProducts || parseInt(id) < 1){
        return false;
    }
    return true;
}
function validateAmount(amt){
    if(isNaN(amt) || parseInt(amt)<0){
        console.log("Amount of product to purchase must be a number larger than zero.");
        return false;
    }
    return true;
}
function incorrectAmount() {
    console.log("Invalid amount. Cannot buy a negative amount of items.");
    connection.end();
}
function hasEnoughStock(stockQty,purchaseQty){
    //
    if (parseInt(stockQty) < parseInt(purchaseQty) || stockQty == 0){
        return false;
    }
    return true;
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

function printOrder(res, amount) {
    console.log("Purchase made! You bought " + amount + " " + res.product_name + "(s) for $" + (res.price * amount) + ".");

}
printProducts();
