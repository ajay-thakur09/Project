const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';

function updateDisplay() {
  display.textContent = expression || '0';
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

function appendValue(value) {
  if (value === '.' && expression.endsWith('.')) {
    return;
  }

  if (['+', '-', '*', '/'].includes(value)) {
    const last = expression.slice(-1);
    if (!expression || ['+', '-', '*', '/'].includes(last)) {
      if (value === '-' && (!expression || isOperator(last))) {
        expression += value;
      } else if (!['-', '+'].includes(value) || expression === '') {
        expression += value;
      }
      updateDisplay();
      return;
    }
  }

  expression += value;
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function clearAll() {
  expression = '';
  updateDisplay();
}

function sanitizeExpression(input) {
  return input.replace(/\s+/g, '');
}

function evaluateExpression() {
  const sanitized = sanitizeExpression(expression);
  if (!sanitized) {
    return '0';
  }

  if (!/^[0-9+\-*/().]+$/.test(sanitized)) {
    return 'Error';
  }

  try {
    const result = Function(`"use strict"; return (${sanitized});`)();

    if (!Number.isFinite(result)) {
      return 'Error';
    }

    return Number.isInteger(result) ? String(result) : Number(result.toFixed(10)).toString();
  } catch (error) {
    return 'Error';
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { action, value } = button.dataset;

    if (action === 'clear') {
      clearAll();
      return;
    }

    if (action === 'back') {
      backspace();
      return;
    }

    if (action === 'equals') {
      expression = evaluateExpression();
      if (expression === 'Error') {
        expression = '';
      }
      updateDisplay();
      return;
    }

    if (value) {
      appendValue(value);
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
    event.preventDefault();
    appendValue(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    expression = evaluateExpression();
    if (expression === 'Error') {
      expression = '';
    }
    updateDisplay();
    return;
  }

  if (key === 'Backspace') {
    event.preventDefault();
    backspace();
    return;
  }

  if (key === 'Escape') {
    event.preventDefault();
    clearAll();
  }
});

updateDisplay();
