pragma solidity 0.5.0;

contract MarketPlace {

    address owner;

    //create a struct to hold details about each item for sale in a particular store
    struct ItemForSale {
        string name;
        uint quantity;
        uint price;
    }

    struct StoreFrontStock {
        ItemForSale[] itemsForSale; //Array of type ItemForSale containing goods for sale in a particular store
    }

    //create a struct to record all items for sale within a particular store
    struct StoreFronts {
        string storeName;
        StoreFrontStock[] storeFrontStock; //Array of all stock being sold by a particular store
    }

    //create a struct to record the stores owned by each owner, and a bool to query the existence of that owner
    struct storeOwners {
        StoreFronts[] storeID;
        bool exists;
    }


    mapping(address => bool) public adminsDB; //mapping of admins by address
    mapping(address => storeOwners) public storeOwnersDB; //create a mapping to access each store owner and the stores under him/her
    mapping(uint => StoreFronts) public storeFronts; //mapping of store ID to store name and stock






    //Constructor

    constructor () public {
        owner = msg.sender;
    }


    //Modifiers

    modifier checkContractOwner() {
        require(msg.sender == owner, "This function is only available to the contract owner");
        _;
    }

    modifier checkAdmin(bool _exists) {
        require(_exists, "This function is only available to administrators");
        _;
    }

    modifier checkStoreOwner(address _storeOwnerAddress) {
        require(storeOwnersDB[_storeOwnerAddress].exists == true, "This function is only available to store owners");
        _;
    }


    //Owner functions

    function addAdmin(address _admin) public checkContractOwner() {
        adminsDB[_admin] = true;
    }

    function deleteAdmin(address _admin) public checkContractOwner() {
        delete adminsDB[_admin];
    }


    //Admin functions

    function addStoreOwner(address _newStoreOwner) public checkAdmin(adminsDB[msg.sender]) {
        storeOwnersDB[_newStoreOwner].exists = true;
    }

    function deleteStoreOwner(address _deleteStoreOwner) public checkAdmin(adminsDB[msg.sender]) {
        delete storeOwnersDB[_deleteStoreOwner];
    }


    //Store owner functions

    function createStoreFront(string memory _storeName) public checkStoreOwner(msg.sender) {
        storeOwnersDB[msg.sender].storeID[].push(_storeName);
    }
}