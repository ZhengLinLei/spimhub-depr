module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        eslint: {
            target: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        },
        uglify: {
            options: {
                mangle: false
            },
            build: {
                files: {
                    'build/index.min.js': ['src/js/index.js']
                }
            },
        },
        concat: {
            options: {
                separator: ';',
            },
            buildjs: {
                src: ['src/js/*.js'],
                dest: 'build/js/src/script.js',
            },
        },
    });
    
    // Load the plugin that provides the "eslint" task.
    grunt.loadNpmTasks('gruntify-eslint');

    // Minify js
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Load concat plugin
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    // Default task(s).
    grunt.registerTask('default', ['eslint', 'concat', 'uglify']);

    grunt.registerTask('docs', ['uglify']);
};