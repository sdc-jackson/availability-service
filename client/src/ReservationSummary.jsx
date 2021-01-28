import React, {Component} from 'react';
import styled from 'styled-components';


const ReservationSummaryTable = styled.table`
    width: 250px;
    border-collapse: collapse;
    position:fixed;
    background-color: white;
    top:250px;
    float:right;
    right: 35px;

`;
const ReservationSummaryTd = styled.td`
    text-align: right;
`;

const TotalTable = styled.table`
    width: 250px;
    position: fixed;
    border-collapse: collapse;
    font-weight: 700;
    float:right;
    top: 350px;
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
            <td>
              {`$${this.props.priceOfStay / this.props.numNights} per night x ${this.props.numNights} nights`}
            </td>
            <ReservationSummaryTd>
              {`$${this.props.priceOfStay}`}
            </ReservationSummaryTd>
          </tr>
          <tr>
            <td>
              Cleaning fee
            </td>
            <ReservationSummaryTd>
              ${this.props.cleaningFee}
            </ReservationSummaryTd>
          </tr>
          <tr>
            <td>
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