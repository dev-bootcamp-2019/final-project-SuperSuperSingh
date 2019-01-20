var MarketPlace = artifacts.require('MarketPlace')

contract('MarketPlace', function(accounts){
    const owner = accounts[0]
    const administrator = accounts[1]
    const storeOwner = accounts[2]
    const shopper = accounts[3]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    const storeName = "Candy Shop"
    const storeID = 1
    const itemName = "Chocolate"
    const itemSKU = 1
    const itemQuantity = 1000
    const itemPrice = 10
    const itemQuantityBought = 50

    it("should assign accounts[1] administrator rights", async() => {
        const marketPlace = await MarketPlace.deployed()

        var eventEmitted = false
        var isAdmin

        const tx = await marketPlace.addAdmin(administrator, {from: owner})

        if (tx.logs[0].event) {
            isAdmin = tx.logs[0].args._admin
            eventEmitted = true
        }
    
        const result = await marketPlace.fetchAdmin.call(isAdmin)

        assert.equal(result, true, 'the administrator was not assigned the role correctly')
        assert.equal(eventEmitted, true, 'adding an administrator should emit a addAdministrator event')

    })

    it("should assign accounts[2] shop owner rights", async() => {
        const marketPlace = await MarketPlace.deployed()

        var eventEmitted = false
        var isStoreOwner

        const tx = await marketPlace.addStoreOwner(storeOwner, {from: administrator})

        if (tx.logs[0].event) {
            isStoreOwner = tx.logs[0].args._storeOwner
            eventEmitted = true
        }
    
        const result = await marketPlace.fetchStoreOwner.call(isStoreOwner)

        assert.equal(result, true, 'the store owner was not assigned the role correctly')
        assert.equal(eventEmitted, true, 'adding a store owner should emit a addStoreOwner event')

    })

    it("should add a store by the store owner", async() => {
        const marketPlace = await MarketPlace.deployed()

        var eventEmitted = false
        var newStoreID

        const tx = await marketPlace.createStoreFront(storeName, {from: storeOwner})

        if (tx.logs[0].event) {
            newStoreID = tx.logs[0].args._storeID
            eventEmitted = true
        }
    
        const result = await marketPlace.fetchStoreID.call(newStoreID)

        assert.equal(result[0], storeOwner, 'the store was not created and the store owner was not assigned correctly')
        assert.equal(result[1], storeName, 'the store name was not saved correctly')
        assert.equal(eventEmitted, true, 'adding a storefront should emit a addStoreFront event')
    })

    it("should add an item to the store just created (store 1)", async() => {
        const marketPlace = await MarketPlace.deployed()

        var eventEmitted = false
        var newItemID

        const tx = await marketPlace.addItem(itemName, itemQuantity, itemPrice, storeID, {from: storeOwner})

        if (tx.logs[0].event) {
            newItemID = tx.logs[0].args._sku
            eventEmitted = true
        }
    
        const result = await marketPlace.fetchItem.call(storeID, newItemID)

        assert.equal(result[0], itemName, 'the item name was not correctly added')
        assert.equal(result[1], itemQuantity, 'the item quantity was not correctly added')
        assert.equal(result[2], itemPrice, 'the item price was not correctly added')
        assert.equal(eventEmitted, true, 'adding a storefront should emit a addStoreFront event')
    })

    /*it("should be able to purchase item just added to store (store 1)", async() => {
        const marketPlace = await MarketPlace.deployed()

        var eventEmitted = false
        const amount = 600
        var currentStoreID
        var currentSKU
        var newQuantity

        var storeBalanceBefore = await marketPlace.fetchStoreBalance(storeID)
        var shopperBalanceBefore = await web3.eth.getBalance(shopper)

        const tx = await marketPlace.buyItem(itemQuantityBought, itemSKU, storeID, {from: shopper, value: amount})

        if (tx.logs[0].event) {
            //currentStoreID = tx.log[3].args._storeID
            eventEmitted = true
        }
    
        var storeBalanceAfter = await marketPlace.fetchStoreBalance(currentStoreID)
        var shopperBalanceAfter = await web3.eth.getBalance(shopper)

        const result = await marketPlace.isItemBought.call(currentStoreID)

        //assert.equal(result[0], itemSKU, "Incorrect item ID being reported")
        //assert.equal(result[1], itemQuantityBought)
        //assert.equal(result[2], storeID, "Incorrect store ID being reported")
        //assert
        assert.equal(storeBalanceAfter, storeBalanceBefore + amount - (itemQuantityBought * itemPrice), 'the balance of the store should increase by the price of the item multiplied by the quantity purchased')
        assert.isBelow(parseInt(shopperBalanceAfter), parseInt(shopperBalanceBefore, 10) - parseInt(itemQuantityBought * itemPrice, 10), "The shoppers balance should decrease by more than the total purchase price + gas costs")
        assert.equal(eventEmitted, true, 'adding a storefront should emit a addStoreFront event')
    })*/
})