import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

var domContainer1 = document.getElementById('availabilityApp1');
var domContainer2 = document.getElementById('availabilityApp2');
ReactDOM.render(<App id={1}/>, domContainer1);
ReactDOM.render(<App id={2}/>, domContainer2);