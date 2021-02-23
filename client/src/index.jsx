import React from 'react';
import ReactDOM from 'react-dom';
//import AppsRoot from './AppsRoot.jsx';
import App from './App.jsx';
import AppSecondary from './AppSecondary.jsx';
import '../dist/styles.css';
import {createBrowserHistory} from 'history';
import "@fontsource/roboto"

const history = createBrowserHistory();

var domContainer1 = document.getElementById('availabilityApp1');
var domContainer2 = document.getElementById('availabilityApp2');
ReactDOM.render(<App id={1} history={history} />, domContainer1); // id={1} history={history}/>, domContainer1);
ReactDOM.render(<AppSecondary id={2} history={history}/>, domContainer2);





// import $ from 'jquery';
// import styled from 'styled-components';

// const RestOfPage = styled.div`
//   color: white;
//   z-index: 1;
//   position: static;
//   top: 1000px;

// `;

// class AppsRoot extends Component {


//   render() {
//     const history = createBrowserHistory();

//     return (<div>
//       <App id={1} history={history}/>
//       <AppSecondary id={2} history={history}/>
//       {/* <RestOfPage>
//         {SamplePage.words}
//       </RestOfPage> */}
//     </div>);
//   }
// }

// export default AppsRoot;