/**
 * Created by CSS on 30-05-2016.
 */
module.exports = function(grunt) {

    // Project configuration.
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // less:{
        //     styles: {
        //         src: ['<banner>','public/css/*.css'],
        //         dest: 'public/build/style.css',
        //         options: {
        //             compress: grunt.config('compress')
        //         }
        //     }
        // },
        //
        //
        // jshint: {
        //     options: {
        //         reporter: require('jshint-html-reporter'),
        //         reporterOutput: 'report/jshint-report.html',
        //         force:true,
        //         globals: {
        //             jQuery: true,
        //             angular: true,
        //             require:true,
        //             process:true,
        //             module:true,
        //             exports:true,
        //             console:true,
        //             myApp:true,
        //             __dirname:true,
        //             $:true,
        //             $timeout:true,
        //             alert:true,
        //             Buffer:true,
        //             it:true,
        //             describe:true,
        //             beforeEach:true,
        //             afterEach:true
        //         },
        //         eqeqeq: true
        //     },
        //
        //     build: {
        //         src: [
        //             'Gruntfile.js',
        //             'server.js',
        //             'routes/*.js',
        //             'controller/*.js',
        //             'config/*.js',
        //             'config/db/*.js',
        //             'public/app/**/**/*.js'
        //             //'test/server/**/*.js'
        //         ]
        //     },
        //
        //     jscs: {
        //         build: {
        //             src: [
        //                 'server.js',
        //                 'gruntfile.js',
        //                 'routes/*.js',
        //                 'controllers/*.js',
        //                 'config/*.js',
        //                 'config/**/*.js',
        //                 'public/app/**/**/*.js'
        //                 //'test/server/**/*.js'
        //             ]
        //         },
        //         options: {
        //             maxErrors: null,
        //             requireTrailingComma: false,
        //             fix: true,
        //             force: true,
        //             reporter: require('jscs-html-reporter').path,
        //             reporterOutput: 'report/jscs-html-report.html',
        //             preset: "node-style-guide",
        //             disallowMultipleVarDecl: false,
        //             maximumLineLength: 160,
        //             validateLineBreaks: null
        //         }
        //     }
        // },
        //
        // htmlmin: {                                     // Task
        //     dist: {                                      // Target
        //         options: {                                 // Target options
        //             removeComments: true,
        //             collapseWhitespace: true,
        //             force:true
        //         },
        //         files: {                                   // Dictionary of files
        //             'public/dist/index.html': 'public/app/core/layout.html'   // 'destination': 'source'
        //
        //             //'public/dist/project/projectReg/projectReg.html': 'public/app/project/projectReg/projectReg.html'
        //
        //             //'dist/contact.html': 'src/contact.html'
        //         }
        //     },
        //     dev: {                                       // Another target
        //         files: {
        //             'public/dist/index.html': 'public/app/core/layout.html'    // 'destination': 'source'
        //             // 'dist/contact.html': 'src/contact.html'
        //         }
        //     }
        // },
        //
        mocha_istanbul:{
            coverage: {
                src: 'test/server', // the folder, not the files
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    coverageFolder: 'report/coverage',
                    // mask: '**/routes/profile.login.server.routesTest.js'
                    mask: '**/**.js'
                },
                force:true
            }
        },
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },
        serve: {
            options: {
                port:9000
            }
        },

        karma: {
            unit: {
                options: {
                    force:true,
                    frameworks: ['jasmine'],
                    // singleRun: true,
                    browsers: ['Chrome'],
                    files: [

                    //
                    // "public/bower_components/jquery/dist/jquery.min.js",
                    // 'public/bower_components/angular/angular.min.js',
                    // "public/bower_components/angular-route/angular-route.min.js",
                    // "public/bower_components/bootstrap/dist/js/bootstrap.min.js",
                    // "public/bower_components/angular-mocks/angular-mocks.js",
                    // "public/bower_components/angular-google-chart/ng-google-chart.js",
                    // "public/bower_components/angularjs-datepicker/dist/angular-datepicker.min.js",
                    // "public/bower_components/leaflet/dist/leaflet.js",
                    // "public/bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.min.js",
                    // "public/bower_components/angular-google-chart/ng-google-chart.js",
                    // "public/bower_components/angular-simple-logger/dist/angular-simple-logger.js",
                    // "public/bower_components/ui-accordion/dist/scripts/ui-accordion.js",


                        "public/bower_components/jquery/dist/jquery.js",
                        'public/bower_components/angular/angular.js',
                        'public/bower_components/angular-mocks/angular-mocks.js',
                        // 'public/bower_components/angular-resource/angular-resource.js',
                        "public/bower_components/angular-google-chart/ng-google-chart.js",
                        "public/bower_components/angularjs-datepicker/dist/angular-datepicker.min.js",
                        "public/bower_components/angular-google-chart/ng-google-chart.js",
                        "public/bower_components/angular-simple-logger/dist/angular-simple-logger.js",
                        "public/bower_components/ui-leaflet/dist/ui-leaflet.js",
                        "public/bower_components/bootstrap/dist/js/bootstrap.min.js",
                        'public/bower_components/angular-bootstrap/ui-bootstrap.js',
                        'public/bower_components/angular-route/angular-route.min.js',
                        'public/bower_components/ui-accordion/dist/scripts/ui-accordion.js',


                        "public/bower_components/jquery/dist/jquery.js",

                     'public/app/core/module.js',
                     'public/app/core/config.js',

                        'public/app/busRegistration/busRegistrationController.js',
                        'public/app/busRegistration/busRegistrationService.js',
                        'public/app/gpsUnitRegistration/gpsUnitRegistrationservice.js',
                        'public/app/gpsUnitRegistration/gpsUnitRegistrationController.js',
                        'public/app/tripRegistration/tripRegistrationController.js',
                        'public/app/tripRegistration/tripRegistrationService.js',
                        'public/app/driverRegistration/driverRegistrationController.js',
                        'public/app/driverRegistration/driverRegistrationService.js',
                        'public/app/studentRegistration/studentRegistrationController.js',
                        'public/app/studentRegistration/studentRegistrationService.js',
                        'public/app/driverRegistration/driverRegistrationController.js',
                        'public/app/driverRegistration/driverRegistrationService.js',


                     // 'public/app/**/**/*.js',

                        'test/client/**/**.js'
                        // 'test/client/controllers/project.home.controller.test.js',
                        // 'test/client/services/project.home.services.test.js'

                    ],
                    concurrency: Infinity,
                    autoWatch: true,
                    reporters: ['progress', 'coverage'],
                    preprocessors: {
                        // source files, that you wanna generate coverage for
                        // do not include tests or libraries
                        // (these files will be instrumented by Istanbul)
                        'public/app/**/**/*.js':['coverage'],
                        'public/app/busRegistration/busRegistrationController.js': ['coverage'],
                        'public/app/busRegistration/busRegistrationService.js': ['coverage'],
                        'public/app/gpsUnitRegistration/gpsUnitRegistrationservice.js':['coverage'],
                        'public/app/gpsUnitRegistration/gpsUnitRegistrationController.js':['coverage'],
                        'public/app/tripRegistration/tripRegistrationController.js':['coverage'],
                        'public/app/tripRegistration/tripRegistrationService.js':['coverage'],
                        'public/app/driverRegistration/driverRegistrationController.js':['coverage'],
                        'public/app/driverRegistration/driverRegistrationService.js':['coverage'],
                        'public/app/studentRegistration/studentRegistrationController.js':['coverage'],
                        'public/app/studentRegistration/studentRegistrationService.js':['coverage']


                        // 'public/app/documents/services/iconServices.js': ['coverage'],
                        // 'public/app/documents/services/starServices.js': ['coverage'],
                        // 'public/app/documents/directives/fileDirective.js': ['coverage'],
                        // 'public/app/documents/filters/commonFilter.js': ['coverage']

                    },
                    coverageReporter: {
                        dir: 'Report Angular Testing',
                        reporters: [
                            { type: 'html', subdir: 'report-html' },
                            { type: 'teamcity', subdir: '.', file: 'teamcity.txt' }
                        ]
                    },
                    plugins: [
                        'karma-jasmine',
                        'karma-coverage',
                        'karma-chrome-launcher'
                    ]

                }
}
}
});

var defaultTasks = [
    // 'less',
    // 'uglify',
    // 'imagemin',
    // 'jshint',
    // 'htmlmin:dist',
    'karma',
    // 'nodemon',
  'mocha_istanbul'

];



grunt.registerTask('default',defaultTasks);
grunt.registerTask('test', ['karma']);




};