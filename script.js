//common elements
const calculatorButtons = document.querySelectorAll(
  `.calculator-buttons > div`
);
const calculatorInput = document.querySelector(`.calculator-input`);
calculatorInput.value = ``;
let regex;

document.addEventListener("keyup", (event) => {
  const validKeyboardCharacters = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "-",
    "/",
    "X",
    "%",
    "e",
    "^",
  ];

  if (event.key === "Backspace" || event.key === "Delete") {
    calculatorInput.value = calculatorInput.value.slice(0, -1);
  }
  if (event.key === "=" || event.key === "Enter") {
    resultFunc();
  }
  if (validKeyboardCharacters.indexOf(event.key) !== -1) {
    calculatorInput.value += event.key;
  }
});

//adding an event listener to each button in calculator
calculatorButtons.forEach((e) => {
  e.addEventListener(`click`, () => {
    let val = e.textContent;

    if (e.className === "remove-data") {
      return;
    }
    val = val.trim(); //it automatically added some white space so had to add it to remove them

    switch (val) {
      case "=":
        resultFunc();
        break;

      case "C":
        calculatorInput.value = "";
        break;

      case `|x|`:
        calculatorInput.value += `|`;
        break;

      case `+/-`:
        signDegToggleFlagFunc();
        break;

      case `1/x`:
        regex = /(\d+)\.?0*(\d*)$/g;

        if (regex.test(calculatorInput.value)) {
          calculatorInput.value = calculatorInput.value.replace(
            regex,
            (match, num1, num2) => {
              if (num2) return `1/${num1}.${num2}`;
              else return `1/${num1}`;
            }
          );
        } else calculatorInput.value += `1/`;

        break;

      case `x2`:
        calculatorInput.value += "^2";
        break;

      case `x3`:
        calculatorInput.value += `^3`;
        break;

      case "n!":
        calculatorInput.value += "!";
        break;

      case `10x`:
        regex = /(\d+)\.?0*(\d*)$/g;
        if (regex.test(calculatorInput.value)) {
          calculatorInput.value = calculatorInput.value.replace(
            regex,
            (match, num1, num2) => {
              if (num2) return `10^${num1}.${num2}`;
              else return `10^${num1}`;
            }
          );
        } else {
          calculatorInput.value += "10^";
        }
        break;

      case `xy`:
        calculatorInput.value += "^";
        break;

      case `2nd`:
        break;

      case `3√x`:
        regex = /(\d+)$/;

        if (regex.test(calculatorInput.value)) {
          calculatorInput.value = calculatorInput.value.replace(
            regex,
            (match, num) => {
              return `${num}X√(`;
            }
          );
        } else {
          calculatorInput.value += "√(";
        }

        break;

      case `2√x`:
        regex = /(\d+)$/;

        if (regex.test(calculatorInput.value)) {
          calculatorInput.value = calculatorInput.value.replace(
            regex,
            (match, num) => {
              return `${num}X√(`;
            }
          );
        } else {
          calculatorInput.value += "√(";
        }

        break;

      default:
        if (calculatorInput.value === "ERROR") return;
        calculatorInput.value += val;
        if (val == `ln` || val == `log`) calculatorInput.value += `(`;
    }
  });
});

document.querySelector(`.remove-data`).addEventListener(`click`, () => {
  let inputVal = calculatorInput.value;
  if (inputVal === `ERROR`) {
    calculatorInput.value = ``;
  } else if (inputVal != ``) {
    calculatorInput.value = inputVal.slice(0, -1);
  }
});

function fact(num) {
  let fact = 1;
  for (let i = 2; i <= num; i++) {
    fact *= i;
  }
  return fact;
}

function conversionBetweenDegRad(value) {
  if (
    document.getElementsByClassName("deg-rad-button")[0].textContent === "DEG"
  ) {
    return (value * Math.PI) / 180;
  } else {
    return value;
  }
}

let secondOperationToggle = 0;
function handleSecondSetOfOperations(e) {
  e.classList.toggle("selected");

  if (secondOperationToggle === 0) {
    document.getElementsByClassName(
      "square-button"
    )[0].innerHTML = `x<sup>3</sup>`;
    document.getElementsByClassName(
      "square-root-button"
    )[0].innerHTML = `<sup>3</sup>&Sqrt;x`;
    secondOperationToggle = 1;
  } else {
    document.getElementsByClassName(
      "square-button"
    )[0].innerHTML = `x<sup>2</sup>`;
    document.getElementsByClassName(
      "square-root-button"
    )[0].innerHTML = `<sup>2</sup>&Sqrt;x`;
    secondOperationToggle = 0;
  }
}

function replaceAll(newStr) {
  newStr = newStr.replace(`X`, `*`);
  newStr = newStr.replace(`÷`, `/`);
  newStr = newStr.replace("mod", "%");
  newStr = newStr.replace("π", `${Math.PI}`);
  newStr = newStr.replace("^", "**");
  if (secondOperationToggle === 1) {
    calculatorInput.value = calculatorInput.value.replace(`√`, "Math.cbrt");
  }
  newStr = newStr.replace("√", "Math.sqrt");
  newStr = newStr.replace(
    /sin\((.+)\)/g,
    `Math.sin(conversionBetweenDegRad($1)).toFixed(2)`
  );
  newStr = newStr.replace(
    /cos\((.+)\)/g,
    "Math.cos(conversionBetweenDegRad($1)).toFixed(2)"
  );
  newStr = newStr.replace(
    /tan\((.+)\)/g,
    "Math.sin(conversionBetweenDegRad($1)).toFixed(2)/Math.cos(conversionBetweenDegRad($1)).toFixed(2)"
  );
  newStr = newStr.replace(
    /cosec\((.+)\)/g,
    "(1/Math.sin(conversionBetweenDegRad($1))).toFixed(2)"
  );
  newStr = newStr.replace(
    /sec\((.+)\)/g,
    "(1/Math.cos(conversionBetweenDegRad($1))).toFixed(2)"
  );
  newStr = newStr.replace(
    /cot\((.+)\)/g,
    "Math.cos(conversionBetweenDegRad($1)).toFixed(2)/Math.sin(conversionBetweenDegRad($1)).toFixed(2)"
  );

  newStr = newStr.replace(`log(`, `Math.log10(`);
  newStr = newStr.replace(`ln(`, `Math.log(`);
  newStr = newStr.replace("ceil", "Math.ceil");
  newStr = newStr.replace("floor", "Math.floor");
  newStr = newStr
    .replace(/(\d)e(\d)/g, "$1*Math.E*$2")
    .replace(/(\d)e\b/g, "$1*Math.E")
    .replace(/\be(\d)/g, "Math.E*$1")
    .replace(/\be\b/g, "Math.E");
  newStr = newStr.replace(`exp`, `e`);

  return newStr;
}

function resultFuncInitialEvaluation(newStr) {
  newStr = replaceAll(newStr);

  if (calculatorInput.value.includes(`!`)) {
    regex = /(\d+)!/g;
    newStr = newStr.replace(regex, (match, num) => {
      return fact(+num);
    });
  }

  regex = /\|([^|]+)\|/;
  newStr = newStr.replace(regex, (match, num) => {
    let val = +eval(num);

    if (val < 0) {
      val = val * -1;
    }

    return `${val}`;
  });
  return newStr;
}

function resultFunc() {
  try {
    let calculatorInputVal = calculatorInput.value;
    if (calculatorInputVal == ``) return;
    let newStr = resultFuncInitialEvaluation(calculatorInputVal);
    calculatorInput.value = eval(newStr);
    if (!localStorage.getItem("history-array")) {
      localStorage.setItem("history-array", JSON.stringify([]));
    }

    let arr = JSON.parse(localStorage.getItem("history-array"));
    arr.push([`${calculatorInputVal}`, `${calculatorInput.value}`]);
    localStorage.setItem("history-array", JSON.stringify(arr));
  } catch (err) {
    console.log(err);
    calculatorInput.value = `ERROR`;
  }
}

function opInclude(str, opArr) {
  for (let i of opArr) {
    if (str.includes(i)) return true;
  }
  return false;
}

function signDegToggleFlagFunc() {
  let str = calculatorInput.value;
  if (str === "") return;
  let input = [];
  for (let a of str) {
    input.push(a);
  }
  let opArr = [`+`, `-`, `÷`, `X`];
  if (opInclude(str, opArr)) {
    let i;
    for (i = input.length - 1; i >= 0; i--) {
      if (opInclude(input[i], opArr)) {
        break;
      }
    }
    if (input[i] == `-` && input[i - 1] == `(`) {
      input.splice(i - 1, 2);
      input.pop();
    } else {
      i++;
      input.splice(i, 0, `(`, `-`);
      input.push(`)`);
    }
  } else if (input[0] == `(` && input[1] == `-`) {
    input.splice(0, 2);
    input.splice(input.length - 1, 1);
  } else if (input[0] == `-`) {
    input.splice(0, 1);
  } else {
    input.unshift(`-`);
    input.unshift(`(`);
    input.push(`)`);
  }

  str = ``;
  for (let a of input) {
    str += a;
  }
  calculatorInput.value = str;
}

function handleTrignometryFunction(funcName) {
  if (funcName === "Trignometry") return;
  regex = /(\d+)$/;
  if (regex.test(calculatorInput.value)) {
    calculatorInput.value += `X${funcName}(`;
  } else {
    calculatorInput.value += `${funcName}(`;
  }

  document.getElementsByClassName("trig-func")[0].value = "Trignometry";
}

function handleAdvancedFunction(funcName) {
  if (funcName === "Function") return;
  regex = /(\d+)$/;
  if (regex.test(calculatorInput.value)) {
    calculatorInput.value += `X${funcName}(`;
  } else {
    calculatorInput.value += `${funcName}(`;
  }

  document.getElementsByClassName("advance-func")[0].value = "Function";
}

function degreeRadianChange(ref) {
  ref.textContent = ref.textContent.trim();

  ref.textContent = ref.textContent === "DEG" ? "RAD" : "DEG";
}

function handleFractionToExponential(ref) {
  let newRegex = /(\d+)$/g;
  if (newRegex.test(calculatorInput.value)) {
    regex = /(\d+)\.?0*(\d*)$/g;
    calculatorInput.value = calculatorInput.value.replace(
      regex,
      (match, num1, num2) => {
        console.log(num1, " ", num2);

        if (num1 === "0" && num2 !== "0") {
          return `${num2}X10^-${num2.length}`;
        } else {
          if (num2 === "") {
            let firstDigit = num1[0];
            let remainingDigits = num1.slice(1, num1.length);
            if (+remainingDigits === 0) remainingDigits = "0";
            return `${firstDigit}.${remainingDigits}X10^${num1.length - 1}`;
          } else return `${num1}${num2}X10^-${num2.length}`;
        }
      }
    );
  } else {
    return;
  }
}

function handleMC() {
  localStorage.removeItem("calculationOutput");
}

function handleMR() {
  let val = localStorage.getItem("calculationOutput");
  if (val) calculatorInput.value += val;
}

function handleMplusAndMinus(ref) {
  let previousOutput = localStorage.getItem("calculationOutput");
  let num = eval(resultFuncInitialEvaluation(calculatorInput.value));

  let val =
    ref.className === "plus"
      ? `${+num + +previousOutput}`
      : `${+num - +previousOutput}`;
  localStorage.setItem("calculationOutput", val);
  calculatorInput.value = val;
}

function handleMS() {
  let num = eval(resultFuncInitialEvaluation(calculatorInput.value));
  localStorage.setItem("calculationOutput", num);
}

function handleHistory() {
  document.getElementsByClassName("text-box")[0].style.display = "none";
  document.getElementsByClassName("advanced-operations")[0].style.display =
    "none";
  document.getElementsByClassName("calculator-buttons")[0].style.display =
    "none";

  let closingHistoryButton = document.createElement("img");
  closingHistoryButton.setAttribute(
    "class",
    "imageHW hamburger-menu close-history"
  );
  closingHistoryButton.setAttribute("src", "./images/x.png");
  closingHistoryButton.setAttribute("alt", "closing history section button");
  closingHistoryButton.setAttribute("onclick", "handleClosingHistorySection()");
  document
    .getElementsByClassName("enclosing-calculator")[0]
    .appendChild(closingHistoryButton);

  let newElement = document.createElement("div");
  newElement.setAttribute("class", "history-section");
  document
    .getElementsByClassName("enclosing-calculator")[0]
    .appendChild(newElement);

  showHistoryContent();
}

function handleClosingHistorySection() {
  document.getElementsByClassName("text-box")[0].style.display = "flex";
  document.getElementsByClassName("advanced-operations")[0].style.display =
    "block";
  document.getElementsByClassName("calculator-buttons")[0].style.display =
    "grid";

  document.getElementsByClassName("close-history")[0].remove();
  document.getElementsByClassName("history-section")[0].remove();
}

function showHistoryContent() {
  let newElement = document.getElementsByClassName("history-section")[0];
  newElement.innerHTML = `<div class = "history-title-clear-button">
    <div class = "history-title">History</div>
    <div class = "clear-history-button">
    
    <button onclick = "handleClearHistory()">Clear</button>
    </div>
    </div>`;
  let arr = JSON.parse(localStorage.getItem("history-array"));
  let historyHtmlCode = "";
  for (let i = arr.length - 1; i >= 0; i--) {
    historyHtmlCode += `<div class = "history-data" onclick = "handleClickOnHistoryData(${arr[i][1]})">
        <div>${arr[i][0]} &nbsp;= &nbsp;</div>
        <div>${arr[i][1]} </div>
    </div>`;
  }
  newElement.innerHTML += historyHtmlCode;
}

function handleClearHistory() {
  localStorage.setItem("history-array", JSON.stringify([]));
  showHistoryContent();
}

function handleClickOnHistoryData(value) {
  handleClosingHistorySection();
  regex = /(\d+)$/;
  if (regex.test(calculatorInput.value)) {
    calculatorInput.value += `X`;
    calculatorInput.value += `${value}`;
  } else {
    calculatorInput.value += `${value}`;
  }
}
