/* Forms.js makes forms on pages functional. 
    REQUIRES request.js TO BE USED with SUBMIT BUTTON
*/

/* These are ids of input fields it will look for on a given page. */
const noResponseAlert = {
    'message': `Something went wrong. Server may be down.`,
    'inputs': [
        {
            'text': 'Okay',
            'type': 'a',
            'classList': 'btn btn-lg btn-success mt-1',
        }
    ],
};
const fieldStatesArray = {};
const possibleFormKeys = ['username', 'email', 'loanAmount', 'fName', 'destinationFName', 'mName', 'destinationMName', 'lName', 'destinationLName', 'address', 'city', 'state', 
'zipcode', 'personID', 'verifyPersonID', 'password', 'confirmPassword', 'newPassword', 'confirmNewPassword', 'verifyPassword', 'sex', 'cardDesign', 'cardName', 'checkingAccount',
'termLength', 'accountName', 'accountType', 'allowOverdraw', 'joinDate', 'bankRoutingNumber', 'accountNumber', 'paymentType', 'cardNumber', 'cardCVC', 'transactionReason',
'destinationID', 'destinationFName', 'destinationMName', 'destinationLName', 'destinationType', 'paymentAmount', 'destinationID'];
let termLengthJSON = null;
let undoBtn = getElementById('undoChangeButton');
const formContainers = getElementsByName('form-container');
debugLog(formContainers);
setTimeout(bindFormContainers, 100);
    
let takenCardNames = null;

function getFormData(fieldStates) {
    let formData = {};
    for(let possibleFormKey of Object.keys(fieldStates)) {
        insertIfNotNull(getElementValue(fieldStates[possibleFormKey][2]), possibleFormKey, formData);
    }
    return formData;
}

/**
 * Posts a request to the server, submitting the page's form data.
 * REQUIRES request.js TO BE IMPORTED
 * @param {String} apiEndpointUrl 
 */

function submitFormData(fieldStates, apiEndpointUrl) {
    postRequest(apiEndpointUrl, getFormData(fieldStates)).then((data) => {
        debugLog(data);
        if(data === undefined) {
            data = noResponseAlert;
        }
        interpretAlert(data);
    });
}


/**
 * Recieves a **key** and **value** pair that it will insert into **obj** object if **value** is not null. 
 * @param {*} value 
 * @param {*} key 
 * @param {*} obj 
 */
function insertIfNotNull(value, key, obj) {
    /* recieves a value, a key, and a Javascript object to insert the data into. */
    if(value != null) {
        obj [key] = value;
    }
}

function bindFormContainers() {
    for(let formContainer of formContainers) {
        debugLog('Bound form container ', formContainer);
        bindFields(formContainer);
    }
    debugLog(fieldStatesArray);
}
// const fieldStates = {}
// setTimeout(bindFields, 300);
/**
 * Finds **password** + **verify password** fields and outputs an error depending on if the **password** and **verify password** meets requirements.
 */
function bindFields(formContainer) {
    let fieldStates = {};
    let idenfifier = formContainer.getAttribute('identifier');
    debugLog('identifier', idenfifier);
    fieldStatesArray[idenfifier] = {'fieldStates': fieldStates};
    let submitBtn = formContainer.querySelector(`[name="submitBtn"]`);
    if(submitBtn) {
        submitBtn.onclick = () => {
            disableElement(submitBtn, true);
            submitFormData(fieldStates, submitBtn.attributes.href.value);
        }
        fieldStates.submitBtn = submitBtn;
    }
    else {
        debugLog('Could not locate submit button');
    }

    undoChanges
    let undoBtn = formContainer.querySelector(`[name="undoBtn"]`);
    if(undoBtn) {
        undoBtn.onclick = () => {
            debugLog('undoing');
            disableElement(submitBtn, true);
            if(submitBtn) {
                hideElement(submitBtn, true);
            }
            if (undoBtn) {
                hideElement(undoBtn, true);
            }
            applyDefaultValues(idenfifier);
        }
        fieldStates.undoBtn = undoBtn;
    }
    else {
        debugLog('Could not locate undo button');
    }

    for(let formKey of possibleFormKeys) {
        let initialState = false;
        let element = formContainer.querySelector(`[name="${formKey}"]`);
        if(element) {
            let required = {};
            if(element.getAttribute('requires')) {
                let requiredName = element.getAttribute('requires').split(',');
                for(let requirement of requiredName) {
                    requirement = requirement.trim();
                    let requiredElement = formContainer.querySelector(`[name="${requirement}"]`);
                    required[requirement] = requiredElement;
                }
            }

            if(element.getAttribute('initialstate')) {
                if(element.getAttribute('initialstate') === 'true') {
                    initialState = true;
                }
                else if(element.getAttribute('initialstate') === 'false') {
                    initialState = false;
                }
                else {
                    debugLog('invalid initial state', formKey);
                }
            }

            let elementWarning = formContainer.querySelector(`p[name="${formKey}Warning"]`);
            let checkFunctionAndInputType = getCheckFunctionAndInputType(formKey);
            
            let checkFunction = null;
            if(checkFunctionAndInputType[0] !== null) {
                let timeout = null;
                checkFunction = () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        let value = getElementValue(element);
                        let checkResults = checkFunctionAndInputType[0](value, required);
                        fieldStates[formKey][0] = checkResults[0];
                        if(elementWarning) {
                            if(checkResults[1] !== null) {
                                elementWarning.innerText = checkResults[1];
                                elementWarning.classList.remove('hideFull');
                            }
                            else {
                                debugLog(`${formKey} is good`);
                                elementWarning.classList.add('hideFull');
                            }
                        }
                        else {
                            debugLog(`${element.getAttribute('name')} does not have a warning element`);
                        }
                    }, 500);
                }
            }
            else {
                debugLog(formKey, 'doesn\'t have a check function.');
            }

            let f = null;
            if(checkFunction !== null) {
                f = executeFunctions.bind(null, () => {
                    disableElement(submitBtn, true);
                    hideElement(submitBtn, false);
                    hideElement(undoBtn, false);
                }, checkFunction, checkAll.bind(null, fieldStates, submitBtn));
                if (checkFunctionAndInputType[1] === 'keyup') {
                    element.onkeyup = f;
                }
                else if(checkFunctionAndInputType[1] === 'onclick') {
                    element.onclick = f;
                }
                else if(checkFunctionAndInputType[1] === 'onchange') {
                    element.onchange = f;
                }
                else {
                    debugLog('this field doesn\'t have a valid check function input type', formKey);
                }
            }
            
            fieldStates[formKey] = [initialState, checkFunction, element, elementWarning];
        }
        else {
            debugLog(`couldn\'t find ${formKey}`);
        }
    }
    if(submitBtn) {
        hideElement(submitBtn, true);
    }
    if (undoBtn) {
        hideElement(undoBtn, true);
    }
}


function getCheckFunctionAndInputType(formKey) {
    let currentFunction = null;
    let inputType = 'keyup';
    if (formKey === 'password') {
        currentFunction = checkPassword;
    }
    else if (formKey === 'confirmPassword') {
        currentFunction = checkConfirmPassword;
    }
    else if(formKey === 'newPassword') {
        currentFunction = checkNewPassword;
    }
    else if(formKey === 'confirmNewPassword') {
        currentFunction = checkConfirmNewPassword
    }
    else if(formKey === 'loanAmount') {
        currentFunction = checkLoanAmount;
        postRequest('loan/getTermLengthFunction').then((f) => {
            termLengthJSON = f.termLengths;
        });
    }
    else if (formKey === 'termLength') {
        currentFunction = checkTermLength;
        postRequest('loan/getLoanInterestRate').then((data) => {
            annualPercentRate = data.rate;
            getElementById('annualInterestPercent').innerText = "@ "+annualPercentRate+"% APR";
        });
    }
    else if (formKey === 'fName' || formKey === 'destinationFName') {
        currentFunction = checkFirstName;
    }
    else if (formKey === 'mName' || formKey === 'destinationMName') {
        currentFunction = checkMiddleName;
    }
    else if(formKey === 'lName' || formKey === 'destinationLName') {
        currentFunction = checkLastName;
    }
    else if (formKey === 'username') {
        currentFunction = checkUsername;
    }
    else if (formKey === 'email') {
        currentFunction = checkEmail;
    }
    else if(formKey === 'address') {
        currentFunction = checkAddress;
    }
    else if(formKey === 'state') {
        currentFunction = checkState;
    }
    else if(formKey === 'city') {
        currentFunction = checkCity;
    }
    else if(formKey === 'zipcode') {
        currentFunction = checkZipcode;
    }
    else if(formKey === 'sex') {
        currentFunction = checkSex;
        inputType = 'onchange';
    }
    else if (formKey === 'personID') {
        currentFunction = checkPersonID;
    }
    else if (formKey === 'cardDesign') {
        currentFunction = checkCardDesign;
        inputType = 'onclick';
    }
    else if (formKey === 'cardName') {
        currentFunction = checkCardName;
        postRequest('card/getCardNames').then((data) => {
            let listOfNames = []
            for(let cardName of data) {
                listOfNames.push(cardName.cardname.toLowerCase());
            }
            takenCardNames = listOfNames;
        });
    }
    else if (formKey === 'verifyPassword') {
        currentFunction = checkVerifyPassword;
    }
    else if (formKey === 'verifyPersonID') {
        currentFunction = checkVerifyPersonID;
    }
    else if (formKey === 'checkingAccount') {
        currentFunction = checkCheckingAccount;
        inputType = 'onclick';
        let checkAccountElement = document.getElementById('checkingAccount');
        postRequest('account/GetCheckingAccountNames').then((data)=>{
            for(let accountName of data) {
                let acntName = accountName.accountname;
                let opt = document.createElement('option');
                opt.value = Number(accountName.accountnumber);
                opt.innerText = acntName;
                checkAccountElement.appendChild(opt);
            }
            debugLog(data);
        });
    }
    else if (formKey === 'accountType') {
        currentFunction = checkAccountType;
        inputType = 'onclick';
    }
    else if (formKey === 'accountName') {
        currentFunction = checkAccountName;
        postRequest('account/getAccountNames').then((data)=>{
            for(let accountObj of data) {
                accountNames.push(accountObj.accountname.toLowerCase());
            }
        });
    }
    else if(formKey === 'allowOverdraw') {
        currentFunction = checkAllowOverdraw;
        inputType = 'onclick';
    }
    else if (formKey === 'bankRoutingNumber') {
        currentFunction = checkBankRoutingNumber;
    }
    else if (formKey === 'accountNumber') {
        currentFunction = checkBankAccountNumber;
    }
    else if (formKey === 'paymentType') {
        currentFunction = checkPaymentType;
    }
    else if (formKey === 'cardNumber') {
        currentFunction = checkCardNumber;
    }
    else if (formKey === 'cardCVC') {
        currentFunction = checkCardCVC;
    }
    else if (formKey === 'paymentAmount') {
        currentFunction = checkPaymentAmount;
    }
    else if (formKey === 'destinationID') {
        currentFunction = notBlank;
    }
    else {
        debugLog(formKey, 'doesn\'t have a check function');
        currentFunction = null;
        inputType = 'onclick';
    }
    return [currentFunction, inputType]
}


function checkPassword(passwordVal, required) {
    let message = null;
    let valid = null;
    debugLog(required);
    let validLength = passwordVal.length >=8;
    let lowerCase = false;
    let upperCase = false;
    let number = false;
    for(let char of passwordVal) {
        if(lowerCase && upperCase && number) {
            break;
        }
        else if (char.match('[a-z]')) {
            lowerCase = true;
        }
        else if (char.match('[A-Z]')) {
            upperCase = true;
        }
        else if (Number(char)) {
            number = true;
        }
    }

    valid = lowerCase && upperCase && number && validLength;
    if(!valid) {
        message = 'A password needs ';
        if(!lowerCase) {
            message += 'a lowercase character, ';
        }
        if(!upperCase) {
            message += 'an uppercase character, ';
        }
        if(!number) {
            message += 'a number, ';
        }
        if(!validLength) {
            message += 'and 8 or more characters in total.. ';
        }
        message = message.substring(0, message.length-2);
    }

    if (required) {
        hideElement(required['confirmPasswordContainer'], false);
    }

    return [valid, message];
}

function checkConfirmPassword(value, required) {
    debugLog(required);
    if(value === getElementValue(required.password)) {
        return [true, null];
    }
    else {
        return [false, 'Passwords do not match'];
    }
}

function checkNewPassword(value, required) {
    if(value.length === 0) {
        return [true, null]
    }
    else {
        return checkPassword(value, required);
    }
}

function checkConfirmNewPassword(value, required) {
    return checkConfirmPassword(value, required);
}


function checkVerifyPassword(value) {
    debugLog(value);
    let message = null;
    let valid = null;
    if (value === null || value.length < 1) {
        message = 'You must verify your password';
        valid = false;
    }
    else {
        valid = true;
    }
    return [valid, message];
}


function checkLoanAmount(value) {
    let message = null;
    let valid = null;
    if (value.length < 1) {
        message = 'You must enter a loan amount';
        valid = false;
    }
    else {
        termLengthRange = null;
        for(let amount of Object.keys(termLengthJSON)) {
            if(Number(value) <= amount) {
                termLengthRange = termLengthJSON[amount];
                break;
            }
        }
        if(termLengthRange == null) {
            valid = false;
            message = 'Loan amount must be between 100 and 500,000';
        }
        else {
            valid = true;
        }
    }
    setTimeout(updateMonthlyPaymentEstimate, 50);
    return [valid, message];
}


let termLengthRange = null;
function checkTermLength(value) {
    let message = null;
    let valid = false;
    if (termLengthRange == null) {
        valid = false;
    }
    else if (Number(value) >= termLengthRange[0] && Number(value) <= termLengthRange[1]) {
        valid = true;
    }
    else {
        message = `Term length must be between ${termLengthRange[0]} and ${termLengthRange[1]}`;
        valid = false;
    }
    setTimeout(updateMonthlyPaymentEstimate, 50);
    return [valid, message];
}

let monthlyPaymentEstimateElement = getElementById('monthlyPaymentAmountEstimate');
let annualPercentRate = null;
let currentAmount = 0;
function updateMonthlyPaymentEstimate() {
    if (monthlyPaymentEstimateElement !== null) {
        let loanAmount = getValueById('loanAmount');
        let termLength = getValueById('termLength');
        if (loanAmount == null || termLength == null) {
            debugLog('Either loan element or termLength element doesn\'t exist', loanAmount, termLength);
        }
        else {
            let amount = 0;
            if(!fieldStatesArray.loanForm.fieldStates.termLength[0] || !fieldStatesArray.loanForm.fieldStates.loanAmount[0]) {
                getElementById('monthlyPaymentAmountEstimate').innerText = '$0.00';
                return;
            }
            amount = calculateMonthlyPayment(Number(loanAmount), Number(termLength/12), 12, annualPercentRate/100);
            
            // assignValueNumberCountEffect('monthlyPaymentAmountEstimate', currentAmount, amount, 2000);
            currentAmount = amount;
            getElementById('monthlyPaymentAmountEstimate').innerText = `$${currentAmount}`;
            
        }
    }
    else {
        debugLog('element monthlyPaymentEstimate doesn\'t exist.');
    }
}


function checkVerifyPersonID(value) {
    let message = null;
    let valid = false;
    if (value.length < 1) {
        message = 'You must verify your personID';
        valid = false;
    }
    else {
        valid = true;
    }
    return [valid, message];
}


function checkUsername(value) {
    let warningMessage = null;
    let valid = false;
    if (value.length < 3) {
        warningMessage = 'Username is too short ';
        valid = false;
    }
    else if (value.length > 32) {
        warningMessage = 'Username is too long ';
        valid = false;
    }
    else {
        valid = true;
    }
    return [valid, warningMessage];
}


function checkEmail(emailValue) {
    let message = null;
    let valid = null;
    
    if(emailValue.length === 0) {
        message = '';
        valid = true;
    }
    else if (emailValue.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        message = '';
        valid = true;
    }
    else {
        message = 'This is not a valid email';
        valid = false;
    }
    return [valid, message];
}


function checkFirstName(value) {
    let valid = true;
    let warningMessage = null;
    if (value.length < 1) {
        warningMessage = 'First name is too short.';
    }
    else if (value.length > 64) {
        warningMessage = 'First name is too long.';
    }
    else {
        valid = true;
    }
    return [valid, warningMessage];
}

function checkMiddleName(value) {
    let valid = true;
    let warningMessage = null;
    if (value.length > 64) {
        warningMessage = 'Middle name is too long.';
    }
    else {
        valid = true;
    }
    return [valid, warningMessage];
}

function checkLastName(value) {
    let valid = true;
    let warningMessage = null;
    if (value.length < 1) {
        warningMessage = 'Last name is too short.';
    }
    else if (value.length > 64) {
        warningMessage = 'Last name is too long.';
    }
    else {
        valid = true;
    }
    return [valid, warningMessage];
}

function checkAddress(addressElement) {
    let message = null;
    let valid = false;
    if(addressElement.length > 128) {
        valid = false;
        message = 'Address is too long';
    }
    else if (addressElement.length < 1) {
        valid = false;
        message = 'Address is too short';
    }
    else {
        valid = true;
    }
    return [valid, message];
}


function checkState(value) {
    let message = null;
    let valid = false;
    if(value.length > 64) {
        valid = false;
        message = 'State is too long';
    }
    else if (value.length < 1) {
        valid = false;
        message = 'State is too short';
    }
    else {
        valid = true;
    }
    return [valid, message]
}


function checkCity(value) {
    let message = null;
    let valid = null;
    if(value.length > 64) {
        valid = false;
        message = 'City is too long';
    }
    else if (value.length < 1) {
        valid = false;
        message = 'City is too short';
    }
    else {
        valid = true;
    }
    return [valid, message];
}


let checkZipCodeTimeout = null;
function checkZipcode(value) {
    let message = null;
    let valid = false;
    if(value.length != 5 || value.match("[^0-9]")) {
        valid = false;
        message = 'ZipCode is invalid';
    }
    else {
        valid = true;
    }
    return [valid, message];
}


function checkSex(value) {
    let message = null;
    let valid = null;
    if (value === 'Select') {
        message = 'An option must be selected';
        valid = false;
    }
    else {
        valid = true;
    }
    return [valid, message];
}


function checkPersonID(value) {
    let message = null;
    let valid = false;
    if(value.match('[^0-9]') || value.length !== 9) {
        valid = false;
        message = 'PersonID is invalid';
    }
    else {
        valid = true;
    }
    return [valid, message];
}

function checkCardDesign(value) {
    let valid = false;
    let message = null;
    if(value !== -1) {
        valid = true;
    }
    else {
        valid = false;
    }
    return [valid, message];
}


function checkCardName(cardNameValue) {
    let warningMessage = null;
    let valid = false;

    if (cardNameValue.length < 1) {
        warningMessage = 'Card name is too short. ';
    }
    else if (cardNameValue.length > 64) {
        warningMessage = 'Card name is too long. ';
    }
    else if (takenCardNames.includes(cardNameValue.toLowerCase())) {
        warningMessage = 'A card with that name already exists. ';
    }
    else {
        valid = true;
    }
    return [valid, warningMessage];
}


function checkCheckingAccount(value) {
    let message = null;
    let valid = false;
    if(value === 'Select') {
        valid = false;
        message= 'You must choose an account';
    }
    else {
        valid = true;
    }
    return [valid, message];
}

function checkAccountType(value) {
    let valid = false;
    let message = null;
    if(value !== -1) {
        valid = true;
    }
    else {
        valid = false;
        message = 'Account Type selected is invalid';
    }
    return [valid, message];
}

let accountNames = []
function checkAccountName(value) {
    value = value.trim().toLowerCase();
    let valid = false;
    let message = null;

    if(accountNames.includes(value)) {
        valid = false;
        message = 'Account name is taken';
    }
    else if(value.length < 1) {
        valid = false;
        message = 'Account name is too short';
    }
    else {
        valid = true;
    }
    return [valid, message];
}

function checkAllowOverdraw() {
    return [true, null];
}

function checkBankRoutingNumber(value) {
    try {
        debugLog(Number(value));
        if (isNaN(Number(value))) {
            return [false, 'routing number is invalid'];
        }
    } catch {
        return [false, 'Something went wrong'];
    }
    if(value.length == 9) {
        return [true, null];
    }
    else {
        return [false, 'routing number is invalid'];
    }
}

function checkBankAccountNumber(value) {
    try {
        debugLog(Number(value));
        if (isNaN(Number(value))) {
            return [false, 'Bank account number is invalid'];
        }
    } catch {
        return [false, 'Something went wrong'];
    }
    if(value.length == 9) {
        return [true, null];
    }
    else {
        return [false, 'Bank account number is invalid'];
    }
}

function checkPaymentType(value) {
    if(value === 'card' || value == 'account' || value == 'user') {
        return [true, null];
    }
    debugLog('Payment type is bad', value);
    return [false, 'payment type is invalid'];
}

function checkCardNumber(value) {
    if (!isNaN(Number(value))) {
        if (value.replaceAll(' ', '').length === 16) {
            return [true, null];
        }
    }
    return [false, 'Card number is invalid'];  
}

function checkCardCVC(value) {
    if(!isNaN(Number(value))) {
        if(value.trim().length === 3) {
            return [true, null];
        }
    }
    return [false, 'CVC is invalid'];
}

function checkPaymentAmount(value) {
    if(!isNaN(Number(value))) {
        if (String(value).length > 0) {
            if(Number(value) > 0) {
                if (Number(value) < 2000000000) {
                    return [true, null];
                }
                return [false, 'You don\'t have that kind of motion. Ease up on the digits'];
            }
            return [false, 'Payment amount must be positive'];
        }
        return [false, 'This cannot be left blank'];
    }
    return [false, 'Payment amount is invalid'];
}

function notBlank(value) {
    if(value.trim().length > 0) {
        return [true, null];
    }
    else return [false, 'This field cannot be left blank'];
}

function setDefaultValues(formIdentifier, defaultValues) {
    fieldStatesArray[formIdentifier]['defaultValues'] = defaultValues;
    debugLog(fieldStatesArray);
    undoChanges(formIdentifier);
}


function undoChanges(formIdentifier) {
    let fieldStates = fieldStatesArray[formIdentifier]['fieldStates'];
    if(fieldStates.undoBtn) {
        fieldStates.undoBtn.classList.add('hideFull');
    }
    if(fieldStates.submitBtn) {
        fieldStates.submitBtn.classList.add('hideFull');
    }
    
    applyDefaultValues(formIdentifier);
}

function applyDefaultValues(formIdentifier) {
    let fieldStates = fieldStatesArray[formIdentifier]['fieldStates'];
    let defaultValues = fieldStatesArray[formIdentifier]['defaultValues'];
    for(let defaultValueKey of Object.keys(defaultValues)) {
        debugLog(defaultValueKey);
        if(fieldStates[defaultValueKey]) {

            // set fieldElement to their default value
            if(fieldStates[defaultValueKey][2]) {
                let fieldElement = fieldStates[defaultValueKey][2];
                let tagName = fieldElement.tagName;
                if(tagName === 'SELECT' || tagName === 'INPUT') {
                    fieldStates[defaultValueKey][2].value = defaultValues[defaultValueKey];
                }
                else {
                    fieldStates[defaultValueKey][2].innerText = defaultValues[defaultValueKey];
                }
            }

            // set warning to clear
            if(fieldStates[defaultValueKey][3]) {
                fieldStates[defaultValueKey][3].classList.add('hideFull');
            }
        }
    }
}

function changesMade(fieldStates) {
    if (fieldStates.undoBtn) {
        fieldStates.undoBtn.classList.remove('hideFull');
    }
    fieldStates.submitBtn.classList.remove('hideFull');
}


function checkAll(fieldStates, submitBtn) {
    let val = null;
    let allValid = true;
    for(let formKey of Object.keys(fieldStates)) {
        val = getElementValue(fieldStates[formKey][2]);
        if(val !== '' && val !== -1 && val !== 0) {
            try {
                fieldStates[formKey][1]();
            }
            catch {
                debugLog(`${formKey} is not formatted normally or doesn\'t have a check function`);
            }
        }
    }
    setTimeout(()=> {
        for(let formKey of Object.keys(fieldStates)) {
            if(formKey === 'submitBtn' || formKey === 'undoBtn') {
                continue;
            }
            else if(fieldStates[formKey][0] === false) {
                disableElement(submitBtn, true);
                allValid = false;
                debugLog('All not valid', formKey);
            }
        }
        
        if(allValid) {
            disableElement(submitBtn, false);
        }
    }, 575);
    
}

function setSubmitButtonState(state) {
    if(state) {
        submitBtn.classList.remove('disabled');
    }
    else {
        submitBtn.classList.add('disabled');
    }
}


/**
 * This function executes after **enableCardOption**, and executes commands depending on whether there is a element present on the page.
 * 
 * For example: some buttons are present on the card pages that isn't present on loans. 
*/
function peripheralFunction() {
    
    if (allowOverdraw !== null) {
        if (selectedCardType.toLowerCase() == 'checking') {
            document.getElementById('overdrawContainer').classList.remove('hide');
        }
        else {
            document.getElementById('overdrawContainer').classList.add('hide');
        } 
    }
    else {}
}

function executeFunctions(...args) {
    for (let func of args) {
        if (typeof(func) === 'function') {
            func();
        }
    }
}


function interpretAlert(r) {
    promptAlertV2(r);
}

