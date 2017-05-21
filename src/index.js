import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import config from './config';
import theme from './theme';
import './index.css';

ReactDOM.render(
    <App
        config={config}
        theme={theme}
    />,
    document.getElementById('root')
);
