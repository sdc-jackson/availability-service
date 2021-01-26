import React from 'react';


class GuestAdder extends React.Component {
  constructor(props) {
    super(props);
  }



  render() {
    return(<div>
      <div><table>
          <tbody>
            <tr>
              <td>Adults</td>
              <td onClick={() => {this.props.updateGuests({numAdults: this.props.guests.numAdults - 1})}}>-</td>
              <td>{this.props.guests.numAdults}</td>
              <td onClick={() => {this.props.updateGuests({numAdults: this.props.guests.numAdults + 1})}}>+</td>
            </tr>
            <tr>
              <td>Children</td>
              <td onClick={() => {this.props.updateGuests({numChildren: this.props.guests.numChildren - 1})}}>-</td>
              <td>{this.props.guests.numChildren}</td>
              <td onClick={() => {this.props.updateGuests({numChildren: this.props.guests.numChildren + 1})}}>+</td>
            </tr>
            <tr>
              <td>Infants</td>
              <td onClick={() => {this.props.updateGuests({numInfants: this.props.guests.numInfants - 1})}}>-</td>
              <td>{this.props.guests.numInfants}</td>
              <td onClick={() => {this.props.updateGuests({numInfants: this.props.guests.numInfants + 1})}}>+</td>
            </tr>
          </tbody>
        </table></div>

    </div>)
  }
}

export default GuestAdder;