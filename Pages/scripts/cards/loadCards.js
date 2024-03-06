
let debitCardData = null;
let creditCardData = postRequest('card/getCreditCards').then((data) => { 
    createBanner('Credit');
    createCardElements(data, 'credit'); 
    debitCardData = postRequest('card/getDebitCards').then((data) => { 
        createBanner('Debit');
        createCardElements(data, 'debit');
    });
});


function createCardElements(data, cardType) {
    if (data.name == 'error') {
        debugLog(data);
        debugLog('something went wrong.');
    }
    else {
        if(cardType === 'credit') {
            let rowContainer = document.createElement('div');
            rowContainer.classList = 'max-width row';
            document.getElementById('main-container').appendChild(rowContainer);
            for(let cardData of data) {
                if (cardData.cardname === null) {
                    cardData.cardname = 'unnamed credit card';
                }
                s = {
                    "name": cardData.cardname,
                    'headingValue': `$${cardData.creditused}`,
                    'headingDescriptor': 'Used',
                    'subHeadingValue': `$${cardData.creditlimit}`,
                    'subHeadingDescriptor': 'Limit',
                    'assetInformation': [
                        ['Minimum Payment:', `$${cardData.minimumpayment}`],
                        ['Due Date: ', dateToStr(cardData.duedate)],
                        ['Interest Rate: ', cardData.interestpercent+"%"],
                        ['Card Number: ', cardData.cardnumberformatted],
                        ['Card Security Code: ', cardData.securitycode],
                        ['Address: ', cardData.address],
                        ['Open Date: ', dateToStr(cardData.dateofcard)],
                        ['Expiration Date: ', dateToStr(cardData.expirationdate)]
                    ],
                    'buttons': [
                        // name, button style
                        ['History', 'btn-primary', 
                            {
                                'message': `Do you want to view the history on ${cardData.cardname}`, 
                                'inputs': [
                                    {
                                        'text': 'Yes',
                                        'type': 'a',
                                        'classList': 'btn btn-lg btn-success mt-1',
                                        'href': `./asset/history/assetHistory.html?id=${cardData.cardnumber}&type=creditcard`
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
                                'message': `Make payment on \n\n\"${cardData.cardname}\"?`, 
                                'inputs': [
                                    {
                                        'text': 'Yes',
                                        'type': 'a',
                                        'classList': 'btn btn-lg btn-success mt-1',
                                        'href': `./asset/payment/makePayment.html?id=${cardData.cardnumber}&type=creditcard`
                                    },
                                    {
                                        'text': 'No',
                                        'type': 'a',
                                        'classList': 'btn btn-lg btn-warning mt-1'
                                    }
                                ]
                            }
                        ]
                    ],
                    'containerMods': 'credit_resize'
                };
                rowContainer.appendChild((new bankAsset(s).element));
            }
        }
        else if(cardType === 'debit') {
            let rowContainer = document.createElement('div');
            rowContainer.classList = 'max-width row';
            document.getElementById('main-container').appendChild(rowContainer);
            for(let cardData of data) {
                if (cardData.cardname === null) {
                    cardData.cardname = 'unnamed debit card';
                }
                s = {
                    "name": cardData.cardname,
                    'headingValue': `${cardData.amountspentthismonth}`,
                    'headingDescriptor': 'Used This Month',
                    'assetInformation': [
                        ['Card Number: ', cardData.cardnumberformatted],
                        ['Card Security Code: ', cardData.securitycode],
                        ['Address: ', cardData.address],
                        ['Open Date: ', dateToStr(cardData.dateofcard)],
                        ['Expiration Date: ', dateToStr(cardData.expirationdate)],
                    ],
                    'buttons': [
                        // name, button style
                        ['History', 'btn-primary', 
                            {
                                'message': `Do you want to view the history on ${cardData.cardname}`, 
                                'inputs': [
                                    {
                                        'text': 'Yes',
                                        'type': 'a',
                                        'classList': 'btn btn-lg btn-success mt-1',
                                        'href': `./asset/history/assetHistory.html?id=${cardData.cardnumber}&type=debitcard`
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
}

debugLog('loaded cards js');
