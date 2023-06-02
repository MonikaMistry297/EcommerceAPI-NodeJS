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

let users = JSON.parse(fs.readFileSync(__dirname + "/" + "users.json"))


router.get("/user-details", (req, res) => {
    res.status(200).json({
        status: "Success",
        count: users.length,
        data: {
            users: users
        }
    })

})

router.post("/create-user", (req, res) => {

    const newId = users[users.length - 1].id + 1;

    const newUser = Object.assign({ id: newId }, req.body)

    users.push(newUser);

    fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users), (err) => {
        res.status(201).json({
            status: "Success",
            data: {
                users: newUser
            }
        })
    })

})

router.get("/get-user/:id", (req, res) => {

    let retriveUser = users.find(user => user.id === req.params.id * 1);
    res.status(200).json({
        status: "Success",
        data: {
            users: retriveUser
        }
    })

})

router.put("/update-user/:id", (req, res) => {

    let updateUser = users.find(user => user.id === req.params.id * 1);

    let index = users.indexOf(updateUser);
    Object.assign(updateUser, req.body);

    users[index] = updateUser;

    fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users), (err) => {
        res.status(200).json({
            status: "Success",
            data: {
                users: updateUser
            }
        })
    })

})

router.delete("/delete-user/:id", (req, res) => {

    let deleteUser = users.find(user => user.id === req.params.id * 1);

    if (!deleteUser) {

        return res.status(404).json({
            status: "Fail",
            message: `No user found for Id ${req.params.id}.`
        })

    }

    const index = users.indexOf(deleteUser);

    users.splice(index, 1)

    fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users), (err) => {
        res.status(204).json({
            status: "Success",
            data: {
                users: null
            }
        })
    })

})

// request number in url and show data that data in response
router.get("/search/:key([0-9]{4})", (req, res) => {

    let SearchUser = users.find(user => user.firstname === req.params.key);
    res.status(200).json({
        status: "Success",
        data: {
            users: SearchUser
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