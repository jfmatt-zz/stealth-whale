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

		requirejs: {
			release: {
				options: {

          baseUrl: "dist/js",
          mainConfigFile: "dist/js/main.js",

					//Compile Almond with main required
					name: "almond",
          include: ["main"],
          insertRequire: ["main"],
          out: "dist/js/main.js",

					//Follow the tree
          findNestedDependencies: true,

					optimize: "none",

          // Wrap everything in an IIFE.
          wrap: true

        }
      }
					
		},
				
		processhtml: {
			release: {
				files: {
					'dist/index.html': ['src/index.html']
				}
			}
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
	grunt.loadNpmTasks('grunt-processhtml');
	
	grunt.registerTask('test', ['jshint', 'mocha']);
	grunt.registerTask('build', ['copy:build', 'requirejs', 'processhtml', 'uglify']);
	grunt.registerTask('deploy', ['test', 'build', 'gh-pages']);

	grunt.registerTask('default', ['test', 'build']);

};
