#!/usr/bin/env node
"use strict"
const argv = require("yargs").argv,
    robot = require("./lib/robot"),
    config = require("./lib/config");

let number = argv.posts ? parseInt(argv.posts) : config.postLimit;
//call the robot
let hackerNews = function () {
    robot(number)
        .then(function (oData) {
            console.log(oData);
            return null;
        })
    return null;
}

//input validation
if (number && (typeof number === "number") && (number > 0) && (number <= config.postLimit)) {
    hackerNews();
} else {
    console.log(`Please check your params\n--posts : how many posts to print. A positive integer <= ${config.postLimit}.`);
}







