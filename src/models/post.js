var oDate = require('o-date');

// Represents a single fastFt blog post 
var Post = function () {
      
    var self = this;

    this.parse = function (obj) {
   
        // Automatically assign the passed object to properties
        // of this object
        Object.keys(obj).forEach(function (k) {
            self[k] = obj[k];
        })

        var datePublished = new Date(0);
        
        datePublished.setUTCSeconds(obj.datepublished);        
        
        Object.defineProperty(this, 'datePublishedISO', {
            get: function () {
                return datePublished.toISOString();
            }
        });

        Object.defineProperty(this, 'datePublished', {
            get: function () {
                return oDate.format(datePublished, 'date');
            }
        });

        Object.defineProperty(this, 'datetimePublished', {
            get: function () {
                return oDate.format(datePublished, 'datetime');
            }
        });
        return this;
    };

};

module.exports = Post;
