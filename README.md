# CSV.js #

[ ![Codeship Status for jxpx777/js-csv-parser](https://www.codeship.io/projects/e13148e0-927c-0131-a40a-7e90334dd434/status?branch=master)](https://www.codeship.io/projects/16534) [![Code Climate](https://codeclimate.com/github/jxpx777/js-csv-parser.png)](https://codeclimate.com/github/jxpx777/js-csv-parser)

## What? ##
A parser for RFC 4180 compliant CSV data written in Javascript. It handles double-quoted fields and multi-line rows. It's strict mode compliant, has no warnings or errors against JSHint, and includes Jasmine specs to make sure things keep working well.


## Why? ##
I needed one and couldn't find anything great that didn't suffer from edge cases I'd bumped into in other languages' libraries in the past.


## How? ##
Import csv.js. Create a `new CSVParser(stringOfCSVData[, options])` and call `parse`.

**Options:** The second parameter to the constructor is an options object. This parameter allows to specify custom `fieldSeparator` and `rowSeparator` characters. By default, this library parses in strict mode, requiring all rows to have the same number of fields. If for some reason you don't want this, set the `strict` option to `false`.


## Support ##
If you're using this, I'd love to know. If you run into bugs, report them and I'll see what I can do. Better yet, if you see a problem, fork, fix, and send a pull request. Pull requests without tests will be rejected. You should be writing tests for your code.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/jxpx777/js-csv-parser/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
