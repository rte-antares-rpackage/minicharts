// Copyright © 2016 RTE Réseau de transport d’électricité

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          "dist/minicharts.js": ["src/minicharts.js"]
        }
      },
      test: {
        files: {
          "tests/test.js": ["tests/src/*.js"]
        },
        options: {
          debug: true
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                'Copyright © 2016 RTE Réseau de transport d’électricité */\n'
      },
      build: {
        src: 'dist/minicharts.js',
        dest: 'dist/minicharts.min.js'
      }
    },
    jsdoc: {
        dist: {
            src: ['src/*.js'],
            options: {
                destination: 'docs',
                template: "template",
                //tutorials: "examples",
                readme: "README.md"
            }
        }
    },
    copy: {
      doc: {
        files: [
          {expand: true, src: "img/*", dest: "docs/"},
          //{expand: true, cwd: "examples", src: "js/*", dest: "docs/"},
          {expand: true, cwd: "dist", src: "*", dest: "docs/"},
        ]
      }
    },
    watch: {
      source: {
        files: ["src/**/*", "tests/**/*"],
        tasks: ['browserify:test', "qunit:all"]
      },
      doc: {
        files: ["src/*", "README.md", "template/*", "examples/**"],
        tasks: ['jsdoc', "copy:doc"]
      }
    },
    qunit: {
      all: ["tests/*.html"]
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  // Default task(s).
  grunt.registerTask('build', ['browserify', 'uglify', "qunit:all"]);
  grunt.registerTask('doc', ['jsdoc', "copy:doc"]);
  grunt.registerTask('default', ['watch:source']);

};
