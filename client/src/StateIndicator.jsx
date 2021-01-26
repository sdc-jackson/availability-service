import React, {Component} from 'react';
import availabilityHelpers from './availabilityHelpers.js';

class StateIndicator extends React.Component {
  constructor(props) {
    super(props);
    //props are:
    // checkIn
    // checkOut
    // showReserveButton
    // numNights
    // nameOfStay
  }



  getIndividualDateStrArr(date) {
    //returns [MonthString, DateString, YearString];
    var thisDate = availabilityHelpers.getDateObjFromStr(date);
    return {
      mo: availabilityHelpers.monthsMap[thisDate.getMonth()],
      da: thisDate.getDate().toString(),
      yr: thisDate.getFullYear().toString()
    };
  }

  getResDateSummaryStr() {
    var ci = this.getIndividualDateStrArr(this.props.checkIn);
    var co = this.getIndividualDateStrArr(this.props.checkOut);

    return `${ci.mo} ${ci.da}, ${ci.yr} - ${co.mo} ${co.da}, ${co.yr}`;
  }

  render() {
    if (this.props.checkIn === 'notSelected') {
      return (<div>
        <h2>Select check-in date</h2>
        <h3>Add your travel dates for exact pricing</h3>
      </div>);
    } else if (this.props.checkOut === 'notSelected') {
      return (<div>
        <h2>Select check-out date</h2>
        <h3>Add your travel dates for exact pricing</h3>
      </div>);
    } else if (this.props.showReserveButton) {
      return (<div>
        <h2>{this.props.numNights} nights in {this.props.nameOfStay}</h2>
        <h3>{this.getResDateSummaryStr()} </h3>
      </div>);
    }
  }
}

export default StateIndicator;