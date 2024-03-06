const dropDownIconSrc = './img/dropdown.png';

class bankAsset {
    element = null;
    name = '';
    headingValue = '';
    headingDescriptor = '';
    subHeadingValue = '';
    subHeadingDescriptor = '';
    assetInformation = [];
    containerMods = '';
    
    constructor (assetDict){
        this.name = assetDict.name;
        this.headingValue = assetDict.headingValue;
        this.headingDescriptor = assetDict.headingDescriptor;
        this.subHeadingValue = assetDict.subHeadingValue;
        this.subHeadingDescriptor = assetDict.subHeadingDescriptor;
        this.assetInformation = assetDict.assetInformation;
        this.containerMods = assetDict.containerMods;
        this.buttons = assetDict.buttons;
        this.#initializeBase();
    }

    #initializeBase() {
        let element = document.createElement('div');
        element.classList = 'account_container '+this.containerMods+' position-relative';
        
        let name = document.createElement('p');
        name.classList = 'relative-account-name'
        name.innerText = this.name;
        element.appendChild(name);

        // main heading stuff

        let leftAlign = document.createElement('div');
        leftAlign.classList = 'left_center_align';

            // drop down button
        let dropDownBtn = document.createElement('a');
        dropDownBtn.classList = 'cst-btn relative-dropdown-button';
        dropDownBtn.setAttribute("name", 'account-dropdown-btn');
        
                // drop down icon
        let dropDownIcon = document.createElement('img');
        dropDownIcon.src = dropDownIconSrc;
        dropDownIcon.classList = 'dropdown-icon';
        
        dropDownBtn.appendChild(dropDownIcon);
        
        pairAccountDropdownActions([dropDownBtn]);

            // headingValueContainer

        let headingValueContainer = document.createElement('div');
        headingValueContainer.classList = 'left_baseline_align';

                // headingValue
        let headingValue = document.createElement('p');
        headingValue.classList = 'fs-3 no-margin';
        headingValue.innerHTML = this.headingValue;
        headingValueContainer.appendChild(headingValue);

                // headingDescriptor
        let headingDescriptor = document.createElement('p');
        headingDescriptor.classList = 'fs-6 no-margin ms-2';
        headingDescriptor.innerHTML = this.headingDescriptor;
        headingValueContainer.appendChild(headingDescriptor);

        leftAlign.appendChild(headingValueContainer);
        leftAlign.appendChild(dropDownBtn);
        element.appendChild(leftAlign);


        // adds subHeadingValue section of subHeadingValue is defined
        if(this.subHeadingValue) {
                    // subheading container
            let subHeadingValueContainer = document.createElement('div');
            subHeadingValueContainer.classList = 'left_baseline_align';

                    // subheadingValue
            let subHeadingValue = document.createElement('p');
            subHeadingValue.classList = 'fs-5 no-margin';
            subHeadingValue.innerHTML = this.subHeadingValue;
            subHeadingValueContainer.appendChild(subHeadingValue);

                    // subheadingDescriptor
            let subHeadingDescriptor = document.createElement('p');
            subHeadingDescriptor.classList = 'fs-6 no-margin ms-2';
            subHeadingDescriptor.innerHTML = this.subHeadingDescriptor;
            subHeadingValueContainer.appendChild(subHeadingDescriptor);

            element.appendChild(subHeadingValueContainer);
        }
        // ------------------

        // vertical separator
        let verticalSeparator3 = document.createElement('div');
        verticalSeparator3.classList = 'vertical-separator-3';

        element.appendChild(verticalSeparator3);
        // ------------------

        // account information
        let assetInformationContainer = document.createElement('div');
        assetInformationContainer.classList = 'row';

        for(let assetInfo of this.assetInformation) {
            let currentAssetInfo = document.createElement('div');
            currentAssetInfo.classList = 'col-md-6 col-sm-12';
            currentAssetInfo.innerHTML = '<b>'+assetInfo[0]+'</b> '+assetInfo[1];
            assetInformationContainer.appendChild(currentAssetInfo);
        }
        element.appendChild(assetInformationContainer);
        // ------------------

        // vertical separator 2
        let verticalSeparator2 = document.createElement('div');
        verticalSeparator2.classList = 'vertical-separator-2';
        element.appendChild(verticalSeparator2);

        // ------------------

        let buttonsContainer = document.createElement('div');
        buttonsContainer.classList = 'right_center_align flex-wrap';

        for(let buttonInfo of this.buttons) {
            let button = document.createElement('a');
            button.classList = 'btn btn-lg margin-left-1 vertical-top-margin-1 '+buttonInfo[1];
            button.innerText = buttonInfo[0];
            button.onclick = promptAlertV2.bind(null, buttonInfo[2]);
            buttonsContainer.appendChild(button);
        }

        element.appendChild(buttonsContainer);

        let gridWrapper = document.createElement('div');
        gridWrapper.classList = 'col-xs-12 col-sm-6 col-lg-4 col-xxl-3';

        gridWrapper.appendChild(element);

        this.element = gridWrapper;
    }
}

class cardSelector {
    element = null;
    cards = [];
    constructor(id='cardDesign') {
        let myElement = document.createElement('div');
        myElement.classList = 'row max-width left-justify';
        myElement.id = id;
        myElement.setAttribute('name', id);
        myElement.value = -1;
        this.element = myElement;
    }

    /**
     * 
     * @param {cardSelectOption} cardElement 
     */
    addCard(cardOption) {
        cardOption.setParentSelector(this);
        this.element.appendChild(cardOption.element);
        this.cards.push(cardOption);
    }

    activateCard(cardID) {
        this.setElementValue(cardID);
        for(let cardOption of this.cards) {
            if(cardOption.cardID === cardID) {
                cardOption.element.classList.add('active');
            }
            else {
                cardOption.element.classList.remove('active');
            }
        }
    }

    setElementValue(val) {
        this.element.value = val;
        this.element.setAttribute('value', val);
    }
}

class cardSelectOption {
    element = null;
    cardID = -1;
    constructor(information, type='card') {
        let myElement = document.createElement('div');
        myElement.classList = 'card-option-btn pe-3 mt-2 mx-1';
        if(type === 'account') {
            this.cardID = information.cardID;
            myElement.innerHTML = `
            <div class="center_align">
                <img src="../img/accounts/${information.imagename}.png" class="card-option-icon">
                <div class="center_align left-justify">
                    <p class="no-margin fs-5 bold">${information.accounttype}</p>`
            if(information.description) {
                myElement.innerHTML += `
                    <p class="no-margin">${information.description}</p>`;
            }
            myElement.innerHTML += `
                </div>
            </div>
            `;
        }
        else if(type === 'card') {
            this.cardID = information.designid;
            myElement.innerHTML = `
            <div class="center_align">
                <img src="../img/cards/${information.imagename}.png" class="card-option-icon">
                <div class="center_align left-justify">
                    <p class="no-margin fs-5 bold">${information.designname}</p>`

            if(information.baselimit) {
                myElement.innerHTML += `
                    <p class="no-margin">${formatMoney(information.baselimit)} Credit Limit</p>`;
            }
            if(information.baseinterestrate) {
                myElement.innerHTML += `
                    <p class="no-margin">${information.baseinterestrate}% APR</p>`;
            }
            if(information.description) {
                myElement.innerHTML += `
                    <p class="no-margin">${information.description}</p>`;
            }
            myElement.innerHTML += `
                </div>
            </div>
            `;
        } 
            this.element = myElement;
    }

    setParentSelector(parentSelector) {
        this.element.onclick = parentSelector.activateCard.bind(parentSelector, this.cardID);
    }
}

    
function createBanner(text) {
    let mainContainer = document.getElementById('main-container');
    let banner = document.createElement('div');
    banner.classList = 'left_center_align max-width horizontal-padding-1';
    banner.innerHTML = `<hr class="hr-thick-1" style="width: 30px; margin-right: 10px;"> <p class="inline no-margin fs-4">${text}</p> \
    <hr class="hr-thick-1" style="width: 100%; margin-left: 10px;">`;
    mainContainer.appendChild(banner);
}

