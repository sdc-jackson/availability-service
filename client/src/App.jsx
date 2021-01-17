
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
      currentlySelecting: 'checkIn', //is the next date clicked to be check-in or check-out?
      activeSelecting: false
    }
  }

  onSelect(dates) {
    this.setState({ dates })
    console.log(this.state.dates)
  }

  onClickCheckinShowCalendar() {
    this.setState({
      showing: true,
      currentlySelecting: 'checkIn',
      activeSelecting: true
    });
  }
  onClickCheckoutShowCalendar() {
    this.setState({
      showing: true,
      currentlySelecting: 'checkOut',
      activeSelecting: true
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
        showing: false,
        activeSelecting: false
      })
    }

  }

  clearDates() {
    this.setState({
      activeSelecting: true,
      currentlySelecting: 'checkIn',
      checkIn: 'notSelected',
      checkOut: 'notSelected'
    })
  }

  closeCalendar() {
    this.setState({
      activeSelecting: false,
      currentlySelecting: 'checkIn',
      showing: false
    })
  }

  render() {
    var checkInStyle = {
      'font-weight': 'normal'
    };
    var checkOutStyle = {
      'font-weight': 'normal'
    };
    if(this.state.activeSelecting === true && this.state.currentlySelecting === 'checkIn') {
      var checkInStyle = {
        'font-weight': 'bold'
      };
    }
    if(this.state.activeSelecting === true && this.state.currentlySelecting === 'checkOut') {
      var checkOutStyle = {
        'font-weight': 'bold'
      };
    }
    return (
      <div>
        <div id = 'check-in'>
          <div id = "check-in1" style = {checkInStyle}>
            Check-in:
          </div>
        </div>
        <div id = 'check-in-add-date' onClick = {this.onClickCheckinShowCalendar.bind(this)}>
            {this.state.checkIn === 'notSelected' ? 'Add date' : this.state.checkIn.toString()}
        </div>

        <div id = 'check-out'>
          <div id = "check-out1" style = {checkOutStyle}>
            Check-out:
          </div>
          <div id = 'check-out-add-date' onClick = {this.onClickCheckoutShowCalendar.bind(this)}>
            {this.state.checkOut === 'notSelected' ? 'Add date' : this.state.checkOut.toString()}
          </div>
        </div>

        <div id = 'calendar'>
          <div id = 'calendar-table' style={{display: this.state.showing ? 'block' : 'none' }}>
            <Calendar clearDates = {this.clearDates.bind(this)} closeCalendar = {this.closeCalendar.bind(this)} dateClicked = {this.dateClicked.bind(this)}/>
          </div>


        </div>
      </div>

      );
  }
}

var domContainer = document.getElementById('availabilityApp');
ReactDOM.render(<App />, domContainer);