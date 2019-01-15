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
    $.getJSON("MarketPlace.json", function(MarketPlace) { //Where does MarketPlace come from?
      // Instantiate a new truffle contract from the artifact
      App.contracts.MarketPlace = TruffleContract(MarketPlace);
      // Connect provider to interact with contract
      App.contracts.MarketPlace.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var marketplaceInstance;

    //var loader = $("#administratorView");
    //var content = $("#storeOwnerView");

    //loader.show();
    //content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
        $("#accountBalance").html("You balance: " + web3.eth.getBalance(account)); //What is wrong ith this line?
      }
    });

    // Load contract data
    App.contracts.MarketPlace.deployed().then(function(instance) { //Where does instance come from?
      marketplaceInstance = instance;
      //return marketplaceInstance.candidatesCount();
    })//.then(function(candidatesCount) {
      /*var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    })*/;
  },

  $(document).ready(function() {
    $("#login").click(function(){
      //check the account against the Contract Owner, then the adminDB, then the ShopOwnerDB, otherwise it is a shopper
    });
  });
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
