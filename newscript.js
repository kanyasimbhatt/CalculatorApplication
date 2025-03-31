import { fact } from "./modularMethods/MathematicalConversionOperations.js";
import { opInclude } from "./modularMethods/BooleanOperation.js";
import {
  replaceAll,
  degreeRadianChange,
} from "./modularMethods/ReplacingStringOperation.js";
import {
  handleMC,
  handleMR,
  handleMS,
  handleMplusAndMinus,
} from "./modularMethods/OperationsRelatedToMemory.js";

import { handleHistory } from "./modularMethods/OperationsRelatedToHistory.js";
class Calculator {
  constructor() {
    this.validKeyboardCharacters = [
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
      ".",
      "(",
      ")",
    ];
    this.calculatorInput = document.querySelector(`.calculator-input`);
    this.secondOperationToggle = 0;
    this.calculatorInput.value = ``;
    this.regex = "";
    this.darkLightFlag = 0;
    this.initializeEventListener();
  }

  //initialized all event listener
  initializeEventListener() {
    document
      .getElementsByClassName("calculator-buttons")[0]
      .addEventListener("click", (event) => {
        this.handleClickOnCalculator(event);
      });

    document
      .getElementsByClassName("remove-data")[0]
      .addEventListener("click", () => {
        this.removeDataFromInput();
      });

    document
      .getElementsByClassName("2nd-button")[0]
      .addEventListener("click", (event) => {
        this.handleSecondSetOfOperations(event);
      });

    document
      .getElementsByClassName("trig-func")[0]
      .addEventListener("change", (event) => {
        this.handleTrignometryFunction(event.target.value);
      });

    document
      .getElementsByClassName("advance-func")[0]
      .addEventListener("change", (event) => {
        this.handleAdvancedFunction(event.target.value);
      });

    document
      .getElementsByClassName("deg-rad-button")[0]
      .addEventListener("click", (event) => {
        degreeRadianChange(event.target);
      });

    document
      .getElementsByClassName("f-e-button")[0]
      .addEventListener("click", () => {
        this.handleFractionToExponential();
      });

    document.getElementById("mc-button").addEventListener("click", () => {
      handleMC.call(this);
    });

    document.getElementById("mr-button").addEventListener("click", () => {
      handleMR.call(this);
    });

    document.querySelectorAll("#M-plus-minus-button").forEach((element) => {
      element.addEventListener("click", (event) => {
        handleMplusAndMinus.call(this, event.target);
      });
    });

    document.getElementById("ms-button").addEventListener("click", () => {
      handleMS.call(this);
    });

    document
      .getElementsByClassName("view-history")[0]
      .addEventListener("click", () => {
        handleHistory.call(this);
      });

    document
      .getElementsByClassName("dark-light-button")[0]
      .addEventListener("click", () => {
        this.handleDarkLightMode();
      });

    document.addEventListener("keyup", (event) => {
      this.handleKeyboardInput(event);
    });
  }

  //added to handle the situation when user clicks on delete button
  removeDataFromInput() {
    let inputVal = this.calculatorInput.value;
    if (inputVal === `ERROR`) {
      this.calculatorInput.value = ``;
    } else if (inputVal != ``) {
      this.calculatorInput.value = inputVal.slice(0, -1);
    }
  }

  //added to event delegate click event for all buttons
  handleClickOnCalculator(event) {
    let e = event.target;
    if (e.classList.value === "calculator-buttons") return;

    let val = e.textContent;

    if (e.className === "remove-data") {
      return;
    }
    val = val.trim(); //it automatically added some white space so had to add it to remove them

    switch (val) {
      case "=":
        this.resultFunc();
        break;

      case "C":
        this.calculatorInput.value = "";
        break;

      case `|x|`:
        this.calculatorInput.value += `|`;
        break;

      case `+/-`:
        this.signDegToggleFlagFunc();
        break;

      case `1/x`:
        this.handleDivisionToOne();
        break;

      case `x2`:
        this.calculatorInput.value += "^2";
        break;

      case `x3`:
        this.calculatorInput.value += `^3`;
        break;

      case "n!":
        this.calculatorInput.value += "!";
        break;

      case `10x`:
        this.handleTenRaiseToX();
        break;

      case "2nd":
        break;

      case `xy`:
        this.calculatorInput.value += "^";
        break;

      case `3√x`:
        this.handleRoot();
        break;

      case `2√x`:
        this.handleRoot();
        break;

      default:
        if (this.calculatorInput.value === "ERROR") return;
        this.calculatorInput.value += val;
        if (val == `ln` || val == `log`) this.calculatorInput.value += `(`;
    }
  }
  //added to handle the operation 1/x
  handleDivisionToOne() {
    this.regex = /(\d+)\.?(\d*)$/g;

    if (this.regex.test(this.calculatorInput.value)) {
      this.calculatorInput.value = this.calculatorInput.value.replace(
        this.regex,
        (match, num1, num2) => {
          if (num2) return `1/${num1}.${num2}`;
          else return `1/${num1}`;
        }
      );
    } else this.calculatorInput.value += `1/`;
  }

  //added to handle operation 10^x
  handleTenRaiseToX() {
    this.regex = /(\d+)\.?(\d*)$/g;
    if (this.regex.test(this.calculatorInput.value)) {
      this.calculatorInput.value = this.calculatorInput.value.replace(
        this.regex,
        (match, num1, num2) => {
          if (num2) return `10^${num1}.${num2}`;
          else return `10^${num1}`;
        }
      );
    } else {
      this.calculatorInput.value += "10^";
    }
  }

  //added to handle square root and cube root operation
  handleRoot() {
    this.regex = /(\d+)$/;

    if (this.regex.test(this.calculatorInput.value)) {
      this.calculatorInput.value = this.calculatorInput.value.replace(
        this.regex,
        (match, num) => {
          return `${num}X√(`;
        }
      );
    } else {
      this.calculatorInput.value += "√(";
    }
  }

  //added as we have to switch the keyboard content from x2 - x3 and square root to cube root
  handleSecondSetOfOperations(e) {
    document
      .getElementsByClassName("2nd-button")[0]
      .classList.toggle("selected");

    if (this.secondOperationToggle === 0) {
      document.getElementsByClassName(
        "square-button"
      )[0].innerHTML = `x<sup>3</sup>`;
      document.getElementsByClassName(
        "square-root-button"
      )[0].innerHTML = `<sup>3</sup>&Sqrt;x`;
      this.secondOperationToggle = 1;
    } else {
      document.getElementsByClassName(
        "square-button"
      )[0].innerHTML = `x<sup>2</sup>`;
      document.getElementsByClassName(
        "square-root-button"
      )[0].innerHTML = `<sup>2</sup>&Sqrt;x`;
      this.secondOperationToggle = 0;
    }
  }

  //common result evaluation required for result operation
  resultFuncInitialEvaluation(newStr) {
    newStr = replaceAll(newStr, this.secondOperationToggle);

    if (this.calculatorInput.value.includes(`!`)) {
      this.regex = /(\d+)!/g;
      newStr = newStr.replace(this.regex, (match, num) => {
        return fact(+num);
      });
    }

    this.regex = /\|([^|]+)\|/;
    newStr = newStr.replace(this.regex, (match, num) => {
      let val = +eval(num);

      if (val < 0) {
        val = val * -1;
      }

      return `${val}`;
    });
    return newStr;
  }

  //added to induce the evaluation using eval function
  resultFunc() {
    try {
      let calculatorInputVal = this.calculatorInput.value;
      if (calculatorInputVal == ``) return;
      let newStr = this.resultFuncInitialEvaluation(calculatorInputVal);

      this.calculatorInput.value = eval(newStr);
      if (!localStorage.getItem("history-array")) {
        localStorage.setItem("history-array", JSON.stringify([]));
      }

      let arr = JSON.parse(localStorage.getItem("history-array"));
      arr.push([`${calculatorInputVal}`, `${this.calculatorInput.value}`]);
      localStorage.setItem("history-array", JSON.stringify(arr));
    } catch (err) {
      console.log(err);
      this.calculatorInput.value = `ERROR`;
    }
  }

  //used to handle the +/- operation
  signDegToggleFlagFunc() {
    let str = this.calculatorInput.value;
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
    this.calculatorInput.value = str;
  }

  //added to handle the input status when a particular trignometry function is clicked on
  handleTrignometryFunction(funcName) {
    if (funcName === "Trignometry") return;
    this.regex = /(\d+)$/;
    if (this.regex.test(this.calculatorInput.value)) {
      this.calculatorInput.value += `X${funcName}(`;
    } else {
      this.calculatorInput.value += `${funcName}(`;
    }

    document.getElementsByClassName("trig-func")[0].value = "Trignometry";
  }

  //added to handle the input status when a particular advanced function is clicked on
  handleAdvancedFunction(funcName) {
    if (funcName === "Function") return;
    this.regex = /(\d+)$/;
    if (this.regex.test(this.calculatorInput.value)) {
      this.calculatorInput.value += `X${funcName}(`;
    } else {
      this.calculatorInput.value += `${funcName}(`;
    }

    document.getElementsByClassName("advance-func")[0].value = "Function";
  }

  //added to handle f-e operation

  handleFractionToExponential() {
    this.regex = /(\d+)\.(\d*)$/g;
    this.calculatorInput.value = this.calculatorInput.value.replace(
      this.regex,
      (match, num1, num2) => {
        console.log(num1, " ", num2);

        if (num1 === "0" && num2 !== "0") {
          return `${num2.replace(/^0+/, "") || "0"}X10^-${num2.length}`;
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
  }

  //added to handle the scenario when user clicks on dark to light mode
  handleDarkLightMode() {
    document
      .getElementsByClassName("dark-light-button")[0]
      .classList.toggle("selected");
    this.calculatorInput.classList.toggle("dark-calculator-input");
    document.body.classList.toggle("dark-body");
    document
      .getElementsByClassName("enclosing-calculator")[0]
      .classList.toggle("dark-enclosing-calculator");
    document
      .getElementsByClassName("dark-light-button")[0]
      .classList.toggle("selected");

    if (this.darkLightFlag === 0) {
      this.darkLightFlag = 1;
      document
        .getElementsByClassName("view-history")[0]
        .setAttribute("src", "./images/history1.png");
      document
        .getElementsByClassName("dark-light-button")[0]
        .setAttribute("src", "./images/brightness-and-contrast1.png");
      document
        .getElementsByClassName("remove-data-icon")[0]
        .setAttribute("src", "./images/delete1.png");
      document
        .getElementsByClassName("trignometry-function-icon")[0]
        .setAttribute("src", "./images/right-triangle1.png");
      document.querySelectorAll(".calculator-buttons > div").forEach((e) => {
        e.style.backgroundColor = "rgb(31, 32, 33)";
      });
      document.querySelectorAll("#calculator-buttons-numbers").forEach((e) => {
        e.style.backgroundColor = "black";
      });

      document
        .querySelectorAll(".trignometry-functions > div > select")
        .forEach((e) => {
          e.style.color = "white";
        });
    } else {
      this.darkLightFlag = 0;
      document
        .getElementsByClassName("view-history")[0]
        .setAttribute("src", "./images/history.png");
      document
        .getElementsByClassName("dark-light-button")[0]
        .setAttribute("src", "./images/brightness-and-contrast.png");
      document
        .getElementsByClassName("remove-data-icon")[0]
        .setAttribute("src", "./images/delete.png");
      document
        .getElementsByClassName("trignometry-function-icon")[0]
        .setAttribute("src", "./images/right-triangle.png");
      document.querySelectorAll(".calculator-buttons > div").forEach((e) => {
        e.style.backgroundColor = "rgb(248, 249, 250)";
      });
      document.querySelectorAll("#calculator-buttons-numbers").forEach((e) => {
        e.style.backgroundColor = "white";
      });
      document
        .querySelectorAll(".trignometry-functions > div > select")
        .forEach((e) => {
          e.style.color = "black";
        });
    }
  }

  //added to induce keyboard input feature
  handleKeyboardInput(event) {
    if (event.key === "Backspace" || event.key === "Delete") {
      this.calculatorInput.value = this.calculatorInput.value.slice(0, -1);
    }
    if (event.key === "=" || event.key === "Enter") {
      this.resultFunc();
    }
    if (this.validKeyboardCharacters.indexOf(event.key) !== -1) {
      this.calculatorInput.value += event.key;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Calculator();
});
