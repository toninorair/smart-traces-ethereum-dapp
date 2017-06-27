var app = angular.module('ethereum-maps-app', []);

EmbarkJS.Storage.setProvider('ipfs', { server: 'localhost', port: '5001' });

app.controller("MainController", function ($scope) {
    let mymap = L.map('mapid', {doubleClickZoom: false}).setView([51.505, -0.09], 13);
    //let mymap = L.map('mapid', {doubleClickZoom: false}).locate({setView: true, maxZoom: 16});
    $scope.inputValue = "rafafr45535344347gcbgg";

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW50b25pbmFub3JhaXIiLCJhIjoiY2o0ZXk0MGU0MDhsMzMzcGVrb3VnZjgzdiJ9.y0S_YAafMGjTRS9Wenuh9Q', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);



    $scope.add = function () {
        let file = $scope.myFile;

        //var input1 = angular.element(document.querySelector('#file1'));
        EmbarkJS.Storage.uploadFile(file).then(function (hash) {
            console.log('hash for uploaded file = ', hash);
            SmartTrace.set(150);
            SmartTrace.get().then(function (value) { console.log("smart contract value = ", value.toNumber()) });

            // var popup = L.popup()
            //     .setLatLng([, -0.09])
            //     .setContent("I was saved with hash" + hash)
            //     .openOn(mymap);

            var marker = L.marker([51.5, -0.09]).addTo(mymap);

            marker.bindPopup("<a href=\"http://localhost:8080/ipfs/" + hash + "\">I saved this for you</a>").openPopup();

        }).catch(function (err) {
            if (err) {
                console.log("IPFS save file Error => " + err.message);
            }
        });


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

