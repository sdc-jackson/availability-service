import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'react-calendar'
//import DateRangePicker from '@wojtekmaj/react-daterange-picker'

class App extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>

        <div id = 'check-in'>
          <div id = "check-in1">
            Check-in
          </div>
          <div id = 'check-in-add-date'>
            Add date
          </div>
        </div>
        <div id = 'check-out'>
          <div id = "check-out1">
            Check-out
          </div>
          <div id = 'check-out-add-date'>
            Add date
          </div>
        </div>

        <div id = 'calendar'>
          <Calendar />
        </div>
      </div>
      );
  }
}

var domContainer = document.getElementById('availabilityApp');
ReactDOM.render(<App />, domContainer);