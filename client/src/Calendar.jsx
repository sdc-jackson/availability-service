import React, {Component} from 'react';
import Week from './Week.jsx';
import Month from './Month.jsx';
import styled from 'styled-components';



const ClearCloseButtonsFlex = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 50px;
  width: 680px;
  align-items: center;

`;

const ClearDatesButton = styled.div`
  text-decoration: underline;
  background-color: white;
  color: #484848;
  border-radius: 10px;
  font-weight: 700;
  width: 115px;
  height: 35px;
  text-align: center;
  line-height: 35px;


`;

const CloseCalendarButton = styled.div`
  border: 2px solid #484848;
  background-color: #484848;
  color: white;
  border-radius: 10px;
  font-weight: 700;
  display: ${props => props.id === 1 ? 'block' : 'none'};
  height: 35px;
  width: 70px;
  text-align: center;
  line-height: 35px;

`;


class Calendar extends React.Component {
  constructor(props) {
    super(props);




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



    var monthStartDate = new Date();
    monthStartDate.setMonth(month);
    monthStartDate.setDate(1);
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



  render() {
    var month1dates = this.props.dates.filter((date) => {
      var adate = new Date(date.date);
      return adate.getMonth() === this.props.month1Date.getMonth();
    });
    var month2dates = this.props.dates.filter((date) => {
      var adate = new Date(date.date);
      return adate.getMonth() === this.props.month2Date.getMonth();
    });
    return (
      <div>
        <div className='flex-calendar-container'>
          <div className='flex-calendar-child'>

            <Month
              first = {true}  //first month of the 2-month calendar
              updateDisplayedMonths = {this.props.updateDisplayedMonths}
              maxSelectableDate = {this.props.maxSelectableDate}
              selectedCheckoutOnlyDate = {this.props.selectedCheckoutOnlyDate}
              dates = {month1dates}
              checkInDate = {this.props.checkInDate}
              checkOutDate = {this.props.checkOutDate}
              hoveredDate = {this.props.hoveredDate}
              changedHoveredDate = {this.props.changeHoveredDate}
              dateClicked = {this.props.dateClicked}
              month = {this.monthsMap[this.props.month1Date.getMonth()]}
              year = {this.props.month1Date.getFullYear()}
              weeks = {this.getWeekArrays(this.props.month1Date.getMonth(), this.props.month1Date.getFullYear())}
            />
          </div>
          <div className='flex-calendar-child'>
            <Month
              first = {false}
              updateDisplayedMonths = {this.props.updateDisplayedMonths}
              maxSelectableDate = {this.props.maxSelectableDate}
              selectedCheckoutOnlyDate = {this.props.selectedCheckoutOnlyDate}
              dates = {month2dates}
              checkInDate = {this.props.checkInDate}
              checkOutDate = {this.props.checkOutDate}
              hoveredDate = {this.props.hoveredDate}
              changedHoveredDate = {this.props.changeHoveredDate}
              dateClicked = {this.props.dateClicked}
              month = {this.monthsMap[this.props.month2Date.getMonth()]}
              year = {this.props.month1Date.getFullYear()}
              weeks = {this.getWeekArrays(this.props.month2Date.getMonth(), this.props.month2Date.getFullYear())}
            />
          </div>
        </div>
        <ClearCloseButtonsFlex id={this.props.id}>
          <ClearDatesButton onClick = {this.props.clearDates}>Clear dates</ClearDatesButton>
          <CloseCalendarButton id={this.props.id} onClick = {this.props.closeCalendar}>Close</CloseCalendarButton>
        </ClearCloseButtonsFlex>
      </div>



    );
  }
}

export default Calendar;