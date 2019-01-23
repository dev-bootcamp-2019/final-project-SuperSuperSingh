# Avoinding common attacks

## 1. Reentrancy

Balance states are changed *prior* to the movement of funds. The store owner can choose the amount to withdraw, but is prevented from withdrawing more than exists in his/her balance. In addition, store balances are stored as independent variables of the contract balance, limiting the potential for losses.


## 2. Integer overflow/underflow

The SafeMath library by [OpenZeppelin](https://openzeppelin.org/api/docs/math_SafeMath.html) has been implemented to control the shop counter and item counter.


## 3. Transaction protocols

Used msg.sender as opposed to tx.origin


## 4. Gas limits

Minimal use of arrays and avoidance of looping functions of indeterminate length. A mapping was used to track administrators, shop owners and shops. These values can therefore be referenced without the need for a loop task.
