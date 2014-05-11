
var request = require('superagent');
    Q = require('q'),
    querystring = require('querystring');

// 
var Clamo = function () {
    
    var host = '/';
    
    var promiseOfClamo = function (url, params) {
        var deferred = Q.defer();
        request
            .get(url, { request: JSON.stringify([params]) })
            .end(function (res) {
                return deferred.resolve(res);
            });
        return deferred.promise;
    }

    /** API */

    this.search = function (query) {
        var params = { 
            action: 'search',
            arguments: { 'query': query }
        }
        return promiseOfClamo(host, params);
    } 
    
    // http://clamo/api?request=[{%22action%22:%22getPost%22,%22arguments%22:{%22id%22:%22147292%22}}]
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
