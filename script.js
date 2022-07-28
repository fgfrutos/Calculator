
// UI
const screen = document.querySelector('#screen');
const text = document.querySelector('#screen > p');
text.style.fontSize = '5rem';
const clearBtn = document.querySelector('.clear');
const signBtn = document.querySelector('.sign');
const numBtn = Array.from(document.querySelectorAll('div[class=button]'));
numBtn.push(document.querySelector('.button.long'));
const commaBtn = document.querySelector('.comma');
const operateBtn = Array.from(document.querySelectorAll('.operator'));
const equalBtn = operateBtn.pop()

// Calculator object
const calculator = {
    input: [undefined, undefined],
    output: undefined,
    Operation: '',
    operating: false,
    operate(func, ...args) {
        return func(args[0], args[1]);
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
    },
    saveNumber() {
        let num = parseFloat(text.textContent.replace(",", ""));
        if (calculator.operating && calculator.output === undefined && calculator.input[0] !== undefined) {
            calculator.input[1] = num;
        } else {
            calculator.input[0] = num;
        }
    },
    display() {
        calculator.input[1] = ([calculator.input[1], calculator.output].every(num => num === undefined)) ? calculator.input[0] : calculator.input[1];
        if ([calculator.input[1], calculator.output].some(num => num !== undefined)) {
            operateBtn.forEach(btn => btn.classList.remove("activated"));
            calculator.input[0] = (calculator.input[0] === undefined)? calculator.output : calculator.input[0];
            calculator.input[1] = (calculator.input[1] === undefined)? calculator.input[0] : calculator.input[1];
            calculator.output = calculator.operate(calculator[calculator.operation], ...calculator.input);
            text.textContent = formatting(calculator.output.toString());
            calculator.input[0] = undefined;
        } else {
            console.log("Invalid operation");
        }
    },
 }

// Functions
const changeSize = (change) => {
    Size = text.style.fontSize.replace('rem', '')
    text.style.fontSize = (change === 1)? `${parseFloat(Size)*1.12}rem`: `${parseFloat(Size)*.88}rem`;
}

// Function that formate numbers
//modified from: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const formatting = (x) => {
    x = x.split(".");
    inte = x[0].replace(",", "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    decimal = (x[1] !== undefined)? `.${x[1]}` : "";
    return inte + decimal;
    /*TODO: formate the number depending on decimal an integer quantity
    and, for output, return the number in exponential notation if necesary*/
}

// Handle events
numBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        let tmpText;
        if (calculator.input[1] === undefined && calculator.operating) {
            tmpText = "";
        } else if (calculator.output !== undefined && calculator.input[0] === undefined) {
            tmpText = "";
        } else if (calculator.input[0] !== undefined && calculator.output === undefined && calculator.operating && calculator.input[1] === undefined) {
            tmpText = "";
        }
        else {
            tmpText = text.textContent.replace(",", "");
        }

        if (tmpText.length < 10) {
            if (tmpText === '0' || tmpText === '-0') {
                tmpText = tmpText.replace('0', '');
                clearBtn.textContent = 'C';
            }

            tmpText += btn.textContent;
            text.textContent = formatting(tmpText);

            if (text.clientWidth > screen.clientWidth-10) {
                text.style.fontSize = changeSize(0);
            }
            calculator.saveNumber();
        }
    });
});

commaBtn.addEventListener('click', () => {
    // Needs to use double backslash to scape dot special character
    if (text.textContent.match("\\.") === null && text.textContent.replaceAll(",", "").length !==9) {
        text.textContent += "."
    }
});

signBtn.addEventListener('click', () =>{
    if (text.textContent[0] === '-') {
        text.textContent = text.textContent.replace("-", "");
        const condition = text.textContent.replace(/[.,]/g, "").length === 9 && text.clientWidth > screen.clientWidth-10;
        if (condition) {
            text.style.fontSize = changeSize(1);
        }
    } else {
        text.textContent = '-'+text.textContent;
    }
    if (text.clientWidth > screen.clientWidth-10) {
        text.style.fontSize = changeSize(0)
    }
});

operateBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        operateBtn.forEach(btn => btn.classList.remove("activated"));
        if (!calculator.operating) {
            e.target.classList.toggle("activated");
            calculator.operation = e.target.dataset.value;
            calculator.saveNumber();
            calculator.operating = true;
        } else {
            //TODO: change the operation when you have selected two numbers is equal to operate
            console.log("asan")
            e.target.classList.toggle("activated");
            calculator.operation = e.target.dataset.value;
            // [calculator.input[0], calculator.input[1], calculator.output] = [calculator.output, undefined, undefined];
            // calculator.saveNumber();
        }

    });
});

equalBtn.addEventListener("click", calculator.display);

clearBtn.addEventListener('click', () =>{
    operateBtn.forEach(btn => btn.classList.remove("activated"));
    calculator.operating = false;
    calculator.output = undefined;
    calculator.input.forEach((num, index) => {
        calculator.input[index] = undefined;
    });
    text.style.fontSize = '5rem';
    clearBtn.textContent = 'AC';
    text.textContent = '0';
});