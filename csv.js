function CSVParser(data, fieldSeparator, rowSeparator){
    "use strict";
    this.fieldSeparator = fieldSeparator || ",";
    this.rowSeparator = rowSeparator || "\n";
    this.rows = [];
    this.data = data;

    var that = this, cursor = 0;

    function scanRow(index) {
        if (index >= that.data.length-1) return null;

        var peekString = that.data.substring(cursor, ++cursor),
            insideQuotedField = false, insideEscapeSequence = false;

        while(peekString && (insideQuotedField || insideEscapeSequence || peekString !== that.rowSeparator)) {
            if (peekString === "\\" && !insideEscapeSequence) {
                insideEscapeSequence = true;
            }
            else {
                insideEscapeSequence = false;
            }
            if (peekString === "\""){
                if(insideQuotedField && !insideEscapeSequence) {
                    insideQuotedField = false;
                }
                else {
                    insideQuotedField = true;
                }
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
                    insideEscapeSequence = !insideEscapeSequence;
                    if (insideEscapeSequence) ignoreCharacter = true;
                }
                else if (peekString === "\"") {
                    insideQuotedField = insideEscapeSequence;
                }
                else {
                    insideEscapeSequence = false;
                }
                if (!ignoreCharacter) { field.push(peekString); }
            }
            peekString = rowString.substring(fieldCursor, ++fieldCursor);
        }
        //Catch the last field since it does not have a field separator following.
        if(field.length !== 0) fields.push(field.join("").trim().replace(/^"/, '').replace(/"$/, ''));
        return fields;
    }
    this.numberOfRows = function numberOfRows() {
        return this.rows.length;
    };
    this.parse = function parse(){
        var rowString, fieldCount, consistentRows;
        while((rowString = scanRow(cursor))) {
            this.rows.push(scanFields(rowString));
        }
        fieldCount = this.rows[0].length || 0
        consistentRows = this.rows.every(function(row, index, array){ return row.length === fieldCount; });
        if (!consistentRows) {
            throw "Invalid CSV format. Each row should have the same number of fields as the first row. " + JSON.stringify(this.rows);
        }
    };
}