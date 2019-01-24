
# Design pattern decisions

## Access restrictions

[Open Zeppelins](https://openzeppelin.org/) has developed secured contracts that have been already audited. The use of the Ownable contract ensures that the contract deployer is safely assigned ownership status of the contract.

Within the contract, the use of modifiers prevent accounts from accessing functions if they are not authorised to do so. The heirarchy of access rights is:

1. Contract Owner

2. Marketplace administrator

3. Storefront owner

4. Shopper

Only a contract owner may create and delete an administrator, and for simplicity sake, only an administrator can create and remove a storefront owner.

Likewise, a store owner is limited to interacting with his/her store(s) only. This includes adding storefronts, adding & deleting items within those stores, changes prices, and withdrawing funds. A store owner is prevented from performing actions on storefronts that do not belong to him/her through a modifier, and similarly, from interacting with items that do not fall within his/her store(s).

Shoppers can *view* any store and purchase items from any store. The only implication on the store itself is when a purchase is made - quantities of stock are updated accordingly.

##  Contract guard

An emergency stop has been incorporated to freeze the contract in the case of an emergency. Only once an emergency has been declared, does a contract owner have the ability to withdraw all funds in the contract for safeguard or distribution in the case of a contract termination.

As with Ownable, the SafeMath contract - again, audited and approved for use by the Ethereum community - prevents integer overflows/underflows.


## Behavioural guards

Limited input validation has been incorporated into the front end, as it has been specified that this is not a course in front-end development.

Within the contract itself, all functions have validation modifiers to ensure correct access, correct deposits & withdrawals, and correct state changes are maintained.


## Gas optimisation

No loops have been used in the construction of this contract, which *could* (they don't have to be) otherwise be computationally expensive. Any looping functionality is handled outside of the contract.

No arrays are used in the construction of this contract which could otherwise become expensive to store.

Mappings have been used to reference administrators, store owners and stores. Within the stores, a mapping is used to reference items that are being sold within those stores. Mappings are quick and easy to reference.

The mapping of a storefront to an integer allows the integer to be used as the store ID, and likewise, the mapping of a (different) integer to a store item does the same. No two stores can ever have the same ID, so simply incrementing a value to represent a new store ID is sufficient. Deleting a store would like nullify the mapping, which can easily be evaluated and skipped when displaying all stores on the UI. The same methodology (regarding incrementing item ID's and display) applies to items within stores.

The store ID's and item IDs' are created by the contract, minimising input error. These values are then displayed to the store owner on his/her UI.

Contained within the storefront mapping is the store name, store owners address, balance of sales for the store, the latest item ID assigned to the store (used externally to display the store items on the UI), and the items belonging to that store.

The above decisions provide a very methodical approach to tracking of the marketplace - 

Is the user a store owner (bool)? Yes ->  Display all store details in which the user is recorded as the owner, mapping(int -> struct) -> Display all the items within that store, mapping(int -> struct) once again.

## Events and logs

All state modifications issue an event. This is useful for UI interactions. The events are listed below.

- Administrator added
- Administrator deleted
- Store owner added
- Store owner deleted
- Store created
- Store item added
- Store price changed
- Store item deleted
- Store sales balance withdrawn
- Item purchased

## Considerations overlooked in the interest of future development

Testing functions should not be part of the main contract, but the decision was taken to leave them in because they could prove useful  for future iterations of the code. They could very well be moved into a separate contract as they are all view only functions.

