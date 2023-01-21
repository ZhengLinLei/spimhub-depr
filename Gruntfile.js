module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        eslint: {
            target: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        }
    })
    
    // Load the plugin that provides the "eslint" task.
    grunt.loadNpmTasks('gruntify-eslint')
    
    // Default task(s).
    grunt.registerTask('default', ['eslint'])
};