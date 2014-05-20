
var request = require('superagent');
var querystring = require('querystring');
var superPromise = require('superagent-promises');

// 
var Clamo = function () {
    
    var opts = opts || {},
        httpTimeout = 2000,
        offset = 0,
        limit = 10,
        outputfields = {
            id: true,
            title: true,
            content: 'html',
            abstract: 'html',
            datepublished: true,
            shorturl: true,
            metadata: true,
            tags: 'visibleonly',
            authorpseudonym: 'true'
        }
   
    this.setHost = function (h) {
        host = h;
        return this;
    };

    /**
     * Returns a promise of a HTTP request to the Clamo API
     */
    var promiseOfClamo = function (url, params) {
        return request
            .post(url)
            .type('form')
            .timeout(httpTimeout)
            .use(superPromise)
            .send({
                request: JSON.stringify([params])
            })
            .end();
    };

    /** API */

    /**
     * Retrieves a sequence of posts from Clamo  
     */
    this.search = function (query, p) { // TODO p is optional
        var params = { 
            action: 'search',
            arguments: { 
                'query': query, 
                'limit': p.limit || limit, 
                'offset': p.offset || offset,
                'outputfields': outputfields
            }
        }
        return promiseOfClamo(host, params);
    };
   
    /**
     * Retrieves a single post from a Clamo post id
     */
    this.getPost = function (postId) {
        var params = {
            'action': 'getPost',
            'arguments': {
                'id': postId,
                'outputfields': outputfields
            }
        }
        return promiseOfClamo(host, params);
    }; 

};

var clamo = new Clamo();

module.exports = {
    search: clamo.search, 
    getPost: clamo.getPost,
    withHost: clamo.setHost 
};
