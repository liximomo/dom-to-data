import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import App from './App';
import theme from './theme';

const div = document.createElement('div');
document.body.appendChild(div);
div.id = 'liximomo-dom2data';
const shadow = div.attachShadow({ mode: 'closed' });

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <StyleSheetManager target={shadow}>
      <App />
    </StyleSheetManager>
  </ThemeProvider>,
  shadow
);
