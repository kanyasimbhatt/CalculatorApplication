function handleClosingHistorySection() {
  document.getElementsByClassName("text-box")[0].style.display = "flex";
  document.getElementsByClassName("advanced-operations")[0].style.display =
    "block";
  document.getElementsByClassName("calculator-buttons")[0].style.display =
    "grid";

  document.getElementsByClassName("close-history")[0].remove();
  document.getElementsByClassName("history-section")[0].remove();
}

//added to handle the scenario where user clicks on see history button
export function handleHistory() {
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
  if (this.darkLightFlag === 1) {
    closingHistoryButton.setAttribute("src", "./images/cross.png");
  } else {
    closingHistoryButton.setAttribute("src", "./images/x.png");
  }

  closingHistoryButton.setAttribute("alt", "closing history section button");
  closingHistoryButton.addEventListener("click", () => {
    handleClosingHistorySection();
  });
  document
    .getElementsByClassName("enclosing-calculator")[0]
    .appendChild(closingHistoryButton);

  let newElement = document.createElement("div");
  newElement.setAttribute("class", "history-section");
  document
    .getElementsByClassName("enclosing-calculator")[0]
    .appendChild(newElement);

  showHistoryContent.call(this);
}

//added to show the basic history content in the history page
function showHistoryContent() {
  let newElement = document.getElementsByClassName("history-section")[0];
  newElement.innerHTML = `<div class = "history-title-clear-button">
          <div class = "history-title">History</div>
          <div class = "clear-history-button">
          
          <button class = "clear-history-button">Clear</button>
          </div>
          </div>`;
  let arr = JSON.parse(localStorage.getItem("history-array"));
  let historyHtmlCode = "";
  for (let i = arr.length - 1; i >= 0; i--) {
    historyHtmlCode += `<div class = "history-data" id = "${arr[i][1]}">
              <div>${arr[i][0]} &nbsp;= &nbsp;</div>
              <div>${arr[i][1]} </div>
          </div>`;
  }
  newElement.innerHTML += historyHtmlCode;

  document.querySelectorAll(".history-data").forEach((element) => {
    element.addEventListener("click", (event) => {
      handleClickOnHistoryData.call(this, element.id);
    });
  });

  document
    .getElementsByClassName("clear-history-button")[0]
    .addEventListener("click", () => {
      handleClearHistory();
    });
}

//handle the scenario when user clicks on clear button in the see history page
function handleClearHistory() {
  localStorage.setItem("history-array", JSON.stringify([]));
  showHistoryContent();
}

//added to implement feature -  user clicks on a particular history the data is automatically added to calculator input
function handleClickOnHistoryData(value) {
  handleClosingHistorySection();
  this.regex = /(\d+)$/;
  if (this.regex.test(this.calculatorInput.value)) {
    this.calculatorInput.value += `X${value}`;
  } else {
    this.calculatorInput.value += `${value}`;
  }
}
