import React, {Component} from 'react';
import availabilityHelpers from './availabilityHelpers.js';
//import styled from 'styled-components';
const {styled} = window;

const StateIndicatorContainer = styled.div`
  width: 330px;
  height: 100px;
  margin-left: 50px;
`;

const StateIndicatorHeader = styled.div`
  font-size: 22px;
  font-weight: 600;
  padding-bottom: 8px;
`;

class StateIndicator extends React.Component {
  constructor(props) {
    super(props);

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
      return (<StateIndicatorContainer>
        <StateIndicatorHeader>Select check-in date</StateIndicatorHeader>
        <span style={{fontSize: '14px', color: 'grey'}}>Add your travel dates for exact pricing</span>
      </StateIndicatorContainer>);
    } else if (this.props.checkOut === 'notSelected') {
      return (<StateIndicatorContainer>
        <StateIndicatorHeader>Select check-out date</StateIndicatorHeader>
        <span style={{fontSize: '14px', color: 'grey'}}>Add your travel dates for exact pricing</span>
      </StateIndicatorContainer>);
    } else if (this.props.showReserveButton) {
      return (<StateIndicatorContainer>
        <StateIndicatorHeader>{this.props.numNights} nights in {this.props.nameOfStay}</StateIndicatorHeader>
        <span style={{fontSize: '14px', color: 'grey'}}>{this.getResDateSummaryStr()} </span>
      </StateIndicatorContainer>);
    }
  }
}

export default StateIndicator;