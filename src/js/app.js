var marketplaceInstance = null;
var selectedShop = null;

$("#login").click(async function(){
  console.log("Attempted to log in");
  if (App.account == await marketplaceInstance.owner()) {
      alert("Logging in as Contract Owner");
      $("#contractOwnerView").show();
      $("#administratorView").hide();
      $("#storeOwnerView").hide();
      $("#shopperSelectShop").hide();
      $("#welcomeView").hide();
      $("#logout").show();
  }
  else if(await marketplaceInstance.adminsDB.call(App.account) == true) {
      alert("Logging in as Marketplace Administrator");
      $("#contractOwnerView").hide();
      $("#administratorView").show();
      $("#storeOwnerView").hide();
      $("#shopperSelectShop").hide();
      $("#welcomeView").hide();
      $("#logout").show();
  }
  else if(await marketplaceInstance.storeOwnersDB.call(App.account) == true) {
      alert("Logging in as Storefront Owner");
      $("#contractOwnerView").hide();
      $("#administratorView").hide();
      $("#storeOwnerView").show();
      $("#shopperSelectShop").hide();
      $("#welcomeView").hide();
      $("#logout").show();
  }
  else {
      alert("Logging in as shopper");
      $("#contractOwnerView").hide();
      $("#administratorView").hide();
      $("#storeOwnerView").hide();
      $("#shopperSelectShop").show();
      $("#welcomeView").hide();
      $("#logout").show();

      var noOfRows = await marketplaceInstance.storeCount();
      for (var k = 1; k <= noOfRows; k++) {
        $('#shopTable > tbody:last-child').append('<tr><td>',marketplaceInstance.storeFront.call(k).storeName,'</td><td>',k,'</td></tr>');
        //$(function(){        
          //var $button = $('.shopSelector').clone();
          //$button.val() = await marketplaceInstance.storeFront.call(k).storeName + "Shop ID: " + k;
          //$('#shopperSelectShop').html($button);
        //});
      }
      $("#selectedShopButton").click(async function(){
        selectedShop = $("#selectedShop").val();

        $("#shopperSelectShop").hide();
        $("#shopperShop").show();

        var noOfRows = await marketplaceInstance.storeFront.call(selectedShop).sku.length();

        for (var k = 1; k <= noOfRows; k++) {
          $('#forSaleTable > tbody:last-child').append('<tr><td>',marketplaceInstance.storeFront.call(selectedShop).sku.call(k).name,'</td><td>',marketplaceInstance.storeFront.call(selectedShop).sku.call(k).quantity,'</td><td>',marketplaceInstance.storeFront.call(selectedShop).sku.call(k).price,'</td></tr>');
        }
      })
      

  }
})

$("#logout").click(function(){
  alert("Logging out");
  $("#contractOwnerView").hide();
  $("#administratorView").hide();
  $("#storeOwnerView").hide();
  $("#shopperSelectShop").hide();
  $("#shopperShop").hide();
  $("#welcomeView").show();
})

$("#addAdminButton").click(async function() { 
  console.log("Attempted to add admin");
  var adminAddressToAdd = $("#addAdminInput").val();
  var result = await marketplaceInstance.addAdmin(adminAddressToAdd);
  console.log(result);

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
  var newItemPrice = $("#newItemPrice").val();
  var newItemShopID = $("#newItemShopID").val();
  marketplaceInstance.addItem(newItemName, newItemQuantity, newItemPrice, newItemShopID);
})

$("#changePriceButton").click(function() {
  console.log("Attempted to change item price");
  var changePriceInput = $("#changePriceNewPrice").val();
  var changePriceSKU = $("#changePriceSKU").val();
  var changePriceShopID = $("#changePriceShopID").val();
  marketplaceInstance.changePrice(changePriceInput, changePriceSKU, changePriceShopID, newItemShopID);
})

$("#deleteItemButton").click(function() {
  var skuToDelete = $("#skuToDelete").val();
  var skuShopIDToDelete = $("#skuShopIDToDelete").val();
  marketplaceInstance.deleteItem(skuToDelete, skuShopIDToDelete);
})

$("withdrawButton").click(function() {
  console.log("Attempted to withdraw sales");
  var shopIDtoWithdrawFrom = $("#shopIDtoWithdrawFrom").val();
  marketplaceInstance.withdrawSales(shopIDtoWithdrawFrom);
})

$("buyButton").click(function(){
  console.log("Attempted to purchase item");
  var buySKU = $("#buySKU").val();
  var buyQuantity = $("#buyQuantity").val();
  var buyStoreID = selectedShop;
  marketplaceInstance.buyItem(buyQuantity, buySKU, buyStoreID);
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
    $("#shopperSelectShop").hide();
    $("#shopperShop").hide();
    $("#logout").hide();
    App.init();
  });
});