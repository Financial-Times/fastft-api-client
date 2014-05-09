A Clamo API client, for use from node.js and within the browser.

## Usage

The latest 10 posts,

```
Clamo
.search()
.then(function (results) {
    console.log(results)
})
```

An individual post,

```
Clamo
.getPost(147292)
.then(function (results) {
    console.log(results)
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
