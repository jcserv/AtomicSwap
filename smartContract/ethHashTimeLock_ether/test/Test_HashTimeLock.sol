pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddressed.sol";
import "../contracts/HashTimeLock.sol";

contract swapAgent{


    function () public payable{}
}



contract TestAtomicSwap{

    uint public initialBalance = 100 wei;

    HashTimeLock AliceContract;
    HashTimeLock BobContract;

    function testSuccessfulSwap(){
        swapAgent Alice = new swapAgent();
        swapAgent Bob = new swapAgent();

        address(Alice).transfer(50);
        address(Bob).transfer(50);

        uint periodBlockNumberAlice = 100;
        uint periodBlockNumberBob = 50;

        uint really_random_secret_seed = 113;
        byte hashOfSecret = keccak256(really_random_secret);


        AliceContract = new HashTimeLock(address(Alice), address(Bob), periodBlockNumberAlice ,hashOfSecret);


        BobContract = new HashTimeLock(address(Bob), address(Alice) , periodBlockNumberBob ,hashOfSecret);
    }




}