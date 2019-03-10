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
    private Address dappAddr;

    @Before
    public void deployDapp() {
        //deploy Dapp:
        // 1- get the Dapp byes to be used for the deploy transaction
        // 2- deploy the Dapp and get the address.
        byte[] dapp = avmRule.getDappBytes(HashTimeLock.class, null);
        dappAddr = avmRule.deploy(from, BigInteger.ZERO, dapp).getDappAddress();
    }
}
