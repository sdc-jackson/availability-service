import React, {Component} from 'react';
import Week from './Week.jsx';

class Month extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id = 'month1'>
        {this.props.month}
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
            {this.props.weeks.map((arr) => {
              return (<Week selectedCheckoutOnlyDate = {this.props.selectedCheckoutOnlyDate} dates = {this.props.dates} checkInDate = {this.props.checkInDate} checkOutDate = {this.props.checkOutDate} hoveredDate = {this.props.hoveredDate} changedHoveredDate = {this.props.changedHoveredDate} thisWeek = {arr} dateClicked = {this.props.dateClicked}/>);
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Month;