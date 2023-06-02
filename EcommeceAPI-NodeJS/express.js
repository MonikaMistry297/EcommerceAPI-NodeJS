const express = require("express")

var products = require("./routes/products");
var users = require("./routes/users")
var items = require("./routes/items");
var orders = require("./routes/orders")

const app = express();

// // moongose for datadata store in mogodb database

// // step:1 
// var moongose = require("mongoose");

// // step: 2 is to create propertise.js file

// //step:3
// var dbURL = require("./propertises").DB_URL;

// // connect with mongoose
// moongose.connect(dbURL);

// moongose.connection.on("connected successfully", () => {

//     console.log("Connected to MongoDB using mongoose.")

// })

// for products api
app.use("/products", products)

//for users api
app.use("/users", users)

//for item api
app.use("/items", items)

//for order api
app.use("/orders", orders)

// for listen port
app.listen(3000, () => {
    console.log("successfully listen");
})