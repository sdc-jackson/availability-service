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
    var dateClicked = this.props.dateClicked;
    var changedHoveredDate = this.props.changedHoveredDate;



    return (<tr>
      {this.props.thisWeek.map((item) => {
        var chosenStyle = normalDateStyle;
        var choosable = true;

        var itemDate = new Date(item);

        if (this.props.checkInDate !== 'notSelected' && itemDate < this.props.checkInDate) {
          chosenStyle = blockedStyle;
          choosable = false;
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

        return <td class = 'day' style = { chosenStyle } onClick={ () => { if (choosable) { dateClicked(item); } }} onMouseEnter={ () => { changedHoveredDate(item); }}> { item === 'blank' ? '  ' : item.getDate() } </td>;


      })}

    </tr>);

  }

}

export default Week;