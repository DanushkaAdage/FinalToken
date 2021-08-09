const FinalToken = artifacts.require('FinalToken');

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('FinalToken', (accounts) => {
    let finalToken
    

   before(async () => {
       //load contract
       let finalToken = await FinalToken.new()

      
       
      await finalToken.transfer(accounts[0], tokens('10'), {from: accounts[0]})
   }) 

  describe('FinalToken deployment', async () => {
    it('Deploy Contract properly', async () => {
        let finalToken = await FinalToken.new()
        const name = await finalToken.name()
        assert.equal(name, 'FinalToken')
        
    });
  })

  

});