'use strict';

module.exports = function (response) {
    return {
        response: response,
        post: JSON.parse(response.text).map(function (result) {
            return new Post(result.data);
        })[0]
    };
};