var ethHTLCFactoryAddr = "0x1724673fedddb27008177f78522c296d41b9ae16";

$("#walletInfo").hide();
$("#createContractInfo").hide();
$("#createAionContractInfo").hide();
$("#LockEthFundsInfo").hide();
$("#FetchEthFundsInfo").hide();
$("#ReturnEthFundsInfo").hide();
$("#createAionContractInfo").hide();

var ethWeb3js = require('web3');

ethweb3 = new ethWeb3js(web3.currentProvider || "ws://localhost:8546");


window.addEventListener('load', function() {

  var appPrepared = true;

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    //ethWeb3js = new Web3(web3.currentProvider);
    console.log('Web3 detected! Provider: ' + web3.currentProvider.constructor.name);
  } else {
    appPrepared = false;
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  //const accountAddress = await aiwa.enable();
  
  if (typeof aionweb3 !== 'undefined'){
    console.log('Aion web3 detected!');
  } else{
    appPrepared = false;
    console.log('Aion web3 not detected, Need to install Wallets for Aion.');
  }

  // Now you can start your app & access web3 freely:
  if(appPrepared){

    $("#btnDisplayWalletInfo").click(async function(){
      walletInfo();
    });

    $("#btnCreateEthContract").click(async function(){
      createEthContract();
    });

    $("#btnLockEthFunds").click(async function(){
      lockEthFunds();
    });


    $("#btnFetchEthFunds").click(async function(){
      fetchEthFunds();
    });


    $("#btnReturnEthFunds").click(async function(){
      returnEthFunds();
    });

  }
  else
    console.log('Follow the steps above to proceed.')
});


function printWalletInfo(){
  ethweb3.eth.defaultAccount = ethAccountAddress;
  console.log('===================================');
  console.log('Wallet Info')
  console.log('===================================');
  console.log('Eth address  : ' + ethAccountAddress);
  console.log('Eth balance  : ' + ethAccountBalance);
  console.log('Aion address : ' + aiwaAccountAddress);
  console.log('Aion balance (notyet) : ' + aiwaAccountBalance);
  console.log('===================================');
}

async function walletInfo(){

  ethAccountAddress = ethweb3.eth.accounts[0];
  aiwaAccountAddresses = await aiwa.enable();
  aiwaAccountAddress = aiwaAccountAddresses[0];

  ethAccountBalance = null;
  aiwaAccountBalance = null;


  ethweb3.eth.getBalance( ethAccountAddress, ethweb3.eth.defaultBlock, (error, result) => {
    ethAccountBalance=result;
    printWalletInfo();
  });


  $("#walletInfo").show();
  $("#userEthAddr").html(ethAccountAddress);
  $("#userAionAddr").html(aiwaAccountAddress);
  $("#createEthContractInfo").show();
}


function generateSecret(){
    return ethweb3.fromAscii("ThisIsVerySecure,UnbelievablySecure");
}


async function createEthContract(){
  ethHTLC = ethweb3.eth.contract(ethHashTimeLockABI);

  LockFunds = 113113;
  Locker = ethAccountAddress;
  Fetcher = ethAccountAddress;
  periodBlockNumber = 100;

  ethSecret = generateSecret();
  console.log(ethSecret);
  hashOfSecret = ethweb3.sha3(ethSecret, {encoding: 'hex'});
  console.log(hashOfSecret);

  $("#ethContractDeploymentStatus").html("Deploying contract...");

  var ethHTLCCreation = ethHTLC.new(Locker, Fetcher, periodBlockNumber, hashOfSecret, 
      {
        data: '0x'+ethHashTimeLockByteCode.object, 
        from: ethAccountAddress, gas: 1000000
      }
  , function(err, myContract){
   if(!err) {
      // NOTE: The callback will fire twice!
      // Once the contract has the transactionHash property set and once its deployed on an address.
       // e.g. check tx hash on the first call (transaction send)
      if(!myContract.address) {
          console.log("transactionHash:")
          console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
      
      // check address on the second call (contract deployed)
      } else {
          console.log("contract Address:");
          $("#ethContractDeploymentStatus").html("Contract Deployed");
          $("#ethContractAddr").html(myContract.address);
          ethContractAddr = myContract.address;
          console.log(myContract.address) // the contract address
          $("#LockEthFundsInfo").show();
      }
      // Note that the returned "myContractReturned" === "myContract",
      // so the returned "myContractReturned" object will also get the address set.
   }
 });

}

ethFunds = 100;

async function lockEthFunds(){
  // send a transaction to a function
  // myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000});

  ethHTLC = ethweb3.eth.contract(ethHashTimeLockABI);
  ethHTLCInstance = ethHTLC.at(ethContractAddr);
  ethweb3.eth.sendTransaction({
    from: ethAccountAddress,
    to: ethContractAddr,
    value: ethFunds,
  }, function(err, result){
    console.log("Ethereum funds locked!");
    $("#ReturnEthFundsInfo").show();
    $("#FetchEthFundsInfo").show();    
  });
}

async function fetchEthFunds(){
  // send a transaction to a function
  // myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000});

  ethHTLC = ethweb3.eth.contract(ethHashTimeLockABI);
  ethHTLCInstance = ethHTLC.at(ethContractAddr);

  ethHTLCInstance.sendToFetcher(ethSecret, function(err, result){
    if(!err)
      console.log("Ethereum funds fetched!");
    else
       console.error(err);
  });
}


async function returnEthFunds(){
  // send a transaction to a function
  // myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000});

  ethHTLC = ethweb3.eth.contract(ethHashTimeLockABI);
  ethHTLCInstance = ethHTLC.at(ethContractAddr);

  ethHTLCInstance.returnToLocker(function(err, result){
    if(!err)
      console.log("Ethereum funds returned!");
    else
       console.error(err);
  });
}


