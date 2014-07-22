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

// Represents a single fastFt blog post 
var Post = function (obj) {
    obj && this.parse(obj);
};

Post.prototype.parse = function (obj) {

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

Post.prototype.uriEncodeTags = function () {
    this.tags && this.tags.forEach(function (tag) {
        tag.encodedQuery = encodeURIComponent(tag.query);
    });
};

Object.defineProperty(Post.prototype, 'datePublishedISO', {
    get: function () {
        return this._datePublished.toISOString();
    }
});

Object.defineProperty(Post.prototype, 'encodedTitle', {
    get: function () {
        return encodeURIComponent(this.title);
    }
});

Object.defineProperty(Post.prototype, 'shorturl', {
    get: function () {
        return this._shorturl.replace(/(\r|\n)$/ig, '');
    }
});

Object.defineProperty(Post.prototype, 'datePublished', {
    get: function () {
        return oDate.format(this._datePublished, 'date');
    }
});

Object.defineProperty(Post.prototype, 'datetimePublished', {
    get: function () {
        return oDate.format(this._datePublished, 'datetime');
    }
});

Object.defineProperty(Post.prototype, 'primaryTag', {
    get: function () {
        if (this.metadata.primarytagid) {
            return primaryTagTable[this.metadata.primarytagid] || getTag(this.metadata.primarytagid, this.tags);
        }
    }
});

Object.defineProperty(Post.prototype, 'attachments', {
    get: function () {
        
        var isAnImage = function (mimetype) {
            return /^image\//.test(mimetype);
        }

        var fixImagePath = function (path) {
            return encodeURI(!/^http/.test(path) ? 'http://clamo.ftdata.co.uk/files' + path : path);
        }
       
        return this._attachments
            .map(function (attachment) {
                if (isAnImage(attachment.mimetype)) {
                    attachment.imgsrc = fixImagePath(attachment.path);
                }
                return attachment;
            });
    }
});

module.exports = Post;