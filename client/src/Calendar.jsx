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



  render() {
    var month1dates = this.props.dates.filter((date) => {
      var adate = new Date(date.date);
      return adate.getMonth() === this.state.month1Date.getMonth();
    });
    var month2dates = this.props.dates.filter((date) => {
      var adate = new Date(date.date);
      return adate.getMonth() === this.state.month2Date.getMonth();
    });
    return (
      <div>
        <div className='flex-calendar-container'>
          <button className='flex-scroll-button-child' id = 'prevMonthButton' onClick = {this.goPrevMonth.bind(this)} > {'<'} </button>
          <div className='flex-calendar-child'>
            <Month
              maxSelectableDate = {this.props.maxSelectableDate}
              selectedCheckoutOnlyDate = {this.props.selectedCheckoutOnlyDate}
              dates = {month1dates}
              checkInDate = {this.props.checkInDate}
              checkOutDate = {this.props.checkOutDate}
              hoveredDate = {this.props.hoveredDate}
              changedHoveredDate = {this.props.changeHoveredDate}
              dateClicked = {this.props.dateClicked}
              month = {this.monthsMap[this.state.month1Date.getMonth()]}
              weeks = {this.getWeekArrays(this.state.month1Date.getMonth(),
              this.state.month1Date.getFullYear())}/>
          </div>
          <div className='flex-calendar-child'>
            <Month
              maxSelectableDate = {this.props.maxSelectableDate}
              selectedCheckoutOnlyDate = {this.props.selectedCheckoutOnlyDate}
              dates = {month2dates}
              checkInDate = {this.props.checkInDate}
              checkOutDate = {this.props.checkOutDate}
              hoveredDate = {this.props.hoveredDate}
              changedHoveredDate = {this.props.changeHoveredDate}
              dateClicked = {this.props.dateClicked}
              month = {this.monthsMap[this.state.month2Date.getMonth()]}
              weeks = {this.getWeekArrays(this.state.month2Date.getMonth(),
              this.state.month2Date.getFullYear())}/>
          </div>
          <button className='flex-scroll-button-child' id = 'nextMonthButton' onClick = {this.goNextMonth.bind(this)} > {'>'} </button>
        </div>
        <br/>
        <br/>
        <button onClick = {this.props.clearDates}>Clear Dates</button>
        <button style={{display: this.props.id === 1 ? 'block' : 'none' }} onClick = {this.props.closeCalendar}>Close</button>
      </div>



    );
  }
}

export default Calendar;