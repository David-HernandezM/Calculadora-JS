const operatorsText = ["multiply", "split", "add", "subtract", "module", "pow", "squareRoot"];
const operatorSymbol = ["x", "/", "+", "–", "%", "^", "√"];
let result = 0;
let operation = "";
const buttons = getButons();
const operatorsButtons = getOperatorsButtons();
const operationSpan = getElemById("operations");
const resultSpan = getElemById("result");
const delButton = getElemById("button-del");
const acButton = getElemById("button-ac");
const equalButton  = getElemById("button-equal");

buttons.forEach((element) => {
    element.addEventListener("click", () => {
        let operationText = getOperation();
        operationText += String(buttons.indexOf(element)) + "_";
        operation = operationText;
        putInfoInOperationDisplay(operation, operationSpan);  
    });
});

operatorsButtons.forEach((element) => {
    element.addEventListener("click", () => {
        let operationText = getOperation();
        operationText += operatorSymbol[Number(operatorsButtons.indexOf(element))] + "_";
        operation = operationText;
        putInfoInOperationDisplay(operation, operationSpan);
    });
});


delButton.addEventListener("click", () => {
    if (operationSpan.innerHTML.length >= 2) {
        operation = operation.substring(0, operation.length - 2) + "_";
        putInfoInOperationDisplay(operation, operationSpan);
    }
});

acButton.addEventListener("click", () => {
    operation = "_";
    putInfoInOperationDisplay(operation, operationSpan);
    setDefaultResultSpan();
});

equalButton.addEventListener("click", () => {
    let postfixOperators = infixToPostfix(getOperation());
    if (postfixOperators) {
        putResultInDisplay(evaluatePostfix(postfixOperators));
    } else {
        resultError();
    }
});

function putResultInDisplay(result) {
    resultSpan.innerHTML = result;
    resultSpan.style.opacity = 1;
}

function resultError() {
    operationSpan.innerHTML = "Syntax ERROR";
    setDefaultResultSpan();
    result = 0;
}

function setDefaultResultSpan() {
    resultSpan.innerHTML = "result";
    resultSpan.style.opacity = 0.5;
}

function getButons() {
    let buttons = [];
    for (let i = 0; i <= 9; i++) {
        buttons.push(document.getElementById(`button${i}`));
    }
    return buttons;
}

function getOperatorsButtons() {
    let operatorsList = [];
    operatorsText.forEach((element) => {
        operatorsList.push(document.getElementById(`button-${element}`));
    });
    return operatorsList;
}

function getElemById(element) {
    return document.getElementById(element);
}

function  getOperation() {
    return operation.substring(0, operation.length - 1);
}

function  putInfoInOperationDisplay(operation, display) {
    if (operation.length < 16)  {
        display.innerHTML =  operation;
    } else {
        display.innerHTML = operation.substring(operation.length-16,  operation.length);
    }
}

function evaluatePostfix(postFix) {
    let result = 0;
    let resultTemp = 0;
    let numbers = [];
    let second = 0;
    postFix.forEach((element) => {
        switch (element) {
            case '^':
                second = numbers.pop();
                resultTemp = Math.pow(numbers.pop(), second);
                break;
            case '%':
                second = numbers.pop();
                resultTemp = numbers.pop() % second;
                break;
            case '/':
                second = numbers.pop();
                resultTemp = numbers.pop() / second;
                break;
            case 'x':
                second = numbers.pop();
                resultTemp = numbers.pop() * second;
                break;
            case '+':
                second = numbers.pop();
                resultTemp = numbers.pop() + second;
                break;
            case '–':
                second = numbers.pop();
                resultTemp = numbers.pop() -  second;
                break;
            default:
                resultTemp = element;
                break;
        }
        numbers.push(resultTemp);
    });
    result = numbers.pop();
    if (String(result).length > 15) {
        result = result.toExponential(10);
        console.log("Con exponente: " + String(result).length);
    }
    return result;
}

function infixToPostfix(infix) {
    let postfija = [];
    let operators = [];
    let numberTemp = "";
    let countOfSquareRoots = 0;
    let isSquareRoot = false;
    let operationFail = false;
    let lastIsOperator = false;
    infix.split("").forEach((element, index, arr) => {
        if (operationFail) {
            return;
        }
        let typeOfOperator = getOperatorPriority(element);
        if (typeOfOperator == 0) {
            lastIsOperator = false;
            numberTemp += element;
            return;
        }
        if ((index == 0 && typeOfOperator != 1) || index == arr.length-1 || 
            (lastIsOperator && typeOfOperator != 1) ||
            (index != 0  && !lastIsOperator && typeOfOperator == 1)) {
            operationFail = true;
            return;
        }
        if (typeOfOperator == 1) {
            isSquareRoot = true;
            countOfSquareRoots ++;
            return;
        }
        if (isSquareRoot) {
            numberTemp = doNSquareRoots(Number(numberTemp), countOfSquareRoots);
            countOfSquareRoots = 0;
            isSquareRoot = false;
        }
        postfija.push(Number(numberTemp));
        numberTemp = "";

        if (operators.length != 0 && getOperatorPriority(operators[operators.length-1]) >= typeOfOperator) {
            while(getOperatorPriority(operators[operators.length-1]) >= typeOfOperator && operators.length != 0) {
                postfija.push(operators.pop());
            }
        }
        operators.push(element);
        lastIsOperator = true;
    });
    if (isSquareRoot) {
        numberTemp = doNSquareRoots(Number(numberTemp), countOfSquareRoots);
        isSquareRoot = false;
    }
    if (numberTemp != "") {
        postfija.push(Number(numberTemp));
    }
    while (operators.length != 0) {
        postfija.push(operators.pop());
    }
    if (operationFail) {
        return null;
    } else {
        return postfija;
    }
}

function doNSquareRoots(number, times) {
    while (times != 0) {
        number = Math.round(Math.sqrt(number));
        times --;
    }
    return number;
}

function getOperatorPriority(operator) {
    //  priority: 
    // ^ -> (%,,x,/) -> (+,–) -> √
    switch (operator) {
        case '√':
            return 1;
        case '–': case '+':
            return 2;
        case '/': case 'x': case '%':
            return 3;
        case '^':
            return 4;
        default:
            return 0;      
    }
}
