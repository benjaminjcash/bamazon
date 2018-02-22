const mysql = require("mysql");
const inquirer = require("inquirer");
const {table} = require("table");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Denver4855@",
    database: "bamazon"
});

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
        console.log(table(data));
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
            connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: productId }, function (err, res) {
                if (err) throw err;
                var currentQuantity = res[0].stock_quantity;
                if (quantityRequested > currentQuantity) {
                    console.log("........\n");
                    console.log("Sorry, we don't have enough in stock!");
                    console.log("........\n");
                    newPurchase();                  
                } else {
                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: currentQuantity - quantityRequested}, {item_id: productId}], function (err, res) {
                        if (err) throw err;
                        connection.query("SELECT price FROM products WHERE ?", {item_id: productId}, function (err, res) {
                            if (err) throw err;
                            var cost = res[0].price * quantityRequested;
                            console.log("........\n");
                            console.log("That will be $" + cost);
                            console.log("Your order is complete");
                            console.log("........\n");
                            newPurchase();
                        })
                    })
                }  
            })
        })
    })
}

connection.connect(function (err) {
    if (err) throw err;
    newPurchase();
})