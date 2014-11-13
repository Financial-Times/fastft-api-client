'use strict';

module.exports = {
    search: function (fixture) {
        return Promise.resolve(require('./src/handlers/search')({
            text: fixture
        }));
    },
    getPost: function (fixture) {
        return Promise.resolve(require('./src/handlers/post')({
            text: fixture
        }));
    }
};