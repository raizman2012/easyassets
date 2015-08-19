/**
 * Created by leonid.raizmen on 18/08/2015.
 */
'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'lib/**/*.js', 'spec/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'
            },
            all: []
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('default', ['jshint', 'jasmine_node']);
    grunt.registerTask('travis', ['jshint', 'jasmine_node']);
};