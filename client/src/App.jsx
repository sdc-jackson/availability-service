
import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import Calendar from './Calendar.jsx';

import DateRangePicker from 'react-daterange-picker'
//import 'react-daterange-picker/dist/css/react-calendar.css'
//import DateRangePicker from '@wojtekmaj/react-daterange-picker'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: new Date(),
      checkIn: 'notSelected',
      checkOut: 'notSelected',
      showing: false //is calendar showing
    }
  }

  onSelect(dates) {
    this.setState({ dates })
    console.log(this.state.dates)
  }

  onClickToggleCalendarShow() {
    this.setState({showing: !this.state.showing});
  }


  render() {
    return (
      <div>

        <div id = 'check-in'>
          <div id = "check-in1">
            Check-in
          </div>
          <div id = 'check-in-add-date' onClick = {this.onClickToggleCalendarShow.bind(this)}>
            {this.state.dates.start ? this.state.dates.start.toString() : 'Add date'}
          </div>
        </div>
        <div id = 'check-out'>
          <div id = "check-out1">
            Check-out
          </div>
          <div id = 'check-out-add-date' onClick = {this.onClickToggleCalendarShow.bind(this)}>
            {this.state.dates.end ? this.state.dates.end.toString() : 'Add date'}
          </div>
        </div>

        <div id = 'calendar'>
          <input type='date' step = '2'></input>
          <div id = 'calendar-table' style={{display: this.state.showing ? 'block' : 'none' }}>
            <Calendar />
          </div>
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