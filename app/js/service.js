app.service('SmartTraceService', function (config) {
    var service = this;
  
    service.addNewMsgOnTheMap = function (map, contract, info) {
        let lat = Math.trunc(info.lat * config.PRECISION);
        let long = Math.trunc(info.long * config.PRECISION);

        Promise.all([EmbarkJS.Storage.uploadFile(info.file), EmbarkJS.Storage.saveText(info.text)])
            .then(hashes => {
                console.log('hashes = ', hashes);
                let mediaHash = hashes[0];
                let textHash = hashes[1];
                contract.addMediaMsg(mediaHash, textHash, lat, long,
                    info.recepient, info.public, { gas: config.GAS_PER_OP })
                    .then(value => {
                        console.log('value = ', value);
                        addMarker(lat / config.PRECISION, long / config.PRECISION, mediaHash, info.text, map);
                    }).catch(err => {
                        errHelper('Add media message error => ', err);
                    });
            }).catch(err => {
                errHelper('IPFS save file error => ', err);
            });

    }

    service.addAllMessagesOnTheMap = function (map, contract) {
        contract.getMsgsCount().then(data => {
            let length = data.toNumber();
            console.log('Number of saved messages = ', length);
            for (i = 0; i < length; i++) {
                contract.getMediaMsg(i).then(data => {
                    addMessageOnMap(data, map);
                }).catch(err => {
                    errHelper('Get media message error => ', err);
                })
            }
        }).catch(err => {
            errHelper('Add media message count => ', err);
        });
    }

    service.addAllSelectedMessagesOnTheMap = function (map, contract) {
        contract.getAllMessages(40, { gas: config.GAS_PER_OP }).then(data => {
            let indexArr = data[0];
            let count = data[1].toNumber();
            console.log('Running add all selected images with count = ', count);

            for (let i = 0; i < count; i++) {
                console.log('selected message index = ', indexArr[i]);
                contract.getMediaMsg(indexArr[i]).then(data => {
                    addMessageOnMap(data, map);
                }).catch(err => {
                    errHelper('Get media message error => ', err);
                })
            }
        }).catch(err => {
            errHelper('Get all messages error => ', err);
        });

    }

    function errHelper(message, err) {
        if (err) {
            console.log(message + err.message);
        }
    }

    function formIPFSLink(mediaHash) {
        return `${config.IPFS_URL}${mediaHash}`;
    }

    function addMessageOnMap(data, mymap) {
        let account = data[0];
        let mediaHash = data[1];
        let textHash = data[2];
        let lat = data[3] / config.PRECISION;
        let long = data[4] / config.PRECISION;
        console.log('account = ', account);

        EmbarkJS.Storage.get(textHash).then(messageText => {
            addMarker(lat, long, mediaHash, messageText, mymap);
        });
    }

    function addMarker(lat, long, mediaHash, text, mymap) {
        let marker = L.marker([lat, long]).addTo(mymap);
        let fullText = `${text}<br><a href=${formIPFSLink(mediaHash)}>Media</a>`;
        marker.bindPopup(fullText).openPopup();
    }

});




