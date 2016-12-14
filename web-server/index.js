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
    console.log(new Date(), JSON.stringify(response));

    const c = log[response.package] || 0;
    log[response.package] = c + 1;
    persist(log, "log.json");
    delete response.package;
}

function persist(obj, file) {
    fs.writeFile(file, JSON.stringify(obj), (err) => {
        if (err){
            console.log("Failed writing file " + file + ", " + JSON.stringify(err));
        }
    });
}

function getTop(cb) {
    topCache.get("top", (err, top) => {
        if (err) { cb(err, undefined); }

        if (top) {
            cb(undefined, top);
        } else {
            console.log("Top list cache miss");
            doGetTop((top) => {
                topCache.put("top", top);
                cb(undefined, top);
            });
        }
    });
}

function doGetTop(cb) {
    const topPackageNames = Object.keys(log).sort(function(a, b) {
            return log[b] - log[a];
        })
        .splice(0, 10);
        console.log("Generating top: ", topPackageNames);

    let agg = [];
    const counter = (err, pkg) => {
        console.log("Top got check response for", pkg, err);
        if (err) {
            agg.push({});
        } else {
            agg.push(pkg);
        }

        if (agg.length === topPackageNames.length) {
            console.log("All top packages have been checked");
            agg = agg.sort(function(a, b) {
                return log[b] - log[a];
            });
            cb(agg);
        }
    };

    if (topPackageNames.length === 0) {
        cb(topPackageNames);
    } else {
        topPackageNames.forEach(pkg => check(pkg, counter));
    }
}

app.get('/check/:packageName', function (req, res) {
    const packageName = req.params.packageName;
    const response = check(packageName, (err, response) => {
        if (err) {
            console.error("Error while responding to /check/" + packageName, err);
            res.send("could not reply to request");
        } else {
            logPackageCheck(response);
            res.send(response);
        }
    });
});

app.get('/top', function (req, res) {
    const top = getTop((err, top) => {
        if (err) {
            console.error("Error while responding to /top", err);
            res.send("could not reply to request");
        } else {
            res.send(top);
        }
    });
});

app.use(express.static('front-end'));

app.listen(3000, function () {
    console.log('App listening on port 3000!')
});
