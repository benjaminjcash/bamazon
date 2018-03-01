const mysql = require("mysql");
const inquirer = require("inquirer");
const {table} = require("table");

//creates connection to mysql database.
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Denver4855@",
    database: "bamazon"
});

//starts a new purchase.
function newPurchase() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var data = [
            ["ID", "Product", "Department", "Price", "Stock Quantity"],
        ];
        for (var i = 0; i < res.length; i++) {
            var row = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity];
            data.push(row);
        }
        console.log("\n");
        //displays product chart.
        console.log(table(data));
        //asks what product you would like to purchase.
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the ID of the product you would like to purchase",
                name: "id",
                validate: function (value) {
                    var pass = value.match('^[0-9]+$');
                    if (pass) {
                        return true
                    } else {
                        return "Please enter a valid ID"
                    }
                }
            },
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "quantity",
                validate: function (value) {
                    var pass = value.match('^[0-9]+$');
                    if (pass) {
                        return true
                    } else {
                        return "Please enter a valid quantity"
                    }
                }
            }
        ]).then(function (res) {
            var productId = res.id;
            var quantityRequested = res.quantity;
            //selects quantity of chosen product.
            connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: productId }, function (err, res) {
                if (err) throw err;
                var currentQuantity = res[0].stock_quantity;
                //checks if we have enough product in stock to fill the order.
                if (quantityRequested > currentQuantity) {
                    //if there is not enough product in stock, displays error message.
                    console.log("........\n");
                    console.log("Sorry, we don't have enough in stock!");
                    console.log("........\n");
                    inquirer.prompt([
                        {
                            type: "confirm",
                            message: "Want to make another purchase?",
                            name: "confirm"
                        }
                    ]).then(function(res) {
                        
                            console.log("Just take a look at our selection:");
                            newPurchase();  
                    })            
                } else {
                    //if there is enough product in stock, decreases quantity in database, calculates cost, concludes order.
                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: currentQuantity - quantityRequested}, {item_id: productId}], function (err, res) {
                        if (err) throw err;
                        connection.query("SELECT price FROM products WHERE ?", {item_id: productId}, function (err, res) {
                            if (err) throw err;
                            var cost = res[0].price * quantityRequested;
                            console.log("........\n");
                            console.log("That will be $" + cost);
                            console.log("Your order is complete\n");
                            console.log("........");
                            newPurchase();
                        })
                    })
                }  
            })
        })
    })
}

//connects to database, and starts the program.
connection.connect(function (err) {
    if (err) throw err;
    newPurchase();
})