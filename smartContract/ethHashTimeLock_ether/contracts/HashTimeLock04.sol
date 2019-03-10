pragma solidity 0.4.15;

contract HashTimeLock{
    
    address public assetLocker;
    address public assetFetcher;

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

    function HashTimeLock (address _assetLocker, address _assetFetcher, 
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



