/*global require,describe,beforeEach,it,expect,spyOn*/

var Clamo = require('./../../main'); 
var Post = require('./../../src/models/post'); 
var superagent = require('superagent');

var fixtures = { 
    firstPage: JSON.stringify(require('../stubs/cameron.json')),
    getPost: JSON.stringify(require('../stubs/post.json'))
};

var testdata = { 
    firstPage: require('../stubs/cameron.json')[0].data.results,
    getPost: require('../stubs/post.json')[0].data
};

function getRequestData (req) {
    return JSON.parse(decodeURIComponent(req.url).split('request=')[1])[0];
}

describe('Clamo', function() {

	"use strict";

	beforeEach(function() {
	     jasmine.Ajax.install();
    });
	
    afterEach(function() {
	     jasmine.Ajax.uninstall();
    });

    it('should exist', function() {
        expect(Clamo).toBeDefined();
    });

    it('should throw if no host specified', function () {
        expect(Clamo.getPost).toThrow('No host specified for clamo api calls');
    });

	describe("API calls", function () {
		
        beforeEach(function () {
            Clamo.config('host', 'http://clamo.com/api');
        });
        
        describe('error handling', function () {
            var success;

            beforeEach(function () {
                jasmine.Ajax.stubRequest(/^http:\/\/clamo\.com\/api/).andReturn({
                    status: 500,
                    responseText: '{"msg":"Malformed API request"}',
                    ok: true
                });    
                success = jasmine.createSpy('success');  
                spyOn(console, 'error');         
            });

            it('should log errors returned by the single post service but not catch them', function (done) {

                function checkHandler () {
                    expect(success).not.toHaveBeenCalled();
                    done();
                }

                Clamo.getPost(147292)
                    .then(success, function (err) {
                        var lastLogged = console.error.calls.argsFor(0);
                        expect(console.error).toHaveBeenCalled();
                        expect(lastLogged[0]).toBe('Failed clamo post fetch: ');
                        expect(lastLogged[1]).toBe(147292);
                        expect(lastLogged[2].text).toBe('{"msg":"Malformed API request"}');

                        expect(err.text).toBe('{"msg":"Malformed API request"}');
                        
                    }).then(checkHandler, checkHandler);

            });

            it('should log errors returned by the search service but not catch them', function (done) {

                function checkHandler () {
                    expect(success).not.toHaveBeenCalled();
                    done();
                }

                Clamo.search('test', {
                    limit: 5,
                    offset: 8
                })
                    .then(success, function (err) {
                        var lastLogged = console.error.calls.argsFor(0);
                        expect(console.error).toHaveBeenCalled();
                        expect(lastLogged[0]).toBe('Failed clamo search: ');
                        expect(lastLogged[1]).toBe('test');
                        expect(lastLogged[2]).toEqual({limit: 5, offset: 8});
                        expect(lastLogged[3].text).toBe('{"msg":"Malformed API request"}');

                        expect(err.text).toBe('{"msg":"Malformed API request"}');
                        
                    }).then(checkHandler, checkHandler);

            });
        
        });

        describe('latency reporting', function () {

            it('should be possible to measure request latency for search', function () {
                jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
                    status: 200,
                    responseText: fixtures.firstPage,
                    ok: true
                });
                Clamo.search('test', {
                    limit: 5,
                    offset: 8
                }).then(function (data) {
                    expect(typeof data.response.latency).toBe('number');
                });
            });

            it('should be possible to measure request latency for individual posts', function () {
                jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
                    status: 200,
                    responseText: fixtures.getPost,
                    ok: true
                });
                Clamo
                    .getPost(12345)
                    .then(function (data) {
                        expect(typeof data.response.latency).toBe('number');
                    });
            });

        });

        describe('requested fields', function () {
            var fieldsList;

            beforeEach(function () {
                fieldsList = Object.keys(require('../../src/outputfields'));
                jasmine.Ajax.stubRequest(/^http:\/\/clamo\.com\/api/);
            });

            it('getPost should request the required fields', function () {
                Clamo.getPost(147292);
                var request = jasmine.Ajax.requests.mostRecent();
                var qs = request.url.split('?')[1].split('=')[1];  // extract querystring from url
                var params = JSON.parse(decodeURIComponent(qs));
                expect(Object.keys(params[0].arguments.outputfields)).toEqual(fieldsList);
            });

            it('search should request the required fields', function () {
                Clamo.search('test', {
                    limit: 5,
                    offset: 8
                });
                var request = jasmine.Ajax.requests.mostRecent();
                var qs = request.url.split('?')[1].split('=')[1];  // extract querystring from url
                var params = JSON.parse(decodeURIComponent(qs));
                expect(Object.keys(params[0].arguments.outputfields)).toEqual(fieldsList);
            });
        });

        describe(".getPost", function () {
            beforeEach(function () {
                jasmine.Ajax.stubRequest(/^http:\/\/clamo\.com\/api/).andReturn({
                    status: 200,
                    responseText: fixtures.getPost,
                    ok: true
                });
            });

            it('should query Clamo API', function(done) {
                Clamo
                    .getPost(12345)
                    .then(function () {
                        var request = jasmine.Ajax.requests.mostRecent();
                        
                        expect(request.url).toContain('http://clamo.com/api?request=%5B');
                        expect(request.method).toBe('GET');
                        var sentData = getRequestData(request);
                        expect(sentData.action).toBe('getPost');
                        expect(sentData.arguments.id).toBe(12345);
                        done();
                    }
                );
            });


            it('retrieve a given post', function(done) {

                Clamo.getPost(testdata.getPost.id)
                    .then(function (res) {
                        expect(JSON.parse(res.response.text)[0].status).toBe('ok');
                        expect(res.post.constructor).toBe(Post);
                        expect(res.post.id).toBe(testdata.getPost.id);
                        done();
                    });
            });
            
        });  
              
        describe(".search", function () {
            beforeEach(function () {
                jasmine.Ajax.stubRequest(/^http:\/\/clamo\.com\/api/).andReturn({
                    status: 200,
                    responseText: fixtures.firstPage,
                    ok: true
                });
            });

            it('should query Clamo API', function(done) {
                Clamo
                    .search()
                    .then(function () {
                        var request = jasmine.Ajax.requests.mostRecent();
                        
                        expect(request.url).toContain('http://clamo.com/api?request=%5B');
                        expect(request.method).toBe('GET');
                        var sentData = getRequestData(request);
                        expect(sentData.action).toBe('search');
                        expect(sentData.arguments.outputfields).toEqual(require('../../src/outputfields'));
                        done();
                    }
                );
            });

            it('should use default values for a request', function(done) {

                Clamo.search()
                    .then(function (res) {
                        var request = jasmine.Ajax.requests.mostRecent();
                        var sentData = getRequestData(request);
                        var args = sentData.arguments;
                        expect(args.limit).toBe(10);
                        expect(args.offset).toBe(0);
                        expect(args.query).toBe('');
                        done();
                    });
            });

            it('should allow default values to be overridden', function(done) {
                Clamo.search('testquery:forstuff', {
                    limit: 30,
                    offset: 60
                })
                    .then(function (res) {
                        var request = jasmine.Ajax.requests.mostRecent();
                        var sentData = getRequestData(request);
                        var args = sentData.arguments;
                        expect(args.limit).toBe(30);
                        expect(args.offset).toBe(60);
                        expect(args.query).toBe('testquery:forstuff');
                        done();
                    });
            });

            it('should return a list of posts and the original response', function(done) {
                Clamo.search()
                    .then(function (res) {
                        expect(JSON.parse(res.response.text)[0].status).toBe('ok');

                        expect(res.posts.length).toBe(10);
                        expect(res.posts[0].constructor).toBe(Post);
                        expect(res.posts[0].id).toBe(testdata.firstPage[0].id);
                        done();
                    });
            });
            
        });

        describe('request method', function () {
            it('should use GET by default', function (done) {
                jasmine.Ajax.stubRequest(/^http:\/\/clamo\.com\/api/).andReturn({
                    status: 200,
                    responseText: fixtures.getPost,
                    ok: true
                });
                spyOn(superagent, 'get').and.callThrough();
                spyOn(superagent, 'post').and.callThrough();
                Clamo.getPost(147292).then(function () {done()});
                expect(superagent.get).toHaveBeenCalled();
                expect(superagent.post).not.toHaveBeenCalled();
            });

            it('should be possible to configure to use POST', function (done) {
                Clamo.config('method', 'POST');
                jasmine.Ajax.stubRequest(/^http:\/\/clamo\.com\/api/).andReturn({
                    status: 200,
                    responseText: fixtures.getPost,
                    ok: true
                });
                spyOn(superagent, 'get').and.callThrough();
                spyOn(superagent, 'post').and.callThrough();
                Clamo.getPost(147292).then(function (res) {
                    expect(JSON.parse(res.response.text)[0].status).toBe('ok');
                    expect(res.post.constructor).toBe(Post);
                    expect(res.post.id).toBe(testdata.getPost.id);
                    Clamo.config('method', 'GET');
                    done();
                });
                expect(superagent.post).toHaveBeenCalled();
                expect(superagent.get).not.toHaveBeenCalled();
            });
        });
        
        describe('configuration', function () {
            beforeEach(function () {
                jasmine.Ajax.stubRequest(/(.*)/).andReturn({
                    status: 200,
                    responseText: fixtures.firstPage,
                    ok: true
                });
            }); 
            it('should be possible to configure limit', function (done) {
                Clamo.config('limit', 2);
                Clamo.search()
                    .then(function (res) {
                        expect(getRequestData(res.response.req).arguments.limit).toBe(2);
                        done();
                    });

            });

            it('should be possible to configure timeout', function (done) {
                 var err = function (err) { console.debug('error', error); done(); }; 
                 Clamo.config('timeout', 50);
                 spyOn(superagent.Request.prototype, 'timeout');
                 Clamo.search().then(done, err);
                 expect(superagent.Request.prototype.timeout).toHaveBeenCalledWith(50);
            });

            it('should be possible to configure ouputfields', function () {
                Clamo.config('outputfields', {ham: 'cheese'});
                Clamo.search()
                    .then(function (res) {
                        expect(JSON.parse(res.response.req._data.request)[0].arguments.outputfields).toEqual({ham: 'cheese'});
                        done();
                    });
            });
        })

	});
});
