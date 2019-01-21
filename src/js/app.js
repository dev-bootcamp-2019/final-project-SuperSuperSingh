var marketplaceInstance = null;
var selectedShop = null;

$("#login").click(async function(){
  console.log("Attempted to log in");
  if (App.account == await marketplaceInstance.owner()) {
      alert("Logging in as Contract Owner");
      $("#contractOwnerView").show();
      $("#welcomeView").hide();
      $("#logout").show();
  }
  else if(await marketplaceInstance.adminsDB.call(App.account) == true) {
      alert("Logging in as Marketplace Administrator");
      $("#administratorView").show();
      $("#welcomeView").hide();
      $("#logout").show();
  }
  else if(await marketplaceInstance.storeOwnersDB.call(App.account) == true) {
      alert("Logging in as Storefront Owner");
      $("#storeOwnerView").show();
      $("#welcomeView").hide();
      $("#logout").show();
  }
  else {
      alert("Logging in as shopper");
      $("#shopperSelectShop").show();
      $("#welcomeView").hide();
      $("#logout").show();





      //This only works because there is no deleteStore function. If this had to be taken into account, a more robust indexing method would be required to
      //map the storeIDs to the store names for display purposes. For eg, deleting store with ID 5 in a list of 7 stores would leave a gap, so a loop from
      //1 to 7 would display a empty line item. This can very easily be dealt with error handling.
      var noOfRows = await marketplaceInstance.storeCount();
      console.log("Number of rows [%o]",noOfRows);
      
      $('#shopTable > tbody:last-child').append('<tr><th>Shop Name</th><th>Shop ID</th></tr>');
      for (let k = 1; k <= noOfRows; k++) {
        let storeFront = await marketplaceInstance.storeFront.call(k);
        //console.log("Store name is [%o][%o]",storeFront,k);
        $('#shopTable > tbody:last-child').append('<tr><td>',storeFront[0],'</td><td>',k,'</td></tr>');
      }






      $("#selectedShopButton").click(async function(){
        selectedShop = $("#selectedShop").val();

        $("#shopperSelectShop").hide();
        $("#shopperShop").show();

        $('#forSaleTable > tbody:last-child').append('<tr><th>Item Name</th><th>Item SKU</th></th><th>Quantity available</th></th><th>Price per unit</th></tr>');
        let noOfRows = await marketplaceInstance.getLatestSKU(selectedShop);
        console.log("no of rows: ", noOfRows);
        //console.log("Items table [%o]");

        //debugger;
        for (var k = 1; k <= noOfRows; k++) {
          let item = await marketplaceInstance.getItemInShop(selectedShop, k);
          if (item[0] !== "") {
            console.log("Item details %o", item);
            $('#forSaleTable > tbody:last-child').append('<tr><td>',item[0],'</td><td>',k,'</td><td>',item[1].toString(),'</td><td>',item[2].toString(),'</td></tr>');
            //$("#forSaleDiv").html(item[0], "    ", k, "    ", item[1].toString(), "    ", item[2].string())
          }  
        }
      })
      
    
  }
})

$("#logout").click(function(){
  alert("Logging out");
})

function redrawTable (_administrator) {
  
}


$("#addAdminButton").click(async function() { 
  console.log("Attempted to add admin");
  var adminAddressToAdd = $("#addAdminInput").val();
  var result = await marketplaceInstance.addAdmin(adminAddressToAdd);
  alert(result.logs[0].args._admin + " added as an administrator");

  /*try {
    console.log("Attempted to add admin");
    var adminAddressToAdd = $("#addAdminInput").val();
    marketplaceInstance.addAdmin(adminAddressToAdd);
  } catch (error){
    alert("Transaction rejected");
  }*/
})

$("#deleteAdminButton").click(async function() {
  console.log("Attempted to delete admin");
  var adminAddressToDelete = $("#deleteAdminInput").val();
  const result = await marketplaceInstance.deleteAdmin(adminAddressToDelete);
  alert(result.logs[0].args._admin + " deleted as an administrator");
})

$("#addStoreOwnerButton").click(async function() {
  console.log("Attempted to add store owner");
  var storeOwnerAddressToAdd = $("#addStoreOwnerInput").val();
  const result = await marketplaceInstance.addStoreOwner(storeOwnerAddressToAdd);
  alert(result.logs[0].args._storeOwner + " added as a store owner");
})

$("#deleteStoreOwnerButton").click(async function() {
  console.log("Attempted to delete store owner");
  var storeOwnerAddressToDelete = $("#deleteStoreOwnerInput").val();
  const result = await marketplaceInstance.deleteStoreOwner(storeOwnerAddressToDelete);
  alert(result.logs[0].args._storeOwner + " deleted as a store owner");
})

$("#createStoreButton").click(async function() {
  console.log("Attempted to create store");
  var storeToCreate = $("#createStoreInput").val();
  const result = await marketplaceInstance.createStoreFront(storeToCreate);
  //console.log(result.logs[0].args);
  alert(result.logs[0].args._storeName + " created with store ID of " + result.logs[0].args._storeID);
})

$("#newItemButton").click(async function() {
  console.log("Attempted to add new item");
  var newItemName = $("#newItemName").val();
  var newItemQuantity = $("#newItemQuantity").val();
  var newItemPrice = $("#newItemPrice").val();
  var newItemShopID = $("#newItemShopID").val();
  const result = await marketplaceInstance.addItem(newItemName, newItemQuantity, newItemPrice, newItemShopID);
  console.log(result.logs);
  alert(result.logs[0].args._nameOfItem + "\nassigned sku code " + result.logs[0].args._sku.toString() + "\nadded to store ID " + result.logs[0].args._storeID.toString()
     + "\nquantity " + result.logs[0].args._quantity.toString() + "\nwith price " + result.logs[0].args._price.toString());
})

$("#changePriceButton").click(async function() {
  console.log("Attempted to change item price");
  var changePriceInput = $("#changePriceNewPrice").val();
  var changePriceSKU = $("#changePriceSKU").val();
  var changePriceShopID = $("#changePriceShopID").val();
  const result = await marketplaceInstance.changePrice(changePriceInput, changePriceSKU, changePriceShopID, newItemShopID);
  console.log(result.logs);
})

$("#deleteItemButton").click(async function() {
  var skuToDelete = $("#skuToDelete").val();
  var skuShopIDToDelete = $("#skuShopIDToDelete").val();
  const result = await marketplaceInstance.deleteItem(skuToDelete, skuShopIDToDelete);
  console.log(result.logs);
})

$("#withdrawButton").click(async function() {
  console.log("Attempted to withdraw sales");
  var shopIDtoWithdrawFrom = $("#shopIDtoWithdrawFrom").val();
  const result = await marketplaceInstance.withdrawSales(shopIDtoWithdrawFrom);
  console.log(result.logs);
})

$("#buyButton").click(async function(){
  console.log("Attempted to purchase item");
  var buySKU = $("#buySKU").val();
  var buyQuantity = $("#buyQuantity").val();
  var payment = parseInt($("#payment").val());
  var buyStoreID = selectedShop;
  const result = await marketplaceInstance.buyItem(buyQuantity, buySKU, buyStoreID, { gas:100000, value: payment});
  console.log(result.logs);
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
    web3.eth.getCoinbase(async function(err, account) {
      if (err === null) {
        App.account = account;
        if (account == null) {
          account = "No account found. Please log into Metamask or use test wallet";
        }
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load shopcount
    App.contracts.MarketPlace.deployed().then(function(instance) {
      marketplaceInstance = instance;
      return marketplaceInstance.storeCount();
    }).then(function(storeCount) {
        $("#numberOfStores").html("Number of stores: " + storeCount);
      });
  },
};

$(function() {
  $(window).load(function() {
    $("#storeOwnerView").hide();
    $("#administratorView").hide();
    $("#contractOwnerView").hide();
    $("#shopperSelectShop").hide();
    $("#shopperShop").hide();
    $("#logout").hide();
    App.init();
  });
});