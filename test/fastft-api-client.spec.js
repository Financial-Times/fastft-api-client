/*global require,describe,beforeEach,it,expect,spyOn*/

var Clamo = require('./../main'); 
var Post = require('./../src/models/post'); 

var fixtures = {
    getPost: '[{ "status": "ok", "data": { "id": 147292, "title": "RBS stands ..." } }]',
    firstPage: JSON.stringify(require('./stubs/first-page'))
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
	
        xit('should catch errors returned by the service', function() {
                // jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
                //     status: 404,
                //     responseText: 'Not found',
                //     ok: true
                // });
                // Clamo.getPost(147292)
                //     .then(function (res) {
                //         expect(JSON.parse(res.response.text)[0].data.id).toBe(147292);
                //         expect(res.post.constructor).toBe(Post);
                //         done();
                //     }
                // );
        });

        describe(".getPost", function () {
            beforeEach(function () {
                jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
                    status: 200,
                    responseText: fixtures.getPost,
                    ok: true
                });
            })
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


                Clamo.getPost(147292)
                    .then(function (res) {
                        expect(JSON.parse(res.response.text)[0].status).toBe('ok');
                        expect(res.post.constructor).toBe(Post);
                        expect(res.post.id).toBe(147292);
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
                        expect(postBody.arguments.outputfields).toEqual({
                            id: true,
                            title: true,
                            content: 'html',
                            abstract: 'html',
                            datepublished: true,
                            shorturl: true,
                            metadata: true,
                            tags: 'visibleonly',
                            authorpseudonym: 'true'
                        });
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

            it('should return a list of posts and teh original response', function(done) {
                Clamo.search()
                    .then(function (res) {
                        expect(JSON.parse(res.response.text)[0].status).toBe('ok');

                        expect(res.posts.length).toBe(10);
                        expect(res.posts[0].constructor).toBe(Post);
                        expect(res.posts[0].id).toBe(156442);
                        done();
                    });
            });
            
        });
        

	});
});
