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
    this.content = obj.content;
    this.abstract = obj.abstract;
    this.datepublished = obj.datepublished;
    this.shorturl = obj.shorturl;
    this.metadata = obj.metadata;
    this.tags = obj.tags;
    this.authorpseudonym = obj.authorpseudonym;

    this._datePublished = new Date(0);
    this._datePublished.setTime(obj.datepublished * 1000);
    this._attachments = obj.attachments || [];

    return this;
};

Object.defineProperty(Post.prototype, 'datePublishedISO', {
    get: function () {
        return this._datePublished.toISOString();
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
            return !/^http/.test(path) ? 'http://clamo.ftdata.co.uk/files' + path : path;
        }
       
        return this._attachments
            .map(function (attachment) {
                if (isAnImage(attachment.mimetype))
                    attachment.imgsrc = fixImagePath(attachment.path);
                return attachment;
            });
    }
});


module.exports = Post;
