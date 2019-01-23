
# Design pattern decisions

The use of arrays is minimised to only what is necessary. Any loop functions are handled outside of the contract

Security patterns
Access restrictions
Implemented zeppelin ownable audited contract for ownership control

Mapping for admins, store owners to bool, easy and fast to reference
Mapping of storefront to int, int used as store ID, used to track all information about the store. Owner, name of store, pending withdrawal, items within store are a ammping of sku to item details
Within stroefront the owner, 
struct for store details under owner. Useful for association

O


Guard checks
Only authorised access
Stores owner as creator of contract
Only owner can freeze unfreeze contract
Modifiers to prevent unauthorised control, payments etc

Emergency stop

Economic patterns


Events and logs

Testing should not be part of the contract, but decided to leave it in because they are useful functions for contract interaction with new future improved UI's
