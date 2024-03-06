let checkingAccounts = [];
const bankRoutingNumber = '051000024';
accountOptionElements = document.getElementsByName('accountOptions');
accountOptionElement = accountOptionElements[0];
accountOptionElement2 = accountOptionElements[1];
const noneAccount = {
    accountname: 'No Account Selected',
    balance: 0,
    accountnumber: 0,
    fname: '',
    mname: '',
    lname: '',
    address: '',
    city: '',
    state: '',
    zipcode: ''
};

postRequest('account/getCheckingAccounts').then((data) => {
    checkingAccounts = data;
    for(let checkingAccount of checkingAccounts) {
        let accountNumber = padWithZeros(checkingAccount.accountnumber, 4);
        accountNumber = accountNumber.substring(accountNumber.length-4);
        addChildElement(accountOptionElement, createOptionElement('...'+accountNumber+' Checking', checkingAccount.accountnumber));
        addChildElement(accountOptionElement2, createOptionElement('...'+accountNumber+' Checking', checkingAccount.accountnumber));
    }
});

accountOptionElement.onchange = () => {
    let selectedValue = accountOptionElement.value;
    let selectedAccount = null;
    if(selectedValue === 'custom') {
        selectedAccount = noneAccount
    }
    else {
        for (let checkingAccount of checkingAccounts) {
            if(checkingAccount.accountnumber == selectedValue) {
                selectedAccount = checkingAccount;
            }
        }
    }
    
    if(selectedAccount) {
        setElementValue(document.getElementById('account_name_1'), selectedAccount.accountname);
        setElementValue(document.getElementById('account_balance_1'), '$'+formatMoney(selectedAccount.balance));

        setElementValue(document.getElementById('bankRoutingNumber'), bankRoutingNumber);
        setElementValue(document.getElementById('accountNumber'), padWithZeros(selectedAccount.accountnumber, 9));
        setElementValue(document.getElementById('accountfName'), selectedAccount.fname);
        setElementValue(document.getElementById('accountmName'), selectedAccount.mname);
        setElementValue(document.getElementById('accountlName'), selectedAccount.lname);
        setElementValue(document.getElementById('accountaddress'), selectedAccount.address);
        setElementValue(document.getElementById('accountcity'), selectedAccount.city);
        setElementValue(document.getElementById('accountstate'), selectedAccount.state);
        setElementValue(document.getElementById('accountzipcode'), selectedAccount.zipcode);
        
        checkAll(fieldStatesArray['send-account'].fieldStates, fieldStatesArray['send-account'].fieldStates.submitBtn);
    }
};

accountOptionElement2.onchange = () => {
    let selectedValue = accountOptionElement2.value;
    let selectedAccount = null;
    if(selectedValue === 'custom') {
        selectedAccount = noneAccount
    }
    else {
        for (let checkingAccount of checkingAccounts) {
            if(checkingAccount.accountnumber == selectedValue) {
                selectedAccount = checkingAccount;
            }
        }
    }
    if(selectedAccount) {
        setElementValue(document.getElementById('account_name_2'), selectedAccount.accountname);
        setElementValue(document.getElementById('account_balance_2'), '$'+formatMoney(selectedAccount.balance));

        setElementValue(document.getElementById('bankRoutingNumber2'), bankRoutingNumber);
        setElementValue(document.getElementById('accountNumber2'), padWithZeros(selectedAccount.accountnumber, 9));
        setElementValue(document.getElementById('accountfName2'), selectedAccount.fname);
        setElementValue(document.getElementById('accountmName2'), selectedAccount.mname);
        setElementValue(document.getElementById('accountlName2'), selectedAccount.lname);
        setElementValue(document.getElementById('accountaddress2'), selectedAccount.address);
        setElementValue(document.getElementById('accountcity2'), selectedAccount.city);
        setElementValue(document.getElementById('accountstate2'), selectedAccount.state);
        setElementValue(document.getElementById('accountzipcode2'), selectedAccount.zipcode);

        checkAll(fieldStatesArray['send-user'].fieldStates, fieldStatesArray['send-user'].fieldStates.submitBtn);
    }
};

