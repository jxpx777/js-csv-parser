describe("CSVParser", function() {
  var parser, data, fieldSeparator;
  describe("behavior", function(){
    it("should report its object type properly", function(){
      parser = new CSVParser("some,data,here\nin,two,lines");
      expect(parser.toString()).toEqual("[object CSVParser]");
    });
  });
  describe("output", function(){
    beforeEach(function(){
      data = ['url,username,password,extra,name,grouping,fav', 'https://www.example.com,username,password,,example.com,,1', ',,,,,,'].join("\r\n");
    });
    it("should exclude empty rows by default", function(){
      parser = new CSVParser(data);
      parser.parse();
      expect(parser.numberOfRows()).toEqual(2);
    });
    it("should exclude empty rows with explicit true option", function(){
      parser = new CSVParser(data, {ignoreEmpty: true});
      parser.parse();
      expect(parser.numberOfRows()).toEqual(2);
    });
    it("should not exclude empty rows with explicit false option", function(){
      parser = new CSVParser(data, {ignoreEmpty: false});
      parser.parse();
      expect(parser.numberOfRows()).toEqual(3);
    });
  });

  describe("separators", function(){
    beforeEach(function(){
      data = ['url,"username",password,extra,name,grouping,fav', 'https://www.example.com,myUsername,"abcdé""4j+<+G9\n3$6,6,+z:(b?g\\",,example.com,,1'].join("\r\n");
      parser = new CSVParser(data);
    });

    it("uses comma as the default field separator", function(){
      expect(parser.options.fieldSeparator).toEqual(",");
    });
    
    it("accepts a custom field separator", function(){
      parser = new CSVParser(data, {fieldSeparator: "|"});
      expect(parser.options.fieldSeparator).toEqual("|");
    });
  });

  describe("parsing", function(){
    describe("basic", function(){
      it("parses rows with default separators", function(){
        data = ['url,username,password,extra,name,grouping,fav', 'https://www.example.com,myUsername,mypassword,,example.com,,1'].join("\r\n");
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
      });
      it("parses rows with custom field separator", function(){
        data = ['url|username|password|extra|name|grouping|fav', 'https://www.example.com|myUsername|mypassword||example.com||1'].join("\r\n");
        parser = new CSVParser(data, {fieldSeparator: "|"});
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
      });
    });
    describe("advanced", function(){
      it("handles rows with quoted fields", function(){
        data = ['"url","username","password","extra","name","grouping","fav"', '"https://www.example.com","myUsername","mypassword","","example.com","","1"'].join("\r\n");
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
        expect(parser.rows[0][0]).toEqual("url");
      });
      it("handles fields with newlines", function(){
        data = ['"url","user\nname","password","extra","name","grouping","fav"', '"https://www.example.com","myUsername","mypassword","","example.com","","1"'].join("\r\n");
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
        expect(parser.rows[0][1]).toEqual("user\nname");
      });
      it("handles fields with escaped double quotes", function(){
        data = ['"url","user\nname","password","extra","name","grouping","fav"', '"https://www.example.com","myUsername","mypassword","","""example.com""","","1"'].join("\r\n");
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
        expect(parser.rows[1][4]).toEqual('"example.com"');
      });
      it("handles fields with backslashes", function(){
        data = ['"url","user\nname","password","extra","name","grouping","fav"', '"https://www.example.com","myUsername","mypassword","","\\example.com\\","","1"'].join("\r\n");
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
        expect(parser.rows[1][4]).toEqual('\\example.com\\');
      });
      it("handles fields with tricky backslashes", function(){
        data = ['"url","user\nname","password","extra","name","grouping","fav"', '"https://www.example.com","myUsername","mypassword","","""example.com\\","","1"'].join("\r\n");
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
        expect(parser.rows[1][4]).toEqual('"example.com\\');
      });
      it("handles quoted fields with commas", function(){
        data = ['"u,r,l","username","password","extra","name","grouping","fav"', '"https://www.example.com","myUser,name","mypassword","","""example.com","","1"'].join("\r\n");
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
        expect(parser.rows[0][0]).toEqual('u,r,l');
        expect(parser.rows[1][1]).toEqual('myUser,name');
      });
      it("handles quoted fields with trailing escaped quotes", function(){
        data = ['"u,r,l""","username","password","extra","name","grouping","fav"', '"https://www.example.com","myUser,name","mypassword","","""example.com\\""""","","1"'].join("\r\n");
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
        expect(parser.rows[0][0]).toEqual('u,r,l"');
        expect(parser.rows[1][4]).toEqual('"example.com\\""');
      });
      it("can parse data with trailing empty field", function(){
        data = ['"u,r,l""","user\nname","password","extra","name","grouping","fav","empty column"', '"https://www.example.com","myUser,name","mypassword","","""example.com\\","","1",'].join("\r\n");
        parser = new CSVParser(data);
        parser.parse();
        expect(parser.numberOfRows()).toEqual(2);
        expect(parser.rows[0][0]).toEqual('u,r,l"');
      });
    });
    describe("options", function(){
      it("throws an error when strict mode is violated", function(){
        data = ['url,username,password,extra,name,grouping,fav', 'https://www.example.com,myUsername,mypassword,example.com,1'].join("\r\n");
        parser = new CSVParser(data, {strict: true});
        try {
          parser.parse();
        }
        catch(e) {
          expect(e.message).toMatch("Invalid CSV data");
        }
      });
    })
  });

});