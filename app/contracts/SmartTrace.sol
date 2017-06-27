pragma solidity ^0.4.8;
contract SmartTrace {
  uint public storedData;

  function SmartTrace(uint initialValue) {
    storedData = initialValue;
  }

  function set(uint x) {
    storedData = x;
  }
  function get() constant returns (uint retVal) {
    return storedData;
  }
}