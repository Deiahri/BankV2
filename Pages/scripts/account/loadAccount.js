let savingsAccountData = null;
let checkingAccountData = postRequest('account/getCheckingAccounts').then((data) => { 
    createBanner('Checking');
    createCheckingAccountElements(data); 

    savingsAccountData = postRequest('account/getSavingsAccounts').then((data) => { 
        createBanner('Savings');
        createSavingsAccountElements(data);
    }).catch((err)=> { debugLog('something went wrong while fetching/creating savings accounts.', err);});

}).catch(()=> { debugLog('something went wrong while fetching/creating checking accounts.');});


function createCheckingAccountElements(data) {
    if (data.name == 'error') {
        debugLog(data);
        debugLog('something went wrong.');
    }
    else {
        let rowContainer = document.createElement('div');
        rowContainer.classList = 'max-width row';
        document.getElementById('main-container').appendChild(rowContainer);
        for(let accountData of data) {
            let overdrawText = (accountData.allowoverdraw)? 'Allowed': 'Not Allowed';
            let enableOverDrawButtonText = (accountData.allowoverdraw)? 'Disable Overdraw': 'Enable Overdraw';
            
            s = {
                "name": accountData.accountname,
                'headingValue': `$${accountData.balance}`,
                'headingDescriptor': 'Available',
                'assetInformation': [
                    ['Type:', accountData.accounttype],
                    ['Overdraw: ', overdrawText],
                    ['account: ', accountData.accountnumber]
                ],
                'buttons': [
                    // name, button style
                    [enableOverDrawButtonText, 'btn-success', 
                        {
                            'message': `Do you want to enable overdraw on \n\n\"${accountData.accountname}\"?`, 
                            'inputs': [
                                {
                                    'text': 'Yes',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-success mt-1',
                                    'onclick': () => {
                                        postRequest('account/modifyAccount', {
                                            allowOverdraw: !accountData.allowoverdraw,
                                            accountNumber: accountData.accountnumber
                                        }).then((data) => {
                                            setTimeout(promptAlertV2.bind(null, {
                                                'message': `${data.message}`, 
                                                'inputs': [
                                                    {
                                                        'text': 'Okay',
                                                        'type': 'a',
                                                        'classList': 'btn btn-lg btn-warning mt-1',
                                                        'onclick': refreshPage
                                                    }
                                                ]
                                            }), 700);
                                            
                                        });
                                        setPromptVisibility(false);
                                    }
                                },
                                {
                                    'text': 'No',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-warning mt-1'
                                }
                            ]
                        }
                    ],
                    ['History', 'btn-primary', 
                        {
                            'message': `Do you want to view the history on ${accountData.accountname}`, 
                            'inputs': [
                                {
                                    'text': 'Yes',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-success mt-1',
                                    'href': `./asset/history/assetHistory.html?id=${accountData.accountnumber}&type=account`
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
                'containerMods': ''
            };
            rowContainer.appendChild((new bankAsset(s).element));
        }
    }
}


function createSavingsAccountElements(data) {
    if (data.name == 'error') {
        debugLog(data);
        debugLog('something went wrong.');
    }
    else {
        let rowContainer = document.createElement('div');
        rowContainer.classList = 'max-width row';
        document.getElementById('main-container').appendChild(rowContainer);
        for(let accountData of data) {
            debugLog(accountData);
            let overdrawText = (accountData.allowoverdraw)? 'Allowed': 'Not Allowed';
            let enableOverDrawButtonText = (accountData.allowoverdraw)? 'Disable Overdraw': 'Enable Overdraw';
            s = {
                "name": accountData.accountname,
                'headingValue': `$${accountData.balance}`,
                'headingDescriptor': 'Available',
                'assetInformation': [
                    ['Type:', accountData.accounttype],
                    ['Overdraw: ', overdrawText],
                    ['Interest Rate: ', `${accountData.interestrate}%`],
                    ['account: ', accountData.accountnumber]
                ],
                'buttons': [
                    // name, button style
                    [enableOverDrawButtonText, 'btn-success', 
                        {
                            'message': `Do you want to enable overdraw on \n\n\"${accountData.accountname}\"?`, 
                            'inputs': [
                                {
                                    'text': 'Yes',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-success mt-1',
                                    'onclick': () => {
                                        postRequest('account/modifyAccount', {
                                            allowOverdraw: !accountData.allowoverdraw,
                                            accountNumber: accountData.accountnumber
                                        }).then((data) => {
                                            setTimeout(promptAlertV2.bind(null, {
                                                'message': `${data.message}`, 
                                                'inputs': [
                                                    {
                                                        'text': 'Okay',
                                                        'type': 'a',
                                                        'classList': 'btn btn-lg btn-warning mt-1',
                                                        'onclick': refreshPage
                                                    }
                                                ]
                                            }), 700);
                                            
                                        });
                                        setPromptVisibility(false);
                                    }
                                },
                                {
                                    'text': 'No',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-warning mt-1'
                                }
                            ]
                        }
                    ],
                    ['History', 'btn-primary', 
                        {
                            'message': `Do you want to view the history on ${accountData.accountname}`, 
                            'inputs': [
                                {
                                    'text': 'Yes',
                                    'type': 'a',
                                    'classList': 'btn btn-lg btn-success mt-1',
                                    'href': `./asset/history/assetHistory.html?id=${accountData.accountnumber}&type=account`
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
                'containerMods': ''
            };
            rowContainer.appendChild((new bankAsset(s).element));
        }
    }
}

debugLog('loaded accounts js');
