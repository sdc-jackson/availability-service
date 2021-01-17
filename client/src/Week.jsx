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
    var dateClicked = this.props.dateClicked;
    var changedHoveredDate = this.props.changedHoveredDate;
    return (<tr>
      {this.props.thisWeek.map((item) => {
        var itemDate = new Date(item);
        if (item.toString().slice(0, 17) === this.props.checkInDate.toString().slice(0, 17) && item !== 'blank') {
          return <td class = 'day' style = {checkInOutStyle} onClick={ () => { dateClicked(item); }} onMouseEnter={ () => { changedHoveredDate(item); }}> {item === 'blank' ? '- ' : item.getDate() } </td>;
        } else if (item.toString().slice(0, 17) === this.props.checkOutDate.toString().slice(0, 17) && item !== 'blank') {
          return <td class = 'day' style = {checkInOutStyle} onClick={ () => { dateClicked(item); }} onMouseEnter={ () => { changedHoveredDate(item); }}> { item === 'blank' ? '- ' : item.getDate() } </td>;
        } else if (item.toString().slice(0, 17) === this.props.hoveredDate.toString().slice(0, 17) && item !== 'blank') {
          return <td class = 'day' style = {hoveredDateStyle} onClick={() => { dateClicked(item); }} onMouseEnter={ () => { changedHoveredDate(item); }}> {item === 'blank' ? '- ' : item.getDate() } </td>;
        } else if (this.props.checkInDate !== 'notSelected') {
          if (this.props.checkOutDate === 'notSelected' && itemDate < this.props.hoveredDate && itemDate > this.props.checkInDate) {
            return <td class = 'day' style = {rangeStyle} onClick={ () => { dateClicked(item); }} onMouseEnter={ () => { changedHoveredDate(item); }}> { item === 'blank' ? '- ' : item.getDate() } </td>;
          } else if (itemDate < this.props.checkOutDate && itemDate > this.props.checkInDate) {
            return <td class = 'day' style = {rangeStyle} onClick={ () => { dateClicked(item); }} onMouseEnter={ () => { changedHoveredDate(item); }}> { item === 'blank' ? '- ' : item.getDate() } </td>;
          }
        }

        return <td class = 'day' style = {normalDateStyle} onClick={ () => { dateClicked(item); }} onMouseEnter={ () => { changedHoveredDate(item); }}> { item === 'blank' ? '- ' : item.getDate() } </td>;


      })}

    </tr>);

  }

}

export default Week;