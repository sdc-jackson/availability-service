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
      <div className='guest-title' style={{fontSize: 'x-small'}}>GUESTS</div>
      <div className='flex-guest-summary-container'>
        <div className='flex-guest-summary-numguests-child'> {`${this.sumGuests()} ${this.sumGuests() > 1 ? 'guests' : 'guest'}`}</div>
        <button className='flex-guest-summary-button-child ' onClick={this.props.showGuestPicker}> {this.props.guestPickerShowing ? '/\\' : '\\/' }</button>
      </div>

    </div>);
  }
}

export default Guests;