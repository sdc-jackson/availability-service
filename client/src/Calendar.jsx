import React, {Component} from 'react';
import Week from './Week.jsx';
import Month from './Month.jsx';

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    var today = new Date();
    var oneMonthFromToday = new Date();
    oneMonthFromToday.setDate(today.getDate() + 30);

    this.state = {
      month1Date: today,
      month2Date: oneMonthFromToday,
      hoveredDate: 'none'
    };

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

    monthStartDate.setMonth(month);
    monthStartDate.setDate(1); //first day of this month
    monthStartDate.setYear(year);
    var weeks = [];
    var week1 = [];
    for (var day = 0; day < monthStartDate.getDay(); day++) {
      week1.push('blank');
    }
    for (var day = monthStartDate.getDay(); day < 7; day++) {
      var pushDate = new Date(monthStartDate);
      week1.push(pushDate);
      monthStartDate.setDate(monthStartDate.getDate() + 1);
    }
    weeks.push(week1);
    var endOfMonth = false;
    while (endOfMonth === false) {
      var week = [];
      for (var day = 0; day < 7; day++) {
        if (monthStartDate.getMonth() !== month) {
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

  changeHoveredDate(date) {
    //console.log('hovered date:', date);
    this.setState({
      hoveredDate: date
    });
  }

  render() {
    var month1dates = this.props.dates.filter((date) => {
      var adate = new Date(date.date);
      return adate.getMonth() === this.state.month1Date.getMonth();
    })
    var month2dates = this.props.dates.filter((date) => {
      var adate = new Date(date.date);
      return adate.getMonth() === this.state.month2Date.getMonth();
    })
    return (
      <div>
        <button id = 'prevMonthButton' onClick = {this.goPrevMonth.bind(this)} > {'<<'} </button>
        <Month dates = {month1dates} checkInDate = {this.props.checkInDate} checkOutDate = {this.props.checkOutDate} hoveredDate = {this.state.hoveredDate} changedHoveredDate = {this.changeHoveredDate.bind(this)} dateClicked = {this.props.dateClicked} month = {this.monthsMap[this.state.month1Date.getMonth()]} weeks = {this.getWeekArrays(this.state.month1Date.getMonth(), this.state.month1Date.getFullYear())}/>
        <Month dates = {month2dates} checkInDate = {this.props.checkInDate} checkOutDate = {this.props.checkOutDate} hoveredDate = {this.state.hoveredDate} changedHoveredDate = {this.changeHoveredDate.bind(this)} dateClicked = {this.props.dateClicked} month = {this.monthsMap[this.state.month2Date.getMonth()]} weeks = {this.getWeekArrays(this.state.month2Date.getMonth(), this.state.month2Date.getFullYear())}/>
        <button id = 'nextMonthButton' onClick = {this.goNextMonth.bind(this)} > {'>>'} </button>
        <br/>
        <br/>
        <button onClick = {this.props.clearDates}>Clear Dates</button>
        <button onClick = {this.props.closeCalendar}>Close</button>
      </div>



    );
  }
}

export default Calendar;