pragma solidity ^0.4.6;
contract SmartTrace {
  
  struct MediaMessage {
    address sender;
		string media_hash;
		string text_hash;
		int64 lat;
		int64 long;
    address recepient;
    bool publicMessage;
	}

  MediaMessage[] public msgs;

  function addMediaMsg(string media_hash, string text_hash, int64 lat, int64 long, address recepient, bool publicMessage) {
        MediaMessage memory temp = MediaMessage(msg.sender, media_hash, text_hash,
         lat, long, recepient, publicMessage);
        msgs.push(temp);
        
  }

  function getAllMessages(uint max) constant returns(uint[], uint) {
    uint[] memory ids = new uint[](max);
    uint count = 0;
    for (var i = 0; i < msgs.length; i++){
      if(msgs[i].sender == msg.sender) {
          ids[count++] = i;
      } else if(msgs[i].recepient == msg.sender) {
          ids[count++] = i;
      } else if (msgs[i].publicMessage) {
         ids[count++] = i;
      }
    }

    return (ids, count);

  }

  function getMsgsCount() constant returns(uint){
    return msgs.length;
  }

  function messageExists(uint index) constant returns (bool){
		if (index < msgs.length) return true;
		return false;
	}

  function getMediaMsg(uint index) constant returns (address, string, string, int64, int64) {
     if (messageExists(index)) {
       return (msgs[index].sender, msgs[index].media_hash, msgs[index].text_hash, msgs[index].lat, msgs[index].long);

     }
  }
	
}