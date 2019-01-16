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
    var marketplaceInstance;

    var loader = $("#welcomeView");
    loader.show();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
        //$("#accountBalance").html("Your Balance: " + web3.eth.getBalance(App.account));
      }
    });

    // Load contract data
    App.contracts.MarketPlace.deployed().then(function(instance) { //Where does instance come from?
      marketplaceInstance = instance;
      return marketplaceInstance.numberOfStores();
    })//.then(function(candidatesCount) {
      /*var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

    }).catch(function(error) {
      console.warn(error);
    })*/;
    $("#accountBalance").html("Your Balance: " + marketplaceInstance.skuCount);
    //alert(marketplaceInstance.getAddress());
    //alert(marketplaceInstance.skuCount);
    
    $("#login").click(function(){
      switch(address) {
        case address == marketplaceInstance.owner:
          alert("Logging in as Contract Owner");
          $("#contractOwnerView").show();
          $("#administratorView").hide();
          $("#storeOwnerView").hide();
          $("#shopperView").hide();
          break;
        case marketplaceInstance.adminsDB[address] == true:
          alert("Logging in as Marketplace Administrator");
          $("#contractOwnerView").hide();
          $("#administratorView").show();
          $("#storeOwnerView").hide();
          $("#shopperView").hide();
          break;
        case marketplaceInstance.storeOwnersDB[address] == true:
          alert("Logging in as Storefront Owner");
          $("#contractOwnerView").hide();
          $("#administratorView").hide();
          $("#storeOwnerView").show();
          $("#shopperView").hide();
          
          break;
        default:
          alert("Logging in as store patron");
          $("#contractOwnerView").hide();
          $("#administratorView").hide();
          $("#storeOwnerView").hide();
          $("#shopperView").show();
      }
    });
  },
};

$(function() {
  $(window).load(function() {
    $("#storeOwnerView").hide(); //Is this the best way of hiding inactive views?
    $("#administratorView").hide();
    $("#contractOwnerView").hide();
    $("#shopperView").hide();
    App.init();
  });
});
