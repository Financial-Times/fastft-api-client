/*global require,describe,beforeEach,it,expect,spyOn*/

'use strict';

var Post = require('./../src/models/post');
var oDate = require('o-date');

describe('models/post', function() {

    it('should exist', function() {
        expect(Post).toBeDefined();
    });


	describe('populating with data', function () {
		
        it('should expose publicly any properties passed in to constructor', function () {
            var post = new Post({
                a: 1,
                b: 2
            });

            expect(post.a).toBe(1);
            expect(post.b).toBe(2);
        });

        it('should expose publicly any properties passed in to the chainable parse method', function () {
            var post = new Post();
            var thing = post.parse({
                a: 1,
                b: 2
            });
            expect(thing).toBe(post);
            expect(post.a).toBe(1);
            expect(post.b).toBe(2);
        });
    });

    describe('getters', function () {

        it('should be possible to retrieve the date in a variety of formats', function () {
            var date = new Date();
            var seconds = Math.round(date.getTime()/1000);
            date.setTime(seconds * 1000);
            var post = new Post({
                datepublished: seconds
            });

            expect(post.datePublished).toBe(oDate.format(date, 'date'));
            expect(post.datetimePublished).toBe(oDate.format(date, 'datetime'));
            expect(post.datePublishedISO).toBe(date.toISOString());
                          

        });

        it('should be possible to retrieve full details of the primary tag', function () {
            var post = new Post({
                metadata: {primarytagid: 11},
                tags: [
                    {
                        id: 1,
                        tag: 'incorrect'
                    },
                    {
                        id: 11,
                        tag: 'correct'
                    }
                ]
            });

            expect(post.primaryTag.tag).toBe('correct');

        });
        it('should fail gracefully when no primary tag', function () {
            var post = new Post({
                metadata: {},
                tags: [
                    {
                        id: 1,
                        tag: 'incorrect'
                    },
                    {
                        id: 11,
                        tag: 'correct'
                    }
                ]
            });

            expect(post.primaryTag).toBe(undefined);

        });

        it('should set a lower case version of the primary tag name', function () {
            var post = new Post({
                metadata: {primarytagid: 11},
                tags: [
                    {
                        id: 11,
                        tag: 'Correct'
                    }
                ]
            });

            expect(post.primaryTag.lowercaseTag).toBe('correct');

        });
    
    });

});
