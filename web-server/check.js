'use strict';

const execSync = require('child_process').execSync;

module.exports = function check(packageName) {
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
