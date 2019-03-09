var ethWeb3js = null;

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



  // Obtaining Wallet and Account information
  //console.log('===================================');
  //console.log('Eth address  : ' + ethWeb3js);
  //console.log('Aion address : ' + accountAddress);
  //console.log('===================================');

  //$("#btnInitAS").html("WOW");


  // Grab the contract instance
  // #1 Ethereum

  // #2 AION



  // Now you can start your app & access web3 freely:
  if(appPrepared){


    $("#btnInitAS").click(async function(){
      const aiwaAccountAddress = await aiwa.enable();
      // ethWeb3js.eth.accounts  ---> can return [] 
      //console.log(aiwaAccountAddress[0]);

      startApp();
    });

  }
  else
    console.log('Follow the steps above to proceed.')
});


async function startApp(){
  const aiwaAccountAddress = await aiwa.enable();

  console.log('===================================');
  console.log('Atomic Swap Prtocol')
  console.log('===================================');
  console.log('Eth address  : ' + ethWeb3js.eth.accounts);
  console.log('Aion address : ' + aiwaAccountAddress);
  console.log('===================================');



}