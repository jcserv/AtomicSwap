package ETHUofT2019;

import org.aion.avm.api.ABIEncoder;
import org.aion.avm.api.Address;
import org.aion.avm.tooling.AvmRule;
import org.aion.vm.api.interfaces.ResultCode;
import org.aion.avm.api.BlockchainRuntime;

import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;

import java.math.BigInteger;

public class HashTimeLockRuleTest {
    @ClassRule
    public static AvmRule avmRule = new AvmRule(true);

    //default address with balance
    private Address from = avmRule.getPreminedAccount();
    private Address c;
    private Address d;
    private Address dappAddr;

    public static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                                 + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }

    @Before
    public void deployDapp() {
        //deploy Dapp:
        // 1- get the Dapp byes to be used for the deploy transaction
        // 2- deploy the Dapp and get the address.
        byte[] dapp = avmRule.getDappBytes(HashTimeLock.class, null);
        dappAddr = avmRule.deploy(from, BigInteger.ZERO, dapp).getDappAddress();

        byte[] secret = hexStringToByteArray("");

        byte[] a = hexStringToByteArray("");
        byte[] b = hexStringToByteArray("");

        c = new Address(a);
        d = new Address(b);

        byte[] txData = ABIEncoder.encodeMethodArguments("constructor", c, d, 1500, BlockchainRuntime.keccak256(secret));
        AvmRule.ResultWrapper result = avmRule.call(from, dappAddr, BigInteger.ZERO, txData);
    }

    @Test
    public void testTransfer() {
        //calling Dapps:
        // 1- encode method name and arguments
        // 2- make the call;
        byte[] txData = ABIEncoder.encodeMethodArguments("transfer", d, BigInteger.TEN);
        AvmRule.ResultWrapper result = avmRule.call(from, dappAddr, BigInteger.ZERO, txData);

        // getReceiptStatus() checks the status of the transaction execution
        ResultCode status = result.getReceiptStatus();
        Assert.assertTrue(status.isSuccess());
    }
}
