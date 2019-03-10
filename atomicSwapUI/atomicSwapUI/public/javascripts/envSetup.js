var ethWeb3js = null;

$("#walletInfo").hide();
$("#createContractInfo").hide();
$("#createAionContractInfo").hide();
$("#LockEthFundsInfo").hide();

window.addEventListener('load', function() {

  var appPrepared = true;

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    ethWeb3js = new Web3(web3.currentProvider);
    console.log('Web3 from MetaMask detected!');
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
      const aiwaAccountAddress = await aiwa.enable();
      walletInfo();
    });

  }
  else
    console.log('Follow the steps above to proceed.')
});

async function walletInfo(){
  const aiwaAccountAddresses = await aiwa.enable();
  const aiwaAccountAddress = aiwaAccountAddresses[0];
  const ethAccountAddress = ethWeb3js.eth.accounts;

  console.log('===================================');
  console.log('Wallet Info')
  console.log('===================================');
  console.log('Eth address  : ' + ethAccountAddress);
  console.log('Aion address : ' + aiwaAccountAddress);
  console.log('===================================');

  $("#walletInfo").show();

  $("#userEthAddr").html(ethAccountAddress);
  $("#userAionAddr").html(aiwaAccountAddress);


  $("#createContractInfo").show();
}