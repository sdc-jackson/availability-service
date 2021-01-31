import React from 'react';
import GuestAdder from './GuestAdder.jsx';
import urlHelpers from './urlHelpers.js';
import {UpOutlined, DownOutlined} from '@ant-design/icons';
import '../dist/styles.css'

class Guests extends React.Component {
  constructor(props) {
    super(props);
  }

  sumGuests() {
    return this.props.guests.numAdults + this.props.guests.numChildren + this.props.guests.numInfants;
  }

  render() {
    return (<div>
      <div className='guest-title' style={{fontSize: 'x-small', paddingLeft: '30%'}}>GUESTS</div>
      <div className='flex-guest-summary-container' onClick={this.props.showGuestPicker}>
        <div className='flex-guest-summary-numguests-child'> <span style={{color: '#404040', fontSize: '15px'}}>{`${this.sumGuests()} ${this.sumGuests() > 1 ? 'guests' : 'guest'}`}</span></div>
        <div className='flex-guest-summary-button-child ' > {this.props.guestPickerShowing ? <UpOutlined/> : <DownOutlined/> }</div>
      </div>

    </div>);
  }
}

export default Guests;