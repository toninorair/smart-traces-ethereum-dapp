app.controller('MainController', function ($scope, $window, SmartTraceService, config) {
    $scope.init = function () {
        console.log('Scope initialization');
        $scope.isPublic = true;
        initMap();
    }

    $window.onload = function (e) {
        console.log('Scope initialization finished');
        SmartTraceService.addAllSelectedMessagesOnTheMap($scope.mymap, SmartTrace);
    }

    /**
     * Nice to have this method for testing private messages functionality
     * Recreate map and add all media messages for current user
     */
    $scope.update = function () {
        $scope.mymap.remove();
        initMap();
        SmartTraceService.addAllSelectedMessagesOnTheMap($scope.mymap, SmartTrace);
    }

    function initMap() {
        $scope.mymap = L.map('mapid', { doubleClickZoom: false }).setView([config.START_LAT, config.START_LNG], config.MAP_ZOOM);
        L.tileLayer(config.MAP_LINK, { attribution: '', maxZoom: config.MAP_ZOOM, id: 'mapbox.streets' })
            .addTo($scope.mymap);
        $scope.mymap.on('click', onMapClick);
    }

    function onMapClick(e) {
        if (!$scope.myFile || !$scope.messageText) {
            alert('Please set up message text and media file');
            return;
        }

        if (!$scope.isPublic && !$scope.recepient) {
            alert('Please set up recepient of the message or make it public');
            return;
        }

        SmartTraceService.addNewMsgOnTheMap($scope.mymap, SmartTrace, {
            file: $scope.myFile,
            lat: e.latlng.lat, long: e.latlng.lng,
            text: $scope.messageText, public: $scope.isPublic, recepient: $scope.isPublic ? '' : $scope.recepient
        });
    }
});

//Directive used for file upload
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element);
                });
            });
        }
    };
}]);

