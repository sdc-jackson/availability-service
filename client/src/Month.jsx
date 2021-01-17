import React, {Component} from 'react'
import Week from './Week.jsx';

class Month extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id = 'month1'>
            {this.props.month}
            <table>
              <tbody>
                <tr>
                  <td>Su</td>
                  <td>Mo</td>
                  <td>Tu</td>
                  <td>We</td>
                  <td>Th</td>
                  <td>Fr</td>
                  <td>Sa</td>
                </tr>
                {/* <Week thisWeek = {['blank', 'blank', 'blank', 'blank', 'blank', 'blank', 'blank']} /> */}
                {this.props.weeks.map((arr) => {
                  console.log('making a week', arr);
                  return <Week thisWeek = {arr} />
                })}
              </tbody>
            </table>
          </div>
    );
  }
}

export default Month;