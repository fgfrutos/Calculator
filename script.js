
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
const equalBtn = operateBtn.pop();
const percent = document.querySelector('.percent');

// Calculator object
const calculator = {
    input: [undefined, undefined],
    screen: 0,
    Operation: '',
    operating: "",
    store: [],
    // TODO: computate 1 value per case and apply it as max fontSize when max digits are reached
    maxFontSize: {
        normal: undefined,
        sign: undefined
    },
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
        if (typeof(calculator.screen) === 'number') {
            if (calculator.operating === 'operating' && typeof(calculator.input[0]) === 'number') {
                calculator.input[1] = calculator.screen;
            } else if (!calculator.input[1] || calculator.operating === 'operated') {
                calculator.input[0] = calculator.screen;
            }
        }
    },
    display(e) {
        if (typeof(calculator.input[0]) === 'number' && calculator.operating) {
            calculator.input[1] =  (!calculator.input[1])? calculator.input[0]: calculator.input[1];
            operateBtn.forEach(btn => btn.classList.remove("activated"));
            calculator.screen = calculator.operate(calculator[calculator.operation], ...calculator.input);

            calculator.roundOutput();

            //Storing calculator information (to implement a logger in the future):
            calculator.store.push({
                input:[...calculator.input],
                operation: calculator.operation,
                output: calculator.screen,
            });
            [calculator.input[0], calculator.screen] = [+calculator.screen, undefined];
            calculator.operating = (e.target.textContent !== '=')? calculator.operating: 'operated';
        } else {
            console.log("Invalid operation");
        }
    },
    roundOutput() {
        if (Math.abs(calculator.screen) >= 1e9 || (Math.abs(calculator.screen) <= 1e-9 && calculator.screen !== 0)) {
            console.log(calculator.screen)
            text.style.fontSize = '5rem';
            if (calculator.screen === Infinity) {
                text.textContent = 'Infinity';
                return
            }
            let tmpText;
            let tmpNum = +calculator.screen;
            for (let i = 6; i > 0; i--) {
                tmpText = tmpNum.toExponential(i);
                // Fix toExponential iterator
                if (tmpText.split(".")[1].split("e")[0].match(/[1-9]/g) !== null) {
                    text.textContent = tmpText.replace("+", "");
                    if (i >= 3) {
                        adjustFontSize();
                        return;
                    } else {
                        return;
                    }
                }
            }
            text.textContent = tmpText.replace("+", "");
        } else {
            calculator.processDecimal();
            text.style.fontSize = '5rem';
            text.textContent = formatting(calculator.screen);
            if (Math.abs(calculator.screen) > 9e5 || Math.abs(calculator.screen) < 9e-5 || text.textContent.replace(/[,.-]/g, "").length > 6) adjustFontSize();
            return;
        }
    },
    shouldResetText() {
        return ((typeof(calculator.input[0]) === 'number' && calculator.input[1] === undefined) && calculator.operating === 'operating') || ((typeof(calculator.input[0]) === 'number' && typeof(calculator.input[1]) === 'number') && (calculator.operating === 'operated' && calculator.screen === undefined));
    },
    processDecimal() {
        calculator.screen = (Number.isInteger(calculator.screen))? calculator.screen.toString(): calculator.screen.toPrecision(9);
        if (calculator.screen.includes(".")){
            let tmp = calculator.screen.split('.')[1].split('')
            for (let i = tmp.length-1; i > 0; i--) {
                if (tmp[i] === '0') {
                    tmp.pop()
                } else {
                    tmp = tmp.join('')
                    break
                }
            }
            calculator.screen = `${calculator.screen.split('.')[0]}.${tmp}`;
        }
    },
 }

// Functions
// Function to customly adjust font size if overflow is detected:
// Modified from: 
const adjustFontSize = () => {
    text.style.fontSize = '5rem';
    let lastSize;
    let fitted = false;
    const Rate = 0.05;
    while (!fitted) {
        if (text.clientWidth > screen.clientWidth) {
            lastSize = parseFloat(text.style.fontSize.replace("em", "")) - Rate;
            text.style.fontSize = `${lastSize}em`;
        } else {
            text.style.fontSize = `${lastSize}em`;
            fitted = true;
        }
    }
}

// Function that formate numbers
// Modified from: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const formatting = (x) => {
    x = x.split(".");
    inte = x[0].replace(",", "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    decimal = (x[1] !== undefined)? `.${x[1]}` : "";
    return inte + decimal;
}

// Handle events
numBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        let tmpText;
        // Check if it works with decimal numbers
        if (calculator.shouldResetText()) {
            text.textContent = '';
            tmpText = '';
            text.style.fontSize = '5rem';
        } else {
            tmpText = text.textContent.replace(/[,-]/g, "");
        }
        if (tmpText.replace(/[.,-]/g, "").length < 9) {
            tmpText = (text.textContent.match("-") && typeof(calculator.screen) === 'number')? '-' + tmpText: tmpText;
            if (text.textContent.replace('-', '') === '0') {
                tmpText = tmpText.replace('0', '');
            } 

            tmpText += btn.textContent;
            clearBtn.textContent = (text.textContent !== '0')? 'C': 'AC';
            text.textContent = formatting(tmpText);
            calculator.screen = +text.textContent.replaceAll(",", "");

            if (text.clientWidth > screen.clientWidth-10) {
                adjustFontSize();
            }
            calculator.saveNumber();
        }
    });
});

commaBtn.addEventListener('click', () => {
    if (calculator.shouldResetText()) {
        text.style.fontSize = '5rem';
        text.textContent = '0';
        calculator.screen = parseFloat(text.textContent);
    }
    if (!text.textContent.match(/[.]/g) && (!calculator.screen || text.textContent.replace(/[.,]/g, "").length < 9)) {
        text.textContent += ".";
        clearBtn.textContent = 'C';
    }
    calculator.saveNumber();
});

signBtn.addEventListener('click', () =>{
    if (text.textContent[0] === '-') {
        text.textContent = text.textContent.replace("-", "");
        const condition = text.textContent.replace(/[.,]/g, "").length >= 9 && text.clientWidth > screen.clientWidth-60;
        if (condition) {
            adjustFontSize();
        }
    } else {
        text.textContent = '-'+text.textContent;
    }
    if (text.clientWidth > screen.clientWidth-20) {
        adjustFontSize();
    }
    calculator.screen = +text.textContent.replaceAll(",", "");
});

operateBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        operateBtn.forEach(btn => btn.classList.remove("activated"));
        if (!calculator.input[1] || calculator.operating == "operated") {
            e.target.classList.toggle("activated");
            calculator.operation = e.target.dataset.value;
            calculator.input[1] = undefined;
            calculator.operating = 'operating';
        } else {
            if (calculator.screen) {
                calculator.display(e);
            }
            e.target.classList.toggle("activated");
            calculator.operation = e.target.dataset.value;
            calculator.input[1] = undefined;
        }

    });
});

equalBtn.addEventListener("click", calculator.display);

clearBtn.addEventListener('click', () =>{
    operateBtn.forEach(btn => btn.classList.remove("activated"));
    calculator.operating = '';
    [calculator.input, calculator.screen] = [[undefined, undefined], 0];
    text.style.fontSize = '5rem';
    clearBtn.textContent = 'AC';
    text.textContent = '0';
});

// TODO:
// navigator.connection.effectivetype to change wifi logo depending on conection.
// navigator.gerBattery to display battery level