'use strict';

const execSync = require('child_process').execSync;
const newCache = require('persistent-cache');
const cache = newCache({
    name: "response-cache",
    duration: 1000 * 3600, // 1h
    memory: true,
    persist: true,
});

module.exports = function check(packageName) {
    let response = cache.getSync(packageName);
    if (!response) {
        console.log("Cache miss for", packageName);
        response = doCheck(packageName);
        cache.put(packageName, response);
    }
    return response;
}

function doCheck(packageName) {
    const response = {
        "package": packageName,
        "exists-in-flow": checkFlow(packageName),
        "exists-in-typescript": checkTypescript(packageName),
    };
    return response;
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
