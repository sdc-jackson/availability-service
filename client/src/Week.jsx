import React, {Component} from 'react';

class Week extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var checkInOutStyle = {
      backgroundColor: 'black',
      color: 'white',
      testId: 'checkInOut'
    };
    var rangeStyle = {
      backgroundColor: 'grey',
      color: 'black',
      testId: 'range'
    };
    var normalDateStyle = {
      backgroundColor: 'white',
      fontWeight: 700,
      color: 'black',
      testId: 'normal'
    };
    var hoveredDateStyle = {
      backgroundColor: 'cornflowerBlue',
      color: 'white',
      testId: 'hoveredDate'
    };
    var blockedStyle = {
      textDecoration: 'line-through',
      color: 'lightGrey',
      testId: 'blocked'
    };
    var checkOutOnlyStyle = {
      color: 'grey',
      testId: 'checkOutOnly',
      fontWeight: 700
    };
    var checkOutOnlyHoverStyle = {
      backgroundColor: 'lightGrey',
      color: 'grey',
      testId: 'checkOutOnlyHover'
    };

    var dateClicked = this.props.dateClicked;
    var changedHoveredDate = this.props.changedHoveredDate;



    return (<tr>

      {


        this.props.thisWeek.map((item, index) => {
          var checkInDate = new Date(this.props.checkInDate);
          checkInDate.setHours(0, 0, 0);
          var checkOutDate = new Date(this.props.checkOutDate);
          checkOutDate.setHours(0, 0, 0);
          var hoveredDate = new Date(this.props.hoveredDate);
          hoveredDate.setHours(0, 0, 0);

          var chosenStyle = normalDateStyle;
          var choosable = true;

          var itemDate = new Date(item);
          itemDate.setHours(0, 0, 0);
          var dateIsAvailable = false;
          var dateIsCheckoutOnly = false; //previous date available but this date is not

          for (var i = 0; i < this.props.dates.length; i++) { //iterate through all the dates for this stay
            var cDate = new Date(this.props.dates[i].date);
            var maxDate = new Date(this.props.maxSelectableDate);
            cDate.setHours(0, 0, 0);
            maxDate.setHours(0, 0, 0);
            if (cDate.toString() === itemDate.toString()) {
              if (cDate.getDate() > maxDate.getDate() || cDate.getMonth() > maxDate.getMonth()) {
                dateIsAvailable = false;
              } else if (this.props.dates[i].isAvailable === true) {
                dateIsAvailable = true;
              } else if (i > 0) {
                if (this.props.dates[i - 1].isAvailable === true) {
                  dateIsCheckoutOnly = true;
                }
              }
            }
          }
          //console.log(itemDate, checkInDate);
          if ((this.props.checkInDate !== 'notSelected' && itemDate < checkInDate) || dateIsAvailable === false) {
            //console.log('blocked date: ', itemDate);
            chosenStyle = blockedStyle;
            choosable = false;
            if (itemDate < checkInDate) {
              chosenStyle = blockedStyle;
            } else if (dateIsCheckoutOnly === true) {
              if (itemDate.toString() === this.props.checkOutDate.toString()) {
                chosenStyle = checkInOutStyle;
              } else {
                chosenStyle = checkOutOnlyStyle;
                choosable = true;
                if (itemDate.toString() === this.props.hoveredDate.toString() && item !== 'blank') {
                  chosenStyle = checkOutOnlyHoverStyle;
                }

              }
            }
          } else if (itemDate.toString() === this.props.checkInDate.toString() && item !== 'blank') {
            chosenStyle = checkInOutStyle;
          } else if (itemDate.toString() === this.props.checkOutDate.toString() && item !== 'blank') {
            chosenStyle = checkInOutStyle;
          } else if (itemDate.toString() === this.props.hoveredDate.toString() && item !== 'blank') {
            chosenStyle = hoveredDateStyle;
          } else if (this.props.checkInDate !== 'notSelected') {
            if (this.props.checkOutDate === 'notSelected' && itemDate < hoveredDate && itemDate > checkInDate) {
              chosenStyle = rangeStyle;
            } else if (itemDate < checkOutDate && itemDate > checkInDate) {
              chosenStyle = rangeStyle;
            } else {
              chosenStyle = normalDateStyle;
            }
          } else {
            chosenStyle = normalDateStyle;
          }

          return <td className = 'day' key={index}
            style = { chosenStyle }
            data-testId = {chosenStyle.testId}
            onClick={ () => {
              if (choosable) {
                dateClicked(item, dateIsCheckoutOnly);
              }
            }}
            onMouseEnter={ () => {
              changedHoveredDate(item);
            }}
            onMouseLeave={ () => {
              changedHoveredDate('none');
            }}>
            { item === 'blank' ? '  ' : item.getDate() }
          </td>;



        })
      }

    </tr>);

  }

}

export default Week;