A Clamo (Athe browser.

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
