var app = angular.module('ethereum-maps-app', []).
    run(['$rootScope', function ($rootScope) {
        //Initial initialization here
        EmbarkJS.Storage.setProvider('ipfs', { server: 'localhost', port: '5001' });
    }]);

