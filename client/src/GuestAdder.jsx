import React from 'react';
import styled from 'styled-components'

const GuestPickerTable = styled.table`

`;
const GptTD = styled.td`
  column-width: 180px;
`;

const PlusCircle = styled.div`
  border-radius: 50%;
  width: 18px;
  text-align: center;
  border: 1px solid black;
  background: white;
  font: 13px Arial, sans-serif;
  z-index: 100;
`;

class GuestAdder extends React.Component {
  constructor(props) {
    super(props);
  }



  render() {
    return (<div>
      <div>

        <GuestPickerTable>
          <tbody>
            <tr>
              <GptTD>Adults</GptTD>
              <td onClick={ () => { this.props.updateGuests({numAdults: this.props.guests.numAdults - 1}); }}><PlusCircle>-</PlusCircle></td>
              <td>{this.props.guests.numAdults}</td>
              <td onClick={ () => { this.props.updateGuests({numAdults: this.props.guests.numAdults + 1}); }}><PlusCircle>+</PlusCircle></td>
            </tr>
            <tr>
              <GptTD>Children</GptTD>
              <td onClick={ () => { this.props.updateGuests({numChildren: this.props.guests.numChildren - 1}); }}><PlusCircle>-</PlusCircle></td>
              <td>{this.props.guests.numChildren}</td>
              <td onClick={ () => { this.props.updateGuests({numChildren: this.props.guests.numChildren + 1}); }}><PlusCircle>+</PlusCircle></td>
            </tr>
            <tr>
              <GptTD>Infants</GptTD>
              <td onClick={ () => { this.props.updateGuests({numInfants: this.props.guests.numInfants - 1}); }}><PlusCircle>-</PlusCircle></td>
              <td>{this.props.guests.numInfants}</td>
              <td onClick={ () => { this.props.updateGuests({numInfants: this.props.guests.numInfants + 1}); }}><PlusCircle>+</PlusCircle></td>
            </tr>
          </tbody>
        </GuestPickerTable>
      </div>
    </div>);
  }
}

export default GuestAdder;