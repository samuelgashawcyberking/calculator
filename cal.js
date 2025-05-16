document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    let currentInput = '';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;

    // Number buttons
    document.querySelectorAll('input[type="button"]').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.value;
            
            if (value >= '0' && value <= '9' || value === '00' || value === '.') {
                appendNumber(value);
            } else if (value === 'AC') {
                clearAll();
            } else if (value === 'DE') {
                deleteLast();
            } else if (value === '=') {
                calculate();
            } else {
                setOperation(value);
            }
        });
    });

    function appendNumber(number) {
        if (display.value === '0' || resetScreen) {
            display.value = '';
            resetScreen = false;
        }
        
        if (number === '.' && display.value.includes('.')) return;
        if (number === '00' && display.value === '') return;
        
        display.value += number;
    }

    function clearAll() {
        display.value = '0';
        currentInput = '';
        previousInput = '';
        operation = null;
    }

    function deleteLast() {
        if (display.value.length === 1) {
            display.value = '0';
        } else {
            display.value = display.value.slice(0, -1);
        }
    }

    function setOperation(op) {
        if (operation !== null) calculate();
        previousInput = display.value;
        operation = op;
        resetScreen = true;
    }

    function calculate() {
        if (operation === null || resetScreen) return;
        if (operation === '/' && display.value === '0') {
            display.value = 'Error';
            setTimeout(clearAll, 1000);
            return;
        }
        
        currentInput = display.value;
        display.value = operate(operation, previousInput, currentInput);
        operation = null;
    }

    function operate(op, a, b) {
        a = parseFloat(a);
        b = parseFloat(b);
        
        switch(op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            default: return b;
        }
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
        else if (e.key === '.') appendNumber('.');
        else if (e.key === 'Escape') clearAll();
        else if (e.key === 'Backspace') deleteLast();
        else if (e.key === 'Enter') calculate();
        else if (['+', '-', '*', '/'].includes(e.key)) setOperation(e.key);
    });
});