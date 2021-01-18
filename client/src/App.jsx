
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Calendar from './Calendar.jsx';
import ReservationSummary from './ReservationSummary.jsx';
import $ from 'jquery';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      checkIn: 'notSelected',
      checkOut: 'notSelected',
      showing: false, //is calendar showing
      currentlySelecting: 'checkIn', //is the next date clicked to be check-in or check-out?
      activeSelecting: false,
      checkoutOnlyShowing: false,
      selectedCheckoutOnlyDate: 'none',
      hoveredDate: 'none',
      showCheckAvailabilityButton: true,
      showReserveButton: false,
      priceOfStay: 0,
      numNights: 0
    };
  }

  componentDidMount() {
    var productId = window.location.pathname.split('/')[1];
    $.ajax({
      method: 'GET',
      url: `/${productId}/availableDates`,
      success: (dates) => {
        this.setState({
          dates: dates
        });
        // console.log('GOT SOME DATES!', dates.length);
        // for (var i = 0; i < dates.length; i++) {
        //   console.log(dates[i].date, dates[i].isAvailable);

        // }
      }
    });
  }

  onSelect(dates) {
    this.setState({ dates });
  }

  onClickCheckinShowCalendar() {
    this.setState({
      showing: true,
      currentlySelecting: 'checkIn',
      activeSelecting: true,
      showReserveButton: false
    });
  }
  onClickCheckoutShowCalendar() {
    this.setState({
      showing: true,
      currentlySelecting: 'checkOut',
      activeSelecting: true
    });
  }

  dateClicked(e, dateIsCheckoutOnly) {
    if (this.state.currentlySelecting === 'checkIn' && dateIsCheckoutOnly === false) {
      this.setState({
        checkIn: e,
        currentlySelecting: 'checkOut'

      });
    } else if (this.state.currentlySelecting === 'checkOut') {
      //if we selected check-out date, set check-out date and close the calendar
      this.setState({
        checkOut: e,
        showing: false,
        activeSelecting: false,
        showCheckAvailabilityButton: false,
        showReserveButton: true
      });
      this.getTotalPrice(e);
    } else if (dateIsCheckoutOnly) {
      this.setState({
        checkoutOnlyShowing: true,
        selectedCheckoutOnlyDate: e
      });
    }

  }

  clearDates() {
    this.setState({
      activeSelecting: true,
      currentlySelecting: 'checkIn',
      checkIn: 'notSelected',
      checkOut: 'notSelected',
      selectedCheckoutOnlyDate: 'none',
      hoveredDate: 'none',
      checkoutOnlyShowing: false

    });
  }

  closeCalendar() {
    this.setState({
      activeSelecting: false,
      currentlySelecting: 'checkIn',
      showing: false
    });
  }

  changeHoveredDate(date) {
    //console.log('hovered date:', date);
    this.setState({
      hoveredDate: date
    });
  }

  getTotalPrice(checkOut) {
    console.log('inside getTotalPrice');
    var checkOutDate = new Date(checkOut);
    var checkInDate = new Date(this.state.checkIn);
    var numNights = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000*60*60*24));
    console.log(checkOutDate, checkInDate);
    this.setState({
      numNights: numNights
    });
    for (var i = 0; i < this.state.dates.length; i++) {
      var thisNight = this.state.dates[i];
      var thisNightDate = new Date(this.state.dates[i].date);
      // console.log('thisNightDate:', thisNightDate.toString().slice(0, 15));
      // console.log('checkInDate', checkInDate);
      if(thisNightDate.toString().slice(0, 15) === checkInDate.toString().slice(0, 15)) {

        this.setState({
          priceOfStay: this.state.dates[i].nightlyRate * numNights,
          cleaningFee: thisNight.cleaningFee * numNights,
          serviceFee:  thisNight.serviceFee * numNights
        });
        return;
      }
    }
  }

  render() {
    var checkInStyle = {
      fontWeight: 'normal'
    };
    var checkOutStyle = {
      fontWeight: 'normal'
    };
    if (this.state.activeSelecting === true && this.state.currentlySelecting === 'checkIn') {
      var checkInStyle = {
        fontWeight: 'bold'
      };
    }
    if (this.state.activeSelecting === true && this.state.currentlySelecting === 'checkOut') {
      var checkOutStyle = {
        fontWeight: 'bold'
      };
    }
    return (
      <div>
        <div id = 'check-in'>
          <div id = "check-in1" style = {checkInStyle}>
            Check-in:
          </div>
        </div>
        <div id = 'check-in-add-date' onClick = {this.onClickCheckinShowCalendar.bind(this)}>
          {this.state.checkIn === 'notSelected' ? 'Add date' : this.state.checkIn.toString()}
        </div>

        <div id = 'check-out'>
          <div id = "check-out1" style = {checkOutStyle}>
            Check-out:
          </div>
          <div id = 'check-out-add-date' onClick = {this.onClickCheckoutShowCalendar.bind(this)}>
            {this.state.checkOut === 'notSelected' ? 'Add date' : this.state.checkOut.toString()}
          </div>
        </div>

        <div id = 'calendar'>
          <div id = 'calendar-table' style={{display: this.state.showing ? 'block' : 'none' }}>
            <Calendar hoveredDate = {this.state.hoveredDate} changeHoveredDate = {this.changeHoveredDate.bind(this)} selectedCheckoutOnlyDate = {this.state.selectedCheckoutOnlyDate} dates = {this.state.dates} checkInDate = {this.state.checkIn} checkOutDate = {this.state.checkOut} clearDates = {this.clearDates.bind(this)} closeCalendar = {this.closeCalendar.bind(this)} dateClicked = {this.dateClicked.bind(this)}/>
          </div>


        </div>
        <div id = 'dateIsCheckoutOnly' style={{display: (this.state.checkoutOnlyShowing && (this.state.hoveredDate.toString().slice(0, 17) === this.state.selectedCheckoutOnlyDate.toString().slice(0, 17))) ? 'block' : 'none'}}> This date is check-out only. </div>
        <button onClick={this.onClickCheckinShowCalendar.bind(this)} style={{display: (this.state.showCheckAvailabilityButton) ? 'block' : 'none'}}> Check Availability </button>
        <div style={{display: (this.state.showReserveButton) ? 'block' : 'none'}}>
          <br/>
          <br/>
          <ReservationSummary cleaningFee = {this.state.cleaningFee} serviceFee = {this.state.serviceFee} numNights = {this.state.numNights} priceOfStay = {this.state.priceOfStay}/>
          <button >Reserve</button>
        </div>
      </div>


    );
  }
}

var domContainer = document.getElementById('availabilityApp');
ReactDOM.render(<App />, domContainer);