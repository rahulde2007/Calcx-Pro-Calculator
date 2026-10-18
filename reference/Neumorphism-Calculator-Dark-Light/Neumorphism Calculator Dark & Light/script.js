const buttons = document.querySelectorAll(".buttons button");
const valueDisplay = document.getElementById("value");
const historyDisplay = document.getElementById("history");
const toggleTheme = document.getElementById("checkbox");
const body = document.querySelector("body");
const clearBtn = document.getElementById("clear");
const themeLabel = document.getElementById("theme-label");

let currentInput = "";
let previousInput = "";
let operation = null;
let shouldResetScreen = false;

// Theme toggle
toggleTheme.addEventListener("change", (e) => {
  const calcBody = document.querySelector(".calculator");
  const displayArea = document.querySelector(".display");
  
  // Remove animation classes to reset them
  calcBody.classList.remove("animate-switch");
  displayArea.classList.remove("animate-flare");
  
  // Trigger a browser reflow so the animation restarts
  void calcBody.offsetWidth;
  
  // Re-add animation classes
  calcBody.classList.add("animate-switch");
  displayArea.classList.add("animate-flare");

  if (e.target.checked) {
    body.classList.add("dark");
    themeLabel.innerText = "PRO MODE";
  } else {
    body.classList.remove("dark");
    themeLabel.innerText = "NORMAL MODE";
  }
});

function updateDisplay() {
  valueDisplay.innerText = currentInput === "" ? "0" : formatNumber(currentInput);
  
  if (operation != null) {
    let opSymbol = operation;
    if(opSymbol === '*') opSymbol = '×';
    if(opSymbol === '/') opSymbol = '÷';
    if(opSymbol === '-') opSymbol = '−';
    historyDisplay.innerText = `${formatNumber(previousInput)} ${opSymbol}`;
  } else {
    historyDisplay.innerText = "";
  }
  
  // Toggle AC to C
  if (currentInput !== "" || previousInput !== "") {
    clearBtn.innerText = "C";
  } else {
    clearBtn.innerText = "AC";
  }

  valueDisplay.scrollLeft = valueDisplay.scrollWidth;
}

// Add commas for large numbers
function formatNumber(num) {
  if (num === "") return "";
  if (num === "-") return "-";
  if (num === "Error") return "Error";
  
  let parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function handleInput(action) {
  if (action === "clear" || action === "AC" || action === "C") {
    currentInput = "";
    previousInput = "";
    operation = null;
  } else if (action === "⌫" || action === "Backspace") {
    currentInput = currentInput.toString().slice(0, -1);
  } else if (action === "+/-") {
    if (currentInput !== "") {
      currentInput = (parseFloat(currentInput) * -1).toString();
    }
  } else if (action === "%") {
    if (currentInput !== "") {
      currentInput = (parseFloat(currentInput) / 100).toString();
    }
  } else if (["+", "-", "*", "/"].includes(action)) {
    if (currentInput === "" && previousInput !== "") {
      operation = action;
    } else if (currentInput !== "") {
      if (previousInput !== "") {
        currentInput = evaluate(previousInput, currentInput, operation).toString();
      }
      operation = action;
      previousInput = currentInput;
      shouldResetScreen = true;
    }
  } else if (action === "=") {
    if (currentInput !== "" && previousInput !== "") {
      currentInput = evaluate(previousInput, currentInput, operation).toString();
      operation = null;
      previousInput = "";
      shouldResetScreen = true;
    }
  } else {
    // Numbers and dot
    if (shouldResetScreen) {
      currentInput = "";
      shouldResetScreen = false;
    }
    if (action === "." && currentInput.includes(".")) return;
    if (currentInput.replace(".", "").length >= 10) return; // limit digit count
    
    // Prevent multiple leading zeros
    if (currentInput === "0" && action !== ".") {
      currentInput = action;
    } else {
      currentInput += action;
    }
  }
  
  updateDisplay();
}

function evaluate(a, b, op) {
  let num1 = parseFloat(a);
  let num2 = parseFloat(b);
  if (isNaN(num1) || isNaN(num2)) return "";
  
  let res = 0;
  switch (op) {
    case "+": res = num1 + num2; break;
    case "-": res = num1 - num2; break;
    case "*": res = num1 * num2; break;
    case "/": res = num2 !== 0 ? num1 / num2 : "Error"; break;
  }
  
  if (res !== "Error") {
    res = parseFloat(res.toFixed(10)); // prevent floating point weirdness
  }
  return res;
}

// Click events
buttons.forEach(btn => {
  btn.addEventListener("click", function () {
    let action = this.getAttribute("data-action") || this.innerText;
    handleInput(action);
  });
});

// Keyboard Mapping
const keyMap = {
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '.': '.', '+': '+', '-': '-', '*': '*', '/': '/',
  'Enter': '=', '=': '=',
  'Backspace': 'Backspace', 'Escape': 'clear',
  '%': '%'
};

document.addEventListener("keydown", (e) => {
  let key = e.key;
  if (keyMap[key]) {
    e.preventDefault();
    let action = keyMap[key];
    
    buttons.forEach(btn => {
      let btnAction = btn.getAttribute("data-action") || btn.innerText;
      if (btnAction === '×') btnAction = '*';
      if (btnAction === '÷') btnAction = '/';
      if (btnAction === '−') btnAction = '-';
      if (btnAction === 'AC' || btnAction === 'C') btnAction = 'clear';

      if (btnAction === action || (action === '=' && btnAction === '=')) {
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 150);
      }
    });

    handleInput(action);
  }
});