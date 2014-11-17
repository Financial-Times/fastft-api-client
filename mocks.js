'use strict';

var handlers = require('./src/handlers');

module.exports = {
    search: function (fixture) {
        return function () {
            return Promise.resolve(handlers.search({
                text: fixture
            }));
        }
    },
    getPost: function (fixture) {
        return function () {
            return Promise.resolve(handlers.post({
                text: fixture
            }));
        }
    }
};