import React from 'react';
import GuestAdder from './GuestAdder.jsx';
import urlHelpers from './urlHelpers.js';

class Guests extends React.Component {
  constructor(props) {
    super(props);
    //props:
      //numAdults
      //numInfants
      //numChildren
  }

  sumGuests() {
    return this.props.guests.numAdults + this.props.guests.numChildren + this.props.guests.numInfants;
  }

  componentDidMount() {

  }

  render() {
    return(<div>
      <div className='guest-title'>GUESTS</div>
      <div className='number-of-guests'> {`${this.sumGuests()} guests`}</div>
      <button className='guest-dropdown-button'>v</button>
    </div>)
  }
}

export default Guests;