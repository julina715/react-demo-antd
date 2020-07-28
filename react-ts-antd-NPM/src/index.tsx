import React from 'react';
import * as ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/es/locale-provider/zh_CN';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';
import './style/style.scss';
import App from './view/App';
ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <BrowserRouter>
            <Route component={App} />
        </BrowserRouter>
    </LocaleProvider>,
    document.getElementById('root')
);
