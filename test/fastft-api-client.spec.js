/*global require,describe,beforeEach,it,expect,spyOn*/

var Clamo = require('./../main'); 

var fixtures = 
    {
        getPost: '[{ "status": "ok", "data": { "id": 147292, "title": "RBS stands ..." } }]'
    }

describe('Clamo', function() {

	"use strict";

	beforeEach(function() {
	     jasmine.Ajax.install();
    });
	
    afterEach(function() {
	     jasmine.Ajax.uninstall();
    });

	describe("Clamo", function () {
		
		it('should exist', function() {
			expect(Clamo).toBeDefined();
		});
            
        describe("client", function () {
 
            // clamo is particular about what it receives, so this test sanity
            // checks the request from fastft-api-client -> clamo
            it('should query Clamo API', function(done) {
                jasmine.Ajax.stubRequest('http://clamo.com/api')
                Clamo
                    .withHost('http://clamo.com/api')
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
                )
            });

            it('should time the request latency', function(done) {
                jasmine.Ajax.stubRequest('http://clamo.com/api')
                Clamo
                    .withHost('http://clamo.com/api')
                    .getPost(12345)
                    .then(function (res) {
                        var request = jasmine.Ajax.requests.mostRecent();
                        expect(res.latency).toMatch(/^\d+$/);
                        done();
                    }
                )
            });

        });
	
        it('should catch errors returned by the service', function() { });
        
        describe(".search", function () {
            it('should return a list of search results', function() { });
        });
        
        describe(".getPost", function () {
            
            it('retrieve a given post', function(done) {
                jasmine.Ajax.stubRequest('http://clamo.com/api').andReturn({
                    status: 200,
                    responseText: fixtures.getPost,
                    ok: true
                })
                Clamo
                    .withHost('http://clamo.com/api')
                    .getPost(147292)
                    .then(function (res, a) {
                        debugger;
                        expect(JSON.parse(res.text)[0].data.id).toBe(147292);
                        done();
                    }
                )
            });
            
        });	    
	});
});
