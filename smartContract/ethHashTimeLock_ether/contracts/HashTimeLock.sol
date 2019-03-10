pragma solidity ^0.5.0;

contract HashTimeLock{
    
    address payable public assetLocker;
    address payable public assetFetcher;

    bytes32 public hashOfSecret;
    bytes public secret;
    bool public isSecretPublished;

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
        isSecretPublished = false;
    }

    function returnToLocker() public{
        require( block.number >= endBlockNumber );
        assetLocker.transfer(address(this).balance);
    }

    function sendToFetcher( bytes memory _secret ) public{
        require( block.number < endBlockNumber );
        require( keccak256(_secret) == hashOfSecret );
        isSecretPublished = true;
        secret = _secret;
        assetFetcher.transfer(address(this).balance);
    }

    // Fallback function that allows locker to store funds.
    function () external payable onlyLocker{}
}



contract HTLCFactory{
    constructor() public {}

    event HTLCBuilt(address contractInstance); // Event

    // when deploy HTLC
    function deployHTLC (address payable _Locker, address payable _Fetcher, 
        uint _periodBlockNumber, bytes32 _hashOfSecret) 
    public 
    payable
    returns(address payable){
        HashTimeLock htlcInstance = new HashTimeLock(_Locker, _Fetcher, _periodBlockNumber, _hashOfSecret);
        address(htlcInstance).transfer(msg.value);
        emit HTLCBuilt(address(htlcInstance));
        return address(htlcInstance);
    }
    
}

