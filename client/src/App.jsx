
import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import Calendar from 'react-calendar'

import DateRangePicker from 'react-daterange-picker'
//import 'react-daterange-picker/dist/css/react-calendar.css'
//import DateRangePicker from '@wojtekmaj/react-daterange-picker'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: new Date()
    }
  }

  onSelect(dates) {
    this.setState({ dates })
    console.log(this.state.dates)
  }

  render() {
    return (
      <div>

        <div id = 'check-in'>
          <div id = "check-in1">
            Check-in
          </div>
          <div id = 'check-in-add-date'>
            {this.state.dates.start ? this.state.dates.start.toString() : 'Add date'}
          </div>
        </div>
        <div id = 'check-out'>
          <div id = "check-out1">
            Check-out
          </div>
          <div id = 'check-out-add-date'>
            {this.state.dates.end ? this.state.dates.end.toString() : 'Add date'}
          </div>
        </div>

        <div id = 'calendar'>
          <input type='date'></input>
          {/* <DateRangePicker
          onSelect={this.onSelect.bind(this)}
          value={this.state.dates}
          numberOfCalendars={2}
          selectionType='range'
          /> */}

        </div>
      </div>
      );
  }
}

var domContainer = document.getElementById('availabilityApp');
ReactDOM.render(<App />, domContainer);