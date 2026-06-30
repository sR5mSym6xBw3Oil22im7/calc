    (() => {
      const expressionEl = document.getElementById('expression');
      const resultEl = document.getElementById('result');
      const keys = document.querySelector('.keys');
      const themeSelectEl = document.getElementById('themeSelect');
      const meteorLayerEl = document.getElementById('meteorLayer');

      function renderMeteors(theme) {
        meteorLayerEl.textContent = '';
        document.body.classList.toggle('meteor-active', Boolean(theme.meteor));
        if (!theme.meteor) {
          return;
        }

        const count = theme.meteorCount || 5;
        for (let index = 0; index < count; index += 1) {
          const meteor = document.createElement('span');
          meteor.className = 'meteor';
          meteor.style.setProperty('--top', `${Math.random() * 100}%`);
          meteor.style.setProperty('--left', `${-20 + Math.random() * 140}%`);
          meteor.style.setProperty('--len', `${160 + Math.random() * 220}px`);
          meteor.style.setProperty('--dur', `${2.1 + Math.random() * 2.8}s`);
          meteor.style.setProperty('--delay', `${Math.random() * 3.8}s`);
          meteor.style.setProperty('--angle', `${-12 - Math.random() * 28}deg`);
          meteor.style.setProperty('--meteor-glow', theme.meteorGlow || 'rgba(255,255,255,0.85)');
          meteorLayerEl.appendChild(meteor);
        }
      }

      const themes = [
        {
          name: 'No.1 Stylish',
          pageBg1: '#0f1115',
          pageBg2: '#171b22',
          pageGlow1: 'rgba(55, 167, 255, 0.12)',
          pageGlow2: 'rgba(232, 177, 90, 0.09)',
          panel: 'rgba(29, 33, 42, 0.96)',
          panel2: 'rgba(20, 23, 30, 0.96)',
          displayBg: 'linear-gradient(180deg, rgba(10, 12, 16, 0.9), rgba(22, 25, 32, 0.96))',
          text: '#f2f4f8',
          muted: '#9ca3af',
          border: 'rgba(255, 255, 255, 0.08)',
          shadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
          digit: 'linear-gradient(180deg, #2b303c 0%, #232833 100%)',
          digitHover: 'linear-gradient(180deg, #353c4a 0%, #2f3642 100%)',
          operator: 'linear-gradient(180deg, #e8b15a 0%, #d8892b 100%)',
          operatorHover: 'linear-gradient(180deg, #f2be76 0%, #e1973b 100%)',
          operatorText: '#171208',
          equal: 'linear-gradient(180deg, #37a7ff 0%, #1778ff 100%)',
          equalHover: 'linear-gradient(180deg, #55b4ff 0%, #2c8cff 100%)',
          equalText: '#ffffff',
          historyBg: 'rgba(255, 255, 255, 0.03)',
          historyItemBg: 'rgba(255, 255, 255, 0.04)',
          historyItemBorder: 'rgba(255, 255, 255, 0.05)',
          meteor: true,
          meteorGlow: 'rgba(127, 198, 255, 0.95)',
          meteorCount: 14
        },
        {
          name: 'No.2 Minimal',
          pageBg1: '#f8f8f6',
          pageBg2: '#e7e7e4',
          pageGlow1: 'rgba(95, 110, 140, 0.12)',
          pageGlow2: 'rgba(74, 160, 120, 0.08)',
          panel: 'rgba(255, 255, 255, 0.95)',
          panel2: 'rgba(243, 244, 246, 0.98)',
          displayBg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(242, 243, 246, 0.98))',
          text: '#1f2937',
          muted: '#667085',
          border: 'rgba(31, 41, 55, 0.1)',
          shadow: '0 18px 44px rgba(31, 41, 55, 0.14)',
          digit: 'linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)',
          digitHover: 'linear-gradient(180deg, #e8eaef 0%, #dbe0e8 100%)',
          operator: 'linear-gradient(180deg, #20345b 0%, #13213f 100%)',
          operatorHover: 'linear-gradient(180deg, #2d4a7f 0%, #1d335d 100%)',
          operatorText: '#f8fafc',
          equal: 'linear-gradient(180deg, #31b67a 0%, #18885a 100%)',
          equalHover: 'linear-gradient(180deg, #49c58a 0%, #229a67 100%)',
          equalText: '#ffffff',
          historyBg: 'rgba(17, 24, 39, 0.04)',
          historyItemBg: 'rgba(255, 255, 255, 0.8)',
          historyItemBorder: 'rgba(31, 41, 55, 0.08)',
          meteor: false
        },
        {
          name: 'No.3 Future',
          pageBg1: '#060816',
          pageBg2: '#10172a',
          pageGlow1: 'rgba(0, 229, 255, 0.12)',
          pageGlow2: 'rgba(168, 85, 247, 0.1)',
          panel: 'rgba(10, 15, 28, 0.96)',
          panel2: 'rgba(17, 24, 39, 0.96)',
          displayBg: 'linear-gradient(180deg, rgba(5, 9, 20, 0.94), rgba(13, 19, 34, 0.98))',
          text: '#e5f4ff',
          muted: '#8ea3b8',
          border: 'rgba(125, 211, 252, 0.16)',
          shadow: '0 24px 56px rgba(0, 0, 0, 0.5)',
          digit: 'linear-gradient(180deg, #172033 0%, #111827 100%)',
          digitHover: 'linear-gradient(180deg, #22304b 0%, #162233 100%)',
          operator: 'linear-gradient(180deg, #22d3ee 0%, #0891b2 100%)',
          operatorHover: 'linear-gradient(180deg, #67e8f9 0%, #0e7490 100%)',
          operatorText: '#03111c',
          equal: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)',
          equalHover: 'linear-gradient(180deg, #c084fc 0%, #8b5cf6 100%)',
          equalText: '#ffffff',
          historyBg: 'rgba(255, 255, 255, 0.03)',
          historyItemBg: 'rgba(255, 255, 255, 0.04)',
          historyItemBorder: 'rgba(125, 211, 252, 0.12)',
          meteor: true,
          meteorGlow: 'rgba(0, 255, 255, 0.95)',
          meteorCount: 16
        },
        {
          name: 'No.4 Cafe',
          pageBg1: '#f6ede1',
          pageBg2: '#dbc7aa',
          pageGlow1: 'rgba(196, 137, 94, 0.14)',
          pageGlow2: 'rgba(62, 104, 72, 0.1)',
          panel: 'rgba(250, 240, 226, 0.96)',
          panel2: 'rgba(238, 224, 205, 0.98)',
          displayBg: 'linear-gradient(180deg, rgba(255, 248, 239, 0.98), rgba(244, 230, 208, 0.98))',
          text: '#3f2f23',
          muted: '#7b6656',
          border: 'rgba(112, 82, 58, 0.12)',
          shadow: '0 20px 46px rgba(112, 82, 58, 0.18)',
          digit: 'linear-gradient(180deg, #e8dccd 0%, #d9c5ad 100%)',
          digitHover: 'linear-gradient(180deg, #dcc9b0 0%, #ccb595 100%)',
          operator: 'linear-gradient(180deg, #c98a58 0%, #a96b38 100%)',
          operatorHover: 'linear-gradient(180deg, #d9a06f 0%, #ba7c47 100%)',
          operatorText: '#fff8f0',
          equal: 'linear-gradient(180deg, #2f6d45 0%, #1f4f34 100%)',
          equalHover: 'linear-gradient(180deg, #3a8252 0%, #286143 100%)',
          equalText: '#ffffff',
          historyBg: 'rgba(255, 255, 255, 0.36)',
          historyItemBg: 'rgba(255, 250, 244, 0.9)',
          historyItemBorder: 'rgba(112, 82, 58, 0.1)',
          meteor: false
        },
        {
          name: 'No.5 Pop',
          pageBg1: '#fdfcff',
          pageBg2: '#f1f3ff',
          pageGlow1: 'rgba(255, 179, 71, 0.12)',
          pageGlow2: 'rgba(255, 105, 180, 0.1)',
          panel: 'rgba(255, 255, 255, 0.96)',
          panel2: 'rgba(245, 246, 255, 0.98)',
          displayBg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(247, 248, 255, 0.98))',
          text: '#2b2436',
          muted: '#786b89',
          border: 'rgba(130, 117, 152, 0.12)',
          shadow: '0 18px 42px rgba(130, 117, 152, 0.16)',
          digit: 'linear-gradient(180deg, #f2eefe 0%, #e8e2ff 100%)',
          digitHover: 'linear-gradient(180deg, #e8e2ff 0%, #ddd6fe 100%)',
          operator: 'linear-gradient(180deg, #ffb870 0%, #ff8f4a 100%)',
          operatorHover: 'linear-gradient(180deg, #ffc78f 0%, #ff9e61 100%)',
          operatorText: '#2d1a08',
          equal: 'linear-gradient(180deg, #ff6fa8 0%, #f43f8a 100%)',
          equalHover: 'linear-gradient(180deg, #ff8abc 0%, #ff5f9e 100%)',
          equalText: '#ffffff',
          historyBg: 'rgba(124, 58, 237, 0.05)',
          historyItemBg: 'rgba(255, 255, 255, 0.92)',
          historyItemBorder: 'rgba(130, 117, 152, 0.1)',
          meteor: false
        },
        {
          name: 'No.6 Cool',
          pageBg1: '#edf4f8',
          pageBg2: '#cfd9e3',
          pageGlow1: 'rgba(56, 189, 248, 0.14)',
          pageGlow2: 'rgba(34, 197, 94, 0.08)',
          panel: 'rgba(246, 250, 252, 0.96)',
          panel2: 'rgba(228, 236, 243, 0.98)',
          displayBg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(240, 246, 250, 0.98))',
          text: '#22303c',
          muted: '#657684',
          border: 'rgba(76, 99, 120, 0.12)',
          shadow: '0 18px 42px rgba(52, 68, 82, 0.16)',
          digit: 'linear-gradient(180deg, #e7eef4 0%, #d5e1ea 100%)',
          digitHover: 'linear-gradient(180deg, #dce6ef 0%, #c7d5e1 100%)',
          operator: 'linear-gradient(180deg, #7cc6ff 0%, #4aa7ea 100%)',
          operatorHover: 'linear-gradient(180deg, #98d4ff 0%, #61b6f0 100%)',
          operatorText: '#0d2230',
          equal: 'linear-gradient(180deg, #a6e22e 0%, #77c918 100%)',
          equalHover: 'linear-gradient(180deg, #b9ef4f 0%, #8ad320 100%)',
          equalText: '#13210a',
          historyBg: 'rgba(255, 255, 255, 0.42)',
          historyItemBg: 'rgba(255, 255, 255, 0.92)',
          historyItemBorder: 'rgba(76, 99, 120, 0.08)',
          meteor: false
        },
        {
          name: 'No.7 Luxury',
          pageBg1: '#2b0f17',
          pageBg2: '#12070c',
          pageGlow1: 'rgba(245, 158, 11, 0.12)',
          pageGlow2: 'rgba(244, 63, 94, 0.1)',
          panel: 'rgba(44, 19, 27, 0.96)',
          panel2: 'rgba(21, 10, 16, 0.98)',
          displayBg: 'linear-gradient(180deg, rgba(59, 25, 35, 0.96), rgba(28, 13, 19, 0.98))',
          text: '#fff2f4',
          muted: '#c5aab0',
          border: 'rgba(245, 158, 11, 0.12)',
          shadow: '0 24px 56px rgba(0, 0, 0, 0.48)',
          digit: 'linear-gradient(180deg, #4a2a32 0%, #331b21 100%)',
          digitHover: 'linear-gradient(180deg, #5e3440 0%, #42232a 100%)',
          operator: 'linear-gradient(180deg, #f4d27a 0%, #c9a24c 100%)',
          operatorHover: 'linear-gradient(180deg, #fde08c 0%, #d4b15d 100%)',
          operatorText: '#2c1b05',
          equal: 'linear-gradient(180deg, #d9465f 0%, #a61d3a 100%)',
          equalHover: 'linear-gradient(180deg, #f05f78 0%, #b92947 100%)',
          equalText: '#fff7f8',
          historyBg: 'rgba(255, 255, 255, 0.04)',
          historyItemBg: 'rgba(255, 255, 255, 0.05)',
          historyItemBorder: 'rgba(245, 158, 11, 0.12)',
          meteor: false
        },
        {
          name: 'No.8 Natural',
          pageBg1: '#f6f1e8',
          pageBg2: '#e4d7c3',
          pageGlow1: 'rgba(132, 145, 96, 0.12)',
          pageGlow2: 'rgba(188, 108, 61, 0.08)',
          panel: 'rgba(251, 246, 237, 0.96)',
          panel2: 'rgba(239, 231, 218, 0.98)',
          displayBg: 'linear-gradient(180deg, rgba(255, 251, 245, 0.98), rgba(245, 238, 227, 0.98))',
          text: '#3e3427',
          muted: '#7c6e60',
          border: 'rgba(126, 103, 77, 0.12)',
          shadow: '0 20px 46px rgba(126, 103, 77, 0.16)',
          digit: 'linear-gradient(180deg, #efe7da 0%, #ddd2bf 100%)',
          digitHover: 'linear-gradient(180deg, #e4dac9 0%, #d0c1aa 100%)',
          operator: 'linear-gradient(180deg, #7d8b53 0%, #5f6d3a 100%)',
          operatorHover: 'linear-gradient(180deg, #91a365 0%, #728147 100%)',
          operatorText: '#f9f6ef',
          equal: 'linear-gradient(180deg, #c8794f 0%, #a85a32 100%)',
          equalHover: 'linear-gradient(180deg, #da8b60 0%, #ba6a40 100%)',
          equalText: '#fff8f1',
          historyBg: 'rgba(255, 255, 255, 0.42)',
          historyItemBg: 'rgba(255, 252, 247, 0.94)',
          historyItemBorder: 'rgba(126, 103, 77, 0.1)',
          meteor: false
        },
        {
          name: 'No.9 Gaming',
          pageBg1: '#050608',
          pageBg2: '#0d1217',
          pageGlow1: 'rgba(34, 197, 94, 0.16)',
          pageGlow2: 'rgba(236, 72, 153, 0.12)',
          panel: 'rgba(12, 15, 18, 0.96)',
          panel2: 'rgba(17, 21, 26, 0.98)',
          displayBg: 'linear-gradient(180deg, rgba(7, 10, 14, 0.96), rgba(15, 18, 24, 0.98))',
          text: '#e7f7ea',
          muted: '#96a6a0',
          border: 'rgba(34, 197, 94, 0.14)',
          shadow: '0 24px 58px rgba(0, 0, 0, 0.5)',
          digit: 'linear-gradient(180deg, #161b21 0%, #0e1217 100%)',
          digitHover: 'linear-gradient(180deg, #232a33 0%, #151b22 100%)',
          operator: 'linear-gradient(180deg, #00e676 0%, #00b85a 100%)',
          operatorHover: 'linear-gradient(180deg, #2af08a 0%, #18c66a 100%)',
          operatorText: '#04110a',
          equal: 'linear-gradient(180deg, #ff4fd8 0%, #d61cff 100%)',
          equalHover: 'linear-gradient(180deg, #ff78e0 0%, #e24dff 100%)',
          equalText: '#fff7ff',
          historyBg: 'rgba(255, 255, 255, 0.03)',
          historyItemBg: 'rgba(255, 255, 255, 0.04)',
          historyItemBorder: 'rgba(34, 197, 94, 0.12)',
          meteor: true,
          meteorGlow: 'rgba(57, 255, 20, 0.95)',
          meteorCount: 18
        },
        {
          name: 'No.10 Modern',
          pageBg1: '#1a1c1f',
          pageBg2: '#ece8df',
          pageGlow1: 'rgba(120, 119, 198, 0.12)',
          pageGlow2: 'rgba(251, 191, 36, 0.1)',
          panel: 'rgba(245, 242, 236, 0.96)',
          panel2: 'rgba(228, 223, 214, 0.98)',
          displayBg: 'linear-gradient(180deg, rgba(251, 248, 241, 0.98), rgba(238, 233, 225, 0.98))',
          text: '#2d3138',
          muted: '#6d6b67',
          border: 'rgba(77, 76, 72, 0.12)',
          shadow: '0 18px 42px rgba(34, 34, 34, 0.16)',
          digit: 'linear-gradient(180deg, #e9e5dd 0%, #d8d1c5 100%)',
          digitHover: 'linear-gradient(180deg, #ddd7ca 0%, #ccc3b4 100%)',
          operator: 'linear-gradient(180deg, #8a6fa8 0%, #654d84 100%)',
          operatorHover: 'linear-gradient(180deg, #9b83ba 0%, #765c95 100%)',
          operatorText: '#fffafc',
          equal: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
          equalHover: 'linear-gradient(180deg, #5b94fb 0%, #305fe0 100%)',
          equalText: '#ffffff',
          historyBg: 'rgba(255, 255, 255, 0.42)',
          historyItemBg: 'rgba(255, 251, 244, 0.94)',
          historyItemBorder: 'rgba(77, 76, 72, 0.1)',
          meteor: false
        }
      ];

      function applyTheme(theme, themeIndex) {
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--page-bg-1', theme.pageBg1);
        rootStyle.setProperty('--page-bg-2', theme.pageBg2);
        rootStyle.setProperty('--page-glow-1', theme.pageGlow1);
        rootStyle.setProperty('--page-glow-2', theme.pageGlow2);
        rootStyle.setProperty('--panel', theme.panel);
        rootStyle.setProperty('--panel-2', theme.panel2);
        rootStyle.setProperty('--display-bg', theme.displayBg);
        rootStyle.setProperty('--text', theme.text);
        rootStyle.setProperty('--muted', theme.muted);
        rootStyle.setProperty('--border', theme.border);
        rootStyle.setProperty('--shadow', theme.shadow);
        rootStyle.setProperty('--digit', theme.digit);
        rootStyle.setProperty('--digit-hover', theme.digitHover);
        rootStyle.setProperty('--operator', theme.operator);
        rootStyle.setProperty('--operator-hover', theme.operatorHover);
        rootStyle.setProperty('--operator-text', theme.operatorText);
        rootStyle.setProperty('--equal', theme.equal);
        rootStyle.setProperty('--equal-hover', theme.equalHover);
        rootStyle.setProperty('--equal-text', theme.equalText);
        rootStyle.setProperty('--history-bg', theme.historyBg);
        rootStyle.setProperty('--history-item-bg', theme.historyItemBg);
        rootStyle.setProperty('--history-item-border', theme.historyItemBorder);
        rootStyle.setProperty('--meteor-glow', theme.meteorGlow || 'rgba(255,255,255,0.85)');
        themeSelectEl.value = String(themeIndex);
        renderMeteors(theme);
      }

      function applyThemeByIndex(index) {
        const safeIndex = ((index % themes.length) + themes.length) % themes.length;
        applyTheme(themes[safeIndex], safeIndex);
      }

      applyThemeByIndex(Math.floor(Math.random() * themes.length));

      themeSelectEl.addEventListener('change', () => {
        applyThemeByIndex(Number(themeSelectEl.value));
      });

      const state = {
        currentInput: '0',
        firstOperand: null,
        operator: null,
        waitingForSecondOperand: false,
        lastExpression: ''
      };

      function updateDisplay() {
        if (state.lastExpression && state.firstOperand === null && state.operator === null && !state.waitingForSecondOperand) {
          expressionEl.textContent = state.lastExpression;
        } else {
          const expressionParts = [];
          if (state.firstOperand !== null) {
            expressionParts.push(formatNumber(state.firstOperand));
          }
          if (state.operator) {
            expressionParts.push(state.operator);
          }
          if (state.firstOperand === null && state.operator === null && state.currentInput !== '0') {
            expressionParts.push(state.currentInput);
          }
          expressionEl.textContent = expressionParts.join(' ');
        }
        resultEl.textContent = state.currentInput;
      }

      function formatNumber(value) {
        if (value === null || value === undefined || value === '') return '0';
        const num = Number(value);
        if (Number.isFinite(num)) {
          return String(num);
        }
        return String(value);
      }

      function appendDigit(digit) {
        if (state.currentInput === 'Error') {
          clearAll();
        }
        if (state.lastExpression && state.firstOperand === null && state.operator === null && !state.waitingForSecondOperand) {
          state.lastExpression = '';
          state.currentInput = '0';
        }
        if (state.waitingForSecondOperand) {
          state.currentInput = digit;
          state.waitingForSecondOperand = false;
          resultEl.textContent = state.currentInput;
          return;
        }

        if (state.currentInput === '0') {
          state.currentInput = digit;
        } else {
          state.currentInput += digit;
        }
      }

      function appendDecimal() {
        if (state.currentInput === 'Error') {
          clearAll();
        }
        if (state.lastExpression && state.firstOperand === null && state.operator === null && !state.waitingForSecondOperand) {
          state.lastExpression = '';
          state.currentInput = '0';
        }
        if (state.waitingForSecondOperand) {
          state.currentInput = '0.';
          state.waitingForSecondOperand = false;
          return;
        }
        if (!state.currentInput.includes('.')) {
          state.currentInput += '.';
        }
      }

      function calculate(first, operator, second) {
        const a = Number(first);
        const b = Number(second);

        if (!Number.isFinite(a) || !Number.isFinite(b)) {
          return 0;
        }

        switch (operator) {
          case '+':
            return a + b;
          case '−':
            return a - b;
          case '×':
            return a * b;
          case '÷':
            return b === 0 ? 'Error' : a / b;
          default:
            return b;
        }
      }

      function chooseOperator(nextOperator) {
        if (state.currentInput === 'Error') {
          return;
        }
        if (state.lastExpression && state.firstOperand === null && state.operator === null && !state.waitingForSecondOperand) {
          state.lastExpression = '';
        }
        if (state.firstOperand === null) {
          state.firstOperand = state.currentInput;
        } else if (state.operator && !state.waitingForSecondOperand) {
          const result = calculate(state.firstOperand, state.operator, state.currentInput);
          if (result === 'Error') {
            commitError();
            return;
          }
          state.currentInput = trimResult(result);
          state.firstOperand = state.currentInput;
        }

        state.operator = nextOperator;
        state.waitingForSecondOperand = true;
      }

      function commitResult() {
        if (state.firstOperand === null || !state.operator) {
          return;
        }

        const expressionBefore = `${formatNumber(state.firstOperand)} ${state.operator} ${state.currentInput}`;
        const result = calculate(state.firstOperand, state.operator, state.currentInput);

        if (result === 'Error') {
          commitError();
          return;
        }

        const output = trimResult(result);
        state.lastExpression = `${formatNumber(state.firstOperand)} ${state.operator} ${state.currentInput} = ${output}`;
        state.currentInput = output;
        state.firstOperand = null;
        state.operator = null;
        state.waitingForSecondOperand = false;
      }

      function commitError() {
        state.currentInput = 'Error';
        state.firstOperand = null;
        state.operator = null;
        state.waitingForSecondOperand = false;
        state.lastExpression = '';
      }

      function trimResult(value) {
        if (typeof value === 'string') {
          return value;
        }

        const rounded = Number.parseFloat(Number(value).toFixed(10));
        return String(rounded);
      }

      function clearAll() {
        state.currentInput = '0';
        state.firstOperand = null;
        state.operator = null;
        state.waitingForSecondOperand = false;
        state.lastExpression = '';
      }

      function backspace() {
        if (state.waitingForSecondOperand || state.currentInput === 'Error') {
          return;
        }
        if (state.currentInput.length <= 1 || (state.currentInput.length === 2 && state.currentInput.startsWith('-'))) {
          state.currentInput = '0';
          return;
        }
        state.currentInput = state.currentInput.slice(0, -1);
      }

      keys.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const value = button.dataset.value;

        switch (action) {
          case 'digit':
            appendDigit(value);
            break;
          case 'decimal':
            appendDecimal();
            break;
          case 'operator':
            chooseOperator(value);
            break;
          case 'equals':
            commitResult();
            break;
          case 'clear':
            clearAll();
            break;
          case 'backspace':
            backspace();
            break;
        }

        updateDisplay();
      });

      document.addEventListener('keydown', (event) => {
        const { key } = event;
        if (/^\d$/.test(key)) {
          appendDigit(key);
        } else if (key === '.') {
          appendDecimal();
        } else if (['+', '-', '*', '/'].includes(key)) {
          const map = { '+': '+', '-': '−', '*': '×', '/': '÷' };
          chooseOperator(map[key]);
        } else if (key === 'Enter' || key === '=') {
          event.preventDefault();
          commitResult();
        } else if (key === 'c' || key === 'C') {
          clearAll();
        } else if (key === 'Backspace') {
          event.preventDefault();
          backspace();
        } else if (key === 'Escape') {
          clearAll();
        } else {
          return;
        }
        updateDisplay();
      });

      updateDisplay();
    })();
  
