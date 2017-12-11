"use strict"
const got = require("got"),
    stringify = require('stringify-object'),
    Q = require("q"),
    jsdom = require("node-jsdom"),
    validUrl = require("valid-url"),
    config = require("./config");    

let getDataFromHTML = function (html, number) {
    let d = Q.defer();
    let aData = [];
    //we load jquery in jsdom to be able to query the DOM easily with jquery selectors
    jsdom.env(
        html,
        //latest jQuery lib
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            let $ = window.$;
            /*
            we select all the "headers" and make sure that we get only the number of articles that the user wants
            I first sliced elementsToQuery to ensure that, but some of the entries are skipped
            because they don't pass the validation, causing an incorrect result (not always the requested number of articles)

            To solve this, I have choosen a counter, that can slightly lower the performance as all the elements get parsed,
            but we are sure that we have the correct number in the result. 
            The reason for this is that we cannot break the jQuery loop by a simple "break;" statement, it's a callback
            */
            let elementsToQuery = $(".athing");
            var cnt = 0;
            elementsToQuery.each(function (el) {
                //all the DOM selections happen here
                let id = $(this).attr("id"),
                    info = $(`#${id}`).next().find(".subtext"),
                    title = $(this).find(".storylink").text(),
                    uri = $(this).find(".storylink").attr("href"),
                    author = info.find(".hnuser").html(),
                    points = parseInt(info.find(".score").html()),
                    commentsHTML = info.find(`a[href='hide?id=${id}&goto=news']+a[href='item?id=${id}']`).html(),
                    /*
                    when there is no comment, the html is "discuss", so we set the value to 0 in that case,
                    otherwise this record will be skipped because parseInt will return NaN where we want typeof comments === "number"
                    */
                    comments = commentsHTML ==="discuss" ? 0 : parseInt(commentsHTML),
                    rank = parseInt($(this).find(".rank").html());
                if (
                    (title && title.length > 0 && title.length < 256) &&
                    (author && author.length > 0 && author.length < 256) &&
                    (points && typeof points === "number" && typeof comments === "number" && typeof rank === "number") &&
                    (points >= 0 && comments >= 0 && rank >= 0) &&
                    validUrl.isUri(uri) &&
                    (cnt < number)
                ) {
                    aData.push({
                        title: title,
                        uri: uri,
                        author: author,
                        points: points,
                        comments: comments,
                        rank: rank
                    });
                    cnt++;
                }
            })
            //Let's get a more configurable output (indent, quotes...)
            let prettyData = stringify(aData, {
                indent: '  ',
                singleQuotes: false
            });
            d.resolve(prettyData);
        }
    );
    return d.promise;
}

let robot = function (number) {
    let d = Q.defer();
    got(config.url)
        .then(function (res) {
            getDataFromHTML(res.body, number)
                .then(function (aData) {
                    d.resolve(aData);
                })
        })
    return d.promise;
}


module.exports = robot;