
var request = require('superagent');
    Q = require('q'),
    querystring = require('querystring');

// 
var Clamo = function () {
    
    var host = '/', 
        offset = 0
        limit = 10;
    
    // 
    var promiseOfClamo = function (url, params) {
        var deferred = Q.defer();
        request
            .post(url)
            .send('request='+JSON.stringify([params]))
            .end(function (err, res) {
                if (err) {
                    deferred.reject(new Error(err));
                }
                return deferred.resolve(res);
            });
        return deferred.promise;
    }

    /** API */

    this.search = function (query, p) { // TODO p is optional
        var params = { 
            action: 'search',
            arguments: { 
                'query': query, 
                'limit': p.limit || limit, 
                'offset': p.offset || offset 
            }
        }
        return promiseOfClamo(host, params);
    } 
    
    this.getPost = function (postId) {
        var params = {
            action: 'getPost',
            arguments: { 'id': postId }
        }
        return promiseOfClamo(host, params);
    } 

}

var clamo = new Clamo();

module.exports = {
    search: clamo.search, 
    getPost: clamo.getPost
}
