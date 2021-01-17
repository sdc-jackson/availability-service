import React, {Component} from 'react'

class Week extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var checkInOutStyle = {
      backgroundColor:'black',
      fontColor: 'white'
    }
    var rangeStyle = {
      backgroundColor: 'grey',
      fontColor: 'black'
    }
    var normalDateStyle = {
      backgroundColor: 'white',
      fontColor: 'black'
    }
    var hoveredDateStyle = {
      backgroundColor: 'cornflowerBlue',
      fontColor:'white'
    }
    var dateClicked = this.props.dateClicked;
    var changedHoveredDate = this.props.changedHoveredDate;
    return (<tr>
      {this.props.thisWeek.map((item) => {

        // console.log('prop:', this.props.hoveredDate.toString().slice(0,17));
        // console.log('item:', item.toString().slice(0,17));
        // console.log(item.toString().slice(0,17) === this.props.hoveredDate.toString().slice(0,17));


        if(item.toString().slice(0,17) === this.props.hoveredDate.toString().slice(0,17) && item !== 'blank') {
          console.log('FOUND MATCH');
          return <td class = 'day' style = {hoveredDateStyle} onClick={() => {dateClicked(item);}} onMouseEnter={() => {changedHoveredDate(item);}}> {item === 'blank' ? '- ' : item.getDate()} </td>
        } else {
          return <td class = 'day' style = {normalDateStyle} onClick={() => {dateClicked(item);}} onMouseEnter={() => {changedHoveredDate(item);}}> {item === 'blank' ? '- ' : item.getDate()} </td>

        }
      })}

    </tr>)
  }

}

export default Week;