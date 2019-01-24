const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "f91f316aecce48928e237ce915ba97a9";
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();
var infura = "rinkeby.infura.io/v3/f91f316aecce48928e237ce915ba97a9";
var HDWallet = require("truffle-hdwallet-provider")

module.exports = {
	networks: {
		development: {
		host: "localhost",
		port: 8545,
		network_id: "*"
		},

		rinkeby: {
			provider: () => new HDWallet(mnemonic, `https://rinkeby.infura.io/${infuraKey}`),
			network_id: 4,          // Rinkeby's id
			gas: 5500000,        
		},
	},

	
  
	/*compilers: {
		solc: {
			version: "0.5.0", // Fetch exact version from solc-bin (default: truffle's version)
			// version: "native",
			// docker: true, // Use "0.5.1" you've installed locally with docker (default: false)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true
					// runs: 200
				}
				// evmVersion: "byzantium"
			}
		}
	}*/
};