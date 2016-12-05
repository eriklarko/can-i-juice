const check = require("./check");
const express = require('express')
const app = express()

function logPackageCheck(response) {
    console.log(new Date(), response);
    delete response.package;
}

app.get('/check/:packageName', function (req, res) {
    const packageName = req.params.packageName;
    const response = check(packageName);
    logPackageCheck(response);
    res.send(response);
});

app.get('/', function (req, res) {
    res.send("Here be pretty react file. Oh yeah");
});

app.listen(3000, function () {
    console.log('App listening on port 3000!')
});
