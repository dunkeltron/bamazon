var mysql = require("mysql");
var inquirer = require("inquirer");

var productsListGenerated = false;
var numProducts = -1;
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
//id = item_id in sql database
//amt = amount to update item by
//sign = 1 for add amt and -1 for subtract amt
function updateStock(id, amt, sign) {
    if (sign == -1) {
        connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amt + " WHERE item_id = " + id + ";", function (err, res) {
            if (err) throw err;
            console.log("Stock Updated.");
        });
    }
    else {
        connection.query("UPDATE products SET stock_quantity = stock_quantity + " + amt + " WHERE item_id = " + id + ";", function (err, res) {
            if (err) throw err;
            console.log("Stock Updated.");
        });
    }
    connection.end();
}

function printProducts() {
    numProducts=0;
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("item_id  |  Name  |  Price  |  Quantity");
        res.forEach(element => {
            numProducts++;      //used for item_id validation later
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
function addInventory() {
    inquirer.prompt([
        {
            message: "What is the item ID of the item you would like to restock?",
            name: "id"
        },
        {
            message: "How much stock are you adding to inventory?",
            name: "amount"
        }
    ]).then(function (answer) {
        //validateAmount returns false if the parameter passed to it is NaN or less than zero so we need to invert the value for intended effect
        if (!validateAmount(answer.amount)) {
            console.log("Resupply amount cannot be less than zero.");
            return;
        }
        if(!validateID(answer.id)){
            console.log("Item ID given doesn't match a product in our database.");
            return;
        }
        else {
            updateStock(answer.id,answer.amount,1);
            numProducts--;
        }
        connection.end();
    });
}
//validates that the argument given is an item id that maps to an entry in the database
function validateID(id){
    if(parseInt(id) > numProducts || parseInt(id) < 1){
        return false;
    }
    return true;
}

//validates that the argument given is a number that works with our database. We don't want a negative price
function validatePrice(price) {
    if (isNaN(price)) {
        console.log();
        console.log("Price must be number.")
        return false;
    }
    else if (parseInt(price) < 0) {
        console.log();
        console.log("Price must be a positive integer.")
        return false;
    }
    return true;
}
//validates that the argument given is a number and is a number that works with our database (we don't want to have stock quantity less than zero)
function validateAmount(amt) {
    if (isNaN(amt) || parseInt(amt) < 0) {
        console.log();
        console.log("Amount of product must be a number larger than zero.");
        return false;
    }
    return true;
}
function addNewProduct() {
    inquirer.prompt([
        {
            message: "What is the name of the product you would like to add?",
            name: "name"
        },
        {
            message: "What department does the new product belong in?",
            name: "deptName"
        },
        {
            message: "What is the price of the new product?",
            name: "price"
        },
        {
            message: "How many units of the new product are there for sale?",
            name: "amount"
        }
    ]).then(function (answer) {
        //check if the price and amount can interpreted as numbers in mysql
        if (validatePrice(answer.price) && validateAmount(answer.amount)) {
            //build the mysql query
            var queryString = "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (\'" +
                answer.name.toUpperCase() + "\', \'" + answer.deptName.toUpperCase() + "\', " + answer.price + ", " + answer.amount + ");";

            //attempt to perform the mysql query
            connection.query(queryString, function (err, res) {
                if (err) throw err;
                console.log("product added!");
            })
        }
        connection.end();
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