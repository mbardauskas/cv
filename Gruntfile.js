/* jslint node: true */
var _ = require('lodash');
var fs = require('fs');
var appConfig = {};

function file2Base64(filename, type) {
	var file = fs.readFileSync(filename);
	return "data:" + type + ";base64," + new Buffer(file).toString('base64');
}

module.exports = function(grunt) {
	"use strict";

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Configuration
	var config = {
		source: 'src',
		temp: '.temp',
		dist: 'dist'
	};

	grunt.initConfig({

		// Project settings
		config: config,

		autoprefixer: {
			options: {
				browsers: ['last 5 versions']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.temp %>/css/',
					src: 'bundle.css',
					dest: '<%= config.temp %>/css/'
				}]
			}
		},

		// Copy remaining files so other tasks can use
		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.source %>/',
						dest: '<%= config.dist %>/',
						src: [
							'**/*.html'
						]
					}
				]
			}
		},

		concat: {
			tmp: {
				options: {
					separator: ''
				},
				files: [{
					src: ['<%= config.source %>/css/**/*.css'],
					dest: '<%= config.temp %>/css/bundle.css'
				}]
			}
		},

		cssmin: {
			tmp: {
				files: [{
					expand: true,
					cwd: '<%= config.temp %>/css',
					src: ['bundle.css'],
					dest: '<%= config.temp %>/css',
					ext: '.min.css'
				}]
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= config.dist %>/*'
					]
				}]
			},
			tmp: {
				files: [{
					dot: true,
					src: [
						'<%= config.temp %>'
					]
				}]
			}
		},

		uglify: {
			options: {
				preserveComments: true
			},
			tmp: {
				files: {
					'<%= config.temp %>/js/bundle.min.js': [
						config.source + '/js/domready.js',
						config.source + '/js/queryselector.polyfill.js',
						config.source + '/js/hex2text.js',
						config.source + '/js/app.js'
					]
				}
			}
		},

		processhtml: {
			config: {
				varFromFile: {
					cssSource: config.temp + '/css/bundle.min.css',
					jsSource: config.temp + '/js/bundle.min.js'
				},
				mbImgSource: file2Base64(config.source + '/img/mb.png', 'image/png')
			},
			src: '<%= config.source %>/index.tpl',
			dest: '<%= config.dist %>/index.html'
		}

	});

	grunt.registerTask('default', [
		'clean:tmp',
		'clean:dist',
		'copy:dist',
		'concat:tmp',
		'autoprefixer',
		'cssmin:tmp',
		'uglify:tmp',
		'processhtml'
	]);

	grunt.registerTask("processhtml", "Process HTML files with config", function () {
		var conf = grunt.config('processhtml'),
			appConfig = conf.config,
			tmpl = grunt.file.read(conf.src),
			varFromFile = {};

		_.each(conf.config.varFromFile, function(fileToRead, index) {
			varFromFile[index] = grunt.file.read(fileToRead);
		});
		appConfig.varFromFile = varFromFile;

		grunt.file.write(conf.dest, grunt.template.process(tmpl, {data: appConfig}));

		grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.src + '\'');
	});

};