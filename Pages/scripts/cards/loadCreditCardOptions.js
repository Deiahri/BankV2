let c = new cardSelector();
document.getElementById('card-container').appendChild(c.element);

let availableCardDesigns = postRequest('card/getCreditCardDesigns').then((availableCardDesigns) => { 
    for(let cardDesign of availableCardDesigns) {
        debugLog(cardDesign);
        let cO = new cardSelectOption(cardDesign);
        c.addCard(cO);
    }
});

// [
//     {
//         designid: 1,
//         designname: 'Jatco Promo',
//         imagename: 'card1',
//         baselimit: 40200,
//         baseinterestrate: 11.3
//     },
//     {
//         designid: 2,
//         designname: 'Jsusis',
//         imagename: 'card2',
//         baselimit: 9999999,
//         baseinterestrate: 33.3
//     },
// ];

// for(let cardDesign of availableCardDesigns) {
//     let cO = new cardSelectOption(cardDesign);
//     c.addCard(cO);
// }


// let s = document.createElement('button');
// s.innerText = 'GetData';
// document.getElementById('card-container').appendChild(s);


