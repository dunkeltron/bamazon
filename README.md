# bamazon
This project is supposed to simulate a stripped down product database.
The project uses mysql and node so make sure those are installed before running.

Before running the javascript files the user should run schema.sql in mysql.

*  __After getting the mysql connection up and running make sure to modify the port, user, and password fields in the javascript files to match those of your mysql connection.__
* Your var connection should look like this in both bamazonCustomer.js and bamazonManager.js
```javascript
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: yourPort,

    // Your username; if not root
    user: yourUsername,

    // Your password; if not blank
    password: yourPassword,
    database: "productsDB"
});
```

# bamazonCustomer
* The bamazonCustomer file connects to the product database and prints the entirety of the table.
The customer can then pick out and choose which item they want to buy and how much of that item they want to buy. 
**There is currently no support for buying multiple different items at this time.**
* The customer must enter an id number greater than zero and less than the number of products in the list.
* If the customer enters an invalid product id number the program will print a message then exit without making a purchase. There are examples of this error here.
* Similarly if the customer enters and invalid number of items to purchase the program will print a message then exit without making a purchase.

# Example Screenshots #
[Entering a string into purchase amount.](./images/bamazonCustomer/amtPurchaseNotNum.png)
[Entering a product ID less than the range of product IDs.](./images/bamazonCustomer/idLessThanRange.png)
[Entering a product ID greater than the range of product IDs.](./images/bamazonCustomer/idMoreThanRange.png)
[Entering a string as a product ID.](./images/bamazonCustomer/idNotNum.png)
[Entering a negative number as a purchase amount.](./images/bamazonCustomer/purchaseNegative.png)
[Entering zero as a purchase amount.](./images/bamazonCustomer/purchasezero.png)

# bamazonManager
The bamazonManager file also connects to the product database. However, this file makes more extensive use of the data.
The manager file can print all products, print products with less than 5 remaining in stock, add stock of a specific product, and add a new product all together.
1. View All Products, this method queries the mysql database and prints off the item id number, product name, price and stock of all products in the database.
1. View Low Inventory, this method queries the mysql database for all items with stock_quantity less than 5 and prints them.
1. Add to Inventory, this method allows the user to add more of a specific product to the database. The user must enter the correct product id for the product they want to add more of. The user must also enter a positive integer for the amount to add otherwise the program will print a message and exit without modifying the database.
1. Add New Product, this method will prompt the user for an item name, the department the item will belong in, the price, and the amount of that item available for sale. If the user enters an invalid product ID the program will print a message and exit. If the user enters an invalid price (less than $1 or not a number) the program will print a message and exit.
**Do not put in the dollar sign for price. 

# Example Screenshots #
* [Selecting View Low Inventory](./images/bamazonManager/displayLowInv.png)
* [Selecting View Products For Sale](./images/bamazonManager/displayProducts.png)
* [Entering a product ID less than the range of product IDs.](./images/bamazonManager/idLessThanRange.png)
* [Entering a product ID greater than the range of product IDs.](./images/bamazonManager/idMoreThanRange.png)
* [Entering a string as a product ID.](./images/bamazonManager/idNotNum.png)
* [Adding a new product.](./images/bamazonManager/newProductAdded.png)
* [Entering a string for new product amount.](./images/bamazonManager/newProductAmountNotNum.png)
* [Entering a negative number for a new product amount.](./images/bamazonManager/newProductAmountOutOfRange.png)
* [Entering a negative number for new product price](./images/bamazonManager/newProductPriceOutOfRange.png)
* [Entering a negative number to add to inventory](./images/bamazonManager/restockAmountLessThanZero.png)
* [Entering a string to add to inventory](./images/bamazonManager/restockAmountNotNum.png)
