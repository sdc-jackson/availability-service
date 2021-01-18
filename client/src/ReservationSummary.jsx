import React, {Component} from 'react';

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
      <div> {`$${this.props.priceOfStay / this.props.numNights} per night x ${this.props.numNights} nights = $${this.props.priceOfStay}`}</div>
      <div> Cleaning Fee:  ${this.props.cleaningFee}</div>
      <div> Service Fee: ${this.props.serviceFee}</div>
      <br/>
      <div> Total: ${this.props.cleaningFee + this.props.serviceFee + this.props.priceOfStay}</div>
      <br/>
    </div>

    );
  }
}

export default ReservationSummary;