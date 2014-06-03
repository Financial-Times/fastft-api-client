/*global require,describe,beforeEach,it,expect,spyOn*/

var Clamo = require('./../../main'); 
var Post = require('./../../src/models/post'); 

var fixtures = { 
    firstPage: JSON.stringify(require('../stubs/search.json')),
    getPost: JSON.stringify(require('../stubs/post.json'))
};

var testdata = { 
    firstPage: require('../stubs/search.json')[0].data.results,
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
            Clamo.setHost('http://clamo.com/api');
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
                spyOn(console, 'debug');         
            });

            it('should log errors returned by the single post service but not catch them', function (done) {

                function checkHandler () {
                    expect(success).not.toHaveBeenCalled();
                    done();
                }

                Clamo.getPost(147292)
                    .then(success, function (err) {
                        var lastLogged = console.debug.calls.argsFor(0);
                        expect(console.debug).toHaveBeenCalled();
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
                        var lastLogged = console.debug.calls.argsFor(0);
                        expect(console.debug).toHaveBeenCalled();
                        expect(lastLogged[0]).toBe('Failed clamo search: ');
                        expect(lastLogged[1]).toBe('test');
                        expect(lastLogged[2]).toEqual({limit: 5, offset: 8});
                        expect(lastLogged[3].text).toBe('{"msg":"Malformed API request"}');

                        expect(err.text).toBe('{"msg":"Malformed API request"}');
                        
                    }).then(checkHandler, checkHandler);

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
        

	});
});
