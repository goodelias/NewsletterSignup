const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
    apiKey: "62b9792e4c382e42389696092ca5dae2-us1",
    server: "us1",
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    const run = async () => {
        try {
            const response = await mailchimp.lists.addListMember("4196a67dd1", {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            console.log(response);
            res.sendFile(__dirname + "/success.html")
        } catch (err) {
            console.log(err.status);
            res.sendFile(__dirname + "/failure.html")
        }
    };

    run();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
})

// API Key
// 62b9792e4c382e42389696092ca5dae2-us1

// List Id 
// 4196a67dd1