
// UI
const screen = document.querySelector('#screen');
const text = document.querySelector('#screen > p');
text.style.fontSize = '5rem';
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
const changeSize = (element, change) => {
    Size = element.style.fontSize.replace('rem', '')
    return (change === 1)? `${parseFloat(Size)*1.12}rem`: `${parseFloat(Size)*.88}rem`;
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
        if (tmpText.length < 10) {
            if (tmpText === '0' || tmpText === '-0') {
                tmpText = tmpText.replace('0', '');
                clearBtn.textContent = 'C';
            }

            tmpText += btn.textContent;
            text.textContent = formatting(tmpText);

            if (text.clientWidth > screen.clientWidth-10) {
                text.style.fontSize = changeSize(text, 0)
            }
        }
    });
});

commaBtn.addEventListener('click', () => {
    // Needs to use double backslash to scape dot special character (find all)
    if (text.textContent.match("\\.") === null && text.textContent.replaceAll(",", "").length !==9) {
        text.textContent += "."
    }
});

signBtn.addEventListener('click', () =>{
    if (text.textContent[0] === '-') {
        text.textContent = text.textContent.replace("-", "");
        const condition = text.textContent.replace(/[.,]/g, "").length === 9 && text.clientWidth > screen.clientWidth-10
        if (condition) {
            text.style.fontSize = changeSize(text, 1);
        }
    } else {
        text.textContent = '-'+text.textContent;
    }
    if (text.clientWidth > screen.clientWidth-10) {
        text.style.fontSize = changeSize(text)
    }
});


clearBtn.addEventListener('click', () =>{
    text.style.fontSize = '5rem';
    clearBtn.textContent = 'AC';
    text.textContent = '0';
});