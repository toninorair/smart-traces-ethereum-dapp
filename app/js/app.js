//AngularJS Application
var app = angular.module('ethereum-maps-app', []).
    run(['$rootScope', function ($rootScope) {
        EmbarkJS.Storage.setProvider('ipfs', { server: 'localhost', port: '5001' });
    }]);

