import React, {Component} from 'react';
import {createBrowserHistory} from 'history';
import App from './App.jsx';
import AppSecondary from './AppSecondary.jsx';
import SamplePage from './samplePage.js';
import "@fontsource/roboto"
import $ from 'jquery';
//import styled from 'styled-components';
const {styled} = window;

const RestOfPage = styled.div`
  color: white;
  z-index: 1;
  position: static;
  top: 1000px;

`;

class AppsRoot extends Component {


  render() {
    const history = createBrowserHistory();

    return (<div>
      <App id={1} history={history}/>
      <AppSecondary id={2} history={history}/>
      {/* <RestOfPage>
        {SamplePage.words}
      </RestOfPage> */}
    </div>);
  }
}

export default AppsRoot;