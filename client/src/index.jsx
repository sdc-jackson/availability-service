import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import AppSecondary from './AppSecondary.jsx';

var domContainer1 = document.getElementById('availabilityApp1');
var domContainer2 = document.getElementById('availabilityApp2');
ReactDOM.render(<App id={1}/>, domContainer1);
ReactDOM.render(<AppSecondary id={2}/>, domContainer2);