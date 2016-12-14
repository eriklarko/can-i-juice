const fs = require("fs");
const check = require("./check");
const express = require('express');
const app = express();
const newCache = require('persistent-cache');
const topCache = newCache({
    name: "top-cache",
    duration: 1000 * 60 * 10, // 10 min
    memory: true,
    persist: true,
});

let log;
try {
    log = JSON.parse(fs.readFileSync("log.json"));
} catch (e) {
    console.log("No log!", e.message);
    log = {};
}

function logPackageCheck(response) {
    console.log(new Date(), response);

    const c = log[response.package] || 0;
    log[response.package] = c + 1;
    persist(log, "log.json");
    delete response.package;
}

function persist(obj, file) {
    fs.writeFile(file, JSON.stringify(obj), (err) => {
        if (err){
            console.log("Failed writing file " + file + ", " + JSON.stringify(err));
        } else {
            console.log('It\'s saved!');
        }
    });
}

function getTop() {
    let top = topCache.getSync("top");
    if (!top) {
        console.log("Top list cache miss");
        top = doGetTop();
        topCache.put("top", top);
    }
    return top;
}

function doGetTop() {
    return Object.keys(log).sort(function(a, b) {
            return log[b] - log[a];
        })
        .reduce((aggr, elem) => {aggr.push(check(elem)); return aggr;}, []);
}

app.get('/check/:packageName', function (req, res) {
    const packageName = req.params.packageName;
    const response = check(packageName);
    logPackageCheck(response);
    res.send(response);
});

app.get('/top', function (req, res) {
    const top = getTop();
    res.send(top);
});

app.use(express.static('front-end'));

app.listen(3000, function () {
    console.log('App listening on port 3000!')
});
