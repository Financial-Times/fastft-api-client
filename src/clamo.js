
var request = require('superagent');
var superPromise = require('superagent-promises');
var Post  = require('./models/post');
var host;

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
        };

    /**
     * Returns a promise of a HTTP request to the Clamo API
     */
    var promiseOfClamo = function (params) {
        if (!host) {
            throw 'No host specified for clamo api calls';
        }
        return request
            .post(host)
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
        p = p || {};
        var params = {
            action: 'search',
            arguments: {
                query: query || '',
                limit: p.limit || limit,
                offset: p.offset || offset,
                outputfields: outputfields
            }
        };
        return promiseOfClamo(params).then(function (response) {
            return {
                response: response,
                posts: JSON.parse(response.text).map(function (results) {
                    return results.data.results.map(function (result) {
                        return new Post().parse(result);
                    });
                })[0]
            };
        }).catch(function (err) {
            console.log('Failed clamo search: ', query, p, err);
        });
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
        };
        return promiseOfClamo(params).then(function (response) {
            return {
                response: response,
                post: JSON.parse(response.text).map(function (result) {
                    return new Post().parse(result.data);
                })[0]
            };
        }).catch(function (err) {
            console.log('Failed clamo post fetch: ', postId, err);
        });
    };

};

var clamo = new Clamo();

module.exports = {
    search: clamo.search,
    getPost: clamo.getPost,
    setHost: function (h) {
        host = h;
    }
};
