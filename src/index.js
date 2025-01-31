import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './style/SidebarStyle.css';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import Theme from './theme/Theme';
import { DateProvider } from './context/DateContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DateProvider>
    {/* <Provider store={store}> */}
    {/* <Router> */}
    <ThemeProvider theme={Theme}>
      <App />
    </ThemeProvider>
    {/* </Router> */}
    {/* </Provider> */}
    </DateProvider>
  </React.StrictMode>
);
 

reportWebVitals();
