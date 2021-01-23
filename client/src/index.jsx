import React from 'react';
import ReactDOM from 'react-dom';
import AppsRoot from './AppsRoot.jsx';
// import {createBrowserHistory} from 'history';

// const history = createBrowserHistory();

var domContainer1 = document.getElementById('availabilityApp1');
// var domContainer2 = document.getElementById('availabilityApp2');
ReactDOM.render(<AppsRoot />, domContainer1); // id={1} history={history}/>, domContainer1);
// ReactDOM.render(<AppSecondary id={2} history={history}/>, domContainer2);

