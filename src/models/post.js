'use strict'

var oDate = require('o-date');
var primaryTagTable = {};

function getTag (id, tags) {
    for (var i = 0, il = tags.length;i<il;i++) {
        if (id == tags[i].id) {
            tags[i].classname = tags[i].tag.toLowerCase().replace(' ', '-');
            primaryTagTable[tags[i].id] = tags[i];
            return tags[i];
        }
    }
}

function isAnImage (mimetype) {
    return /^image\//.test(mimetype);
}

function fixImagePath (path) {
    return encodeURI(!/^http/.test(path) ? 'http://clamo.ftdata.co.uk/files' + path : path);
}

function addGetter (name, func) {
    Object.defineProperty(postProto, name, {
        get: func
    });
}

// Represents a single fastFt blog post 
var Post = function (obj) {
    obj && this.parse(obj);
};

var postProto = Post.prototype;

postProto.parse = function (obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.uuid = obj.uuidv3;
    this.content = obj.content;
    this.abstract = obj.abstract;
    this.datepublished = obj.datepublished;
    this._shorturl = obj.shorturl;
    this.metadata = obj.metadata;
    this.tags = obj.tags;
    this.slug = obj.slug;
    this.authorpseudonym = obj.authorpseudonym;

    this._datePublished = new Date(0);
    this._datePublished.setTime(obj.datepublished * 1000);
    this._attachments = obj.attachments;
    this.uriEncodeTags();
    return this;
};

postProto.uriEncodeTags = function () {
    this.tags && this.tags.forEach(function (tag) {
        tag.encodedQuery = encodeURIComponent(tag.query);
    });
};

addGetter('datePublishedISO', function () {
    return this._datePublished.toISOString();
});

addGetter('encodedTitle', function () {
    return encodeURIComponent(this.title);
});

addGetter('plainTextAbstract', function () {
    return this.abstract.replace(/<br\/?>/g, '\n').replace(/<[^>]*>/g, '');
});

addGetter('shorturl', function () {
    return this._shorturl.replace(/(\r|\n)$/ig, '');
});

addGetter('datePublished', function () {
    return oDate.format(this._datePublished, 'date');
});

addGetter('datetimePublished', function () {
    return oDate.format(this._datePublished, 'datetime');
});

addGetter('primaryTag', function () {
    if (this.metadata.primarytagid) {
        return primaryTagTable[this.metadata.primarytagid] || getTag(this.metadata.primarytagid, this.tags);
    }
});

addGetter('attachments', function () {
        
    return this._attachments
        .map(function (attachment) {
            if (isAnImage(attachment.mimetype)) {
                attachment.imgsrc = fixImagePath(attachment.path);
            }
            return attachment;
        });
});

module.exports = Post;