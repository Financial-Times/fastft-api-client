A Clamo (AKA. fastFT) API client, for use from node.js and within the browser.

## Usage

The latest 10 posts,

```
Clamo
.search('location: London')
.then(function (results) {
    ...
})
```

An individual post,

```
Clamo
.getPost(147292)
.then(function (results) {
    ...
})
```

Each Clamo method returns a promise, so you can chain the promise methods together like so,

```
Clamo
 .search()
 .then(fn)
 .catch(fn)
 .done(fn)
```

It's also possible to page through the search results with the offset & limit parameters,

```
Clamo
.search('location: London', { offset: 7, limit: 20 })
.then(function (results) {
    ...
})
```
