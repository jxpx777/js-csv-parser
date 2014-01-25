/* jshint curly: false */
function CSVParser(data, options){
    "use strict";
    var defaultOptions = { "fieldSeparator": ",", "rowSeparator": "\n", "strict": true, "ignoreEmpty": true};
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

        var currentCharacter = that.data.substring(cursor, ++cursor),
            peekCharacter = that.data.substring(cursor, cursor+1),
            insideQuotedField = false, insideEscapeSequence = false;

        while(currentCharacter && (insideQuotedField || insideEscapeSequence || currentCharacter !== that.rowSeparator)) {
            if (currentCharacter === '"') {
                if (!insideQuotedField) {
                    insideQuotedField = true;
                }
                else if (insideEscapeSequence) {
                    insideEscapeSequence = false;
                }
                else if (peekCharacter === '"'){
                    insideEscapeSequence = true;
                }
                else {
                    insideQuotedField = !insideQuotedField;
                }
            }
            currentCharacter = that.data.substring(cursor, ++cursor);
            peekCharacter = that.data.substring(cursor, cursor+1);
        }
        var rowString = that.data.substring(index, cursor).trim();
        return rowString;
    }
    function scanFields(rowString) {
        var fields = [], field = [], fieldString, fieldCursor = 0,
            insideQuotedField = false,
            insideEscapeSequence = false,
            ignoreCharacter = false,
            currentCharacter = rowString.substring(fieldCursor, ++fieldCursor),
            peekCharacter = rowString.substring(fieldCursor, fieldCursor+1);
        while (fieldCursor <= rowString.length) {
            ignoreCharacter = false;
            if(!insideQuotedField && !insideEscapeSequence && currentCharacter === that.fieldSeparator) {
                fieldString = field.join("").trim().replace(/^"/,'').replace(/"$/, '');
                insideEscapeSequence = insideQuotedField = false;
                fields.push(fieldString);
                field = [];
            }
            else {
                if (currentCharacter === '"') {
                    if (!insideQuotedField) {
                        insideQuotedField = true;
                    }
                    else if (insideEscapeSequence) {
                        insideEscapeSequence = false;
                    }
                    else if (peekCharacter === '"'){
                        insideEscapeSequence = true;
                    }
                    else {
                        insideQuotedField = !insideQuotedField;
                    }
                }
                if (!insideEscapeSequence) { field.push(currentCharacter); }
            }
            currentCharacter = rowString.substring(fieldCursor, ++fieldCursor);
            peekCharacter = rowString.substring(fieldCursor, fieldCursor+1);
        }

        //Catch the last field since it does not have a field separator following.
        fieldString = field.join("").trim().replace(/^"/, '').replace(/"$/, '');

        fields.push(fieldString);
        return fields;
    }
    this.numberOfRows = function numberOfRows() {
        return this.rows.length;
    };
    this.parse = function parse(){
        var rowString, fieldCount, consistentRows, fields, notEmpty = function(field) { return field !== ""; };
        while((rowString = scanRow(cursor))!=null) {
            fields = scanFields(rowString);
            if (fields.some(notEmpty) || this.options.ignoreEmpty === false) {
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