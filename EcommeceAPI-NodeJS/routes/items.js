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

let items = JSON.parse(fs.readFileSync(__dirname + "/" + "items.json"))


router.get("/item-details", (req, res) => {
    res.status(200).json({
        status: "Success",
        count: items.length,
        data: {
            items: items
        }
    })

})

router.post("/create-item", (req, res) => {

    const newId = items[items.length - 1].id + 1;

    const newItem = Object.assign({ id: newId }, req.body)

    items.push(newItem);

    fs.writeFile(__dirname + "/" + "items.json", JSON.stringify(items), (err) => {
        res.status(201).json({
            status: "Success",
            data: {
                items: newItem
            }
        })
    })

})

router.get("/get-item/:id", (req, res) => {

    let retriveItem = items.find(item => item.id === req.params.id * 1);
    res.status(200).json({
        status: "Success",
        data: {
            items: retriveItem
        }
    })

})

router.put("/update-item/:id", (req, res) => {

    let updateItem = items.find(item => item.id === req.params.id * 1);

    let index = items.indexOf(updateItem);
    Object.assign(updateItem, req.body);

    items[index] = updateItem;

    fs.writeFile(__dirname + "/" + "items.json", JSON.stringify(items), (err) => {
        res.status(200).json({
            status: "Success",
            data: {
                items: updateItem
            }
        })
    })

})

router.delete("/delete-item/:id", (req, res) => {

    let deleteItem = items.find(item => item.id === req.params.id * 1);

    if (!deleteItem) {

        return res.status(404).json({
            status: "Fail",
            message: `No item found for Id ${req.params.id}.`
        })

    }

    const index = items.indexOf(deleteItem);

    items.splice(index, 1)

    fs.writeFile(__dirname + "/" + "items.json", JSON.stringify(items), (err) => {
        res.status(204).json({
            status: "Success",
            data: {
                items: null
            }
        })
    })

})

// request number in url and show data that data in response
router.get("/search/:key([0-9]{4})", (req, res) => {

    let searchItem = users.find(user => user.firstname === req.params.key);
    res.status(200).json({
        status: "Success",
        data: {
            users: searchItem
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