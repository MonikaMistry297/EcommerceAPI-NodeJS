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

let products = JSON.parse(fs.readFileSync(__dirname + "/" + "products.json"))


router.get("/product-details", (req, res) => {
    res.status(200).json({
        status: "Success",
        count: products.length,
        data: {
            products: products
        }
    })

})

router.post("/create-product", (req, res) => {

    const newId = products[products.length - 1].id + 1;

    const newproduct = Object.assign({ id: newId }, req.body)

    products.push(newproduct);

    fs.writeFile(__dirname + "/" + "products.json", JSON.stringify(products), (err) => {
        res.status(201).json({
            status: "Success",
            data: {
                products: newproduct
            }
        })
    })

})

router.get("/get-product/:id", (req, res) => {

    let retriveproduct = products.find(product => product.id === req.params.id * 1);
    res.status(200).json({
        status: "Success",
        data: {
            products: retriveproduct
        }
    })

})

router.put("/update-product/:id", (req, res) => {

    let updateproduct = products.find(product => product.id === req.params.id * 1);

    let index = products.indexOf(updateproduct);
    Object.assign(updateproduct, req.body);

    products[index] = updateproduct;

    fs.writeFile(__dirname + "/" + "products.json", JSON.stringify(products), (err) => {
        res.status(200).json({
            status: "Success",
            data: {
                products: updateproduct
            }
        })
    })

})

router.delete("/delete-product/:id", (req, res) => {

    let deleteproduct = products.find(product => product.id === req.params.id * 1);

    if (!deleteproduct) {

        return res.status(404).json({
            status: "Fail",
            message: `No product found for Id ${req.params.id}.`
        })

    }

    const index = products.indexOf(deleteproduct);

    products.splice(index, 1)

    fs.writeFile(__dirname + "/" + "products.json", JSON.stringify(products), (err) => {
        res.status(204).json({
            status: "Success",
            data: {
                products: null
            }
        })
    })

})

// request number in url and show data that data in response
router.get("/search/:key([0-9]{4})", (req, res) => {

    let searchproduct = users.find(user => user.firstname === req.params.key);
    res.status(200).json({
        status: "Success",
        data: {
            users: searchproduct
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