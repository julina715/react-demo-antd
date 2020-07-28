import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncLoader from '../../services/loading';

const PageMaster = asyncLoader(() => import('../PageMaster'));
const PageSon = asyncLoader(() => import('../PageSon'));

export default class App extends Component {
    render() {
        return (
            <div>
                <h2>恭喜你，react + es6+ typescript + webpack + antd 环境搭建成功!!!!!!</h2>
                <h3>
                    <a href="/">首页</a>
                    <a href="/son">子页面</a>
                </h3>
                <Switch>
                    <Route exact path="/" component={PageMaster} />
                    <Route path="/son" component={PageSon} />
                </Switch>
            </div>
        );
    }
}