'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
            state('home', {
                url: '/',
                templateUrl: '/modules/core/views/home.client.view.html'
            }).
            state('resources_server', {
                url: '/resources_server',
                templateUrl: '/modules/core/views/resources.server.view.html'
            }).
            state('resource_client', {
                url: '/resources_client',
                templateUrl: '/modules/core/views/resources.client.view.html'
            }).
            state('snippets_status', {
                url: '/snippets_status',
                templateUrl: '/modules/core/views/snippets.status.view.html'
            }).
            state('search', {
                url: "/search/:tags",
                templateUrl: '/modules/core/views/snippets.client.view.html'
            }).
            state('snippets', {
                url: "/snippets",
                templateUrl: '/modules/core/views/snippets.client.view.html'
            }).state('snippet', {
                url: "/snippet/:snippetId",
                templateUrl: '/modules/core/views/snippet.client.view.html'
            });
    }
]);
