# Avoiding common attacks

## 1. Re-entrancy

Balance states are changed *prior* to the movement of funds. The store owner can choose the amount to withdraw, but is prevented from withdrawing more than exists in his/her balance. In addition, store balances are stored as independent variables of the contract balance, limiting the potential for losses.

Modifiers are used to prevent access to functionality not belonging to the owner of the funds, by means of a mapping structure between shops and shop owners.


## 2. Integer overflow/underflow

The SafeMath library by [OpenZeppelin](https://openzeppelin.org/api/docs/math_SafeMath.html) has been implemented to control the shop counter and item counter. It is also used to protect account balances on withdrawals of store funds.


## 3. Transaction protocols

Used msg.sender as opposed to tx.origin for value transfers.


## 4. Gas limits

Zero use of arrays and looping functions. A mapping was used to track administrators, shop owners and shops. These values can therefore be referenced without the need for a loop task.
