import React, {Component} from 'react';
import {createBrowserHistory} from 'history';
import App from './App.jsx';
import AppSecondary from './AppSecondary.jsx';


class AppsRoot extends Component {
  render() {
    const history = createBrowserHistory();

    return (<div>
      <App id={1} history={history}/>
      <AppSecondary id={2} history={history}/>

    </div>);
  }
}

export default AppsRoot;