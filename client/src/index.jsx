import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import AppSecondary from './AppSecondary.jsx';
import {createBrowserHistory} from 'history';

const history = createBrowserHistory();

var domContainer1 = document.getElementById('availabilityApp1');
var domContainer2 = document.getElementById('availabilityApp2');
ReactDOM.render(<App id={1} history={history}/>, domContainer1);
ReactDOM.render(<AppSecondary id={2} history={history}/>, domContainer2);