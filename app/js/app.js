var app = angular.module('ethereum-maps-app', []).
    run(['$rootScope', function ($rootScope) {
        //Initial initialization here
        EmbarkJS.Storage.setProvider('ipfs', { server: 'localhost', port: '5001' });
    }]);

app.service('MapUtilsService', function () {
    var service = this;
    service.addAllMessagesOnTheMap = function (map, contract) {
        contract.getMsgsCount().then(function (data) {
            let length = data.toNumber();
            console.log("number of messages = ", length);
            for (i = 0; i < length; i++) {
                contract.getMediaMsg(i).then(function (data) {
                    console.log(`Result for index = ${i}`, data);
                    service.addMessageOnMap(data, map);
                });
            }
        });
    }

    service.formIPFSLink = function (mediaHash) {
        return `http://localhost:8080/ipfs/${mediaHash}`;
    }

    service.addMessageOnMap = function (data, map) {
        let mediaHash = data[1];
        let textHash = data[2];
        let lat = data[3].toNumber();
        let long = data[4].toNumber();

        EmbarkJS.Storage.get(textHash).then(function (messageText) {
            service.addMarker(lat, long, mediaHash, messageText, map);
        });
    }

    service.addMarker = function (lat, long, mediaHash, text, mymap) {
        var marker = L.marker([lat, long]).addTo(mymap);
        let fullText = `${text} + <a href=${service.formIPFSLink(mediaHash)}>Media</a>`;
        marker.bindPopup(fullText).openPopup();
    }

});


app.controller("MainController", function ($scope, MapUtilsService) {
    $scope.init = function () {
        console.log("Scope initialization");
        $scope.mymap = L.map('mapid', { doubleClickZoom: false }).setView([37.775, -122.419], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW50b25pbmFub3JhaXIiLCJhIjoiY2o0ZXk0MGU0MDhsMzMzcGVrb3VnZjgzdiJ9.y0S_YAafMGjTRS9Wenuh9Q', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'your.mapbox.access.token'
        }).addTo($scope.mymap);

        $scope.mymap.on('click', onMapClick);

        $scope.mymap.on('load', onMapLoaded)

        //MapUtilsService.addAllMessagesOnTheMap($scope.mymap, $rootScope.contract);

    }

    let onMapLoaded = function(e) {
        console.log("Map was loaded");
        $scope.update();
    }

    let onMapClick = function (e) {
        alert("You clicked the map at " + e.latlng);

        let file = $scope.myFile;
        let text = "hello world";
        let lat = e.latlng.lat;
        let long = e.latlng.lng;

        Promise.all([EmbarkJS.Storage.saveText(text), EmbarkJS.Storage.uploadFile(file)])
            .then(hashes => {
                SmartTrace.addMediaMsg(hashes[1], hashes[0], lat, long, { gas: 500000 })
                    .then(function (value) {
                        self.lat += 0.2;
                        self.long += 0.2;
                        console.log("value = ", value);
                        MapUtilsService.addMarker(lat, long, hashes[1], text, $scope.mymap);

                        SmartTrace.getMsgsCount().then(function (data) {
                            let length = data.toNumber();
                            console.log("number of messages = ", length);
                        });

                    });
            }).catch(function (err) {
                if (err) {
                    console.log("IPFS save file Error => " + err.message);
                }
            })
    }


    $scope.update = function () {
        MapUtilsService.addAllMessagesOnTheMap($scope.mymap, SmartTrace);
    }

    //add new media message to the map
    $scope.add = function () {
        let file = $scope.myFile;
        let text = "hello world";
        let lat = 37.775;
        let long = -122.419;
        let self = this;

        //var input1 = angular.element(document.querySelector('#file1'));
        Promise.all([EmbarkJS.Storage.saveText(text), EmbarkJS.Storage.uploadFile(file)])
            .then(hashes => {
                SmartTrace.addMediaMsg(hashes[1], hashes[0], lat, long, { gas: 500000 })
                    .then(function (value) {
                        self.lat += 0.2;
                        self.long += 0.2;
                        console.log("value = ", value);
                        MapUtilsService.addMarker(lat, long, hashes[1], text, $scope.mymap);

                        SmartTrace.getMsgsCount().then(function (data) {
                            let length = data.toNumber();
                            console.log("number of messages = ", length);
                        });

                    });
            }).catch(function (err) {
                if (err) {
                    console.log("IPFS save file Error => " + err.message);
                }
            })
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

