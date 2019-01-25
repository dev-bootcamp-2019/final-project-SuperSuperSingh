# Decentralised online marketplace

Consensys Academy Developers Course

Final Project - Kreaan Singh

Jan 2019



## Introduction

The developed dapp is a decentralised open marketplace built to operate on the [Ethereum](https://ethereum.org/) blockchain, using Ethereums native currency, Ether, as the medium of exchange.

The marketplace is built to allow anyone to create a storefront, subject to their approval as a registered shopfront owner by an administrator of the system, and manage sales and inventory within their store(s). A simple GUI has been designed to allow for interaction with the contract within a standard graphical browser environment, using the [web3](https://blockchainhub.net/web3-decentralized-web) standard. The contract itself has been developed using the [Truffle](https://truffleframework.com/truffle) development framework v5.0.2, and [Solidity](https://solidity.readthedocs.io/en/v0.5.1/) compiler v0.5.0.

The marketplace can be deployed to a local development blockchain such as that created by [Ganache](https://truffleframework.com/ganache), an Ethereum testnet such as [Rinkeby](https://rinkeby.etherscan.io/), or the main Ethereum blockchain (*please note that this code has not been audited*).

This dapp has been submitted as a final project for the Consensys Academy Developers Course, October 2018 - January 2019.


## App functionality

There are 4 sets of users - the contract owner, the administrator, the shopfront owner and the shopper. Upon login, the dapp recognises the Ethereum address of the user and grants them viewing/access rights accordingly.


**Contract Owner functionality**

- Add marketplace administrator

- Delete marketplace administrator

- Freeze contract functionality (emergency stop)

- Withdraw all contract funds (once emergency stop activated)

- Unfreeze contract functionality

**Administrator functionality**

- Add shop owner

- Delete shop owner


**Shop owner functionality**

- Create new shopfront

- Add new items for sale in a particular shopfront

- Modify the price of an existing item for sale

- Delete an item from a shopfront

- Withdraw sales income from a particular shop


**Shopper functionality**

- View shopfronts available on the marketplace

- Enter a shopfront and view items available for sale

- Purchase items from a particular storefront

**Initial deployment walkthrough**

The dapp will automatically recognise the account and verify access rights upon login. This action takes the user to the relevant view in which the functions that are pertinent to him/her are visible.

Upon initial deployment, an administrator and store owner will not exist. The contract owner must first assign administrator rights to a user, who can then assign store owner rights to the next user.

A shopper will not see any stores or items until a store owner has created a store and added items to sell within that store.
 
At the current state of the codebase with simplified functionality, a contract owner takes precedence in the login hierarchy, and therefore cannot log in as an administrator, store owner or shopper. The same applies to administrators and store owners in their respective ranking.

Metamask will generally open a confirmation window upon every state-changing transaction (most button clicks), but if it does not, click on the Metamask extension icon to confirm.

**A note on error handling**

Errors that originate from the contract, such as access rights, incorrect deposits, and empty inputs can be viewed in the console. To access the console, right click on the web page and select "inspect", or similar.

As a future improvement, errors originating from the contract should be displayed in the UI.

## Application setup

The source code for the marketplace dapp can be found on [Github](https://github.com/dev-bootcamp-2019/final-project-SuperSuperSingh/). 

### Development Environment 

[VirtualBox v6.0](https://www.virtualbox.org/wiki/Downloads)

Host OS - Windows 10 Home edition

[VM OS - Ubuntu 18.4.1](https://www.ubuntu.com/download/desktop)


### Installations

[Ganache-cli](https://truffleframework.com/ganache)

[Truffle](https://truffleframework.com/truffle)

[Metamask](https://metamask.io/)

Lite server - installed with npm/node


In command line, run the following commands as root/administrator.
```
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```

To confirm installation
```
$ nodejs -v
```

To install Ganache-cli and Truffle, run
```
$ sudo npm install -g ganache-cli
$ sudo npm install -g truffle
```

Metamask is installed via your browsers extensions (Chrome or Brave browsers are suggested)

To run the app, clone the Github repo to your local machine, and navigate to the root folder in a command line editor.

In one terminal, run
```
$ ganache-cli
```

In another terminal (or tab), run
```
$ truffle migrate --reset
```
Note that the first instance of project setup may require administrator access - $sudo truffle migrate --reset

In a third terminal (or tab), run
```
npm run dev
```

This creates a local server in which the GUI can be accessed. The typical address is localhost:3000

*Metamask setup in a localhost blockchain deployment* 

Once the GUI is loaded in your browser, open the Metamask browser extension, and then select "Import using account seed phrase" at the bottom of the window. A new browser tab should open. Select localhost network from the available networks, and again, "Import using account seed phrase". Navigate back to the terminal in which Ganache-cli was run, and copy the 12-word mnemonic that is displayed. Copy and paste these words into the Metamask wallet seed field. Enter a password and click restore. The local blockchain account that was used to deploy the dapp is now available for use via Metamask.

*Metamask setup in testnet or mainnet* 

For testnet or mainnet deployments, you will have to load your Rinkeby or private Metamask account respectively in a similar fashion to above, except using the relevant network selection. The details will not be discussed here, but requires real Ether or Ether from a testnet faucet.

Sample tests have been developed and are accessible in the MarketPlace.js file under the test folder. To run the tests, open a new terminal, navigate to the root folder of the app and enter
```
$ truffle develop
```
then
```
$ compile
$ migrate
$ test
```

### Rinkeby testnet deployment

To deploy to the Rinkeby testnet, first ensure that you have a funded Rinkeby account in Metamask. If you do not have an account, create one within the Metamask extension. Take note of your 12 word seed phrase as you will need this to proceed.

Once the account is active, save the 12 word seed phrase in a file called ".secret" in your projects root directory. *Only create and use this file when deploying your contract. For security purposes, you should not expose this seed phrase to anyone and do not use it to generate a real Ether wallet!*

To fund your account, visit [this Rinkeby faucet](https://faucet.rinkeby.io/).

Once you have funds in your account, visit infura.io, create a free account and a new project. Change the project endpoint to "Rinkeby", and copy the project ID. Assign this ID to the infuraKey constant in truffle-config.js. Uncomment all code.

For Truffle to derive the Ethereum address from your mnemonic, Truffle HD wallet provider needs to be installed. Run the command
```
$ npm install truffle-hdwallet-provider
```

Once completed, type the following into your command line
```
$ truffle migrate --network rinkeby
```

Which should deploy the contract to the Rinkeby testnet.


## Enhancemets

- Implement a more robust administrator management system, including the abilities to freeze particular stores and approve stores before they are activated

- Implement a standalone indexing and storage contract to allow for upgradeability

- Include a n-of-m multisig withdrawal system in emergency state

- Remove test functions from the contract. For the purpose of this project it is fine to leave it in the contract, but it does use unnecessary gas to deploy

- Include ERC-20 tokens as mediums of payment

- Implement an oracle to convert the Eth price to a $US price

- Serve the UI from IPFS

- Input validation


## Project Requirements
### User Interface Requirements
- [x] Run the app on a dev server locally for testing/grading
- [x] You should be able to visit a URL and interact with the application
- [x] App recognizes current account
- [x] Sign transactions using MetaMask or uPort
- [x] Contract state is updated
- [x] Update reflected in UI
### Test Requirements
- [x] Write 5 tests for each contract you wrote
- [x] Solidity or JavaScript
- [x] Explain why you wrote those tests
- [x] Tests run with truffle test
### Design Pattern Requirements
- [x] Implement a circuit breaker (emergency stop) pattern
- [x] What other design patterns have you used / not used?
- [x] Why did you choose the patterns that you did?
- [x] Why not others?
### Security Tools / Common Attacks
- [x] Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks
- [x] Use a library or extend a contract
- [x] Via EthPM or write your own
### Stretch Requirements
- [x] Deploy contract on testnet
- [ ] Use Ethereum Name Service
- [ ] Add functionality that allows store owners to create an auction for an individual item in their store
- [ ] Give store owners the option to accept any ERC-20 token
- [ ] Implement an upgradable design pattern
- [ ] Write a smart contract in LLL or Vyper
- [ ] Use uPort
- [ ] Use IPFS
- [ ] Use Oracle
