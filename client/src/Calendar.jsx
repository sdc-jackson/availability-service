import React, {Component} from 'react'
import Week from './Week.jsx'

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    var today = new Date();

    this.state = {
      month1Date: today

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


  render() {
    return (
      <div>
        <div id = 'month1'>
          {this.monthsMap[this.state.month1Date.getMonth()]}
          <table>
            <tbody>
              <tr>
                <td>Su</td>
                <td>Mo</td>
                <td>Tu</td>
                <td>We</td>
                <td>Th</td>
                <td>Fr</td>
                <td>Sa</td>
              </tr>
              {/* <Week thisWeek = {['blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank']} /> */}
              {this.getWeekArrays(this.state.month1Date.getMonth(), this.state.month1Date.getFullYear()).map((arr) => {
                console.log('making a week', arr);
                return <Week thisWeek = {arr} />
              })}
            </tbody>
          </table>
        </div>
        <div id = 'month2'>

        </div>
      </div>

    )
  }
}

export default Calendar;