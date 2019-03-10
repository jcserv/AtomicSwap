var ethHTLCFactoryAddr = "0x1724673fedddb27008177f78522c296d41b9ae16";

$("#walletInfo").hide();

/*
$("#createEthContractInfo").hide();
$("#LockEthFundsInfo").hide();
$("#FetchEthFundsInfo").hide();
$("#ReturnEthFundsInfo").hide();

$("#createAionSolContractInfo").hide();
$("#LockAionSolFundsInfo").hide();
$("#FetchAionSolFundsInfo").hide();
$("#ReturnAionSolFundsInfo").hide();
*/

var ethWeb3js = require('web3');
//var aionWeb3js = require('aion-web3');

ethweb3 = new ethWeb3js(web3.currentProvider || "ws://localhost:8546");
//aionweb3 = new aionWeb3js(aionweb3.currentProvider);

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

  // setting default account
  aionweb3.eth.defaultAccount = aiwaAccountAddress;

  ethAccountBalance = null;
  aiwaAccountBalance = null ;

  aionweb3.eth.getBalance(aiwaAccountAddress, (error, result) => {
    aiwaAccountBalance=result;
  });

  //try {
  //      await aiwaAccountBalance = aionweb3.eth.getBalance(aiwaAccountAddress);
  //}catch(err){
  //      console.log(err.message);
  //}

  ethweb3.eth.getBalance( ethAccountAddress, ethweb3.eth.defaultBlock, (error, result) => {
    ethAccountBalance=result;
    printWalletInfo();
  });

  //console.log(aionweb3.eth.getAccounts());

  $("#walletInfo").show();
  $("#userEthAddr").html(ethAccountAddress);
  $("#userAionAddr").html(aiwaAccountAddress);
  $("#createEthContractInfo").show();
}


function generateSecret(){
    return ethweb3.fromAscii("ThisIsVerySecure,UnbelievablySecure");
}




async function createEthContract(){

  ethLockFunds = 113113;
  ethLocker = ethAccountAddress;
  ethFetcher = ethAccountAddress;
  ethPeriodBlockNumber = 100;
  ethSecret = generateSecret();
  hashOfSecret = ethweb3.sha3(ethSecret, {encoding: 'hex'});


  ethHTLC = ethweb3.eth.contract(ethHashTimeLockABI);

  console.log(ethSecret);
  console.log(hashOfSecret);

  $("#ethContractDeploymentStatus").html("Deploying contract...");

  var ethHTLCCreation = ethHTLC.new(ethLocker, ethFetcher, ethPeriodBlockNumber, hashOfSecret, 
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

async function lockEthFunds(){
  // send a transaction to a function
  // myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000});

  ethHTLC = ethweb3.eth.contract(ethHashTimeLockABI);
  ethHTLCInstance = ethHTLC.at(ethContractAddr);
  ethweb3.eth.sendTransaction({
    from: ethAccountAddress,
    to: ethContractAddr,
    value: ethLockFunds,
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




$("#btnCreateAionSolContract").click( async function(){

  aionLockFunds = 114114;
  aionLocker = aiwaAccountAddress;
  aionFetcher = aiwaAccountAddress;
  aionPeriodBlockNumber = 50;
  aionSecret = generateSecret();
  hashOfSecret = ethweb3.sha3(aionSecret, {encoding: 'hex'});

  aionSolHTLC = aionweb3.eth.contract(aionSolABI);

  $("#aionSolContractDeploymentStatus").html("Contract Deploying...");

  var aionSolHTLCCreation = aionSolHTLC.new(aionLocker, aionFetcher, aionPeriodBlockNumber, hashOfSecret, 
      {
        data: '0x'+aionSolByteCode.object, 
        from: aiwaAccountAddress, gas: 1000000
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
          $("#aionSolContractDeploymentStatus").html("Contract Deployed");
          $("#aionSolContractAddr").html(myContract.address);
          aionSolContractAddr = myContract.address;
          console.log(myContract.address) // the contract address
      }
      // Note that the returned "myContractReturned" === "myContract",
      // so the returned "myContractReturned" object will also get the address set.
   }
 });

});

async function lockAionSolFunds(){
  aionSolHTLC = aionweb3.eth.contract(aionSolABI);
  aionSolHTLCInstance = aionSolHTLC.at(aionSolContractAddr);

  aionweb3.eth.sendTransaction({
    from: aiwaAccountAddress,
    to: aionSolContractAddr,
    value: aionLockFunds,
  }, function(err, result){
    console.log("Aion funds locked!");   
  });
}

async function fetchAionSolFunds(){
  aionSolHTLC = aionweb3.eth.contract(aionSolABI);
  aionSolHTLCInstance = aionSolHTLC.at(aionSolContractAddr);

  aionSolHTLCInstance.sendToFetcher(aionSecret, function(err, result){
    if(!err)
      console.log("Aion funds fetched!");
    else
       console.error(err);
  });
}

async function returnAionSolFunds(){
  aionSolHTLC = aionweb3.eth.contract(aionSolABI);
  aionSolHTLCInstance = aionSolHTLC.at(aionSolContractAddr);

  aionSolHTLCInstance.returnToLocker(function(err, result){
    if(!err)
      console.log("Ethereum funds returned!");
    else
       console.error(err);
  });
}

