app.service('SmartTraceService', function () {
    var service = this;

    service.addAllMessagesOnTheMap = function (map, contract) {
        contract.getMsgsCount().then(function (data) {
            let length = data.toNumber();
            console.log("number of messages = ", length);
            for (i = 0; i < length; i++) {
                contract.getMediaMsg(i).then(function (data) {
                    service.addMessageOnMap(data, map);
                });
            }
        });
    }

    service.addAllSelectedMessagesOnTheMap = function (map, contract) {
        contract.getAllMessages(40, { gas: 500000 }).then(function (data) {
            let indexArr = data[0];
            let count = data[1].toNumber();
            console.log("Running add all selected images with count = ", count);

            for (let i = 0; i < count; i++) {
                console.log("element", indexArr[i]);
                contract.getMediaMsg(indexArr[i]).then(function (data) {
                    service.addMessageOnMap(data, map);
                });
            }
        });

    }

    service.formIPFSLink = function (mediaHash) {
        return `http://localhost:8080/ipfs/${mediaHash}`;
    }

    service.addMessageOnMap = function (data, mymap) {
        let account = data[0];
        let mediaHash = data[1];
        let textHash = data[2];
        let lat = data[3] / 100000;
        let long = data[4] / 100000;
        console.log("account = ", account);

        EmbarkJS.Storage.get(textHash).then(function (messageText) {
            service.addMarker(lat, long, mediaHash, messageText, mymap);
        });
    }

    service.addMarker = function (lat, long, mediaHash, text, mymap) {
        var marker = L.marker([lat, long]).addTo(mymap);
        let fullText = `${text}<a href=${service.formIPFSLink(mediaHash)}>Media</a>`;
        marker.bindPopup(fullText).openPopup();
    }

});




