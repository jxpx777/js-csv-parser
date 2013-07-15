# CSV.js #

## What? ##
A CSV parser written in Javascript. It handles double-quoted fields and multi-line rows. It's strict mode compliant and has no warnings or errors against JSHint.


## Why? ##
I needed one and couldn't find anything great that didn't suffer from edge cases I'd bumped into in other languages' libraries in the past.


## How? ##
Import csv.js. Create a `new CSVParser(stringOfCSVData)` and call `parse`. If your field separator and row separator are anything but `,` and `\n` respectively, pass those in as the second and third parameters to the constructor.


## Support ##
If you're using this, I'd love to know. If you run into bugs, report them and I'll see what I can do. Better yet, if you see a problem, fork, fix, and send a pull request.