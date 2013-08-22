# CSV.js #

## What? ##
A CSV parser written in Javascript. It handles double-quoted fields and multi-line rows. It's strict mode compliant and has no warnings or errors against JSHint.


## Why? ##
I needed one and couldn't find anything great that didn't suffer from edge cases I'd bumped into in other languages' libraries in the past.


## How? ##
Import csv.js. Create a `new CSVParser(stringOfCSVData[, options])` and call `parse`.

**Options:** The second parameter to the constructor is an options object. This parameter allows to specify custom `fieldSeparator` and `rowSeparator` characters. By default, this library parses in strict mode, requiring all rows to have the same number of fields. If for some reason you don't want this, set the `strict` option to `false`.


## Support ##
If you're using this, I'd love to know. If you run into bugs, report them and I'll see what I can do. Better yet, if you see a problem, fork, fix, and send a pull request.