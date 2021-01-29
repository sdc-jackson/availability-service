import React, {Component} from 'react';
import Week from './Week.jsx';
import styled from 'styled-components';




const MonthScrollFlexDiv = styled.div`
  display: flex;
  height: 30px;
  width: 260px;
`;

const MonthScrollButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid white;
  fill: ${props => {
    if(props.first && props.id=== 'nextMonthButton') {
      return 'white';
    } else if (!props.first && props.id === 'prevMonthButton') {
      return 'white';
    } else {
      return 'black'
    }
  }};
  height: 30px;
  width: 30px;
  &:hover {
    background-color: ${props => {
      if(props.first && props.id=== 'nextMonthButton') {
        return 'white';
      } else if (!props.first && props.id === 'prevMonthButton') {
        return 'white';
      } else {
        return 'lightgrey'
      }
    }};
  }
`;

const PrevMonthFlexChildDiv = styled.div`
  align-self: flex-start;
`;
const NextMonthFlexChildDiv = styled.div`
  align-self: flex-end;
`;
const MonthYearFlexChildDiv = styled.div`
  flex: 4;
  align-self: center;
  text-align: center;
  font-weight: 500;
`;



const CalendarTable = styled.table`
  width: 260px;
  height: 260px;
  text-align: center;
  border-collapse: collapse;
`;

const DOWRow = styled.tr`
  color: grey;
`;

// const MonthRow = styled.tr`
//   font-weight: 700;
//   font-size: medium
//   text-align: center
// `;

// const ButtonTd = styled.td`
//   column-width:
// `;




class Month extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id = 'month1' >
        <MonthScrollFlexDiv>
          <PrevMonthFlexChildDiv first={this.props.first}>
            <MonthScrollButtonDiv first={this.props.first} id ={'prevMonthButton'} onClick = {() => {this.props.updateDisplayedMonths(-1);}} >
              <svg style={{height: '20px', width: '20px'}}>
                <path d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z" fill-rule="evenodd"></path>
              </svg>
            </MonthScrollButtonDiv>
          </PrevMonthFlexChildDiv>
          <MonthYearFlexChildDiv>{this.props.month} {this.props.year}</MonthYearFlexChildDiv>
          <NextMonthFlexChildDiv first={this.props.first}>
            <MonthScrollButtonDiv first={this.props.first} id={'nextMonthButton'} onClick = {() => {this.props.updateDisplayedMonths(1);}} >
              <svg style={{height: '20px', width: '20px'}}>
                <path d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z" fill-rule="evenodd"></path>
              </svg>
            </MonthScrollButtonDiv>
          </NextMonthFlexChildDiv>
        </MonthScrollFlexDiv>
        <CalendarTable>
          <tbody>
            <DOWRow>
              <td>Su</td>
              <td>Mo</td>
              <td>Tu</td>
              <td>We</td>
              <td>Th</td>
              <td>Fr</td>
              <td>Sa</td>
            </DOWRow>
            {this.props.weeks.map((arr, index) => {
              return (<Week key={index} maxSelectableDate = {this.props.maxSelectableDate} selectedCheckoutOnlyDate = {this.props.selectedCheckoutOnlyDate} dates = {this.props.dates} checkInDate = {this.props.checkInDate} checkOutDate = {this.props.checkOutDate} hoveredDate = {this.props.hoveredDate} changedHoveredDate = {this.props.changedHoveredDate} thisWeek = {arr} dateClicked = {this.props.dateClicked}/>);
            })}
          </tbody>
        </CalendarTable>
      </div>
    );
  }
}

export default Month;