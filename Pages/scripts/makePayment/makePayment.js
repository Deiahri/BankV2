let pageParameters = getPageParameters();
debugLog(pageParameters);

const bankRoutingNumber = '051000024';

let cardOptionElement = document.getElementById('cardOptions');
let accountOptionElement = document.getElementById('accountOptions');

let usablePaymentTypes = [];
let endPoint = '';
let parameterName = '';
let assetInfo = null;
let pageData = {};
if(pageParameters.type) {
    switch(pageParameters.type) {
        case ('creditcard'):
            usablePaymentTypes = ['debitCard', 'account'];
            endPoint = 'card/getCreditCard';
            parameterName = 'cardNumber';
            break;
        case ('loan'):
            usablePaymentTypes = ['creditCard', 'debitCard', 'account'];
            endPoint = 'loan/getLoan';
            parameterName = 'loanID';
            document.getElementById('previousPageButton').href = '../../loans.html'
            break;
        default:
            debugLog('page type is invalid', pageParameters.type);
            break;
    }
}
if (endPoint) {
    postRequest(endPoint, {
        [parameterName]: pageParameters.id
    }).then((data) => {
        if(data.message) {
            promptAlertV2({
                'message': 'You do not have access to this asset',
                'inputs': [
                    {
                        'text': 'Okay',
                        'type': 'a',
                        'classList': 'btn btn-lg btn-danger mt-1',
                        'href': document.getElementById('previousPageButton').href
                    }
                ],
            });
        } else {
            assetInfo = data[0];
            if(pageParameters.type === 'creditcard') {
                setAllElementValueWithName('destinationID', assetInfo.cardnumber);
                setAllElementValueWithName('destinationFName', assetInfo.fname);
                setAllElementValueWithName('destinationMName', assetInfo.mname);
                setAllElementValueWithName('destinationLName', assetInfo.lname);
            }
            else if(pageParameters.type === 'loan') {
                setAllElementValueWithName('destinationID', assetInfo.loanid);
                setAllElementValueWithName('destinationType', 'loan');
                setAllElementValueWithName('destinationFName', assetInfo.fname);
                setAllElementValueWithName('destinationMName', assetInfo.mname);
                setAllElementValueWithName('destinationLName', assetInfo.lname);
                setAllElementValueWithName('transactionReason', 'Loan Payment');
            }

            preparePageData();
        }
    });
}

function preparePageData() {
    debugLog('asset info:', assetInfo);
    let title = getElementById('assetTitle');
    let name = getElementById('assetName');
    let number = getElementById('assetNumber');
    let amountDue = getElementById('assetAmountDue');
    console.log(assetInfo);
    switch(pageParameters.type) {
        case ('creditcard'):
            title.innerText = 'Credit Card Information';
            if (!assetInfo.cardname) {
                assetInfo.cardname = 'Name: unnamed card';
            }
            name.innerText = `Name: ${assetInfo.cardname}`;
            number.innerText = `Card Number: ${assetInfo.cardnumberformatted}`;
            amountDue.innerText = `Amount Due: $${formatMoney(assetInfo.minimumpayment)}`;
            break;
        case ('loan'):
            title.innerText = 'Loan Information';
            name.innerText = `Name: ${assetInfo.interestperiodquantity} ${assetInfo.interestperiod} $${formatMoney(assetInfo.amount)} loan`;
            number.innerText = `Loan Number: ${assetInfo.loanid}`;
            amountDue.innerText = `Amount Due: $${formatMoney(assetInfo.amountdue)}`;
            break;
        default:
            debugLog('page type is invalid', pageParameters.type);
            break;
    }
}

let creditCards = null;
let debitCards = null;
let checkingAccounts = null;
if(usablePaymentTypes.length > 0) {
    for (let paymentType of usablePaymentTypes) {
        switch(paymentType) {
            case ('creditCard'):
                postRequest('card/getCreditCards').then((data) => {
                    creditCards = data;
                    for(let creditCard of creditCards) {
                        addChildElement(cardOptionElement, createOptionElement('**** **** **** '+creditCard.cardnumberformatted.split(" ")[3]+' Credit', creditCard.cardnumber));
                    }
                });
                break;
            case ('debitCard'):
                postRequest('card/getDebitCards').then((data) => {
                    debugLog('debit cards', data);
                    debitCards = data;
                    for(let creditCard of debitCards) {
                        addChildElement(cardOptionElement, createOptionElement('**** **** **** '+creditCard.cardnumberformatted.split(" ")[3]+' Debit', creditCard.cardnumber));
                    }
                });
                break;
            case ('account'):
                postRequest('account/getCheckingAccounts').then((data) => {
                    checkingAccounts = data;
                    for(let checkingAccount of checkingAccounts) {
                        let accountNumber = padWithZeros(checkingAccount.accountnumber, 4);
                        accountNumber = accountNumber.substring(accountNumber.length-4);
                        addChildElement(accountOptionElement, createOptionElement('...'+accountNumber+' Checking', checkingAccount.accountnumber));
                    }
                });
                break;
            default:
                debugLog('page type is invalid', pageParameters.type);
                break;
        }
    }
}


cardOptionElement.onchange = () => {
    debugLog('selected', cardOptionElement.value);
    let selectedValue = cardOptionElement.value;
    let selection = null;
    if(creditCards) {
        for(let creditCard of creditCards) {
            if(creditCard.cardnumber == selectedValue) {
                selection = creditCard;
                break;
            }
        }
    }
    
    if(debitCards && !selection) {
        for(let debitCard of debitCards) {
            if(debitCard.cardnumber == selectedValue) {
                selection = debitCard;
                break;
            }
        }
    }

    if(selection === null) {
        debugLog('Card number doesn\'t correspond with anything.');
    }
    else {
        debugLog('selected :: :: : : :::: ', selection);
        setElementValue('cardNumber', selection.cardnumberformatted.replaceAll(' ', ''));
        setElementValue('cardCVC', selection.securitycode);
        setElementValue('fName', selection.fname);
        setElementValue('mName', selection.mname);
        setElementValue('lName', selection.lname);
        setElementValue('address', selection.address);
        setElementValue('city', selection.city);
        setElementValue('state', selection.state);
        setElementValue('zipcode', selection.zipcode);
    }
    checkAll(fieldStatesArray['credit-debit'].fieldStates, fieldStatesArray['credit-debit'].fieldStates.submitBtn);
}

accountOptionElement.onchange = () => {
    debugLog('selected', accountOptionElement.value);
    let selectedValue = accountOptionElement.value;
    let selection = null;
    if(checkingAccounts) {
        for(let checkingAccount of checkingAccounts) {
            if(checkingAccount.accountnumber == selectedValue) {
                selection = checkingAccount;
                break;
            }
        }
    }

    if(selection === null) {
        debugLog('Account number doesn\'t correspond with anything.');
    }
    else {
        setElementValue('bankRoutingNumber', bankRoutingNumber);
        setElementValue('accountNumber', padWithZeros(selection.accountnumber, 9));
        setElementValue('accountfName', selection.fname);
        setElementValue('accountmName', selection.mname);
        setElementValue('accountlName', selection.lname);
        setElementValue('accountaddress', selection.address);
        setElementValue('accountcity', selection.city);
        setElementValue('accountstate', selection.state);
        setElementValue('accountzipcode', selection.zipcode);
        setElementValue('verifyPersonID', selection.personid);
        debugLog('selection: ', selection);
    }
    // GET THIS TO WORK
    checkAll(fieldStatesArray['account'].fieldStates, fieldStatesArray['account'].fieldStates.submitBtn);
}
setElementValue('bankRoutingNumber', bankRoutingNumber);

