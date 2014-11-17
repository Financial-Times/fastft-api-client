/*global require,describe,beforeEach,it,expect,spyOn*/

var Clamo = require('./../../main'); 
var helpers = require('../../src/handlers');
var superagent = require('superagent');
var mocks = require('../../mocks');

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

describe('Clamo mocks', function() {

    "use strict";

    beforeEach(function() {
         jasmine.Ajax.install();
         Clamo.config('host', 'http://clamo.com/api');
    });
    
    afterEach(function() {
         jasmine.Ajax.uninstall();
    });

    describe(".getPost", function () {

        it('should faithfully mock the getPost endpoint', function(done) {
            jasmine.Ajax.stubRequest(/^http:\/\/clamo\.com\/api/).andReturn({
                status: 200,
                responseText: fixtures.getPost,
                ok: true
            });
            spyOn(helpers, 'post').and.callThrough();
            Clamo
                .getPost(12345)
                .then(function (real) {
                    expect(helpers.post.calls.count()).toBe(1);

                    mocks.getPost(fixtures.getPost)().then(function (fake) {
                        expect(real.post).toEqual(fake.post);
                        done(); 
                    });
                    
                    expect(helpers.post.calls.count()).toBe(2);     
                                  
                }
            );
        });           
    });  
          
    describe(".search", function () {

        it('should faithfully mock the search endpoint', function(done) {
            jasmine.Ajax.stubRequest(/^http:\/\/clamo\.com\/api/).andReturn({
                status: 200,
                responseText: fixtures.firstPage,
                ok: true
            });
            spyOn(helpers, 'search').and.callThrough();
            Clamo
                .search()
                .then(function (real) {
                    expect(helpers.search.calls.count()).toBe(1);

                    mocks.search(fixtures.firstPage)().then(function (fake) {
                        expect(real.posts).toEqual(fake.posts);
                        done(); 
                    });
                    expect(helpers.search.calls.count()).toBe(2);   
                }
            );
        });
            

    });
});
