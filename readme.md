## Hacker news scraper

#### How to run it
* `yarn install` to install the dependencies
* `./hackernews.js --posts i`, with i a positive integer <= 100


#### Libraries
* got : this is the library I use for http requests
* jquery, node-jsdom : this is needed to transform the response text into a DOM object (node-jsdom does this part) that we can then parse easily with css selectors (jquery does this part)
* q : this is the library I use for promises. I use deferred objects for that. There are many other solutions, native es6 promises amongst them.
* stringify-object : used to have a more configurable output (indentations and quotes)
