var request = require('superagent');
var superPromise = require('superagent-promises');
var Post  = require('./models/post');
var handlers = require('./handlers');
var host;
var opts;

var Clamo = function () {
    
    opts = {
        outputfields: require('./outputfields'),
        limit: 10,
        method: 'GET',
        maxAge: undefined
    };
    
    /**
     * Returns a promise of a HTTP request to the Clamo API
     */
    var promiseOfClamo = function (params) {

        if (!opts.host) {
            throw 'No host specified for clamo api calls';
        }

        var req,
            payload = {
                request: JSON.stringify([params])
            };

        // ... 
        if (opts.maxAge) {
            payload.maxage = opts.maxAge * Math.round((Date.now()/1000) / opts.maxAge)
        }

        if (opts.method === 'POST') {
            req = request
                .post(opts.host)
                .type('form')
                .send(payload);
        } else if (opts.method === 'GET') {
            req = request
                .get(opts.host)
                .query(payload);
        }

        if (opts.timeout) {
            req.timeout(opts.timeout);
        }

        var start = new Date();
        return req
                .use(superPromise)
                .end()
                .then(function (response) {
                    response.latency = (new Date()).getTime() - start.getTime();
                    return response;
                });
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

        return promiseOfClamo(params).then(handlers.search, function (err) {
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
        return promiseOfClamo(params).then(handlers.post, function (err) {
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
