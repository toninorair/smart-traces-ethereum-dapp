pragma solidity ^0.4.8;
/// @title Saving media messages on the map.
contract SmartTrace {
  
  // This declares a new complex type which will
  // be used for variables later.
  // It will represent a media message.
  struct MediaMessage {
    address sender;
		string media_hash; //ipfs hash of media file
		string text_hash; //ipfs hash of saved text message
		int64 lat; // message coordinate
		int64 long; // message coordinate
    address recepient; // recepient address if the message is private
    bool publicMessage; // detects id message is private and have recepient or it's public
	}

  // A dynamically-sized array of `MediaMessage` structs.
  MediaMessage[] public msgs;

  //Saves media message in the array, if message is public, recepient field does not matter
  function addMediaMsg(string media_hash, string text_hash, int64 lat, int64 long, address recepient, bool publicMessage) {
        if (publicMessage) recepient = msg.sender;
        MediaMessage memory temp = MediaMessage(msg.sender, media_hash, text_hash,
         lat, long, recepient, publicMessage);
        msgs.push(temp);
        
  }

  //Returns all accessible message for current user
  //Message is accessible for a user if
  //1. It's public message
  //2. It is owned by this user
  //3. User is a recepient of a message
  function getAllMessages(uint max_count) constant returns(uint[], uint) {
    uint[] memory ids = new uint[](max_count);
    uint count = 0;
    uint i = 0;
    while (i < msgs.length && count < max_count) {
      if (messageAccessible(i)) {
        ids[count++] = i;
      }
      i++;
    }

    return (ids, count);
  }

  //Returns number of saved media messages
  function getMsgsCount() constant returns(uint){
    return msgs.length;
  }

  //checks if message with given index exists
  function messageExists(uint index) constant returns (bool){
		if (index >= 0 && index < msgs.length) return true;
		return false;
	}

  //Checks if message with given index is accessible for current user
  //Message is accessible for a user if
  //1. It's public message
  //2. It is owned by this user
  //3. User is a recepient of a message
  function messageAccessible(uint index) constant returns (bool) {
    if (messageExists(index)) {
      if (msgs[index].publicMessage) return true;
      if (msgs[index].sender == msg.sender) return true;
      if (msgs[index].recepient == msg.sender) return true;
    }
    return false;
  }

  //Gets message for given index
  function getMediaMsg(uint index) constant returns (address, string, string, int64, int64) {
     //should be changed to `messageAccessible`, done this way for testing purposes
     if (messageExists(index)) {
       return (msgs[index].sender, msgs[index].media_hash, msgs[index].text_hash, msgs[index].lat, msgs[index].long);
     }
  }
	
}