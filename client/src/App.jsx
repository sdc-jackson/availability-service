
import React, {Component} from 'react';
import Calendar from './Calendar.jsx';
import ReservationSummary from './ReservationSummary.jsx';
import $ from 'jquery';
import urlHelpers from './urlHelpers.js';
import availabilityHelpers from './availabilityHelpers';
import Guests from './Guests.jsx';
import "@fontsource/roboto/700.css"
import styled from 'styled-components';
import GuestAdder from './GuestAdder.jsx';
import {StarOutlined, StarTwoTone, StarFilled} from '@ant-design/icons';

const StickyReservationDiv = styled.div`

  border-radius: 10px;
  position: sticky;
  top: 100px;
  background-color: white;
  border: 1px solid lightgrey;
  width: 300px;
  height: ${props => props.height};
  float:right;
  white-space: nowrap;
  box-shadow:         2px 2px 2px 3px #D8D8D8;
`;

const DatesGuestsTablePicker = styled.table`
    width: 250px;
    border-spacing: 0;
    position: fixed;
    top: 160px;
    right: 35px;
`;

const DatesGuestsTablePickerRow = styled.tr`
    border: 1px solid lightgrey;

    border-spacing: 0;
    line-height: 25px;

`;
const DatesGuestsTablePickerDiv = styled.div`
  border: ${(props) => {
    if (props.currentlySelecting === 'checkIn' && props.activeSelecting === true && props.checkin === true) {
      return '2px solid black;';
    } else if (props.currentlySelecting === 'checkOut' && props.activeSelecting === true && props.checkin === false) {
      return '2px solid black;';
    }
    return '1px solid lightgrey;';

  }}
  border-radius: ${props => props.checkin === true ? '10px 0 0 0' : '0 10px 0 0'};
  z-index: 105;

`;
const DatesGuestsTablePickerGuestRow = styled.tr`
    line-height: 25px;
`;
const DatesGuestsTablePickerGuestTd = styled.td`
    border: 1px solid lightgrey;
    colspan: "2";
    border-radius: 0 0 10px 10px;

`;

const TextDivSpaced = styled.div`
  margin-left: 5%;
`;

const ReserveButton = styled.button`
  position: fixed;
  float: right;
  right: 35px;
  top: 450px;
  border-radius: 10px;
  border: 1px solid white;
  background: linear-gradient(120DEG, #fd5c63, #c30b03);
  color: white;
  font-weight: 700;
  font-size: medium;
  width: 250px;
  height: 45px;
  text-align: center;
  line-height: 45px;
`;


const CheckAvailabilityButton = styled.div`
  position: fixed;
  float: right;
  top: 300px;
  right: 35px;
  border-radius: 10px;
  border: 1px solid white;
  background: linear-gradient(120DEG, #fd5c63, #c30b03);
  color: white;
  font-size: medium;
  width: 250px;
  height: 45px;
  text-align: center;
  z-index:98;
  line-height: 45px;

`;

const RateReviewsDiv = styled.div`
  width: 250px;
  right: 35px;
  top: 130px;
  display:flex;
  align-items: flex-end;
  justify-content: space-between;
  position: fixed;

`;

const RateDiv = styled.div`
  order: 1;
  display: flex;
  align-items: flex-end;
`;

const RateNumberDiv = styled.div`
  font-weight: 500;
  font-size: 20px;
  order: 1;
`;

const PerNightDiv = styled.div`
  font-weight: 500;
  font-size: 15px;
  order: 2;
`;

const ReviewsDiv = styled.div`
  float:right;
  order: 2;
  font-size: 12px;
`;



class App extends React.Component {
  constructor(props) {
    super(props);

    var today = new Date();
    today.setDate(1);
    var oneMonthFromToday = availabilityHelpers.getStartOfNextOrPrevMonth(today.toString(), 1);

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
      minNightlyRate: 'none',
      nameOfStay: 'Big Bear Lake', //fix me later!
      guests: {
        numAdults: 1,
        numChildren: 0,
        numInfants: 0
      },
      guestPickerShowing: false,
      month1Date: today,
      month2Date: oneMonthFromToday,
      checkoutOnlyX: 0,
      checkoutOnlyY: 0



    };

    this.monthsMap = availabilityHelpers.monthsMap;
    this.daysMap = availabilityHelpers.daysMap;
    this.history = this.props.history;
  }

  getStateObjFromUrl(searchStr, hash, dates) {
    var newState = {};

    newState.dates = dates;

    //should the calendar be showing?
    if (hash.slice(0, 22) === '#availability-calendar') {
      newState.showing = true;
      newState.activeSelecting = true;
    } else {
      newState.showing = false;
      newState.activeSelecting = false;
    }

    //guests?
    newState.guests = urlHelpers.getNumGuestsFromUrl(searchStr);


    //what dates do we have?
    var checkInDate = urlHelpers.getCheckInOrOutDateFromUrl(searchStr, 'checkIn');
    var checkOutDate = urlHelpers.getCheckInOrOutDateFromUrl(searchStr, 'checkOut');

    if (checkInDate === null) {
      //this means we don't have a check-in or check-out date (UI forces this)
      newState.checkIn = 'notSelected';
      newState.checkOut = 'notSelected';
      newState.maxSelectableDate = 'notSelected';
      newState.showReserveButton = false;
      newState.showCheckAvailabilityButton = true;
    } else {
      newState.showReserveButton = false;
      newState.checkIn = checkInDate.toString();
      this.updateDisplayedMonths(0, checkInDate.toString());
      if (checkOutDate === null) {
        //we have a check-in but not a check-out
        newState.checkOut = 'notSelected';
        newState.maxSelectableDate = availabilityHelpers.getMaxSelectableDate(checkInDate, dates);
        newState.currentlySelecting = 'checkOut';
        if (newState.showing) {
          newState.checkAvailability = false;
        }
      } else {
        //we have both check-in and check-out
        newState.checkOut = availabilityHelpers.getDateObjFromStr(checkOutDate.toString());
        newState.maxSelectableDate = availabilityHelpers.getDateObjFromStr(checkOutDate.toString());
        newState.currentlySelecting = 'checkIn';
        newState.showCheckAvailabilityButton = false;
        newState.showReserveButton = true;
        this.getTotalPrice(checkOutDate, checkInDate, dates);
      }
    }
    return newState;
  }

  componentDidMount() {
    var productId = window.location.pathname.split('/')[1];
    if (productId === null || productId === undefined || productId.length === 0) {
      productId = '109';
    }

    var windowLocationSearch = window.location.search;
    var windowLocationHash = window.location.hash;

    this.history.listen(() => {
      this.setState(this.getStateObjFromUrl(window.location.search, window.location.hash, this.state.dates));
    });

    var urlStateInfo;
    $.ajax({
      method: 'GET',
      url: `/${productId}/availableDates`,
      success: (dates) => {
        urlStateInfo = this.getStateObjFromUrl(windowLocationSearch, windowLocationHash, dates);
        $.ajax({
          method: 'GET',
          url: `/${productId}/minNightlyRate`,
          success: ({minNightlyRate}) => {
            urlStateInfo.minNightlyRate = minNightlyRate;
            this.setState(urlStateInfo);
          },
          error: (err) => {
            urlStateInfo.minNightlyRate = 100;
            this.setState(urlStateInfo);
          }
        });
      },
      error: (err) => {
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
      showReserveButton: false,
      showCheckAvailabilityButton: false
    });
  }
  onClickCheckoutShowCalendar() {
    window.location.hash = '#availability-calendar';
    var currentlySelecting = (this.state.checkIn === 'notSelected') ?  'checkIn' : 'checkOut';

    this.setState({
      showing: true,
      currentlySelecting: currentlySelecting,
      activeSelecting: true,
      showReserveButton: false,
      showCheckAvailabilityButton: false
    });
  }

  dateClicked(e, dateIsCheckoutOnly) {
    if (this.state.currentlySelecting === 'checkIn' && dateIsCheckoutOnly === false) {
      //go through dates and find the maxSelectableDate
      var checkInDate = availabilityHelpers.getDateObjFromStr(e);

      this.setState({
        checkIn: checkInDate.toString(),
        currentlySelecting: 'checkOut',
        maxSelectableDate: availabilityHelpers.getMaxSelectableDate(checkInDate, this.state.dates)
      });
      this.history.push(urlHelpers.makeQueryString(window.location.search, {
        check_in: checkInDate.toString(),
        guests: this.state.guests}), {foo: 'check_in'});
      window.location.hash = '#availability-calendar';

    } else if (this.state.currentlySelecting === 'checkOut') {
      //if we selected check-out date, set check-out date and close the calendar
      var checkOutDate = availabilityHelpers.getDateObjFromStr(e);
      this.setState({
        checkOut: checkOutDate.toString(),
        showing: false,
        activeSelecting: false,
        showCheckAvailabilityButton: false,
        showReserveButton: true,
        guestPickerShowing: false
      });
      this.history.push(urlHelpers.makeQueryString(window.location.search, {
        check_in: this.state.checkIn.toString(),
        check_out: checkOutDate.toString(),
        guests: this.state.guests}), {foo: 'check_out'});
      window.location.hash = '';
      this.getTotalPrice(checkOutDate.toString());
    } else if (dateIsCheckoutOnly) {
      var checkOutOnlyDate = availabilityHelpers.getDateObjFromStr(e);
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
      showCheckAvailabilityButton: true,
      showReserveButton: false,
      maxSelectableDate: 'notSelected'
    });
    this.history.push(urlHelpers.removeDatesFromQueryString(window.location.search), {foo: 'clear_dates'});

  }

  closeCalendar() {
    this.setState({
      activeSelecting: false,
      currentlySelecting: 'checkIn',
      showing: false,
    });
    window.location.hash = '';
  }

  changeHoveredDate(date) {
    var hDate = availabilityHelpers.getDateObjFromStr(date);
    this.setState({
      hoveredDate: hDate.toString()
    });
  }

  getTotalPrice(checkOut, checkIn, dates) {
    var checkOutDate = new Date(checkOut);
    if (checkIn === undefined) {
      var checkInDate = availabilityHelpers.getDateObjFromStr(this.state.checkIn);
    } else {
      var checkInDate = availabilityHelpers.getDateObjFromStr(checkIn);
    }
    if (dates === undefined) {
      dates = this.state.dates;
    }

    var numNights = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    this.setState({ numNights });
    for (var i = 0; i < dates.length; i++) {
      var thisNight = dates[i];
      var thisNightDate = availabilityHelpers.getDateObjFromStr(dates[i].date);
      if (thisNightDate.toString() === checkInDate.toString()) {
        this.setState({
          priceOfStay: dates[i].nightlyRate * numNights,
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

  showGuestPicker() {
    this.setState({
      guestPickerShowing: !this.state.guestPickerShowing
    });
  }

  closeGuestPicker() {
    this.setState({
      guestPickerShowing: false
    });
  }

  updateGuests(updateObj) {
    var stateUpdateObj = {
      numAdults: this.state.guests.numAdults,
      numChildren: this.state.guests.numChildren,
      numInfants: this.state.guests.numInfants
    };
    for (var guestType in updateObj) {
      stateUpdateObj[guestType] = updateObj[guestType];
    }
    this.setState({
      guests: stateUpdateObj
    });
    this.history.push(urlHelpers.makeQueryString(window.location.search, {
      guests: stateUpdateObj}), {foo: 'check_out'});
  }

  goNextMonth() {
    this.setState({
      month1Date: new Date(this.state.month2Date),
      month2Date: availabilityHelpers.getStartOfNextOrPrevMonth(this.state.month2Date.toString(), 1)
    });
  }

  goPrevMonth() {
    this.setState({
      month1Date: availabilityHelpers.getStartOfNextOrPrevMonth(this.state.month1Date.toString(), -1),  //new Date(this.state.month1Date.setDate(this.state.month1Date.getDate() - 31)),
      month2Date: availabilityHelpers.getStartOfNextOrPrevMonth(this.state.month2Date.toString(), -1) // new Date(this.state.month2Date.setDate(this.state.month2Date.getDate() - 31)),
    });
  }

  updateDisplayedMonths(dir, checkIn) {
    if (dir === -1) {
      this.goPrevMonth();
    } else if (dir === 1) {
      this.goNextMonth();
    } else if (dir === 0) {
      var newMonth1 = new Date(checkIn);
      if(this.state.month2Date.getMonth() !== newMonth1.getMonth()) {
        newMonth1.setDate(1);
        var newMonth2 = availabilityHelpers.getStartOfNextOrPrevMonth(newMonth1.toString(), 1);
        this.setState({
          month1Date: newMonth1,
          month2Date: newMonth2
        })
      }
    }
  }


  render() {
    var checkInStyle = {
      fontWeight: 'normal',
      fontSize: 'x-small'
    };
    var checkOutStyle = {
      fontWeight: 'normal',
      fontSize: 'x-small'
    };
    if (this.state.activeSelecting === true && this.state.currentlySelecting === 'checkIn') {
      var checkInStyle = {
        fontWeight: 700,
        fontSize: 'x-small'
      };
    }
    if (this.state.activeSelecting === true && this.state.currentlySelecting === 'checkOut') {
      var checkOutStyle = {
        fontWeight: 700,
        fontSize: 'x-small'
      };
    }
    return (
      <StickyReservationDiv height={this.state.showReserveButton ? '415px' : '300px'}>

        <RateReviewsDiv>
          <RateDiv>
            <RateNumberDiv>
              { ` $${(this.state.checkOut === 'notSelected') ? this.state.minNightlyRate : Math.floor(this.state.priceOfStay / this.state.numNights)}`}
            </RateNumberDiv>
            <PerNightDiv>
              {'  / night'}
            </PerNightDiv>
          </RateDiv>
          <ReviewsDiv>
            <StarFilled twoToneColor="#fd5c63" style={{color:'#c30b03'}} /> 4.78 <span style={{color: 'lightgrey'}}>(103)</span>
          </ReviewsDiv>
        </RateReviewsDiv>

        <div id = 'minNightlyRate' style={{display: this.state.minNightlyRate === 'none' ? 'none' : 'block' }}>
        </div>
        <br/>
        <DatesGuestsTablePicker>
          <tbody>
            <DatesGuestsTablePickerRow>
              <td>
              <DatesGuestsTablePickerDiv checkin = {true} currentlySelecting = {this.state.currentlySelecting} activeSelecting = {this.state.activeSelecting}>

                <TextDivSpaced>
                  <div id = "check-in1" style = {checkInStyle}>
                    CHECK-IN
                  </div>
                </TextDivSpaced>
                <TextDivSpaced>
                  <div id = 'check-in-add-date' data-testId ='checkInDate' onClick = {this.onClickCheckinShowCalendar.bind(this)}>
                    <span style={{color: '#404040', fontSize: '15px'}}>{this.state.checkIn === 'notSelected' ? 'Add date' : `${this.getCheckIn().getMonth() + 1}/${this.getCheckIn().getDate()}/${this.getCheckIn().getFullYear()}` }
                    </span>
                  </div>
                </TextDivSpaced>
              </DatesGuestsTablePickerDiv>
              </td>
              <td>
              <DatesGuestsTablePickerDiv checkin = {false} currentlySelecting = {this.state.currentlySelecting} activeSelecting = {this.state.activeSelecting}>
                <TextDivSpaced>
                  <div id = "check-out1" style = {checkOutStyle} >
                    CHECKOUT
                  </div>
                  <div id = 'check-out-add-date' data-testId ='checkOutDate' onClick = {this.onClickCheckoutShowCalendar.bind(this)}>
                    <span style={{color: '#404040', fontSize: '15px'}}>{this.state.checkOut === 'notSelected' ? 'Add date' : `${this.getCheckOut().getMonth() + 1}/${this.getCheckOut().getDate()}/${this.getCheckOut().getFullYear()}`}
                    </span>
                  </div>
                </TextDivSpaced>
              </DatesGuestsTablePickerDiv>
              </td>
            </DatesGuestsTablePickerRow>
            <DatesGuestsTablePickerGuestRow>
              <DatesGuestsTablePickerGuestTd colSpan={2}>
                <div id='guests' style={{display: this.state.showing ? 'none' : 'block'}}>
                  <Guests
                    guestPickerShowing = {this.state.guestPickerShowing}
                    guests={this.state.guests}
                    showGuestPicker={this.showGuestPicker.bind(this)}
                    closeGuestPicker={this.closeGuestPicker.bind(this)}
                    updateGuests={this.updateGuests.bind(this)}/>
                </div>
              </DatesGuestsTablePickerGuestTd>
            </DatesGuestsTablePickerGuestRow>
          </tbody>
          </DatesGuestsTablePicker>
        <div className='pop-out-guests-sticky' style={{display: this.state.guestPickerShowing ? 'block' : 'none' }}>
          <GuestAdder guests = {this.state.guests} updateGuests={this.updateGuests.bind(this)}/>
        </div>



        <div id = 'calendar' >
          <div id = 'calendar-table' data-testId = 'calendar' className='pop-out-calendar-sticky' style={{display: this.state.showing ? 'flex' : 'none' }}>
            <Calendar id = {1}
              maxSelectableDate = {this.state.maxSelectableDate}
              hoveredDate = {this.state.hoveredDate}
              changeHoveredDate = {this.changeHoveredDate.bind(this)}
              selectedCheckoutOnlyDate = {this.state.selectedCheckoutOnlyDate}
              dates = {this.state.dates}
              checkInDate = {this.state.checkIn}
              checkOutDate = {this.state.checkOut}
              clearDates = {this.clearDates.bind(this)}
              closeCalendar = {this.closeCalendar.bind(this)}
              dateClicked = {this.dateClicked.bind(this)}
              month1Date = {this.state.month1Date}
              month2Date = {this.state.month2Date}
              updateDisplayedMonths = {this.updateDisplayedMonths.bind(this)}
              checkoutOnlyX = {this.state.checkoutOnlyX}
              checkoutOnlyY = {this.state.checkoutOnlyY}
              checkoutOnlyShowing = {this.state.checkoutOnlyShowing}/>
          </div>


        </div>
        {/* <div id = 'dateIsCheckoutOnly' style={{zIndex: '109', display: (this.state.checkoutOnlyShowing && (this.state.hoveredDate.toString().slice(0, 17) === this.state.selectedCheckoutOnlyDate.toString().slice(0, 17))) ? 'block' : 'none'}}> This date is check-out only. </div> */}
        <br/>
        <CheckAvailabilityButton
          onClick={this.onClickCheckinShowCalendar.bind(this)}
          style={{display: (this.state.showCheckAvailabilityButton) ? 'block' : 'none'}}>
          Check availability
        </CheckAvailabilityButton>

        <div style={{display: (this.state.showReserveButton) ? 'block' : 'none'}}>
          <br/>
          <br/>
          <ReservationSummary
            cleaningFee = {this.state.cleaningFee}
            serviceFee = {this.state.serviceFee}
            numNights = {this.state.numNights}
            priceOfStay = {this.state.priceOfStay}/>
          <ReserveButton >Reserve</ReserveButton>
        </div>
      </StickyReservationDiv>


    );
  }
}

export default App;