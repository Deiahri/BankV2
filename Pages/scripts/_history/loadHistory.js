let pageParameters = getPageParameters();
let transactionMonths = null;

let dateSelectBtn = document.getElementById('dateSelectButton');
let yearSelect = document.getElementById('yearSelect');
let monthSelect = document.getElementById('monthSelect');
let transactionContainer = document.getElementById('transactionContainer');
let warnUserText = document.getElementById('warnUserText');


const historyAPIEndpoint ='general/getHistory';
const getHistoryMonthsEndPoint = 'general/getHistoryMonths'
const historyAPIJSON = {}

dateSelectBtn.onclick = () => {
    disableElement(dateSelectBtn, true);
    getHistory();
}

yearSelect.onchange = () => {
    disableElement(dateSelectBtn, false);
    changeSelectOptions();
}

monthSelect.onchange = () => {
    disableElement(dateSelectBtn, false);
}

if (pageParameters.id && pageParameters.type) {
    let getHistoryParameters = {}
    

    document.getElementById('previousPageButton').href = `../../${pageParameters.type}s.html`
    if(pageParameters.type === 'creditcard' || pageParameters.type === 'debitcard') {
        document.getElementById('previousPageButton').href = `../../cards.html`
    }

    historyAPIJSON.type = pageParameters.type;
    historyAPIJSON.id = pageParameters.id;
    getHistoryParameters.type = pageParameters.type;
    getHistoryParameters.id = pageParameters.id;

    debugLog(getHistoryParameters);
    postRequest(getHistoryMonthsEndPoint, getHistoryParameters).then((data) => {
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
        }
        else if(Object.keys(data).length !== 0) {
            transactionMonths = data;
            let keys = Object.keys(transactionMonths);

            for(let year of keys) {
                let element = document.createElement('option');
                element.value = year;
                element.innerText = year
                yearSelect.appendChild(element);
            }
            yearSelect.value = keys[keys.length-1];

            changeSelectOptions(keys[keys.length-1]);
        }
        else {
            warnUserText.innerText = 'No Transaction Data';
            warnUserText.classList.remove('fullHide');
        }
        
    });
}
else {
    warnUserText.innerText = 'Something went wrong';
}


function getHistory() {
    let year = yearSelect.value;
    let month = monthSelect.value;
    if(!month || !year) {
        promptAlertV2({
            message: 'Cannot retrieve data for that month or year',
            'inputs': [
                {
                    'text': 'Okay',
                    'type': 'a',
                    'classList': 'btn btn-lg btn-warning mt-1'
                }
            ]
        });
        return;
    }
    historyAPIJSON.month = month
    historyAPIJSON.year = year;
    postRequest(historyAPIEndpoint, historyAPIJSON).then((data) => { 
        if(Object.keys(data).length !== 0) {
            displayHistory(data); 
        }
        else {
            warnUserText.innerText = 'No Transaction Data';
            warnUserText.classList.remove('fullHide');
        }
    })
}

function displayHistory(data) {
    transactionContainer.innerHTML = '';
    debugLog(data);
    let lastHR = null;
    for(let t of data) {
        let ElementObj = new transactionDisplayElement(t.source, t.date, t.amount);
        transactionContainer.appendChild(ElementObj.element);
        lastHR = document.createElement('hr')
        lastHR = transactionContainer.appendChild(lastHR);
    }
    lastHR.remove();
    disableElement(dateSelectBtn, false);
}


function changeSelectOptions() {
    let months = transactionMonths[yearSelect.value];
    monthSelect.innerHTML = '';
    for(let month of months) {
        let element = document.createElement('option');
        element.value = month;
        element.innerText = monthNumberToStr(month)
        monthSelect.appendChild(element);
    }
    months.value = months[0];
}

class transactionDisplayElement {
    constructor(source, date, amount) {
        let year = date.substring(0, 4);
        let month = date.substring(5, 7);
        let day = Number(date.substring(8, 10));
        
        debugLog(date);

        let hour = date.substring(11, 13);
        let minute = date.substring(14, 16);
        let ampm = (hour/12 > 1)?'pm':'am';
        
        if (hour > 12) {
            hour = hour-12;
        }

        let myElement = document.createElement('div');
        myElement.classList = 'left_baseline_align';
        myElement.innerHTML = `
            <div class="vertical_align left_justify max-width">
                <p class="fs-6 no-margin me-2">${monthNumberToStr(month)} ${day}${numberPostFix(day)}, ${year} @ ${hour}:${minute}${ampm}</p>
                <p class="fs-5 no-margin">${source}</p>
            </div>
            <p class="fs-6 text-right fw-bold">$${amount}</p>
            <hr class='hr-thick-1'>`
        
        this.element = myElement;
    }
}


