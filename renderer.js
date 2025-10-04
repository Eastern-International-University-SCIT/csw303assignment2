const { compute, formatNumber, symbolForOp } = require('./calculator');

// This code runs in the browser window (the renderer process).
// It has access to the DOM.
window.addEventListener('DOMContentLoaded', () => {
  const currentEl = document.getElementById('current');
  const historyEl = document.getElementById('history');
  const keys = document.querySelector('.keys');

  const state = {
    displayValue: '0',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    justEvaluated: false
  };

  function setDisplay(value) {
    currentEl.textContent = value;
  }

  function setHistory(text) {
    historyEl.textContent = text || '';
  }

  function resetAll() {
    state.displayValue = '0';
    state.firstOperand = null;
    state.operator = null;
    state.waitingForSecondOperand = false;
    state.justEvaluated = false;
    setDisplay(state.displayValue);
    setHistory('');
  }

  function inputDigit(digit) {
    if (state.waitingForSecondOperand) {
      state.displayValue = digit;
      state.waitingForSecondOperand = false;
    } else if (state.displayValue === '0' || state.justEvaluated) {
      state.displayValue = digit;
      state.justEvaluated = false;
    } else {
      state.displayValue += digit;
    }
    setDisplay(state.displayValue);
  }

  function inputDecimal() {
    if (state.waitingForSecondOperand || state.justEvaluated) {
      state.displayValue = '0.';
      state.waitingForSecondOperand = false;
      state.justEvaluated = false;
    } else if (!state.displayValue.includes('.')) {
      state.displayValue += '.';
    }
    setDisplay(state.displayValue);
  }

  function handleOperator(nextOp) {
    const inputValue = parseFloat(state.displayValue);

    if (nextOp === '=') {
      if (state.operator && state.firstOperand !== null && !state.waitingForSecondOperand) {
        const result = compute(state.firstOperand, inputValue, state.operator);
        if (result === null) return showError('Cannot divide by 0');
        const formatted = formatNumber(result);
        setHistory(`${formatNumber(state.firstOperand)} ${symbolForOp(state.operator)} ${formatNumber(inputValue)} =`);
        state.displayValue = formatted;
        state.firstOperand = result;
        state.operator = null;
        state.justEvaluated = true;
        setDisplay(formatted);
      }
      return;
    }

    if (state.operator && state.waitingForSecondOperand) {
      state.operator = nextOp;
      setHistory(`${formatNumber(state.firstOperand)} ${symbolForOp(state.operator)}`);
      return;
    }

    if (state.firstOperand === null) {
      state.firstOperand = inputValue;
    } else if (state.operator) {
      const result = compute(state.firstOperand, inputValue, state.operator);
       if (result === null) return showError('Cannot divide by 0');
      state.firstOperand = result;
      state.displayValue = formatNumber(result);
      setDisplay(state.displayValue);
    }

    state.operator = nextOp;
    state.waitingForSecondOperand = true;
    state.justEvaluated = false;
    setHistory(`${formatNumber(state.firstOperand)} ${symbolForOp(state.operator)}`);
  }

   function showError(msg) {
    setHistory(msg);
    state.displayValue = 'Error';
    setDisplay(state.displayValue);
    setTimeout(() => resetAll(), 900);
    return null;
  }


  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button.key');
    if (!btn) return;
    if (btn.dataset.digit) return inputDigit(btn.dataset.digit);
    if (btn.dataset.action === 'decimal') return inputDecimal();
    if (btn.dataset.action === 'clear') return resetAll();
    if (btn.dataset.op) return handleOperator(btn.dataset.op);
  });

  resetAll();
});
