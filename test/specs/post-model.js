/*global require,describe,beforeEach,it,expect,spyOn*/

'use strict';

var Post = require('./../../src/models/post');
var oDate = require('o-date');

describe('models/post', function() {

    it('should exist', function() {
        expect(Post).toBeDefined();
    });


	describe('getters', function () {

        it('should be possible to get the uuid', function () {
            var post = new Post({
                uuidv3: 'bah'
            });
            expect(post.uuid).toBe('bah');
        });

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
                metadata: {primarytagid: '11'}, // using string as this is the real data returned by the api even though it should be a number
                tags: [
                    {
                        id: 1,
                        tag: 'Incorrect'
                    },
                    {
                        id: 11,
                        tag: 'Correct'
                    }
                ]
            });

            expect(post.primaryTag.tag).toBe('Correct');
            expect(post.primaryTag.classname).toBe('correct');

        });
        it('should fail gracefully when no primary tag exists', function () {
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

        it('should cache the primary tags in a look up table', function () {
            var post = new Post({
                metadata: {primarytagid: 11},
                tags: [
                    {
                        id: 11,
                        tag: 'Other'
                    }
                ]
            });

            expect(post.primaryTag.tag).toBe('Correct');

        });

        it('should provide uri encoded copies of properties that might be put in html atrtibutes', function () {
            var post = new Post({
                title: 'escapeme /',
                tags: [
                    {
                        id: 1,
                        tag: 'incorrect',
                        query: '/ escapeme'
                    }
                ]
            });
            expect(post.encodedTitle).toBe('escapeme%20%2F');
            expect(post.tags[0].encodedQuery).toBe('%2F%20escapeme');
        });

        it('should clean up the shorturl (fixing the stray carriage return)', function () {
         
            var post = new Post({
                shorturl: 'http://thing\r'
            });
            expect(post.shorturl).toBe('http://thing');
        });


        describe('attachments', function () {

            it('should be able to retrieve content from all attachments', function() {
                var content = '<p class="postattachment"><a href="http://ft.com">World business, finance, and political news from the Financial Times - FT.com</a></p>';
                var post = new Post({
                    attachments: [
                        {
                            'mimetype': 'text/html',
                            'path': 'http://ft.com',
                            'content': content
                        }
                    ]
                });
                expect(post.attachments[0].content).toBe(content);
            });

            it('should transform attached images to an img tag', function() {
                var post = new Post({
                    attachments: [
                        {
                            'mimetype': 'image/jpg',
                            'path': 'http://msfhq.com/wp-content/uploads/2011/06/FT.jpg',
                            'content': '<div class="formatted-img" data-src="http://msfhq.com/wp-content/uploads/2011/06/FT.jpg"></div>'
                        }
                    ]
                });
                expect(post.attachments[0].imgsrc).toBe('http://msfhq.com/wp-content/uploads/2011/06/FT.jpg');
            });
            
            it('should fix images with missing HTTP prefixes', function() {
                var post = new Post({
                    attachments: [
                        {
                            'mimetype': 'image/png',
                            'path': '/FT.jpg',
                        }
                    ]
                });
                expect(post.attachments[0].imgsrc).toBe('http://clamo.ftdata.co.uk/files/FT.jpg');
            });

            it('should encode image uris', function() {
                var post = new Post({
                    attachments: [
                        {
                            'mimetype': 'image/png',
                            'path': 'http://msfhq.com/FT image.jpg',
                        }
                    ]
                });
                expect(post.attachments[0].imgsrc).toBe('http://msfhq.com/FT%20image.jpg');
            });

            it('should not blow up if attachments isn\'t an image', function() {
                var post = new Post({
                    attachments: [
                        {
                            'mimetype': 'text/html',
                            'path': 'http://ft.com',
                            'content': '<p class="postattachment"><a href="http://ft.com">Financial Times</a></p>'
                        }
                    ]
                });
                expect(post.attachments[0].content).toBe('<p class="postattachment"><a href="http://ft.com">Financial Times</a></p>');
                expect(post.attachments[0].imgsrc).toBe(undefined);
            });

            it('should not blow up if attachments is empty', function() {
                var post = new Post({
                    attachments: []
                });
                expect(post.attachments.length).toBe([].length);
            });

        });


    });

});
