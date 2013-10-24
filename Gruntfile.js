module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: 'src',
						src: ['**', '!**/*~', '!**/#*#'],
						dest: 'dist/'
					}
				]
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', '!src/js/vendor/**', 'test/**/*.js'],
			options: {
				asi: true
			}
		},
		mocha: {
			files: ['test/**/*.html']
		},
		'gh-pages': {
			options: {
				base: 'dist'
			},
			src: ['**']
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'mocha']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-mocha');
	grunt.loadNpmTasks('grunt-gh-pages');

	grunt.registerTask('test', ['jshint', 'mocha']);
	grunt.registerTask('build', ['copy:build', /*'requirejs', */'uglify']);
	grunt.registerTask('deploy', ['test', 'build', 'gh-pages']);

	grunt.registerTask('default', ['test', 'build']);

};
