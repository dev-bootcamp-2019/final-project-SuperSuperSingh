var marketplaceInstance = null;

$("#login").click(function(){
  console.log("Attempted to log in");
  if (App.account == marketplaceInstance.owner) {
      alert("Logging in as Contract Owner");
      $("#contractOwnerView").show();
      $("#administratorView").hide();
      $("#storeOwnerView").hide();
      $("#shopperView").hide();
      $("#welcomeView").hide();
      $("#logout").show();
  }
  else if (marketplaceInstance.adminsDB[App.account] == true) {
      alert("Logging in as Marketplace Administrator");
      $("#contractOwnerView").hide();
      $("#administratorView").show();
      $("#storeOwnerView").hide();
      $("#shopperView").hide();
      $("#welcomeView").hide();
  }
  else if(marketplaceInstance.storeOwnersDB[App.account] == true) {
      alert("Logging in as Storefront Owner");
      $("#contractOwnerView").hide();
      $("#administratorView").hide();
      $("#storeOwnerView").show();
      $("#shopperView").hide();
      $("#welcomeView").hide();
      $("#logout").show();
  }
  else {
      alert("Logging in as store patron");
      $("#contractOwnerView").hide();
      $("#administratorView").hide();
      $("#storeOwnerView").hide();
      $("#shopperView").show();
      $("#welcomeView").hide();
      $("#logout").show();
  }
})

$("#logout").click(function(){
  alert("Logging out");
      $("#contractOwnerView").hide();
      $("#administratorView").hide();
      $("#storeOwnerView").hide();
      $("#shopperView").hide();
      $("#welcomeView").show();
})

$("#addAdminButton").click(function() { 
  console.log("Attempted to add admin");
  var adminAddressToAdd = $("#addAdminInput").val();
  marketplaceInstance.addAdmin(adminAddressToAdd);

  /*try {
    console.log("Attempted to add admin");
    var adminAddressToAdd = $("#addAdminInput").val();
    marketplaceInstance.addAdmin(adminAddressToAdd);
  } catch (error){
    alert("Transaction rejected");
  }*/
})

$("#deleteAdminButton").click(function() {
  console.log("Attempted to delete admin");
  var adminAddressToDelete = $("#deleteAdminInput").val();
  marketplaceInstance.deleteAdmin(adminAddressToDelete);
})

$("#addStoreOwnerButton").click(function() {
  console.log("Attempted to add store owner");
  var storeOwnerAddressToAdd = $("#addStoreOwnerInput").val();
  marketplaceInstance.addStoreOwner(storeOwnerAddressToAdd);
})

$("#deleteStoreOwner").click(function() {
  console.log("Attempted to delete store owner");
  var storeOwnerAddressToDelete = $("#deleteStoreOwnerInput").val();
  marketplaceInstance.deleteStoreOwner(storeOwnerAddressToDelete);
})

$("#createStoreButton").click(function() {
  console.log("Attempted to create store");
  var storeToCreate = $("#createStoreInput").val();
  marketplaceInstance.createStoreFront(storeToCreate);
})

$("#newItemButton").click(function() {
  console.log("Attempted to add new item");
  var newItemName = $("#newItemName").val();
  var newItemQuantity = $("#newItemQuantity").val();
  var newItemPrice = $("#newItemPrice");
  var newItemShopID = $("#newItemShopID");
  marketplaceInstance.createStoreFront(newItemName, newItemQuantity, newItemPrice, newItemShopID);
})

$("#changePriceButton").click(function() {
  console.log("Attempted to change item price");
  var changePriceInput = $("#changePriceNewPrice").val();
  var changePriceSKU = $("#changePriceSKU").val();
  var changePriceShopID = $("#changePriceShopID");
  marketplaceInstance.createStoreFront(changePriceInput, changePriceSKU, changePriceShopID, newItemShopID);
})

$("#deleteItemButton").click(function() {
  var skuToDelete = $("#skuToDelete");
  var skuShopIDToDelete = $("#skuShopIDToDelete");
  marketplaceInstance.deleteItem(skuToDelete, skuShopIDToDelete);
})

$("withdrawButton").click(function() {
  var shopIDtoWithdrawFrom = $("#shopIDtoWithdrawFrom");
  marketplaceInstance.withdrawSales(shopIDtoWithdrawFrom);
})

$("#sayHelloButton").click(function(){
  alert($("#sayHello").val());
})

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("MarketPlace.json", function(data) {
      // Instantiate a new truffle contract from the artifact
      var MarketPlaceArtifact = data;
      App.contracts.MarketPlace = TruffleContract(MarketPlaceArtifact);
      // Connect provider to interact with contract
      App.contracts.MarketPlace.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {

    var loader = $("#welcomeView");
    loader.show();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        if (account == null) {
          account = "No account found. Please log into Metamask or use test wallet";
        }
        $("#accountAddress").html("Your Account: " + account);
        //$("#accountBalance").html("Your Balance: " + web3.eth.getBalance(App.account));
      }
    });

    // Load shopcount
    App.contracts.MarketPlace.deployed().then(function(instance) {
      marketplaceInstance = instance;

      //marketplaceInstance.skuCount(function(error,result){
        //console.log("The obect information %o",result)

      return marketplaceInstance.storeCount();
    }).then(function(storeCount) {
        $("#numberOfStores").html("Number of stores: " + storeCount);
      });
  },
};

$(function() {
  $(window).load(function() {
    $("#storeOwnerView").hide(); //Is this the best way of hiding inactive views?
    $("#administratorView").hide();
    $("#contractOwnerView").hide();
    $("#shopperView").hide();
    $("#logout").hide();
    App.init();
  });
});