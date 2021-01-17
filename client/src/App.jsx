
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
      showing: false, //is calendar showing
      currentlySelecting: 'checkIn' //is the next date clicked to be check-in or check-out?
    }
  }

  onSelect(dates) {
    this.setState({ dates })
    console.log(this.state.dates)
  }

  onClickCheckinShowCalendar() {
    this.setState({
      showing: true,
      currentlySelecting: 'checkIn'
    });
  }
  onClickCheckoutShowCalendar() {
    this.setState({
      showing: true,
      currentlySelecting: 'checkOut'
    })
  }

  dateClicked(e) {
    console.log(e)
    if(this.state.currentlySelecting === 'checkIn') {
      this.setState({
        checkIn: e,
        currentlySelecting: 'checkOut'
      })
    } else if (this.state.currentlySelecting === 'checkOut') {
      //if we selected check-out date, set check-out date and close the calendar
      this.setState({
        checkOut: e,
        showing: false
      })
    }

  }

  render() {
    return (
      <div>

        <div id = 'check-in'>
          <div id = "check-in1">
            Check-in
          </div>
          <div id = 'check-in-add-date' onClick = {this.onClickCheckinShowCalendar.bind(this)}>
            {this.state.checkIn === 'notSelected' ? 'Add date' : this.state.checkIn.toString()}
          </div>
        </div>
        <div id = 'check-out'>
          <div id = "check-out1">
            Check-out
          </div>
          <div id = 'check-out-add-date' onClick = {this.onClickCheckoutShowCalendar.bind(this)}>
            {this.state.checkOut === 'notSelected' ? 'Add date' : this.state.checkOut.toString()}
          </div>
        </div>

        <div id = 'calendar'>
          <div id = 'calendar-table' style={{display: this.state.showing ? 'block' : 'none' }}>
            <Calendar dateClicked = {this.dateClicked.bind(this)}/>
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