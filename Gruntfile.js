"use strict";

var spawn = require("child_process").spawn;

function configureGrunt(grunt) {
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            files: [
                "**/*.js",
                "!node_modules/**/*.js"
            ],
            options: {
                jshintrc: true
            }
        }
    });

    grunt.registerTask("jasmine", function() {
        var done = this.async();

        function afterJasmineNodeCompletes() {
            done();
        }

        var command = "./node_modules/.bin/jasmine-node";

        var args = [
            "--matchAll",
            "spec/"
        ];

        var options = {
            // Ignore stdin and stderr
            stdio: ["ignore", process.stdout, "ignore"]
        };

        spawn(command, args, options)
            .on("exit", afterJasmineNodeCompletes);
    });

    grunt.registerTask("test", [
        "jshint",
        "jasmine"
    ]);

    grunt.registerTask("default", ["test"]);

}

module.exports = configureGrunt;
