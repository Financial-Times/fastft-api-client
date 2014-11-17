'use strict';

var Post = require('./models/post');

exports.post = function (response) {
    return {
        response: response,
        post: JSON.parse(response.text).map(function (result) {
            return new Post(result.data);
        })[0]
    };
};

exports.search = function (response) {
    return {
        response: response,
        posts: JSON.parse(response.text).map(function (results) {
            return results.data.results.map(function (result) {
                return new Post(result);
            });
        })[0]
    };
}; 