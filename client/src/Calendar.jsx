import React, {Component} from 'react'
import Week from './Week.jsx'
import Month from './Month.jsx'

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    var today = new Date();
    var oneMonthFromToday = new Date();
    oneMonthFromToday.setDate(today.getDate() + 30);

    this.state = {
      month1Date: today,
      month2Date: oneMonthFromToday
    }

    this.monthsMap = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];


    this.daysMap = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
  }

  getWeekArrays (month, year) {
    let monthStartDate = new Date();

    monthStartDate.setMonth(month)
    monthStartDate.setDate(1); //first day of this month
    monthStartDate.setYear(year)
    console.log(monthStartDate);
    var weeks = [];
    var week1 = [];
    for (var day = 0; day < monthStartDate.getDay(); day++) {
      week1.push('blank');
    }
    for (var day = monthStartDate.getDay(); day < 7; day++) {
      console.log(monthStartDate);
      var pushDate = new Date(monthStartDate);
      console.log(pushDate);
      week1.push(pushDate);
      monthStartDate.setDate(monthStartDate.getDate() + 1);
    }
    weeks.push(week1);
    var endOfMonth = false;
    while(endOfMonth === false) {
      var week = [];
      for (var day = 0; day < 7; day++) {
        if(monthStartDate.getMonth() !== month) {
          endOfMonth = true;
          week.push('blank');
        } else {
          var pushDate = new Date(monthStartDate);
          week.push(pushDate);
          monthStartDate.setDate(monthStartDate.getDate() + 1);
        }
      }
      weeks.push(week);

    }
    return weeks;
  }


  goNextMonth() {
    this.setState({
      month1Date: new Date(this.state.month2Date),
      month2Date: new Date(this.state.month2Date.setDate(this.state.month2Date.getDate() + 30))
    });
  }

  goPrevMonth() {
    this.setState({
      month1Date: new Date(this.state.month1Date.setDate(this.state.month1Date.getDate() - 30)),
      month2Date: new Date(this.state.month2Date.setDate(this.state.month2Date.getDate() - 30)),
    });
  }

  render() {
    return (
      <div>
        <button id = 'prevMonthButton' onClick = {this.goPrevMonth.bind(this)}></button>
        <Month dateClicked = {this.props.dateClicked} month = {this.monthsMap[this.state.month1Date.getMonth()]} weeks = {this.getWeekArrays(this.state.month1Date.getMonth(), this.state.month1Date.getFullYear())}/>
        <Month dateClicked = {this.props.dateClicked} month = {this.monthsMap[this.state.month2Date.getMonth()]} weeks = {this.getWeekArrays(this.state.month2Date.getMonth(), this.state.month2Date.getFullYear())}/>
        <button id = 'nextMonthButton' onClick = {this.goNextMonth.bind(this)}></button>
        <br/>
        <button onClick = {this.props.clearDates}>Clear Dates</button>
        <button onClick = {this.props.closeCalendar}>Close</button>
      </div>



    )
  }
}

export default Calendar;