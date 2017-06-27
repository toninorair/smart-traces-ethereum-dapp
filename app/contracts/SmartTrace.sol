pragma solidity ^0.4.6;
contract SmartTrace {
  
  struct MediaMessage {
    address sender;
		string media_hash;
		string text_hash;
		int64 lat;
		int64 long;
	}

  MediaMessage[] public msgs;

  function addMediaMsg(string media_hash, string text_hash, int64 lat, int64 long) {
        MediaMessage memory temp = MediaMessage(msg.sender, media_hash, text_hash, lat, long);
        msgs.push(temp);
        
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