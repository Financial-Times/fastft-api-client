/*global require,describe,beforeEach,it,expect,spyOn*/

var Clamo = require('./../main'); 

describe('Clamo', function() {

	"use strict";

	beforeEach(function() {
        // ...
	});

	describe("Clamo", function () {
		
		it('should exist', function() {
			expect(Clamo).toBeDefined();
		});
	
        describe("search", function () {

            xit('should return a promise of a search result', function() {
                expect(Clamo.search('location: London').done(
                    function (res) {
                        console.log(res);
                    } 
                )).toBe('');
            });
            
            xit('should return a list of search results', function() {
                expect(Clamo.search('location: London')).toBeDefined();
            });
            
            xit('should catch errors returned by the service', function() {
                expect(Clamo.search('location: xxx')).toBeDefined();
            });
            
            xit('should page through the results', function() {
                expect(Clamo.search('location: xxx', {
                    limit: 3,
                    offset: 12
                })).toBeDefined();
            });
        
        });
        
        describe("getPosts", function () {

            it('success', function() {
                expect(Clamo.getPost(43463)).toBeDefined();
            });
            
        });	    

	});

});
