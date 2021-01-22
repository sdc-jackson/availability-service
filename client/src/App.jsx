
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Calendar from './Calendar.jsx';
import ReservationSummary from './ReservationSummary.jsx';
import $ from 'jquery';
import {createBrowserHistory} from 'history';
import urlHelpers from './urlHelpers.js'

const history = createBrowserHistory();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      checkIn: 'notSelected',
      checkOut: 'notSelected',
      maxSelectableDate: 'notSelected', //the last available date after the selected check-in date
      showing: false, //is calendar showing
      currentlySelecting: 'checkIn', //is the next date clicked to be check-in or check-out?
      activeSelecting: false,
      checkoutOnlyShowing: false,
      selectedCheckoutOnlyDate: 'none',
      hoveredDate: 'none',
      showCheckAvailabilityButton: true,
      showReserveButton: false,
      priceOfStay: 0,
      numNights: 0,
      minNightlyRate: 'none'
    };

    this.monthsMap = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];


    this.daysMap = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ];
  }

  componentDidMount() {
    var productId = window.location.pathname.split('/')[1];
    if (productId === null || productId === undefined || productId.length === 0){
      productId = '109';
    }

    history.listen((location, action) => {
      console.log(`calendar is ${window.location.hash === '#availability-calendar' ? 'open' : 'closed'}`);
      console.log(`check-in date is ${urlHelpers.getCheckInOrOutDateFromUrl(window.location.search)}`);
      console.log(`The last navigation action was ${action}`)
    })

    $.ajax({
      method: 'GET',
      url: `/${productId}/availableDates`,
      success: (dates) => {
        this.setState({
          dates: dates
        });

        $.ajax({
          method: 'GET',
          url: `/${productId}/minNightlyRate`,
          success: ({minNightlyRate}) => {
            this.setState({
              minNightlyRate: minNightlyRate
            })
          }

        })

      },
      error: (err) => {
        console.log('GOT AN ERROR', err);
      }

    });
  }

  onSelect(dates) {
    this.setState({ dates });
  }

  onClickCheckinShowCalendar() {
    window.location.hash = '#availability-calendar';
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
      //go through dates and find the maxSelectableDate
      var checkInDate = new Date(e);
      checkInDate.setHours(0, 0, 0);
      var hitCheckInDate = false;
      for (var i = 0; i < this.state.dates.length; i++) {
        var curDate = new Date(this.state.dates[i].date);
        curDate.setHours(0, 0, 0);
        if (!hitCheckInDate) {
          if (curDate.toString() === checkInDate.toString()) {
            hitCheckInDate = true;
          }
        } else {
          if (this.state.dates[i].isAvailable === false) {
            this.setState({
              checkIn: checkInDate.toString(),
              currentlySelecting: 'checkOut',
              maxSelectableDate: this.state.dates[i].date
            });
            history.push(urlHelpers.makeQueryString(checkInDate.toString()), {foo: 'check_in'});
            return;
          }
        }
      }
    } else if (this.state.currentlySelecting === 'checkOut') {
      //if we selected check-out date, set check-out date and close the calendar
      var checkOutDate = new Date(e);
      checkOutDate.setHours(0, 0, 0);
      this.setState({
        checkOut: checkOutDate.toString(),
        showing: false,
        activeSelecting: false,
        showCheckAvailabilityButton: false,
        showReserveButton: true
      });
      history.push(urlHelpers.makeQueryString(this.state.checkIn.toString(), checkOutDate.toString()), {foo: 'check_out'});
      window.history.hash = '';
      this.getTotalPrice(checkOutDate.toString());
    } else if (dateIsCheckoutOnly) {
      var checkOutOnlyDate = new Date(e);
      checkOutOnlyDate.setHours(0, 0, 0);
      this.setState({
        checkoutOnlyShowing: true,
        selectedCheckoutOnlyDate: checkOutOnlyDate.toString()
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
      checkoutOnlyShowing: false,
      howCheckAvailabilityButton: true,
      showReserveButton: false,
      maxSelectableDate: 'notSelected'
    });
    console.log('clear dates');
    history.replace('?', {foo: 'clear_dates'});

  }

  closeCalendar() {
    this.setState({
      activeSelecting: false,
      currentlySelecting: 'checkIn',
      showing: false
    });
  }

  changeHoveredDate(date) {
    var hDate = new Date(date);
    hDate.setHours(0, 0, 0);
    this.setState({
      hoveredDate: hDate.toString()
    });
  }

  getTotalPrice(checkOut) {
    var checkOutDate = new Date(checkOut);
    var checkInDate = new Date(this.state.checkIn);
    var numNights = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    console.log(checkOutDate, checkInDate);
    this.setState({
      numNights: numNights
    });
    for (var i = 0; i < this.state.dates.length; i++) {
      var thisNight = this.state.dates[i];
      var thisNightDate = new Date(this.state.dates[i].date);
      if (thisNightDate.toString().slice(0, 15) === checkInDate.toString().slice(0, 15)) {

        this.setState({
          priceOfStay: this.state.dates[i].nightlyRate * numNights,
          cleaningFee: thisNight.cleaningFee * numNights,
          serviceFee: thisNight.serviceFee * numNights
        });
        return;
      }
    }
  }

  getCheckIn() {
    return new Date(this.state.checkIn);
  }

  getCheckOut() {
    return new Date(this.state.checkOut);
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
        <div id = 'minNightlyRate' style={{display: this.state.minNightlyRate === 'none' ? 'none' : 'block' }}>
          { ` $${(this.state.checkOut === 'notSelected') ? this.state.minNightlyRate : Math.floor(this.state.priceOfStay / this.state.numNights)} per night`}
        </div>
        <br/>
        <div id = 'check-in'>
          <div id = "check-in1" style = {checkInStyle}>
            Check-in:
          </div>
        </div>
        <div id = 'check-in-add-date' data-testId ='checkInDate' onClick = {this.onClickCheckinShowCalendar.bind(this)}>
          {this.state.checkIn === 'notSelected' ? 'Add date' : `${this.daysMap[this.getCheckIn().getDay()]} ${this.monthsMap[this.getCheckIn().getMonth()]} ${this.getCheckIn().getDate()} ${this.getCheckIn().getFullYear()}` }
        </div>

        <div id = 'check-out'>
          <div id = "check-out1" style = {checkOutStyle}>
            Check-out:
          </div>
          <div id = 'check-out-add-date' data-testId ='checkOutDate' onClick = {this.onClickCheckoutShowCalendar.bind(this)}>
            {this.state.checkOut === 'notSelected' ? 'Add date' : `${this.daysMap[this.getCheckOut().getDay()]} ${this.monthsMap[this.getCheckOut().getMonth()]} ${this.getCheckOut().getDate()} ${this.getCheckOut().getFullYear()}`}
          </div>
        </div>

        <div id = 'calendar'>
          <div id = 'calendar-table' data-testId = 'calendar' style={{display: this.state.showing ? 'block' : 'none' }}>
            <Calendar maxSelectableDate = {this.state.maxSelectableDate} hoveredDate = {this.state.hoveredDate} changeHoveredDate = {this.changeHoveredDate.bind(this)} selectedCheckoutOnlyDate = {this.state.selectedCheckoutOnlyDate} dates = {this.state.dates} checkInDate = {this.state.checkIn} checkOutDate = {this.state.checkOut} clearDates = {this.clearDates.bind(this)} closeCalendar = {this.closeCalendar.bind(this)} dateClicked = {this.dateClicked.bind(this)}/>
          </div>


        </div>
        <div id = 'dateIsCheckoutOnly' style={{display: (this.state.checkoutOnlyShowing && (this.state.hoveredDate.toString().slice(0, 17) === this.state.selectedCheckoutOnlyDate.toString().slice(0, 17))) ? 'block' : 'none'}}> This date is check-out only. </div>
        <br/>
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

export default App;