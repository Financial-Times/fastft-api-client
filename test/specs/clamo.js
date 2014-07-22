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
                jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
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
            var reporter;

            beforeEach(function () {
                reporter = jasmine.createSpy('latency reporter');  

                Clamo.config('latencyReporter', reporter);
            });

            it('should be possible to measure request latency for search', function () {
                jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
                    status: 200,
                    responseText: fixtures.firstPage,
                    ok: true
                });
                Clamo.search('test', {
                    limit: 5,
                    offset: 8
                }).then(function () {
                    expect(typeof reporter.calls.argsFor(0)[0]).toBe('number');
                    expect(reporter).toHaveBeenCalled();

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
                    .then(function () {
                        expect(typeof reporter.calls.argsFor(0)[0]).toBe('number');
                        expect(reporter).toHaveBeenCalled();
                    });
            });

        });

        describe('requested fields', function () {
            var fieldsList;

            beforeEach(function () {
                fieldsList = Object.keys(require('../../src/outputfields'));
                jasmine.Ajax.stubRequest('http://clamo.com/api');
            });

            it('getPost should request the required fields', function () {
                 Clamo.getPost(147292);
                 var request = jasmine.Ajax.requests.mostRecent();
                 var params = JSON.parse(decodeURIComponent(request.params).substr(8));
                 expect(Object.keys(params[0].arguments.outputfields)).toEqual(fieldsList);
            });

            it('search should request the required fields', function () {
                Clamo.search('test', {
                    limit: 5,
                    offset: 8
                });
                var request = jasmine.Ajax.requests.mostRecent();
                var params = JSON.parse(decodeURIComponent(request.params).substr(8));
                expect(Object.keys(params[0].arguments.outputfields)).toEqual(fieldsList);
            });
        });

        describe(".getPost", function () {
            beforeEach(function () {
                jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
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
                        
                        expect(request.url).toBe('http://clamo.com/api');
                        expect(request.method).toBe('POST');

                        var postBody = JSON.parse(request.data().request[0])[0];
                        expect(postBody.action).toBe('getPost');
                        expect(postBody.arguments.id).toBe(12345);
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
                jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
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
                        
                        expect(request.url).toBe('http://clamo.com/api');
                        expect(request.method).toBe('POST');

                        var postBody = JSON.parse(request.data().request[0])[0];
                        expect(postBody.action).toBe('search');
                        expect(postBody.arguments.outputfields).toEqual(require('../../src/outputfields'));
                        done();
                    }
                );
            });

            it('should use default values for a request', function(done) {

                Clamo.search()
                    .then(function (res) {
                        var request = jasmine.Ajax.requests.mostRecent();
                        var args = JSON.parse(request.data().request[0])[0].arguments;
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
                        var args = JSON.parse(request.data().request[0])[0].arguments;
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
        
        describe('configuration', function () {
            beforeEach(function () {
                jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
                    status: 200,
                    responseText: fixtures.firstPage,
                    ok: true
                });
            }); 
            it('should be possible to configure limit', function (done) {
                Clamo.config('limit', 2);
                Clamo.search()
                    .then(function (res) {
                        expect(JSON.parse(res.response.req._data.request)[0].arguments.limit).toBe(2);
                        done();
                    });

            });

            it('should be possible to configure timeout', function (done) {
                 Clamo.config('timeout', 50);
                 spyOn(superagent.Request.prototype, 'timeout');
                 Clamo.search().then(done);
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
