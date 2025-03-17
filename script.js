//common elements
const calculatorButtons = document.querySelectorAll(
  `.calculator-buttons > div`
);
const calculatorInput = document.querySelector(`.calculator-input`);
calculatorInput.value = ``;
const removeContentButton = document.querySelector(`.remove-data`);
let regex;

//adding an event listener to each button in calculator
calculatorButtons.forEach((e) => {
  e.addEventListener(`click`, () => {
    if (e.textContent === "=") resultFunc();
    else if (e.textContent === `C`) calculatorInput.value = ``;
    else if (calculatorInput.value === "ERROR") return;
    else if (e.textContent === `|x|`) {
      calculatorInput.value += `|`;
    } else if (e.textContent === `+/-`) {
      signDegToggleFlagFunc();
    } else if (e.textContent == "1/x") {
      regex = /(\d+)$/;

      if (regex.test(calculatorInput.value)) {
        calculatorInput.value = calculatorInput.value.replace(
          regex,
          (match, num) => {
            return `1/${num}`;
          }
        );
      } else {
        calculatorInput.value += "1/";
      }
    } else if (e.textContent == "x2") {
      calculatorInput.value += "^2";
    } else if (e.textContent == "10x") {
      regex = /(\d+)$/;
      if (regex.test(calculatorInput.value)) {
        calculatorInput.value = calculatorInput.value.replace(
          regex,
          (match, num) => {
            return `10^${num}`;
          }
        );
      } else {
        calculatorInput.value += "10^";
      }
    } else if (e.textContent == "xy") {
      calculatorInput.value += "^";
    } else if (e.textContent == "2√x") {
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
    } else if (
      e.textContent !== `=` &&
      e.textContent !== `` &&
      e.className !== "remove-data"
    ) {
      calculatorInput.value += e.textContent;
      if (e.textContent == `ln` || e.textContent == `log`)
        calculatorInput.value += `(`;
    }

    calculatorInput.value = calculatorInput.value.replace(`n!`, `!`);
    calculatorInput.value = calculatorInput.value.replace(`mod`, `%`);
  });
});

removeContentButton.addEventListener(`click`, () => {
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

function replaceAll(newStr) {
  newStr = newStr.replace(`X`, `*`);
  newStr = newStr.replace(`÷`, `/`);
  newStr = newStr.replace("π", `${Math.PI}`);
  newStr = newStr.replace("^", "**");
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
    let newStr = calculatorInput.value;
    if (newStr == ``) return;
    newStr = resultFuncInitialEvaluation(newStr);
    calculatorInput.value = eval(newStr);
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
