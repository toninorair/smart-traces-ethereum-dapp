//This service interacts with SmartTrace contract and show data on the map
app.service('SmartTraceService', function (config) {
    var service = this;

    /**
    * Add media file and message to IPFS, saves message's data in contract storage
    * @param map map instance
    * @param {SmartTrace}  contract 
    * @param info media message data - hashes of text and media, geo coordinates   
    */
    service.addNewMsgOnTheMap = function (map, contract, info) {
        let lat = Math.trunc(info.lat * config.PRECISION);
        let long = Math.trunc(info.long * config.PRECISION);

        //saving data to EmbarkJS.Storage - IPFS
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

    /**
    * Retrieving all media messages saved in the contract. 
    * Adding them on a map. 
    * For testing purposes only, better to get only accessible for current user messages
    * @param map map instance
    * @param {SmartTrace}  contract    
    */
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

    /**
    * Retrieving all ACCESSIBLE media messages saved in the contract. 
    * Adding them on a map. 
    * Message is accessible for a user if 
    * 1. It's public message;
    * 2. It is owned by this user;
    * 3. User is a recepient of a message.
    * @param map map instance
    * @param {SmartTrace}  contract    
    */
    service.addAllSelectedMessagesOnTheMap = function (map, contract) {
        contract.getAllMessages(config.MAX_MESSAGES, { gas: config.GAS_PER_OP }).then(data => {
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

    //Forms proper IPFS link for media hash
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

        //retrieving saved in IPFS message 
        EmbarkJS.Storage.get(textHash).then(messageText => {
            addMarker(lat, long, mediaHash, messageText, mymap);
        }).catch(err => {
            errHelper('IPFS get text message error => ', err);
        });
    }

    //add marker to the map
    function addMarker(lat, long, mediaHash, text, mymap) {
        let marker = L.marker([lat, long]).addTo(mymap);
        let fullText = `<b><i>${text}</b></i><br>Your <a href=${formIPFSLink(mediaHash)}>media</a>`;
        marker.bindPopup(fullText).openPopup();
    }

});




