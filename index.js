window.onload = () => {
    aiwa.enable();
}

$('#grantAccess').on('click', async () => {
    try {
        const accountAddress = await aiwa.enable();  // grants access. Best practice to do it in a button. 
        document.getElementById("grantsAccess").innerHTML = 'account address: ' + accountAddress;
    } catch(err){
        document.getElementById("grantsAccess").innerHTML = err.message;
    }
}); 

$('#getBalance').clock(() => {
    try {
        const balance = web3.eth.getBalance(accountAddress);
        document.getElementById("balanceResult").innerHTML = 'account balance: ' + balance;
    }catch(err){
        document.getElementById("balanceResult").innerHTML = err.message;
    }
});