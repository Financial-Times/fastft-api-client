var oDate = require('o-date');
var tagsTable = {};


function getTag (id, tags) {
    for (var i = 0, il = tags.length;i<il;i++) {
        if(!tagsTable[tags[i].id]) {
            tagsTable[tags[i].id] = tags[i];
        }
        if (id === tags[i].id) {
            return tags[i];
        }
    }
}

// Represents a single fastFt blog post 
var Post = function (obj) {
    obj && this.parse(obj);
};

Post.prototype.parse = function (obj) {
   
    var self = this;
    // Automatically assign the passed object to properties
    // of this object
    Object.keys(obj).forEach(function (k) {
        self[k] = obj[k];
    });

    this._datePublished = new Date(0);
    

    this._datePublished.setTime(obj.datepublished * 1000);

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
            return tagsTable[this.metadata.primarytagid] || getTag(this.metadata.primarytagid, this.tags);
        }
    }
});


module.exports = Post;
