pragma solidity ^0.5.0;

contract HashTimeLock{
    
    address payable public assetLocker;
    address payable public assetFetcher;

    bytes32 public hashOfSecret;
    bytes public secret;

    uint private startBlockNumber;
    uint public endBlockNumber;

    modifier onlyLocker(){
        require(msg.sender == assetLocker);
        _;
    }

    modifier onlyFetcher(){
        require(msg.sender == assetFetcher);
        _;
    }

    constructor (address payable _assetLocker, address payable _assetFetcher, 
        uint periodBlockNumber, bytes32 _hashOfSecret) 
    public 
    payable
    {
        assetLocker = _assetLocker;
        assetFetcher = _assetFetcher;
        startBlockNumber = block.number;
        endBlockNumber = startBlockNumber + periodBlockNumber;
        hashOfSecret = _hashOfSecret;
    }

    function returnToLocker() public{
        require( block.number >= endBlockNumber );
        assetLocker.transfer(address(this).balance);
    }

    function sendToFetcher( bytes memory secret ) public{
        require( block.number < endBlockNumber );
        require( keccak256(secret) == hashOfSecret );
        assetFetcher.transfer(address(this).balance);
    }

    // Fallback function that allows locker to store funds.
    function () payable onlyLocker{}
}