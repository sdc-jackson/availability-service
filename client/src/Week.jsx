import React, {Component} from 'react'

class Week extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('WEEK PROPS: ', this.props.thisWeek)
    return (<tr>
      {this.props.thisWeek.map((item) => {
        console.log('making week in week', item)
        return <td class = 'day' onClick={() => {this.props.dateClicked(item);}}> {item === 'blank' ? '- ' : item.getDate()} </td>
      })}

    </tr>)
  }

}

export default Week;