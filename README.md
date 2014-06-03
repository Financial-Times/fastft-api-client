[![Build Status](https://travis-ci.org/Financial-Times/fastft-api-client.svg?branch=outputfields-tests)](https://travis-ci.org/Financial-Times/fastft-api-client)

A fastft posts client for the browser or node.js

## Promises

This module depends on es6 Promises being available as a global. At present this needs polyfilling in most environments. Note that popular promise libraries e.g. Q, Reqwest, don't necessarily conform to the es6 standard

### node

    npm install -S es6-promise

Then at the start of your application code

    GLOBAL.Promise = require('es6-promise').Promise;

### Browser

Include the [es6-promise-polyfill](http://s3.amazonaws.com/es6-promises/promise-1.0.0.min.js) or similar in the head of your page

## API

### setHost (str)

Sets the host name for requests to clamo (may contain `http://` etc if your environment requires it)

### getPost (id)

Retrieves a single post from clamo. Returns a promise for an object with two properties

 * `response` : The XHR response object received
 * `post`: An instance of a `Post` model (see below for details) 

### search (query, params)

Retrieves posts matching the given query, ordered by most recent first. Accepts two parameters

 * `query`: A string conforming to clamo's query syntax e.g. `location: London`. Defaults to ''
 * `params`: An object containing two properties - `limit` and `offset` - which enable pagination of results. `limit` defaults to 10 and `offset` to 0

Returns a promise for an object with two properties

 * `response` : The XHR response object received
 * `posts`: An array of instances of the `Post` model (see below for details) 

### Post model

Exposed as a property on the object exported by this module. This contains utilties for accessing properties of a given post. *Exact structure to be determined*

### Clamo search syntax

As well as searching for raw strings clamo will use the foloowing to query a post's metadata

* 'author: name' Restrict by author name
* 'from:date' No earlier than date (dd/mm/YYYY)
* 'to:date' No later than date (dd/mm/YYYY)
* 'status: status' Either 'live' or 'draft'
* '*taxonomy: tag*' Tagged with a tag from a given taxonomy

Use `AND`, `OR`, `NOT`, `(` and `)` to construct complex search terms

e.g. `bananas AND from: "01/12/2013" AND NOT location: "Americas"`

## Tests

To run tests locally run

    npm install; bower install; make test

To debug tests in the browser run

    ./node_modules/karma/bin/karma start --browsers Chrome --singleRun false

(Note you will have to run `make testRebuild` too every time you change a file. If you have `karma-cli` installed globally you can use `karma` instead of `./node_modules/karma/bin/karma`)

To update test data from the clamo api run `make refreshtestdata`


