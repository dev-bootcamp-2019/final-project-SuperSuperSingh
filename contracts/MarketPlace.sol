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

    //Struct to hold details about each item for sale in a particular store
    struct ItemForSale {
        string name;
        uint quantity;
        uint price;
    }

    struct StoreFronts {
        string storeName; //Struct containing store name to display on UI
        uint[] skusInStore;
        address payable storeOwner; //Address to cross check that the store owner is calling the function
        uint pendingWithdrawal; //Total sales value of store
        uint latestSkuNoInStore;
        mapping(uint => ItemForSale) sku; //Mapping of all stock being sold by a particular store
    }

    struct StoreOwnersDB {
        bool exists;
        uint[] storesInStoreOwner;
    }

    //used a mapping as opposed to an array to avoid use of a loop to find matches
    mapping(address => bool) public adminsDB; //mapping of admins by address
    mapping(address => StoreOwnersDB) public storeOwnersDB; //mapping of store owners by address
    mapping(uint => StoreFronts) public storeFront;



    //Events
    event adminAdded(address _admin);
    event adminDeleted(address _admin);
    event storeOwnerAdded(address _storeOwner);
    event storeOwnerDeleted(address _storeOwner);
    event storeFrontCreated(uint _storeID, string _storeName, address _storeOwner, uint[] _storesInStoreOwner);
    event itemToSellAdded(uint _sku, uint _storeID, string _nameOfItem, uint _quantity, uint _price, uint[] _skusInStore);
    event itemPriceUpdated(uint _sku, uint _storeID, uint _newPrice);
    event itemForSaleDeleted(uint _storeID, uint _skuCode, uint[] _skusInStore);
    event salesWithdrawn(uint _storeID, uint _payment, uint _storeSalesBalance);
    event refund(uint _refund);
    event itemBought(uint _skuCode, uint _quantity, uint _storeID, uint _price);



    //Modifiers

    modifier checkAdmin(bool _exists) {
        require(_exists, "This function is only available to administrators");
        _;
    }

    modifier checkStoreOwner(bool _exists) {
        require(_exists, "This function is only available to store owners");
        _;
    }

    modifier checkOwnerOfStore(address _owner, uint _storeID) {
        require (_owner == storeFront[_storeID].storeOwner, "You cannot interact with this store as you are not the owner");
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



    //Admin functions

    function addStoreOwner(address _newStoreOwner) 
        public 
        checkAdmin(adminsDB[msg.sender]) 
    {
            storeOwnersDB[_newStoreOwner].exists = true;
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
        checkStoreOwner(storeOwnersDB[msg.sender].exists) 
    {
            storeCount = SafeMath.add(storeCount, 1);
            storeFront[storeCount].storeName = _storeName;
            storeFront[storeCount].storeOwner = msg.sender;
            storeOwnersDB[msg.sender].storesInStoreOwner.push(storeCount);
            emit storeFrontCreated(storeCount, _storeName, msg.sender, storeOwnersDB[msg.sender].storesInStoreOwner);
    }

    function addItem(string memory _nameOfItem, uint _quantity, uint _price, uint _storeID) 
        public 
        checkStoreOwner(storeOwnersDB[msg.sender].exists)
        checkOwnerOfStore(msg.sender, _storeID)
    {
            skuCount = SafeMath.add(skuCount, 1);
            storeFront[_storeID].sku[skuCount].name = _nameOfItem;
            storeFront[_storeID].sku[skuCount].quantity = _quantity;
            storeFront[_storeID].sku[skuCount].price = _price;
            storeFront[_storeID].skusInStore.push(skuCount);
            storeFront[_storeID].latestSkuNoInStore = skuCount;
            
            emit itemToSellAdded(skuCount, _storeID, _nameOfItem, _quantity, _price, storeFront[_storeID].skusInStore);
    }

    function changePrice(uint _skuCode, uint _storeID, uint _newPrice) 
        public 
        checkStoreOwner(storeOwnersDB[msg.sender].exists)
        checkOwnerOfStore(msg.sender, _storeID)
    {
            storeFront[_storeID].sku[_skuCode].price = _newPrice;
            emit itemPriceUpdated(_skuCode, _storeID, _newPrice);
    }

    function deleteItem(uint _storeID, uint _skuCode)
        public 
        checkStoreOwner(storeOwnersDB[msg.sender].exists)
        checkOwnerOfStore(msg.sender, _storeID)
    {
            delete storeFront[_storeID].sku[_skuCode];

            //An array is used to track skus that belong to a store.
            //It is necessary to remove a sku and delete its position from this array so that the front
            //end displays the correct number of items for sale in a shop. Order does not matter. The
            //quickest way to delete an element from an array is to move the last item in the array into
            //the deleted position, delete the last position, reduce len of array by 1 --> saves gas.
            uint len = storeFront[_storeID].skusInStore.length;
            for (uint k = 0; k < len; k++) {
                if (storeFront[_storeID].skusInStore[k] == _skuCode) {
                    storeFront[_storeID].skusInStore[k] = storeFront[_storeID].skusInStore[len-1];
                    delete storeFront[_storeID].skusInStore[len -1];
                    storeFront[_storeID].skusInStore.length --;
                    break;
                }
            }
            emit itemForSaleDeleted(_storeID, _skuCode, storeFront[_storeID].skusInStore);
    }

    function withdrawSales(uint _storeID) 
        public 
        checkStoreOwner(storeOwnersDB[msg.sender].exists)
        checkOwnerOfStore(msg.sender, _storeID)
    {
            address payable storeOwnerAddress = storeFront[_storeID].storeOwner;
            uint payment = storeFront[_storeID].pendingWithdrawal;
            storeFront[_storeID].pendingWithdrawal = 0; //Preventing reentrancy
            storeOwnerAddress.transfer(payment);
            emit salesWithdrawn(_storeID, payment, storeFront[_storeID].pendingWithdrawal);
    }


    
    //Shopper functions
    function buyItem(uint _quantity, uint _skuCode, uint _storeID) 
        public
        payable
        checkQuantity(_quantity, _storeID, _skuCode)
        paidEnough(_quantity, storeFront[_storeID].sku[_skuCode].price)
        checkValue(_quantity, storeFront[_storeID].sku[_skuCode].price)
    {
            storeFront[_storeID].sku[_skuCode].quantity -= _quantity;
            storeFront[_storeID].pendingWithdrawal += (storeFront[_storeID].sku[_skuCode].price*_quantity);
            emit itemBought(_skuCode, _quantity, _storeID, storeFront[_storeID].sku[_skuCode].price);
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
    
    /*function getItemInShopName(uint _storeID, uint _sku)
        public
        view
        returns (string memory)
    {
        return storeFront[_storeID].sku[_sku].name;
    }

    function getItemInShopQuantity(uint _storeID, uint _sku)
        public
        view
        returns (uint)
    {
        return storeFront[_storeID].sku[_sku].quantity;
    }
            
    function getItemInShopPrice(uint _storeID, uint _sku)
        public
        view
        returns (uint)
    {
        return storeFront[_storeID].sku[_sku].price;
    }*/



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
            newStoreOwner = storeOwnersDB[_isStoreOwner].exists;
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