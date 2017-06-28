// app.constant('config', {
//     appName: ‘My App’,
//     appVersion: 2.0,
//     apiUrl: ‘http://www.google.com?api’
// });


app.controller("MainController", function ($scope, $window, SmartTraceService) {
    $scope.init = function () {
        console.log("Scope initialization");
        $scope.isPublic = true;
        $scope.mymap = L.map('mapid', { doubleClickZoom: false }).setView([37.775, -122.419], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW50b25pbmFub3JhaXIiLCJhIjoiY2o0ZXk0MGU0MDhsMzMzcGVrb3VnZjgzdiJ9.y0S_YAafMGjTRS9Wenuh9Q', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'your.mapbox.access.token'
        }).addTo($scope.mymap);

        $scope.mymap.on('click', onMapClick);
    }

    $window.onload = function (e) {
        console.log("Scope initialization finished");
        SmartTraceService.addAllSelectedMessagesOnTheMap($scope.mymap, SmartTrace);
    }


    let onMapClick = function (e) {
        if (!$scope.myFile || !$scope.messageText) {
            alert("Please set up message text and media file");
            return;
        }

        if (!$scope.isPublic && !$scope.recepient) {
            alert("Please set up recepient of the message or make it public");
            return;
        }

        let recepient = $scope.isPublic ? '' : $scope.recepient;

        SmartTraceService.addNewMsgOnTheMap($scope.mymap, SmartTrace, { file: $scope.myFile, 
            lat: e.latlng.lat, long: e.latlng.lng, 
            text: $scope.messageText, public: $scope.isPublic, recepient: recepient });

       
    }


    $scope.update = function () {
        SmartTraceService.addAllSelectedMessagesOnTheMap($scope.mymap, SmartTrace);
    }

});


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

