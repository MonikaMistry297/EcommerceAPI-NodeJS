var express = require("express");
var fs = require("fs");
var bodyparser = require('body-parser')

var router = express.Router();

// for middleware
router.use("/", (req, res, next) => {
    console.log("API call received.");
    next();
})

router.use(bodyparser.json())

let orders = JSON.parse(fs.readFileSync(__dirname + "/" + "orders.json"))


router.get("/order-details", (req, res) => {
    res.status(200).json({
        status: "Success",
        count: orders.length,
        data: {
            orders: orders
        }
    })

})

router.post("/create-order", (req, res) => {

    const newId = orders[orders.length - 1].id + 1;

    const newOrder = Object.assign({ id: newId }, req.body)

    orders.push(newOrder);

    fs.writeFile(__dirname + "/" + "orders.json", JSON.stringify(orders), (err) => {
        res.status(201).json({
            status: "Success",
            data: {
                orders: newOrder
            }
        })
    })

})

router.get("/get-order/:id", (req, res) => {

    let retriveOrder = orders.find(order => order.id === req.params.id * 1);
    res.status(200).json({
        status: "Success",
        data: {
            orders: retriveOrder
        }
    })

})

router.put("/update-order/:id", (req, res) => {

    let updateOrder = orders.find(order => order.id === req.params.id * 1);

    let index = orders.indexOf(updateOrder);
    Object.assign(updateOrder, req.body);

    orders[index] = updateOrder;

    fs.writeFile(__dirname + "/" + "orders.json", JSON.stringify(orders), (err) => {
        res.status(200).json({
            status: "Success",
            data: {
                orders: updateOrder
            }
        })
    })

})

router.delete("/delete-order/:id", (req, res) => {

    let deleteOrder = orders.find(order => order.id === req.params.id * 1);

    if (!deleteOrder) {

        return res.status(404).json({
            status: "Fail",
            message: `No order found for Id ${req.params.id}.`
        })

    }

    const index = orders.indexOf(deleteOrder);

    orders.splice(index, 1)

    fs.writeFile(__dirname + "/" + "orders.json", JSON.stringify(orders), (err) => {
        res.status(204).json({
            status: "Success",
            data: {
                orders: null
            }
        })
    })

})

// request number in url and show data that data in response
router.get("/search/:key([0-9]{4})", (req, res) => {

    let searchorder = users.find(user => user.firstname === req.params.key);
    res.status(200).json({
        status: "Success",
        data: {
            users: searchorder
        }
    })
})

// request alphabetic in url and show that data in response
router.get("/search-username/:key([a-zA-Z]{4})", (req, res) => {

    res.send("Searching Requested data is " + req.params.key);

})

// where does not match your req
router.post("*", (req, res) => {

    var resObj = {
        statusCode: 404,
        statusMsg: "URL not found."
    }

    res.send(resObj)
})




module.exports = router;