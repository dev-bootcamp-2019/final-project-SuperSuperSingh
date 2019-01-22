var marketplaceInstance = null;
var selectedShop = null;

async function refreshTables(){
  $("#ownerTable").remove();
  $("#ownerTablePos").html("<table id='ownerTable' class='table text-left'><tbody><tr></tr></tbody></table>")
  let noOfRows = await marketplaceInstance.storeCount();
  for (let k = 1; k <= noOfRows; k++) {
    let storeFront = await marketplaceInstance.storeFront.call(k);
    if (App.account == storeFront[1]){
      $('#ownerTable> tbody:last-child').append('<tr><th>' + storeFront[0] + '</th><th>Store ID ' + k + '</th></tr>');
      $('#ownerTable> tbody:last-child').append('<tr><th>Item Name</th><th>Item SKU</th></th><th>Quantity available</th></th><th>Price per unit</th></tr>');
      let noOfInner = await marketplaceInstance.getLatestSKU(k);
      for (var i = 1; i <= noOfInner.c[0]; i++) {
        let item = await marketplaceInstance.getItemInShop(k, i);
        if (item[0] !== "") {
          $('#ownerTable > tbody:last-child').append('<tr><td>' + item[0] + '</td><td>' + k + '</td><td>' + item[1].toString() + '</td><td>' + item[2].toString() + '</td></tr>');
        }  
      }
      $('#ownerTable> tbody:last-child').append('<hr/>');
    }
  }
}

$("#login").click(async function(){
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
      refreshTables();
  }
  else {
      alert("Logging in as shopper");
      $("#shopperSelectShop").show();
      $("#welcomeView").hide();
      $("#logout").show();

      //This only works because there is no deleteStore function. If this had to be taken into account, a more robust indexing method would be required to
      //map the storeIDs to the store names for display purposes. For eg, deleting store with ID 5 in a list of 7 stores would leave a gap, so a loop from
      //1 to 7 would display a empty line item. This can very easily be dealt with error handling.
      let noOfRows = await marketplaceInstance.storeCount();
      $('#shopTable > tbody:last-child').append('<tr><th>Shop Name</th><th>Shop ID</th></tr>');
      for (let k = 1; k <= noOfRows; k++) {
        let storeFront = await marketplaceInstance.storeFront.call(k);
        $('#shopTable > tbody:last-child').append('<tr><td>' + storeFront[0] + '</td><td>' + k + '</td></tr>');
      }

      $("#selectedShopButton").click(async function(){
        selectedShop = $("#selectedShop").val();

        $("#shopperSelectShop").hide();
        $("#shopperShop").show();

        let storeFront = await marketplaceInstance.storeFront.call(selectedShop);
        $("#shopperHeading").html(storeFront[0]);

        $('#forSaleTable > tbody:last-child').append('<tr><th>Item Name</th><th>Item SKU</th></th><th>Quantity available</th></th><th>Price per unit</th></tr>');
        let noOfRows = await marketplaceInstance.getLatestSKU(selectedShop);
        for (var k = 1; k <= noOfRows; k++) {
          let item = await marketplaceInstance.getItemInShop(selectedShop, k);
          if (item[0] !== "") {
            $('#forSaleTable > tbody:last-child').append('<tr><td>' + item[0] + '</td><td>' + k + '</td><td>' + item[1].toString() + '</td><td>' + item[2].toString() + '</td></tr>');
          }  
        }
      })
      
    
  }
})

$("#logout").click(function(){
  alert("Logging out");
})

$("#refreshPage").click(function(){
  refreshTables();
})

function refreshStoreOwnerView() {
  window.location.reload();
  $("#welcomeView").hide();
  $("#storeOwnerView").show();
}

$("#addAdminButton").click(async function() { 
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
  alert(result.logs[0].args._storeName + " created with store ID of " + result.logs[0].args._storeID);
})

$("#newItemButton").click(async function() {
  console.log("Attempted to add new item");
  var newItemName = $("#newItemName").val();
  var newItemQuantity = $("#newItemQuantity").val();
  var newItemPrice = $("#newItemPrice").val();
  var newItemShopID = $("#newItemShopID").val();
  const result = await marketplaceInstance.addItem(newItemName, newItemQuantity, newItemPrice, newItemShopID);
  alert(result.logs[0].args._nameOfItem + "\nassigned sku code " + result.logs[0].args._sku.toString() + "\nadded to store ID " + result.logs[0].args._storeID.toString()
     + "\nquantity " + result.logs[0].args._quantity.toString() + "\nwith price " + result.logs[0].args._price.toString());
})

$("#changePriceButton").click(async function() {
  console.log("Attempted to change item price");
  var changePriceInput = $("#changePriceNewPrice").val();
  var changePriceSKU = $("#changePriceSKU").val();
  var changePriceShopID = $("#changePriceShopID").val();
  const result = await marketplaceInstance.changePrice(changePriceSKU, changePriceShopID, changePriceInput);
  alert("Item with sku code " + result.logs[0].args._sku.toString() + "\nin store ID " + result.logs[0].args._storeID.toString()
     + "\nPrice changed to " + result.logs[0].args._newPrice.toString());
})

$("#deleteItemButton").click(async function() {
  console.log("Attempted to delete item");
  var skuToDelete = $("#skuToDelete").val();
  var skuShopIDToDelete = $("#skuShopIDToDelete").val();
  const result = await marketplaceInstance.deleteItem(skuShopIDToDelete, skuToDelete);
  alert("Item with sku code " + result.logs[0].args._skuCode.toString() + "\nin store ID " + result.logs[0].args._storeID.toString()
     + "\ndeleted");
})

$("#withdrawButton").click(async function() {
  console.log("Attempted to withdraw sales");
  var shopIDtoWithdrawFrom = $("#shopIDtoWithdrawFrom").val();
  const shopBalance = await marketplaceInstance.fetchStoreBalance.call(shopIDtoWithdrawFrom);
  var withdrawAmount = prompt("Store balance is " + shopBalance.toString() + ". How much would you like to withdraw?");
  if (withdrawAmount > shopBalance || withdrawAmount < 0) {
    alert("You can only withdraw up to a maximum of the shop balance. Please input a lower value")
  }
  else {
    const result = await marketplaceInstance.withdrawSales(withdrawAmount, shopIDtoWithdrawFrom);
    const remainingBalance = shopBalance - withdrawAmount;
    alert(withdrawAmount + " withdrawn. \nRemaining balance in store " + remainingBalance);
  }

})

$("#buyButton").click(async function(){
  console.log("Attempted to purchase item");
  var buySKU = $("#buySKU").val();
  var buyQuantity = $("#buyQuantity").val();
  var payment = parseInt($("#payment").val());
  var buyStoreID = selectedShop;
  const result = await marketplaceInstance.buyItem(buyQuantity, buySKU, buyStoreID, { gas:100000, value: payment});
  var pricePerUnit = result.logs[0].args._price.toString();
  var totalPrice = pricePerUnit * buyQuantity;
  var returned = payment - totalPrice;
  alert("Purchase receipt\n" + result.logs[0].args._name + "\nsku " + result.logs[0].args._skuCode.toString() + "\nfrom store ID " + result.logs[0].args._storeID.toString()
    + "\n\nTransaction details" + "\nTotal: " + totalPrice.toString() + "\nTendered: " + payment.toString() + "\nReturned: " + returned.toString());
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