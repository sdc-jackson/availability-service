import React, {Component} from 'react';
import styled from 'styled-components';

const DateCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${props => props.chosenStyle.isRange ? '5%' : '50%'};
  border: ${props => props.chosenStyle.border};
  background-color: ${props => props.chosenStyle.backgroundColor};
  font-weight: ${props => props.chosenStyle.fontWeight};
  color: ${props => props.chosenStyle.color};
  text-decoration: ${props => props.chosenStyle.textDecoration ? 'line-through' : 'none'};
  height: 30px;
  width: 30px;
`;



class Week extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var checkInOutStyle = {
      border: '1px solid black',
      backgroundColor: 'black',
      fontWeight: 500,
      color: 'white',
      testId: 'checkInOut'
    };
    var rangeStyle = {
      border: '1px solid #E8E8E8',
      isRange: true,
      backgroundColor: '#E8E8E8',
      fontWeight: 500,
      color: 'black',
      testId: 'range'
    };
    var normalDateStyle = {
      border: '1px solid white',
      backgroundColor: 'white',
      fontWeight: 500,
      color: 'black',
      testId: 'normal'
    };
    var hoveredDateStyle = {
      border: '1px solid black',
      backgroundColor: 'white',
      fontWeight: 500,
      color: 'black',
      testId: 'hoveredDate'
    };
    var blockedStyle = {
      textDecoration: 'line-through',
      border: '1px solid white',
      backgroundColor: 'white',
      fontWeight: 500,
      color: 'lightGrey',
      testId: 'blocked'
    };
    var checkOutOnlyStyle = {
      border: '1px solid white',
      backgroundColor: 'white',
      fontWeight: 500,
      color: 'grey',
      testId: 'checkOutOnly',
    };
    var checkOutOnlyHoverStyle = {
      border: '1px solid grey',
      backgroundColor: 'white',
      fontWeight: 500,
      color: 'grey',
      testId: 'checkOutOnlyHover'
    };

    var dateClicked = this.props.dateClicked;
    var changedHoveredDate = this.props.changedHoveredDate;



    return (

    <tr>

      {


        this.props.thisWeek.map((item, index) => {
          //console.log(item);
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
              if ((cDate.getDate() > maxDate.getDate() && cDate.getMonth() === maxDate.getMonth()) || cDate.getMonth() > maxDate.getMonth()) {
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
          if ((this.props.checkInDate !== 'notSelected' && itemDate < checkInDate) || dateIsAvailable === false) {
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

            data-testid = {chosenStyle.testId}
            onClick={ (e) => {
              if (choosable) {
                dateClicked(item, dateIsCheckoutOnly, e);
              }
            }}
            onMouseEnter={ () => {
              changedHoveredDate(item);
            }}
            onMouseLeave={ () => {
              changedHoveredDate('none');
            }}>

              <DateCircle chosenStyle={chosenStyle}>
                { item === 'blank' ? '  ' : item.getDate() }
              </DateCircle>
          </td>;



        })
      }

    </tr>);

  }

}

export default Week;