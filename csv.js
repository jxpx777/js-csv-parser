/* jshint curly: false */
function CSVParser(data, options){
    "use strict";
    var defaultOptions = { "fieldSeparator": ",", "rowSeparator": "\n", "strict": true, "removeEmpty": true};
    if (options === undefined) options = {};
    this.options = {};
    Object.keys(defaultOptions).forEach(function(key) {
        this.options[key] = options[key] === undefined ? defaultOptions[key] : options[key];
    }, this);
    this.fieldSeparator = this.options.fieldSeparator;
    this.rowSeparator = this.options.rowSeparator;
    this.rows = [];
    this.data = data;

    var that = this, cursor = 0;

    function scanRow(index) {
        if (index >= that.data.length-1) return null;

        var peekString = that.data.substring(cursor, ++cursor),
            insideQuotedField = false, insideEscapeSequence = false;

        while(peekString && (insideQuotedField || insideEscapeSequence || peekString !== that.rowSeparator)) {
            if (peekString === "\\") {
                insideEscapeSequence = !insideEscapeSequence;
            }
            if (peekString === '"') {
                insideQuotedField = insideEscapeSequence ? true : !insideQuotedField;
                insideEscapeSequence = false;
            }
            peekString = that.data.substring(cursor, ++cursor);
        }
        var rowString = that.data.substring(index, cursor).trim();
        return rowString;
    }
    function scanFields(rowString) {
        var fields = [], field = [], fieldString, fieldCursor = 0,
            insideQuotedField = false,
            insideEscapeSequence = false,
            ignoreCharacter = false,
            peekString = rowString.substring(fieldCursor, ++fieldCursor);

        while (fieldCursor <= rowString.length) {
            ignoreCharacter = false;
            if(!insideQuotedField && !insideEscapeSequence && peekString === that.fieldSeparator) {
                fieldString = field.join("").trim().replace(/^"/,'').replace(/"$/, '');
                insideEscapeSequence = insideQuotedField = false;
                fields.push(fieldString);
                field = [];
            }
            else {
                if (peekString === "\\") {
                    insideEscapeSequence = insideQuotedField && !insideEscapeSequence;
                    if (insideEscapeSequence) ignoreCharacter = true;
                }
                else if (peekString === '"') {
                    if (!insideEscapeSequence) insideQuotedField = (!insideQuotedField && !insideEscapeSequence);
                    insideEscapeSequence = false;
                }
                else {
                    insideEscapeSequence = false;
                }
                if (!ignoreCharacter) { field.push(peekString); }
            }
            peekString = rowString.substring(fieldCursor, ++fieldCursor);
        }
        //Catch the last field since it does not have a field separator following.
        fields.push(field.join("").trim().replace(/^"/, '').replace(/"$/, ''));
        return fields;
    }
    this.numberOfRows = function numberOfRows() {
        return this.rows.length;
    };
    this.parse = function parse(){
        var rowString, fieldCount, consistentRows, fields, emptyChecker = function(field) { return field !== ""; };
        while((rowString = scanRow(cursor))!=null) {
            fields = scanFields(rowString);
            if (fields.some(emptyChecker) || this.options.removeEmpty === false) {
                this.rows.push(fields);
            }
        }
        if (this.options.strict) {
            fieldCount = this.rows[0].length || 0;
            consistentRows = this.rows.every(function(row){ return row.length === fieldCount; });
            if (!consistentRows) {
                throw "Invalid CSV format. Each row should have the same number of fields as the first row. " + JSON.stringify(this.rows.map(function(row){ return row.length; } ));
            }
        }
    };
}