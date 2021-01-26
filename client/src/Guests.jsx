import React from 'react';
import GuestAdder from './GuestAdder.jsx';
import urlHelpers from './urlHelpers.js';

class Guests extends React.Component {
  constructor(props) {
    super(props);
  }

  sumGuests() {
    return this.props.guests.numAdults + this.props.guests.numChildren + this.props.guests.numInfants;
  }

  render() {
    return (<div>
      <div className='guest-title'>GUESTS</div>
      <div className='number-of-guests'> {`${this.sumGuests()} ${this.sumGuests() > 1 ? 'guests' : 'guest'}`}</div>
      <button className='guest-dropdown-button' onClick={this.props.showGuestPicker}> {this.props.guestPickerShowing ? '^' : 'v' }</button>
      <div style={{display: this.props.guestPickerShowing ? 'block' : 'none' }}>
        <GuestAdder guests = {this.props.guests} updateGuests={this.props.updateGuests}/>
      </div>
    </div>);
  }
}

export default Guests;