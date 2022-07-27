
// UI
const screen = document.querySelector('#screen');
const text = document.querySelector('#screen > p');
text.style.fontSize = '2.5rem';
const clearBtn = document.querySelector('.clear');
const signBtn = document.querySelector('.sign');
const numBtn = Array.from(document.querySelectorAll('div[class=button]'));
numBtn.push(document.querySelector('.button.long'));
commaBtn = document.querySelector('.comma');

// Calculator object
const calculator = {
    numbers: [0, 0],
    Operation: '',
    operate(func, num1, num2) {
        return func(num1, num2);
    },
    sum(num1, num2) {
        return num1 + num2;
    },

    substract(num1, num2) {
        return num1 - num2;
    },

    multiply(num1, num2) {
        return num1 * num2;
    },

    divide(num1, num2) {
        return num1 / num2;
    }
 }

// Functions
const changeSize = (element) => {
    Size = element.style.fontSize.replace('rem', '')
    return `${parseFloat(Size)*.89}rem`
}

// Function that formate numbers
//modified from: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const formatting = (x) => {
    x = x.split(".");
    inte = x[0].replace(",", "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    decimal = (x[1] !== undefined)? `.${x[1]}` : "";
    return inte + decimal;
}

// Handle events
numBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        let tmpText = text.textContent.replace(",", "");
        const condition = (tmpText.match("\\.") === null)?tmpText.length < 10:tmpText.length < 11;
        if (condition) {
            if (tmpText === '0' || tmpText === '-0') {
                tmpText = tmpText.replace('0', '');
                clearBtn.textContent = 'C';
            }

            tmpText += btn.textContent;
            text.textContent = formatting(tmpText);

            if (text.clientWidth > screen.clientWidth-2) {
                text.style.fontSize = changeSize(text)
            }
        }
    });
});

commaBtn.addEventListener('click', () => {
    // Needs to use double backslash to scape dot special character (find all)
    if (text.textContent.match("\\.") === null) {
        text.textContent += "."
    }
});

signBtn.addEventListener('click', () =>{
    if (text.textContent[0] === '-') {
        text.textContent.replace("-", "");
    } else {
        text.textContent = '-'+text.textContent;
    }
    if (text.clientWidth > screen.clientWidth-2) {
        text.style.fontSize = changeSize(text)
    }
});


clearBtn.addEventListener('click', () =>{
    clearBtn.textContent = 'AC';
    text.textContent = '0';
});