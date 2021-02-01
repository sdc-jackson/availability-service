import React, {Component} from 'react';
import styled from 'styled-components';


const ReservationSummaryTable = styled.table`
    width: 250px;
    border-collapse: collapse;
    position:absolute;
    background-color: white;
    top:200px;
    float:right;
    right: 35px;

`;
const ReservationSummaryTd = styled.td`
    text-align: right;
`;

const TotalTable = styled.table`
    width: 250px;
    position: absolute;
    border-collapse: collapse;
    font-weight: 700;
    float:right;
    top: 300px;
    right: 35px;

`;
const TotalTd = styled.td`
    text-align: right;
`;

class ReservationSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numNights: 0,
      priceOfStay: 0
    };
  }




  render() {
    return (<div>
      <ReservationSummaryTable>
        <tbody>
          <tr>
            <td style={{textDecoration: 'underline'}}>
              {`$${this.props.priceOfStay / this.props.numNights} per night x ${this.props.numNights} nights`}
            </td>
            <ReservationSummaryTd>
              {`$${this.props.priceOfStay}`}
            </ReservationSummaryTd>
          </tr>
          <tr>
            <td style={{textDecoration: 'underline'}}>
              Cleaning fee
            </td>
            <ReservationSummaryTd>
              ${this.props.cleaningFee}
            </ReservationSummaryTd>
          </tr>
          <tr>
            <td style={{textDecoration: 'underline'}}>
              Service Fee
            </td>
            <ReservationSummaryTd>
              ${this.props.serviceFee}
            </ReservationSummaryTd>
          </tr>
        </tbody>
      </ReservationSummaryTable>
      <br/>
      <br/>
      <TotalTable>
        <tbody>
          <tr>
            <td>
              Total
            </td>
            <TotalTd>
              ${this.props.cleaningFee + this.props.serviceFee + this.props.priceOfStay}
            </TotalTd>
          </tr>

        </tbody>
      </TotalTable>
    </div>

    );
  }
}

export default ReservationSummary;