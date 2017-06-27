var app = angular.module('ethereum-maps-app', []).
    run(['$rootScope', function ($rootScope) {
        //Initial initialization here
        EmbarkJS.Storage.setProvider('ipfs', { server: 'localhost', port: '5001' });
    }]);



app.controller("MainController", function ($scope) {
    let mymap = L.map('mapid', { doubleClickZoom: false }).setView([51.505, -0.09], 13);
    //let mymap = L.map('mapid', {doubleClickZoom: false}).locate({setView: true, maxZoom: 16});
    $scope.inputValue = "rafafr45535344347gcbgg";

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW50b25pbmFub3JhaXIiLCJhIjoiY2o0ZXk0MGU0MDhsMzMzcGVrb3VnZjgzdiJ9.y0S_YAafMGjTRS9Wenuh9Q', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);


    //add new media message to the map
    $scope.add = function () {
        let file = $scope.myFile;
        let text = "hello world";
        let lat = 50;
        let long = -9;

        //var input1 = angular.element(document.querySelector('#file1'));
        Promise.all([EmbarkJS.Storage.saveText(text), EmbarkJS.Storage.uploadFile(file)])
            .then(hashes => {
                SmartTrace.addMediaMsg(hashes[0], hashes[1], lat, long, { gas: 500000 })
                    .then(function (value) {
                        var marker = L.marker([lat, long]).addTo(mymap);
                        marker.bindPopup("<a href=\"http://localhost:8080/ipfs/" + hashes[0] + "\">I saved this for you</a>").openPopup();

                        SmartTrace.getMediaMsg(0).then(function (data) {
                            console.log("Result = ", data);
                        });

                         SmartTrace.getMsgsCount().then(function (data) {
                            console.log("Result = ", data.toNumber());
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

