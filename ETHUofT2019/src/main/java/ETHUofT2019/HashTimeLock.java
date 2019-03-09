package ETHUofT2019;

import org.aion.avm.api.ABIDecoder;
import org.aion.avm.api.BlockchainRuntime;

public class HashTimeLock
{
    public Address assetLocker;
    public Address assetFetcher;

    public bytes32 hashOfSecret;
    public byte[] secret;

    private int startBlockNumber;
    private int endBlockNumber;

    private boolean isSecretPublished;

    /*static {
        contractAddress = BlockchainRuntime.getAddress();
        owner = BlockchainRuntime.getCaller();
        timestamp = BlockchainRuntime.getBlockTimestamp();
        startBlockNumber = BlockchainRuntime.getBlockNumber();
    }*/

    HashTimeLock(Address _assetLocker, address _assetFetcher, int periodBlockNumber, bytes[] _hashOfSecret) {
        this.assetLocker = _assetLocker;
        this.assetFetcher = _assetFetcher;
        this.startBlockNUmber = block.number;
        this.endBlockNumber = this.startBlockNumber + periodBlockNumber;
        this.hashOfSecret = _hashOfSecret;
        this.isSecretPublished = false;
    }
      
    // Can be called into other functions to validate the owner of the contract.
    private static void onlyOwner() {
        BlockchainRuntime.require(BlockchainRuntime.getCaller().equals(owner));
    }
  
    public static void transferOwnership(Address newOwnerAddress) {
        onlyOwner();
        newOwner = newOwnerAddress;
    }
  
    public static void acceptOwnership() {
        BlockchainRuntime.require(BlockchainRuntime.getCaller().equals(newOwner));
        owner = newOwner;
        newOwner = null;
    }
    
    public static void transfer(Address to, long value) {
        onlyOwner();
        Result result = BlockchainRuntime.call(to, BigInteger.valueOf(value), new byte[0], BlockchainRuntime.getRemainingEnergy());
          
        if (result.isSuccess()) {
        BlockchainRuntime.println("Transfer succeeded. " + BlockchainRuntime.getBalance(to) + " " + BlockchainRuntime.getBalanceOfThisContract());
        } else {
          BlockchainRuntime.println("Transfer failed.");
        }
    }

    public void returnToLocker() {
        if (block.number >= endBlockNumber) {
            transfer(this.assetLocker, this.assetLocker.balance);
        }
    }

    public static void sendToFetcher(byte[] _secret) {
        if (block.number < endBlockNumber && keccak256(secret) == hashOfSecret) {
            transfer(this.assetFetcher, this.assetFetcher.balance);
            this.isSecretPublished = true;
            this.secret = _secret;
        }
    }

    //main should be last function
    public static byte[] main() {
        return ABIDecoder.decodeAndRunWithClass(HelloAvm.class, BlockchainRuntime.getData());
    }
}