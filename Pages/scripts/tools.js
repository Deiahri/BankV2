function getPageParameters() {
    let splited = document.location.href.split('?');
    if(splited.length <= 1) {
        return {};
    }
    else if (splited.length === 2) {
        let parameterObj = {};
        let parameters = splited[1].split('&');
        let lastKey = null;
        for(let parameter of parameters) {
            let parameterSplit = parameter.split('=');
            if(parameterSplit.length !== 2) {
                debugLog(parameterSplit, 'has weird formatting');
                continue;
            }
            let key = parameterSplit[0].toLowerCase();
            let value = parameterSplit[1];
            parameterObj[key] = value;
            lastKey = key;
        }
        if(parameterObj[lastKey].includes('#')) {
            parameterObj[lastKey] = parameterObj[lastKey].substring(0, parameterObj[lastKey].indexOf('#'));
        }
        return parameterObj;
    }
    else {
        debugLog('URL is not in GET parameter format');
    }
}


function monthNumberToStr(monthNumber) {
    switch(Number(monthNumber)) {
        case 1:
            return 'January';
        case 2:
            return 'February';
        case 3:
            return 'March';
        case 4:
            return 'April';
        case 5:
            return 'May';
        case 6:
            return 'June';
        case 7:
            return 'July';
        case 8:
            return 'August';
        case 9:
            return 'September';
        case 10:
            return 'October';
        case 11:
            return 'November';
        case 12:
            return 'December'
        default:
            return 'Undefined';
    }
}

function numberPostFix(number) {
    // first switch detects for 12 and 13
    // 12 and 13 are stupid numbers which don't follow predictable number postfix patterns
    // 2nd, 3rd, ..., 12 "TH", 13 "TH", 22 "ND", 23 "RD". ITS ONLY 12 AND 13!! WHY???
    switch(number) {
        case 12:
            return 'th';
        case 13:
            return 'th';
    }

    // numbers that do follow traditional post-fix patterns are detected and responded to here
    switch(Number(number%10)) {
        case 0:
            return 'th';
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        case 4:
            return 'th';
        case 5:
            return 'th';
        case 6:
            return 'th';
        case 7:
            return 'th';
        case 8:
            return 'th';
        case 9:
            return 'th';
        case 10:
            return 'th';
    }
}

/**
 * Recieves a formatted date, and returns a string date (e.g.: January 3rd 2026)
 * @param {Date} date Formatted as yyyy-mm-ddThh:mm:ss.mlsZ
 */
function dateToStr(date) {
    date = String(date);
    let year = date.substring(0, 4);
    let month = Number(date.substring(5, 7));
    let day = Number(date.substring(8, 10));

    return `${monthNumberToStr(month)} ${day}${numberPostFix(day)}, ${year}`;
}

/**
 * 
 * @param {Element} element 
 * @param {Boolean} state 
 */
function disableElement(element, state) {
    if (element) {
        if(state) {
            element.classList.add('disabled');
        }
        else {
            element.classList.remove('disabled');
        }
    }
    else {
        debugLog('Couldn\'t disable element');
    }
}


function hideElement(element, state) {
    if (element) {
        if(state) {
            element.classList.add('hideFull');
            debugLog(`Hiding ${element.getAttribute('name')}`);
        }
        else {
            element.classList.remove('hideFull');
            debugLog(`Showing ${element.getAttribute('name')}`);
        }
    }
    else {
        debugLog('Couldn\'t hide element');
    }
}


const existingCountEffects = {};
function assignValueNumberCountEffect(elementID, currentValue, endValue, timeInMs) {
    let element = getElementById(elementID);
    try {
        currentValue = Number(currentValue);
        endValue = Number(endValue);
    }
    catch {
        debugLog(`${currentValue} and ${endValue} are not numbers`);
        return;
    }
    if(element) {
        let difference = endValue - currentValue;
        clearTimeout(existingCountEffects[elementID]);
        numberCountEffect(element, currentValue, difference, performance.now() + timeInMs + 50, elementID)
    }
    else {
        debugLog(`tried to do numberCountEffect, but element with id ${elementID} does not exist.`);
    }
}

const delayMS = 200;
function numberCountEffect(element, currentValue, difference, timeEnd, elementID) {
    if(performance.now() < timeEnd) {
        let timeDiff = timeEnd - performance.now();
        debugLog(currentValue);
        element.innerText = currentValue + difference*(1/(1 + timeDiff)).toFixed(2);
        existingCountEffects[elementID] = setTimeout(() => {numberCountEffect(element, currentValue, difference, timeEnd, elementID)}, delayMS);
    }
    else {
        element.innerText = (currentValue + difference).toFixed(2);
        debugLog(element.innerText);
    }
}

function calculateMonthlyPayment(principal, termYears, paymentsPerYear, annualInterestRate) {
    termYears = Number(termYears);
    principal = Number(principal);
    annualInterestRate = Number(annualInterestRate);
    paymentsPerYear = Number(paymentsPerYear);
    
    return (( principal*(annualInterestRate/paymentsPerYear) ) / (1 - Math.pow((1 + annualInterestRate/paymentsPerYear), -termYears*paymentsPerYear) )).toFixed(2);
}

/**
 * A shorthand method. Allows me to get an elements using their ID without having to type *document.getElementById()*
 * @param {*} id 
 * @returns 
 */
function getElementById(id) {
    if(typeof(id) == 'string') {
        return document.getElementById(id);
    }
    return null;
}


function getElementValueById(id) {
    let element = document.getElementById(id);
    let val = element.value;
    if(element.type === 'checkbox') {
        val = element.checked;
    }
    else if(val === undefined) {
        val = element.innerText;
    }
    return val;
}

/**
 * A shorthand method. Allows me to get an elements using their ID without having to type *document.getElementById().value*
 * @param {*} id 
 * @returns 
 */
function getValueById(id) {
    if(typeof(id) == 'string') {
        try {
            return getElementValueById(id);
        }
        catch(err) {
            return null;
        }
    }
    return null;
}

/**
 * A shorthand method. Allows me to get an elements using their ID without having to type *document.getElementById().value*
 * @param {*} id 
 * @returns 
 */
function getElementValue(element) {
    let val = undefined;
    if(element) {
        if(element.type === 'checkbox') {
            val = element.checked;
        }
        if(val === undefined) {
            val = element.value;
        }
        if(val === undefined) {
            val = element.innerText;
        }
    }
    else {
        return null;
    }
    return val;
}

function getElementsByName(name) {
    if(typeof(name) == 'string') {
        return document.getElementsByName(name);
    }
    return null;
}

/**
 * A shorthand method. Allows me to set an element's value using their ID without having to type *document.getElementById().value*
 * @param {Element} element 
 * @param {*} value
 */
function setElementValue(element, value) {
    if (element === null || element === undefined) {
        debugLog('Could not set to value', value);
        return;
    }
    if(typeof(element) === 'string') {
        element = document.getElementById(element);
        if(element === null) {
            debugLog('Could not set elemnt value', element);
            return;
        }
    }
    else if (typeof(element) === 'object') {
        
    }
    else {
        debugLog(`!!! Could not set value of ${element}`);
        return;
    }
    
    switch(element.tagName) {
        case 'INPUT': 
            element.value = value;
            break;
        case 'P':
            element.innerHTML = value;
            break;
        default:
            debugLog(`Did not expect to set value of element with tag type: ${element.tagName}`);
            break;
    }
}

function setElementValueWithName(elementName, value) {
    elements = document.getElementsByName(elementName);
    if(elements) {
        setElementValue(elements[0], value);
    }
    else {
        debugLog('Could not locate any elements with name', elementName);
    }
}

function setAllElementValueWithName(elementName, value) {
    elements = document.getElementsByName(elementName);
    if(elements) {
        for(let element of elements) {
            setElementValue(element, value);
        }
    }
    else {
        debugLog('Could not locate any elements with name', elementName);
    }
}

function formatMoney(number) {
    if(Number(number) === 0) {
        return '0.00';
    }
    return Number(number).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).substring(1);
}

/**
 * 
 * @param {Element} parent 
 * @param {Element} child 
 */
function addChildElement(parent, child) {
    try {
        parent.appendChild(child);
    }
    catch {
        debugLog(`Could not append child.
    Parent: ${parent}
    Child: ${child}`);
    }
} 

/**
 * 
 * @param {Number} number 
 * @returns {String}
 */
function padWithZeros(number, length) {
    let isNegative = number < 0;
    let numberStr = number+'';
    if(isNegative) {
        numberStr = numberStr.substring(1);
    }
    if(numberStr.length >= length) {
        return numberStr;
    }
    else {
        while(numberStr.length < length) {
            numberStr = '0'+numberStr;
        }
    }
    if(isNegative) {
        numberStr = "-"+numberStr;
    }
    return numberStr;
}


function createOptionElement(name, value) {
    let el = document.createElement('option');
    el.value = value;
    el.innerText = name;
    return el;
}


function refreshPage() {
    location.href = location.href;
}

const allowDebug = false;
/**
 * Allows me to activate or deactivate debug output.
 * @param  {...any} strs 
 * @returns 
 */
function debugLog(...strs) {
    if(!allowDebug) {
        return;
    }
    let p = ''
    for (let str of strs) {
        p += str+' ';
    }
    console.log(p.substring(0, p.length-1));
}
