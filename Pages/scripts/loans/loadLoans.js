
let loanData = postRequest('loan/getLoans').then((data) => { 
    createBanner('Loans');
    createLoanElements(data); 
});

function createLoanElements(data) {
    if (data.name == 'error') {
        debugLog('something went wrong.');
    }
    else {
        let rowContainer = document.createElement('div');
        rowContainer.classList = 'max-width row';
        document.getElementById('main-container').appendChild(rowContainer);
        for(let loanData of data) {
            let loanName = `$${loanData.amount} ${loanData.interestperiodquantity} ${loanData.interestperiod.toLowerCase()} Loan`;
            s = {
                "name": loanName,
                'headingValue': loanData.amountdue,
                'headingDescriptor': `Due @ ${dateToStr(loanData.duedate)}`,
                'assetInformation': [
                    ['Interest Rate:', `${loanData.interestpercent}%`],
                    ['Appreciates', `${loanData.interestperiod.toLowerCase()}ly`]
                ],
                'buttons': [
                    // name, button style
                    ['History', 'btn-primary', 
                        {
                            'message': `Do you want to view the history of \n\n\"${loanName}\"?`, 
                            'inputs': [
                                {
                                    'text': 'Yes',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-success mt-1',
                                    'href': `./asset/history/assetHistory.html?id=${loanData.loanid}&type=loan`
                                },
                                {
                                    'text': 'No',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-warning mt-1'
                                }
                            ]
                        }
                    ],
                    ['Make Payment', 'btn-warning', 
                        {
                            'message': `Make payment on \n\n\"${loanName}\"?`, 
                            'inputs': [
                                {
                                    'text': 'Yes',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-success mt-1',
                                    'href': `./asset/payment/makePayment.html?id=${loanData.loanid}&type=loan`
                                },
                                {
                                    'text': 'No',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-warning mt-1'
                                }
                            ]
                        }
                    ],
                ],
                'containerMods': ''
            };
            rowContainer.appendChild((new bankAsset(s).element));
        }
    }
}

debugLog('loaded loans js');
