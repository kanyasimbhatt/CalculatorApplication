const calculatorButtons = document.querySelectorAll(
  `.calculator-buttons > div`
);
const calculatorInput = document.querySelector(`.calculator-input`);
calculatorInput.value = ``;
const removeContentButton = document.querySelector(`.remove-data`);
const resultButton = document.querySelector(`#calculator-buttons-result`);
const signToggleButton = document.querySelector(`.toggle-sign`);
let regex;

calculatorButtons.forEach((e) => {
  e.addEventListener(`click`, () => {
    if (calculatorInput.value === "ERROR") return;
    else if (e.textContent === `C`) calculatorInput.value = ``;
    else if (e.textContent === `|x|`) {
      calculatorInput.value += `|`;
    } else if (e.textContent === `+/-`) {
      console.log(`dfsdfsd`);
      signToggleFunc();
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
    } else if (e.textContent !== `=` && e.textContent !== ``) {
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

function replaceAll(newStr) {
  newStr = newStr.replace(`X`, `*`);
  newStr = newStr.replace(`÷`, `/`);
  newStr = newStr.replace("π", `${Math.PI}`);
  newStr = newStr.replace("^", "**");
  newStr = newStr.replace("√", "Math.sqrt");
  newStr = newStr.replace("cosec", "1/sin");
  newStr = newStr.replace("sec", "1/cos");
  newStr = newStr.replace("cot", "1/tan");
  newStr = newStr.replace("sin", "Math.sin");
  newStr = newStr.replace("cos", "Math.cos");
  newStr = newStr.replace("tan", "Math.tan");

  newStr = newStr.replace(`exp`, `e`);
  newStr = newStr.replace(`log(`, `Math.log10(`);
  newStr = newStr.replace(`ln(`, `Math.log(`);
  newStr = newStr.replace(`(e)`, `(${Math.E})`);
  newStr = newStr.replace(`(e`, `(${Math.E}*`);
  newStr = newStr.replace(`e)`, `*${Math.E})`);
  newStr = newStr.replace("ceil", "Math.ceil");
  newStr = newStr.replace("floor", "Math.floor");
  console.log(newStr);

  return newStr;
}

resultButton.addEventListener(`click`, () => {
  try {
    let newStr = calculatorInput.value;
    if (newStr == ``) return;
    newStr = replaceAll(newStr);
    if (newStr.includes(`e`)) {
      if (newStr.length !== 1) {
        if (newStr[newStr.length - 1] == `e`) {
          newStr = newStr.replace(`e`, `*${Math.E}`);
        } else if (newStr[0] == `e`) {
          newStr = newStr.replace(`e`, `${Math.E}*`);
        } else {
          newStr = newStr.replace(`e`, `*${Math.E}*`);
        }
      } else {
        newStr = newStr.replace(`e`, `${Math.E}`);
      }
    }

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

    calculatorInput.value = eval(newStr);
  } catch (err) {
    calculatorInput.value = `ERROR`;
  }
});

function opInclude(str, opArr) {
  for (let i of opArr) {
    if (str.includes(i)) return true;
  }
  return false;
}

function signToggleFunc() {
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
        console.log(input[i], ` `, i);
        break;
      }
    }
    if (input[i] == `-` && input[i - 1] == `(`) {
      console.log(`hellooo`);
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
