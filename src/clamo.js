var request = require('superagent');
var superPromise = require('superagent-promises');
var Post  = require('./models/post');
var host;
var opts;

var Clamo = function () {
    
    opts = {
        outputfields: require('./outputfields'),
        limit: 10
    };
    
    /**
     * Returns a promise of a HTTP request to the Clamo API
     */
    var promiseOfClamo = function (params) {
        if (!opts.host) {
            throw 'No host specified for clamo api calls';
        }
        var req = request
            .post(opts.host)
            .type('form')
            .use(superPromise)
            .send({
                request: JSON.stringify([params])
            });

        if (opts.timeout) {
            req.timeout(opts.timeout);
        }
        return req.end();
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
                limit: p.limit || opts.limit,
                offset: p.offset || 0,
                outputfields: opts.outputfields
            }
        };
        return promiseOfClamo(params).then(function (response) {
            return {
                response: response,
                posts: JSON.parse(response.text).map(function (results) {
                    return results.data.results.map(function (result) {
                        return new Post(result);
                    });
                })[0]
            };
        }, function (err) {
            console.error('Failed clamo search: ', query, p, err);
            throw err;
        });
    };
   
    /**
     * Retrieves a single post from a Clamo post id
     */
    this.getPost = function (postId) {
        var params = {
            action: 'getPost',
            arguments: {
                id: postId,
                outputfields: opts.outputfields
            }
        };
        return promiseOfClamo(params).then(function (response) {
            return {
                response: response,
                post: JSON.parse(response.text).map(function (result) {
                    return new Post(result.data);
                })[0]
            };
        }, function (err) {
            console.error('Failed clamo post fetch: ', postId, err);
            throw err;
        });
    };

};

var clamo = new Clamo();

module.exports = {
    search: clamo.search,
    getPost: clamo.getPost,
    config: function (name, val) {
        opts[name] = val;
    },
    Post: Post
};
