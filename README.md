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

### Contract Owner functionality
Add marketplace administrator
Delete marketplace administrator
Freeze contract functionality (emergency stop)
Withdraw all contract funds (once emergency stop activated)
Unfreeze contract functionality

### Administrator functionality
Add shop owner
Delete shop owner

### Shop owner functionality
Create new shopfront
Add new items for sale in a particular shopfront
Modify the price of an existing item for sale
Delete an item from a shopfront
Withdraw sales income from a particular shop

### Shopper functionality
View shopfronts available on the marketplace
Enter a shopfront and view items available for sale
Purchase items from a particular shopfront


## Application setup

The source code for the marketplace dapp can be found on [Github](https://github.com/dev-bootcamp-2019/final-project-SuperSuperSingh/). 

### Development Environment 
[VirtualBox v6.0](https://www.virtualbox.org/wiki/Downloads)
Host OS - Windows 10 Home edition
[VM OS - Ubuntu 18.4.1](https://www.ubuntu.com/download/desktop)

### Dependencies
[Ganache-cli](https://truffleframework.com/ganache)
[Truffle](https://truffleframework.com/truffle)
Lite server
[Metamask](https://metamask.io/)

In command line, run the following commands as root/administrator. Lite server is installed alongside nodejs.
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
Note that the first instance of project setup may require adminstrator access - $sudo truffle migrate --reset

In a third terminal (or tab), run
```
npm run dev
```

This creates a local server in which the GUI can be accessed. The typical address is localhost:3000

*For a localhost blockchain deployment* Once the GUI is loaded in your browser, open the Metamask browser extension, and then select "Import using account seed phrase" at the bottom of the window. A new browser tab should open. Select localhost network from the available networks, and again, "Import using account seed phrase". Navigate back to the terminal in which Ganache-cli was run, and copy the 12-word mnemonic that is displayed. Copy and paste these words into the Metamask wallet seed field. Enter a password and click restore. The local blockchain account that was used to deploy the dapp is now available for use via Metamask.

For testnet or mainnet deployment, you will have to load your Rinkeby or private Metamask account respevtively in a similar fashion to above, except using the relevant network selection.

## Enhancemets
Implement a more robust administrator management system, including the abilities to freeze particular stores and approve stores before they are activated
Implement a standalone indexing and storage contract to allow for upgradeability
Include a n-of-m multisig withdrawal system in emergency state
Include ERC-20 tokens as mediums of payment
Implement an oracle to convert the Eth price to a $US price

## Project Requirements
### User Interface Requirements
[ ] Run the app on a dev server locally for testing/grading
[ ] You should be able to visit a URL and interact with the application
[ ] App recognizes current account
[ ] Sign transactions using MetaMask or uPort
[ ] Contract state is updated
[ ] Update reflected in UI
### Test Requirements
[ ] Write 5 tests for each contract you wrote
[ ] Solidity or JavaScript
[ ] Explain why you wrote those tests
[ ] Tests run with truffle test
### Design Pattern Requirements
[ ] Implement a circuit breaker (emergency stop) pattern
[ ] What other design patterns have you used / not used?
[ ] Why did you choose the patterns that you did?
[ ] Why not others?
### Security Tools / Common Attacks
[ ] Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks
[ ] Use a library or extend a contract
[ ] Via EthPM or write your own
### Stretch Requirements
-[ ] Deploy contract on testnet
-[ ] Use Ethereum Name Service
-[ ] Add functionality that allows store owners to create an auction for an individual item in their store
-[ ] Give store owners the option to accept any ERC-20 token
-[ ] Implement an upgradable design pattern
-[ ] Write a smart contract in LLL or Vyper
-[ ] Use uPort
-[ ] Use IPFS
-[ ] Use Oracle
