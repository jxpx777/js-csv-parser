/* jshint curly: false */
var CSVParser = (function(){
    "use strict";
    function captureFields(fields) {
        if (this.options.ignoreEmpty === false || fields.some(function(field){ return field.length !== 0 })) {
            this.rows.push(fields);
        }
    }

    function parser(data, options){
        var defaultOptions = { "fieldSeparator": ",", "rowSeparator": "\r\n", "strict": true, "ignoreEmpty": true};
        if (options === undefined) options = {};
        this.options = {};
        Object.keys(defaultOptions).forEach(function(key) {
            this.options[key] = options[key] === undefined ? defaultOptions[key] : options[key];
        }, this);
        this.fieldSeparator = this.options.fieldSeparator;
        this.rowSeparator = this.options.rowSeparator;
        this.rows = [];
        this.data = data;
    }
    parser.prototype.toString = function toString() { return "[object CSVParser]" }
    parser.prototype.numberOfRows = function numberOfRows() { return this.rows.length; };
    parser.prototype.parse = function parse(){
        // Regular expression for parsing CSV from [Kirtan](http://stackoverflow.com/users/83664/kirtan) on Stack Overflow
        // http://stackoverflow.com/a/1293163/34386
        var regexString = (
            // Delimiters.
            "(\\" + this.fieldSeparator + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + this.fieldSeparator + "\\r\\n]*))");
            var objPattern = new RegExp(regexString, "gi");
            var doubleQuotePattern = new RegExp( "\"\"", "g" );

        var fields = [];
        var arrMatches = null;

        while (arrMatches = objPattern.exec( this.data )){
            var strMatchedDelimiter = arrMatches[ 1 ];
            if (strMatchedDelimiter.length && (strMatchedDelimiter != this.fieldSeparator)){
                captureFields.apply(this, [fields]);
                fields = [];
            }

            if (arrMatches[ 2 ]){
                var strMatchedValue = arrMatches[ 2 ].replace(doubleQuotePattern, "\"");
            } else {
                var strMatchedValue = arrMatches[ 3 ];
            }
            fields.push( strMatchedValue );
        }
        captureFields.apply(this, [fields]);
    };
    return parser;
})();