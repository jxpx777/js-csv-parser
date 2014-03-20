module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                esnext: true,
                immed: true,
                laxcomma: true,
                eqnull: true
            },
            all: ['csv.js']
        },
        jasmine: {
            spec: {
                src: 'csv.js',
                options: {
                    specs: ['test/spec/*Spec.js'],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'test/coverage/coverage.json',
                        report: {
                            type: 'lcov',
                            options: {
                                dir: 'test/coverage'
                            }
                        }
                    }
                }
            }
        },
        uglify: {
            options: {
                mangle: true,
                compress: true,
                beautify: false,
                expand: true
            },
            csv:{
                src: ['csv.js'],
                dest: 'csv.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.registerTask('default', ['jshint', 'jasmine:spec']);
    grunt.registerTask('build', ['default', 'uglify', 'coveralls']);
}