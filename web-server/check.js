'use strict';

const execSync = require('child_process').execSync;
const newCache = require('persistent-cache');
const cache = newCache({
    name: "response-cache",
    duration: 1000 * 3600, // 1h
    memory: true,
    persist: true,
});

module.exports = function check(packageName, cb) {
    cache.get(packageName, (err, response) => {
        if (err) { cb(err, response)};

        if (response) {
            cb(undefined, response);
        } else {
            console.log("Cache miss for", packageName);
            doCheck(packageName, (response) => {
                cache.put(packageName, response);
                cb(undefined, response);
            });
        }
    });
}

function doCheck(packageName, cb) {
    const response = {
        "package": packageName,
        "exists-in-flow": checkFlow(packageName),
        "exists-in-typescript": checkTypescript(packageName),
    };
    cb(response);
}

function checkFlow(packageName) {
    return run("check-flow.sh", packageName);
}

function checkTypescript(packageName) {
    return run("check-typescript.sh", packageName);
}

function run(cmd, packageName) {
    try {
        execSync(cmd + " " + packageName);
        return true;
    } catch (e) {
        return false;
    }
}
