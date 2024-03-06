/*
    pairs account dropdown buttons and pairs showmenu buttons + its peripheral function to ensure animation is correct.
*/


let accountDropdownBtn = document.getElementsByName('account-dropdown-btn');
pairAccountDropdownActions(accountDropdownBtn);
/**
 * Pairs the recieves buttons with a function that toggles the dropdown button's and dropdown comntainer's open state
 * @param {Array<Element>} buttons
 */
function pairAccountDropdownActions(buttons) {
    for(let btn of buttons) {
        let btnIcon = btn.children[0];
        btn.onclick = () => {
            btn.parentElement.parentElement.classList.toggle('open');
            btn.classList.toggle('open');
            btnIcon.classList.toggle('openState');
        };
    }
}


let openMenuBtns = document.getElementsByName('openMenuButton');
pairShowMenuButton(openMenuBtns);
/**
 * Binds every showMenu button in the current HTML document with a function that activates the showMenu button's open state
 * @param {Array<Element>} buttons 
 */
function pairShowMenuButton(buttons) {
    for(let btn of buttons) {
        let btnIcon = btn.children[0];
        btn.onclick = () => {
            btn.classList.toggle('open');
            btnIcon.classList.toggle('open');
            body.classList.toggle('overflow-hidden');
            mainContainer.classList.toggle('disabled');
            toggleMenuButtons();
        };
    }
}


let currentMenuButton = 0;
let menuButtonsHidden = true;
let menuButtons = document.getElementsByClassName('menuButton');
/**
 * This function is called everytime a showMenu button is pressed. \n
 * Animates the menu buttons
 */
function toggleMenuButtons() {
    if(menuButtonsHidden && currentMenuButton == 0) {
        menuButtonArea.classList.toggle('disabled');
        darknessScreen.classList.toggle('off');
        darknessScreen.classList.toggle('hide');
    }
    if(menuButtons[currentMenuButton] === undefined) {
        currentMenuButton = 0;
        if (!menuButtonsHidden) {
            darknessScreen.classList.toggle('off');
            setTimeout(() => {
                darknessScreen.classList.toggle('hide');
                menuButtonArea.classList.toggle('disabled');
            }, 100);
            
        }
        menuButtonsHidden = !menuButtonsHidden;
    }
    else {
        menuButtons[currentMenuButton++].classList.toggle('onScreen');
        setTimeout(toggleMenuButtons, 50);
    }
}



let accountsMenuButton = document.getElementById('accounts-menu-button');
let cardsMenuButton = document.getElementById('cards-menu-button');
let loansMenuButton = document.getElementById('loans-menu-button');
let myInfoMenuButton = document.getElementById('myinfo-menu-button');
let transferMenuButton = document.getElementById('transfer-menu-button');
let logoutMenuButton = document.getElementById('logout-menu-button');
pairMenuButtons();
function pairMenuButtons() {
    try {
        accountsMenuButton.href = 'accounts.html';
        cardsMenuButton.href = 'cards.html';
        loansMenuButton.href = 'loans.html';
        myInfoMenuButton.href = 'myinfo.html';
        transferMenuButton.href = 'transfer.html'

        // adds functionality to logout button
        logoutMenuButton.onclick = () => {
            document.cookie.userToken = null;
            processCookies({
                'userToken': {
                    value: null,
                    expires: 0
                }
            });
            location.href = 'login.html'
        };
    }
    catch {
        debugLog('this page does not have a menu');
    }
}


let darknessScreen = document.getElementById('darknessScreen');
let body = document.getElementsByTagName('body')[0];
let mainContainer = document.getElementById('main-container');
let menuButtonArea = document.getElementsByClassName('menuButtonArea')[0];




