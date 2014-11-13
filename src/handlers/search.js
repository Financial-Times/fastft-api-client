'use strict';

module.exports = function (response) {
    return {
        response: response,
        posts: JSON.parse(response.text).map(function (results) {
            return results.data.results.map(function (result) {
                return new Post(result);
            });
        })[0]
    };
}; 