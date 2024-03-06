
let accountOptionSelection = new cardSelector('accountType');
getElementById('accountTypeContainer').appendChild(accountOptionSelection.element);

const checkingAccountInfo = {
    'accounttype': 'Checkings',
    'imagename': 'cash',
    'cardID': 1,
    'description': 'Your spending account. Link debit cards!'
}
const savingsAccountInfo = {
    'accounttype': 'Savings',
    'imagename': 'piggybank',
    'cardID': 2,
    'description': 'Build a backup fund! Enjoy 0.49% APY!'
}

let checkingOption = new cardSelectOption(checkingAccountInfo, 'account');
let savingsOption = new cardSelectOption(savingsAccountInfo, 'account');
accountOptionSelection.addCard(checkingOption);
accountOptionSelection.addCard(savingsOption);

