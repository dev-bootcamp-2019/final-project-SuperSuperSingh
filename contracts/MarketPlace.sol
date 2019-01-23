/*
Questions:
Implement Eth/USD price
*/

pragma solidity 0.5.0;

import "./Ownable.sol";
import "./SafeMath.sol";

contract MarketPlace is Ownable {

    uint public storeCount = 0;
    uint public skuCount = 0;
    bool public stopped = false;

    //Struct to hold details about each item for sale in a particular store
    struct ItemForSale {
        string name;
        uint quantity;
        uint price;
    }

    struct StoreFronts {
        string storeName; //Struct containing store name to display on UI
        address payable storeOwner; //Address to cross check that the store owner is calling the function
        uint pendingWithdrawal; //Total sales value of store
        uint latestSkuNoInStore;
        mapping(uint => ItemForSale) sku; //Mapping of all stock being sold by a particular store
    }

    //used a mapping as opposed to an array to avoid use of a loop to find matches
    mapping(address => bool) public adminsDB; //mapping of admins by address
    mapping(address => bool) public storeOwnersDB; //mapping of store owners by address
    mapping(uint => StoreFronts) public storeFront;



    //Events
    event adminAdded(address _admin);
    event adminDeleted(address _admin);
    event storeOwnerAdded(address _storeOwner);
    event storeOwnerDeleted(address _storeOwner);
    event storeFrontCreated(uint _storeID, string _storeName, address _storeOwner);
    event itemToSellAdded(uint _sku, uint _storeID, string _nameOfItem, uint _quantity, uint _price);
    event itemPriceUpdated(uint _sku, uint _storeID, uint _newPrice);
    event itemForSaleDeleted(uint _storeID, uint _skuCode);
    event salesWithdrawn(uint _storeID, uint _payment, uint _storeSalesBalance);
    event refund(uint _refund);
    event itemBought(string _name, uint _skuCode, uint _quantity, uint _storeID, uint _price);



    //Modifiers

    modifier checkAdmin(bool _exists) {
        require(_exists, "This function is only available to administrators");
        _;
    }

    modifier checkStoreOwner(bool _exists) {
        require(_exists, "This function is only available to store owners");
        _;
    }

    modifier checkOwnerOfStore(address _storeOwner, uint _storeID) {
        require (_storeOwner == storeFront[_storeID].storeOwner, "You cannot interact with this store as you are not the owner");
        _;
    }

    modifier checkQuantity(uint _quantity, uint _storeID, uint _skuCode) {
        require(_quantity <= storeFront[_storeID].sku[_skuCode].quantity, "You are trying to purchase more items than are available");
        _;
    }

    modifier paidEnough(uint _quantity, uint _price) {
        require(msg.value >= _price*_quantity, "You have not tendered the incorrect amount.");
        _;
    }

    modifier checkValue(uint _quantity, uint _price) {
        _;
        uint amountToRefund = msg.value - _price*_quantity;
        msg.sender.transfer(amountToRefund);
        emit refund(amountToRefund);
    }

    modifier checkInt(uint _valueToCheck, uint _checkAgainst) {
        require(_valueToCheck <= _checkAgainst, "You have entered a value that does not exist");
        _;
    }

    modifier stopInEmergency {
        require(!stopped, "To protect your funds, the marketplace has been placed on emergency shutdown by the contract owner due to a potential threat. Please wait for further notice");
        _;
    }

    modifier onlyInEmergency {
        require(stopped);
        _;
    }



    //Contract owner functions

    function addAdmin(address _admin) 
        public 
        onlyOwner() 
    {
            adminsDB[_admin] = true;
            emit adminAdded(_admin);
    }

    function deleteAdmin(address _admin) 
        public 
        onlyOwner() 
    {
            delete adminsDB[_admin];
            emit adminDeleted(_admin);
    }

    function activateEmergencyStop()
        public
        onlyOwner()
    {
            stopped = true;
    }

    function deActivateEmergencyStop()
        public
        onlyOwner()
    {
            stopped = false;
    }

    function withdrawAllFunds()
        public
        onlyOwner()
        onlyInEmergency() 
    {
            _owner.transfer(address(this).balance);
    }


    //Admin functions

    function addStoreOwner(address _newStoreOwner) 
        public 
        checkAdmin(adminsDB[msg.sender])
    {
            storeOwnersDB[_newStoreOwner] = true;
            emit storeOwnerAdded(_newStoreOwner);
    }

    function deleteStoreOwner(address _deleteStoreOwner) 
        public 
        checkAdmin(adminsDB[msg.sender]) 
    {
            delete storeOwnersDB[_deleteStoreOwner];
            emit storeOwnerDeleted(_deleteStoreOwner);
    }



    //Store owner functions

    function createStoreFront(string memory _storeName) 
        public 
        checkStoreOwner(storeOwnersDB[msg.sender]) 
    {
            storeCount = SafeMath.add(storeCount, 1);
            storeFront[storeCount].storeName = _storeName;
            storeFront[storeCount].storeOwner = msg.sender;
            emit storeFrontCreated(storeCount, _storeName, msg.sender);
    }

    function addItem(string memory _nameOfItem, uint _quantity, uint _price, uint _storeID) 
        public 
        checkStoreOwner(storeOwnersDB[msg.sender])
        checkOwnerOfStore(msg.sender, _storeID)
        stopInEmergency()
    {
            skuCount = SafeMath.add(skuCount, 1);
            storeFront[_storeID].sku[skuCount].name = _nameOfItem;
            storeFront[_storeID].sku[skuCount].quantity = _quantity;
            storeFront[_storeID].sku[skuCount].price = _price;
            storeFront[_storeID].latestSkuNoInStore = skuCount;
            
            emit itemToSellAdded(skuCount, _storeID, _nameOfItem, _quantity, _price);
    }

    function changePrice(uint _skuCode, uint _storeID, uint _newPrice) 
        public 
        checkStoreOwner(storeOwnersDB[msg.sender])
        checkOwnerOfStore(msg.sender, _storeID)
        stopInEmergency()
        checkInt(_skuCode, skuCount)
    {
            storeFront[_storeID].sku[_skuCode].price = _newPrice;
            emit itemPriceUpdated(_skuCode, _storeID, _newPrice);
    }

    function deleteItem(uint _storeID, uint _skuCode)
        public 
        checkStoreOwner(storeOwnersDB[msg.sender])
        checkOwnerOfStore(msg.sender, _storeID)
        checkInt(_skuCode, skuCount)
    {
            delete storeFront[_storeID].sku[_skuCode];
            emit itemForSaleDeleted(_storeID, _skuCode);
    }

    function withdrawSales(uint _withdrawAmount, uint _storeID) 
        public 
        checkStoreOwner(storeOwnersDB[msg.sender])
        checkOwnerOfStore(msg.sender, _storeID)
        stopInEmergency()
    {
            address payable storeOwnerAddress = storeFront[_storeID].storeOwner;
            storeFront[_storeID].pendingWithdrawal = SafeMath.sub(storeFront[_storeID].pendingWithdrawal, _withdrawAmount); //Preventing reentrancy
            storeOwnerAddress.transfer(_withdrawAmount);
            emit salesWithdrawn(_storeID, _withdrawAmount, storeFront[_storeID].pendingWithdrawal);
    }


    
    //Shopper functions
    function buyItem(uint _quantity, uint _skuCode, uint _storeID) 
        public
        payable
        checkQuantity(_quantity, _storeID, _skuCode)
        paidEnough(_quantity, storeFront[_storeID].sku[_skuCode].price)
        checkValue(_quantity, storeFront[_storeID].sku[_skuCode].price)
        stopInEmergency()

    {
            storeFront[_storeID].sku[_skuCode].quantity -= _quantity;
            storeFront[_storeID].pendingWithdrawal += (storeFront[_storeID].sku[_skuCode].price*_quantity);
            emit itemBought(storeFront[_storeID].sku[_skuCode].name, _skuCode, _quantity, _storeID, storeFront[_storeID].sku[_skuCode].price);
    }



    //Getters
    function getLatestSKU(uint _storeID) 
        public
        view
        returns (uint)
    {
        return storeFront[_storeID].latestSkuNoInStore;
    }

    function getItemInShop(uint _storeID, uint _sku)
        public
        view
        returns (string memory, uint, uint)
    {
            string memory itemName = storeFront[_storeID].sku[_sku].name;
            uint itemQuantity = storeFront[_storeID].sku[_sku].quantity;
            uint itemPrice = storeFront[_storeID].sku[_sku].price;
            return (itemName, itemQuantity, itemPrice);
    }



    //Testing
    function fetchAdmin(address _isAdmin) 
        public
        view
        returns (bool newAdminExists)
    {
            newAdminExists = adminsDB[_isAdmin];
            return newAdminExists;
    }

    function fetchStoreOwner(address _isStoreOwner)
        public
        view
        returns (bool newStoreOwner)
    {
            newStoreOwner = storeOwnersDB[_isStoreOwner];
            return newStoreOwner;
    }

    function fetchStoreID(uint _storeID)
        public
        view
        returns (address newStoreOwnerAddress, string memory storeNameAdded)
    {
            newStoreOwnerAddress = storeFront[_storeID].storeOwner;
            storeNameAdded = storeFront[_storeID].storeName;
            return (newStoreOwnerAddress, storeNameAdded);
    }

    function fetchItem(uint _storeID, uint _skuCode)
        public
        view
        returns (string memory isName, uint isQuantity, uint isPrice)
    {
            isName = storeFront[_storeID].sku[_skuCode].name;
            isQuantity = storeFront[_storeID].sku[_skuCode].quantity;
            isPrice = storeFront[_storeID].sku[_skuCode].price;
            return (isName, isQuantity, isPrice);
    }

    function isItemBought(uint _currentStoreID, uint _currentSKU)
        public
        view
        returns (uint newQuantity)
    {
            return newQuantity = storeFront[_currentStoreID].sku[_currentSKU].quantity;
    }

    function fetchStoreBalance (uint _storeID)
        public
        view
        returns (uint storeBalance)
    {
            storeBalance = storeFront[_storeID].pendingWithdrawal;
            return storeBalance;
    }

    function fetchSalesWithdrawn(uint _storeID)
        public
        view
        returns (uint storeBalance)
    {
            storeBalance = storeFront[_storeID].pendingWithdrawal;
            return storeBalance;
    }
}