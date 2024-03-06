/*
    Adds functionality to the pop-ups
*/

// Creates the screenPrompt element
const screenPromptContainer = document.createElement('div');
screenPromptContainer.classList = 'max-width max-height position-fixed corner bring-to-front center_middle_align hideable hide';

let promptElement = document.createElement('div');
promptElement.classList = 'screenPrompt max-width-5';
promptElement.id = 'screenPrompt';

promptElement.innerHTML = `
    <p class="fs-5 text-center" id="screenPromptText">Text</p>
    
    <div class="center_align hideable" id="screenPromptOptionContainer">
    </div>
`;
screenPromptContainer.appendChild(promptElement);
document.getElementsByTagName('body')[0].appendChild(screenPromptContainer);
// -------------------


/**
 * Adds function to the screen prompt elements
 */
let currentInputType = null;


const screenPrompt = document.getElementById('screenPrompt');
const screenPromptText = document.getElementById('screenPromptText');
const screenPromptOptionContainer = getElementById('screenPromptOptionContainer');



/**
 * Recieves an object that is formatted with the following keys:
 * 
 * message: STRING
 * 
 * inputs: OBJECTS ARRAY (See function **generatePromptElement** for more info on the format of these objects)
 * @param {Object} promptAlertData 
 */
function promptAlertV2(promptAlertData) {
    screenPromptOptionContainer.innerHTML = '';
    screenPromptText.innerText = promptAlertData.message;
    let seperator = document.createElement('div');
    seperator.classList = 'horizontal-separator s2';
    
    let currentElementContainer = document.createElement('div');
    currentElementContainer.classList = 'left_center_align';
    let lastSeperator = null;
    for(let inputData of promptAlertData.inputs) {
        currentElementContainer.appendChild(generatePromptElement(inputData));
        lastSeperator = seperator.cloneNode();
        if(inputData['break-line']) {
            screenPromptOptionContainer.appendChild(currentElementContainer);
            currentElementContainer = currentElementContainer.cloneNode();
        }
        else {
            currentElementContainer.appendChild(lastSeperator);
        }
    }
    
    try {
        currentElementContainer.removeChild(lastSeperator);
    }
    catch {
    }

    screenPromptOptionContainer.appendChild(currentElementContainer);
    setPromptVisibility(true);
}


function promptResponded2() {
    setPromptVisibility(false);
}


/**
 * Sets the visibility of **promptAlert** to true or false depending on the value of state.
 * @param {Boolean} state 
 */
function setPromptVisibility(state) {
    switch (state) {
        case true:
            body.classList.add('overflow-hidden');
            darknessScreen.classList.remove('hide');
            darknessScreen.classList.remove('off');
            darknessScreen.classList.add('deeper');
            screenPromptContainer.classList.remove('hide');
            break;
        case false:
            screenPromptContainer.classList.add('hide');
            setTimeout(()=> {
                darknessScreen.classList.add('off');
                setTimeout(()=> {
                    darknessScreen.classList.add('hide');
                    darknessScreen.classList.remove('deeper');
                    body.classList.remove('overflow-hidden');
                }, 300);
                
            }, 300);
            break;
        default:
            debugLog(`did not expect prompt visibility type: ${state}`);
            break;
    }
}

let screenPromptOptionButtons = document.getElementsByName('screenPromptOptionButton');
bindScreenPromptOption(screenPromptOptionButtons);
function bindScreenPromptOption(screenPromptOptions) {
    for(let option of screenPromptOptions) {
        option.onclick = promptResponded.bind(null, option.innerText);
    }
}

/**
 * Recieves an object promptElementData and returns a customized DOM element
 * @param {Object} promptElementData Can contains the keys *type*, *text*, *classList*, *onclick*, and *href*
 * @returns 
 */
function generatePromptElement(promptElementData) {
    let myElement = null;
    
    // creates element as long as the prompt element type is given
    if(promptElementData.type) {
        myElement = document.createElement(`${promptElementData.type}`);
    }
    else {
        debugLog(`element input type is undefined.`);
        return null;
    }

    if(promptElementData.text) {
        myElement.innerText = promptElementData.text;
    }
    if(promptElementData.classList) {
        myElement.classList = promptElementData.classList;
    }
    if(promptElementData.onclick) {
        myElement.onclick = () => { 
            setPromptVisibility(false);
            promptElementData.onclick(); 
        };
    }
    else {
        myElement.onclick = () => { 
            setPromptVisibility(false);
        };
    }

    if(promptElementData.href !== null && promptElementData.href !== undefined) {
        myElement.href = promptElementData.href;
    }

    if(promptElementData.onclick !== null && promptElementData.onclick !== undefined) {
        myElement.onclick = promptElementData.onclick;
    }
    
    if(promptElementData.target) {
        myElement.target = promptElementData.target;
    }
    else {
        myElement.target = '_self';
    }

    return myElement;
}

function show(element) {
    element.classList.remove('hideFull');
}

function hide(element) {
    element.classList.add('hideFull');
}

function findChildWithName(element, desiredName) {
    let childrenMatch = [];
    for(let currentChild of element.children) {
        if (currentChild.getAttribute('name') === desiredName) {
            childrenMatch.push(currentChild);
        }
    }
    return childrenMatch;
}
