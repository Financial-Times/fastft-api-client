A Clamo (Athe browser.

## Promises

This module depends on es6 Promises being available as a global. At present this needs polyfilling in most environments

### node

    npm install -S es6-promise

Then at the start of your application code

    GLOBAL.Promise = require('es6-promise').Promise();


### Browser

Include the [es6-promise-polyfill](http://s3.amazonaws.com/es6-promises/promise-1.0.0.min.js) in the head of your page

## Usage

The latest 10 posts,

```
Clamo
  .withHost('xxx.clamo.ft.com')
  .search('location: London')
  .then(function (results) {
    ...
  })
```

An individual post,

```
Clamo
  .withHost('xxx.clamo.ft.com')
  .getPost(147292)
  .then(function (results) {
    ...
  })
```

It's also possible to page through the search results with the offset & limit parameters,

```
Clamo
  .withHost('xxx.clamo.ft.com')
  .search('location: London', { offset: 7, limit: 20 })
  .then(function (results) {
    ...
  })
```
