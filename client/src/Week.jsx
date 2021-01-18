import React, {Component} from 'react';

class Week extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var checkInOutStyle = {
      backgroundColor: 'black',
      color: 'white'
    };
    var rangeStyle = {
      backgroundColor: 'grey',
      color: 'black'
    };
    var normalDateStyle = {
      backgroundColor: 'white',
      color: 'black'
    };
    var hoveredDateStyle = {
      backgroundColor: 'cornflowerBlue',
      color: 'white'
    };
    var blockedStyle = {
      textDecoration: 'line-through',
      color: 'lightGrey'
    };
    var checkOutOnlyStyle = {
      color: 'grey'
    };
    var checkOutOnlyHoverStyle = {
      backgroundColor: 'lightGrey',
      color: 'grey'
    };
    var dateClicked = this.props.dateClicked;
    var changedHoveredDate = this.props.changedHoveredDate;



    return (<tr>
      {this.props.thisWeek.map((item) => {
        var chosenStyle = normalDateStyle;
        var choosable = true;

        var itemDate = new Date(item);
        var dateIsAvailable = false;
        var dateIsCheckoutOnly = false; //previous date available but this date is not

        for(var i = 0; i < this.props.dates.length; i++) {
          var cDate = new Date(this.props.dates[i].date);
          if(cDate.getDate() === itemDate.getDate() &&
              cDate.getMonth() === itemDate.getMonth() &&
              cDate.getYear() === itemDate.getYear()) {
                if(this.props.dates[i].isAvailable === true) {
                  dateIsAvailable = true;
                } else if (i > 0) {
                  if(this.props.dates[i - 1].isAvailable === true) {
                    dateIsCheckoutOnly = true;
                  }
                }
              }
        }

        if ((this.props.checkInDate !== 'notSelected' && itemDate < this.props.checkInDate) || dateIsAvailable === false) {
          chosenStyle = blockedStyle;
          choosable = false;
          if (dateIsCheckoutOnly === true) {
            chosenStyle = checkOutOnlyStyle;
            choosable = true;
            if (item.toString().slice(0, 17) === this.props.hoveredDate.toString().slice(0, 17) && item !== 'blank') {
              chosenStyle = checkOutOnlyHoverStyle;
            }
          }
        } else if (item.toString().slice(0, 17) === this.props.checkInDate.toString().slice(0, 17) && item !== 'blank') {
          chosenStyle = checkInOutStyle;
        } else if (item.toString().slice(0, 17) === this.props.checkOutDate.toString().slice(0, 17) && item !== 'blank') {
          chosenStyle = checkInOutStyle;
        } else if (item.toString().slice(0, 17) === this.props.hoveredDate.toString().slice(0, 17) && item !== 'blank') {
          chosenStyle = hoveredDateStyle;
        } else if (this.props.checkInDate !== 'notSelected') {
          if (this.props.checkOutDate === 'notSelected' && itemDate < this.props.hoveredDate && itemDate > this.props.checkInDate) {
            chosenStyle = rangeStyle;
          } else if (itemDate < this.props.checkOutDate && itemDate > this.props.checkInDate) {
            chosenStyle = rangeStyle;
          } else {
            chosenStyle = normalDateStyle;
          }
        } else {
          chosenStyle = normalDateStyle;
        }

        return <td class = 'day'
                style = { chosenStyle }
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



      })}

    </tr>);

  }

}

export default Week;