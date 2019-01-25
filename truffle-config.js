//const infuraKey = "f91f........";   //Visit infura.io, create a free account and project, and input the project ID here
//const fs = require('fs');
//const mnemonic = fs.readFileSync(".secret").toString().trim();   //create a file called .secret and save your Rinkeby account 12-word mnemonic here
//var HDWallet = require("truffle-hdwallet-provider")

module.exports = {
	networks: {
		development: {
		host: "localhost",
		port: 8545,
		network_id: "*"
		},

		//rinkeby: {
		//	provider: () => new HDWallet(mnemonic, `https://rinkeby.infura.io/${infuraKey}`),
		//	network_id: 4,          // Rinkeby's id
		//	gas: 5500000,        
		//},
	},
};