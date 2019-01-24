pragma solidity 0.5.0;

/** @title Decentralised Online Marketplace
  * @author Kreaan Singh
  * @notice Final project Consensys Developers Course 2019
*/

import "./Ownable.sol";
import "./SafeMath.sol";

contract MarketPlace is Ownable {
    /** @dev Solidity-based smart contract to create a decentralised marketplace for shop owners to create storefronts and sell products
    */

    uint public storeCount = 0;
    uint public skuCount = 0;
    bool public stopped = false;

    struct ItemForSale {
        string name;
        uint quantity;
        uint price;
    }

    struct StoreFronts {
        string storeName;
        address payable storeOwner;
        uint pendingWithdrawal;
        uint latestSkuNoInStore;
        mapping(uint => ItemForSale) sku;
    }

    mapping(address => bool) public adminsDB;
    mapping(address => bool) public storeOwnersDB;
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

    modifier checkStoreBalance(uint _storeID, uint _withdrawAmount) {
        require(storeFront[_storeID].pendingWithdrawal >= 0, "The store balance is 0. No funds to withdraw.");
        require(_withdrawAmount <= storeFront[_storeID].pendingWithdrawal, "You are trying to withdraw more than the available balance in the account");
        _;
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



    /** @notice Contract owner functions
     */


    /** @dev Contract owner assigns administrator rights to an ethereum account
      * @param _admin ethereum address
     */
    function addAdmin(address _admin) 
        public
        stopInEmergency()
        onlyOwner() 
    {
            adminsDB[_admin] = true;
            emit adminAdded(_admin);
    }


    /** @dev Contract owner revokes administrator rights from an ethereum account
      * @param _admin ethereum address
     */
    function deleteAdmin(address _admin) 
        public
        stopInEmergency()
        onlyOwner() 
    {
            delete adminsDB[_admin];
            emit adminDeleted(_admin);
    }

    /** @dev Contract owner activates emergency stop - disables all contract functionality
     */
    function activateEmergencyStop()
        public
        onlyOwner()
    {
            stopped = true;
    }

    /** @dev Contract owner deactivates emergency stop - enables all contract functionality
     */
    function deActivateEmergencyStop()
        public
        onlyOwner()
    {
            stopped = false;
    }

    /** @dev Contract owner withdraws all funds of contract in an emergency situation
     */
    function withdrawAllFunds()
        public
        onlyOwner()
        onlyInEmergency() 
    {
            _owner.transfer(address(this).balance);
    }



    /** @notice Administrator functions
     */

    
    /** @dev Administrator assigns store owner rights to an ethereum account
      * @param _newStoreOwner ethereum address
     */
    function addStoreOwner(address _newStoreOwner) 
        public
        stopInEmergency()
        checkAdmin(adminsDB[msg.sender])
    {
            storeOwnersDB[_newStoreOwner] = true;
            emit storeOwnerAdded(_newStoreOwner);
    }

    /** @dev Administrator revokes store owner rights from an ethereum account
      * @param _deleteStoreOwner ethereum address
     */
    function deleteStoreOwner(address _deleteStoreOwner) 
        public
        stopInEmergency()
        checkAdmin(adminsDB[msg.sender]) 
    {
            delete storeOwnersDB[_deleteStoreOwner];
            emit storeOwnerDeleted(_deleteStoreOwner);
    }



    /** @notice Store owner functions
     */

    
    /** @dev Store owner creates a new storefront
      * @param _storeName The display name of the store to create
      * @notice storeOwner Associates the store and the owner
      * @notice storeID Generates a unique ID for the newly added store
     */
    function createStoreFront(string memory _storeName) 
        public
        stopInEmergency()
        checkStoreOwner(storeOwnersDB[msg.sender]) 
    {
            storeCount = SafeMath.add(storeCount, 1);
            storeFront[storeCount].storeName = _storeName;
            storeFront[storeCount].storeOwner = msg.sender;
            emit storeFrontCreated(storeCount, _storeName, msg.sender);
    }

    /** @dev Store owner adds a new item to a particular store that he/she owns
      * @param _nameOfItem The display name of the item to be added
      * @param _quantity The quantity of the item that is to be added
      * @param _price The price per unit of the item to be added
      * @param _storeID The unique ID of the store to which the item will be added. The store ID is generated upon store creation
      * @notice skuCount Generates a unique ID assigned to a newly created item
     */
    function addItem(string memory _nameOfItem, uint _quantity, uint _price, uint _storeID) 
        public
        stopInEmergency()
        checkStoreOwner(storeOwnersDB[msg.sender])
        checkOwnerOfStore(msg.sender, _storeID)
    {
            skuCount = SafeMath.add(skuCount, 1);
            storeFront[_storeID].sku[skuCount].name = _nameOfItem;
            storeFront[_storeID].sku[skuCount].quantity = _quantity;
            storeFront[_storeID].sku[skuCount].price = _price;
            storeFront[_storeID].latestSkuNoInStore = skuCount;
            
            emit itemToSellAdded(skuCount, _storeID, _nameOfItem, _quantity, _price);
    }

    /** @dev Store owner changes the price of an already existing item in a particular store that he/she owns
      * @param _skuCode The unique ID belonging to that particular item
      * @param _storeID The unique ID of the store that the item exists in
      * @param _newPrice The new price of the item
     */
    function changePrice(uint _skuCode, uint _storeID, uint _newPrice) 
        public
        stopInEmergency()
        checkStoreOwner(storeOwnersDB[msg.sender])
        checkOwnerOfStore(msg.sender, _storeID)
        checkInt(_skuCode, skuCount)
    {
            storeFront[_storeID].sku[_skuCode].price = _newPrice;
            emit itemPriceUpdated(_skuCode, _storeID, _newPrice);
    }

    /** @dev Store owner deletes an item from a particular store that he/she owns
      * @param _skuCode The unique ID belonging to that particular item
      * @param _storeID The unique ID of the store that the item exists in
     */
    function deleteItem(uint _storeID, uint _skuCode)
        public
        stopInEmergency()
        checkStoreOwner(storeOwnersDB[msg.sender])
        checkOwnerOfStore(msg.sender, _storeID)
        checkInt(_skuCode, skuCount)
    {
            delete storeFront[_storeID].sku[_skuCode];
            emit itemForSaleDeleted(_storeID, _skuCode);
    }

    /** @dev Store owner withdraws the revenue generated from sales in a particular store
      * @param _withdrawAmount The amount to withdraw. Can withdraw the full balance or a particular amount, to refund customers for returns for eg
      * @param _storeID The unique ID of the store to withdraw from
     */
    function withdrawSales(uint _withdrawAmount, uint _storeID) 
        public
        stopInEmergency()
        checkStoreOwner(storeOwnersDB[msg.sender])
        checkOwnerOfStore(msg.sender, _storeID)
        checkStoreBalance(_storeID, _withdrawAmount)
    {
            address payable storeOwnerAddress = storeFront[_storeID].storeOwner;
            storeFront[_storeID].pendingWithdrawal = SafeMath.sub(storeFront[_storeID].pendingWithdrawal, _withdrawAmount); //Preventing reentrancy
            storeOwnerAddress.transfer(_withdrawAmount);
            emit salesWithdrawn(_storeID, _withdrawAmount, storeFront[_storeID].pendingWithdrawal);
    }



    /** @notice Shopper functions
     */
    

    /** @dev Shopper logs in, browses stores, selects a store, and can purchase an item from the chosen store
      * @param _quantity The number of units of a chosen item to purchase
      * @param _skuCode The unique ID of the item to purchase
      * @param _storeID The unique ID of the store to purchase from (not shown on the UI as by this point, they would already be within the store i.e. store ID is known)
      * @notice Payable payment for the purchase
     */
    function buyItem(uint _quantity, uint _skuCode, uint _storeID) 
        public
        payable
        stopInEmergency()
        checkQuantity(_quantity, _storeID, _skuCode)
        paidEnough(_quantity, storeFront[_storeID].sku[_skuCode].price)
        checkValue(_quantity, storeFront[_storeID].sku[_skuCode].price)

    {
            storeFront[_storeID].sku[_skuCode].quantity -= _quantity;
            storeFront[_storeID].pendingWithdrawal += (storeFront[_storeID].sku[_skuCode].price*_quantity);
            emit itemBought(storeFront[_storeID].sku[_skuCode].name, _skuCode, _quantity, _storeID, storeFront[_storeID].sku[_skuCode].price);
    }



    /** @notice Getters
     */

    /** @dev Gets the latest sku ID, used as the end parameter of a js loop to display the shop items on the UI
      * @param _storeID The unique ID of the store to display the items of
      * @return latestSkuNoInStore The latest item ID added to the store
     */
    function getLatestSKU(uint _storeID) 
        public
        view
        returns (uint)
    {
        return storeFront[_storeID].latestSkuNoInStore;
    }

    /** @dev Gets the details of each item in a shop to display on the UI
      * @param _storeID The unique ID of the store to display the items of
      * @param _sku The unique ID of each item in a particular store
      * @return itemName The name of the item to display
      * @return itemQuantity The number of units of a particular item available in the store
      * @return itemPrice The price per unit of item available to purchase
     */
    function getItemInShop(uint _storeID, uint _sku)
        public
        view
        returns (string memory itemName, uint itemQuantity, uint itemPrice)
    {
            itemName = storeFront[_storeID].sku[_sku].name;
            itemQuantity = storeFront[_storeID].sku[_sku].quantity;
            itemPrice = storeFront[_storeID].sku[_sku].price;
            return (itemName, itemQuantity, itemPrice);
    }

    /** @notice Test getters
      * @dev Fetches the existence of an admin
      * @param _isAdmin The address of account to check the admin status of
      * @return The status of the account => admin or not admin
     */
    function fetchAdmin(address _isAdmin) 
        public
        view
        returns (bool newAdminExists)
    {
            newAdminExists = adminsDB[_isAdmin];
            return newAdminExists;
    }

    /** @dev Fetches the existence of a store owner
      * @param _isStoreOwner The address of account to check the store owner status of
      * @return The status of the account => store owner or not store owner
     */
    function fetchStoreOwner(address _isStoreOwner)
        public
        view
        returns (bool newStoreOwner)
    {
            newStoreOwner = storeOwnersDB[_isStoreOwner];
            return newStoreOwner;
    }

    /** @dev Fetch function used for testing to check that a store was added correctly
      * @param _storeID The store ID for which to check the store owner and store name of
      * @return newStoreOwnerAddress The address of account to confirm ownership against
      * @return storeNameAdded The name of the store to confirm creation of
     */
    function fetchStoreID(uint _storeID)
        public
        view
        returns (address newStoreOwnerAddress, string memory storeNameAdded)
    {
            newStoreOwnerAddress = storeFront[_storeID].storeOwner;
            storeNameAdded = storeFront[_storeID].storeName;
            return (newStoreOwnerAddress, storeNameAdded);
    }

    /** @dev Checks that an item quantity has been reduced after a purchase
      * @param _currentStoreID The store ID to retrieve information from
      * @param _currentSKU The item ID to retrieve information about
      * @return quantity The balance of items left in the shop
     */
    function isItemBought(uint _currentStoreID, uint _currentSKU)
        public
        view
        returns (uint newQuantity)
    {
            return newQuantity = storeFront[_currentStoreID].sku[_currentSKU].quantity;
    }

    /** @dev Checks the balance of the store after sales have been made
      * @param _storeID The store ID for which to check the balance of
      * @return storeBalance The current balance of the store
     */
    function fetchStoreBalance (uint _storeID)
        public
        view
        returns (uint storeBalance)
    {
            storeBalance = storeFront[_storeID].pendingWithdrawal;
            return storeBalance;
    }
}