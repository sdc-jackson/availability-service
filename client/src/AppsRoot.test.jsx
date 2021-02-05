import React from 'react';
import renderer from 'react-test-renderer';
import AppsRoot from './AppsRoot.jsx';
import {render, fireEvent, screen, cleanup, waitFor} from '@testing-library/react';
import { TestWatcher } from 'jest';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {exampleData} from './exampleData.js';

import '@testing-library/jest-dom/extend-expect';
//import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'


// it('renders correctly', async () => {
//   const tree = await renderer
//     .create(<AppsRoot />)
//     .toJSON();
//   expect(tree).toMatchSnapshot();
// });



var server1 = setupServer(
  rest.get('/rooms/109/minNightlyRate', (req, res, ctx) => {
    console.log('got request to minnightlyrate')
    return res(ctx.status(200), ctx.json({minNightlyRate: 888}))
  })
);
server1.use(
  rest.get('/rooms/109/availableDates', (req, res, ctx) => {
    console.log('got request to available dates. sending exampleData')
    return res(ctx.status(200), ctx.json({exampleData}));
  })
);

var originalConsoleLog = console.log;
var consoleMessages = [];

var mockConsoleLog = async (message) => {
  consoleMessages.push(message);
}

beforeAll(() => {
  server1.listen()
  //server2.listen()
});

beforeEach( () => {
  //console.log('> setup test')
  console.log = mockConsoleLog;

});

afterEach( () => {
  //console.log('< teardown test')
  console.log = originalConsoleLog;
  console.log(consoleMessages);
  server1.resetHandlers();
  //server2.resetHandlers();
});

afterAll(() => {
  server1.close()
  //server2.close()
});

describe("Calendar tests", () => {






  // test('Scroll to next month button', async() => {
  //   const { unmount } = render(<AppsRoot />)
  //   const marchMonthsBefore = await screen.queryByText('March');
  //   expect(marchMonthsBefore).toBe(null);

  //   fireEvent.click(screen.queryByText('Check availability'))
  //   fireEvent.click(screen.queryAllByTestId('nextMonthButton')[0]);

  //   const marchMonthsAfter = await screen.findAllByText('March');


  //   expect(marchMonthsAfter).toHaveLength(1);
  //   unmount();
  // })


  // test('Calendar has different formatting for available, unavailable, and checkOutOnly dates', async() => {
  //   const { unmount } = render(<AppsRoot />)


  //   fireEvent.click(screen.queryByText('Check availability'));

  //   const blockedDates = await screen.queryAllByTestId('blocked');
  //   const normalDates = await screen.queryAllByTestId('normal');
  //   const checkOutOnly = await screen.queryAllByTestId('checkOutOnly');
  //   expect(blockedDates[0]).toBeInTheDocument();
  //   expect(normalDates[0]).toBeInTheDocument();
  //   expect(checkOutOnly[0]).toBeInTheDocument();

  //   unmount();

  // })

  // test('Hovering over an available date changes its formatting to \'hovered date\'', async() => {
  //   const { unmount } = render(<AppsRoot />)


  //   fireEvent.click(screen.queryByText('Check availability'));
  //   const normalDates = await screen.queryAllByText(/1/i);

  //   fireEvent.mouseOver(normalDates[0]);

  //   const blockedDates = await screen.queryAllByTestId('hoveredDate');
  //   expect(blockedDates[0]).toBeInTheDocument();

  //   unmount();
  // })

  // test('Selecting a check-in date updates the listed check-in date and changes the date style', async() => {
  //   const { unmount } = render(<AppsRoot />)



  //   fireEvent.click(screen.queryByText('Check availability'));
  //   const normalDates = await screen.queryAllByText(/1/i);
  //   fireEvent.click(normalDates[0]);

  //   const blockedDates = await screen.queryAllByTestId('checkInDate');
  //   //const checkInDate = await screen.findAllBy
  //   expect(blockedDates[0].innerHTML).toEqual('2/1/2021');
  //   const checkInDate = await screen.queryAllByTestId('checkInOut');
  //   expect(checkInDate[0]).toBeInTheDocument();
  //   unmount();

  // })



  // test('Selecting a check-out date updates the listed check-out date and pulls up the reservation summary', async() => {
  //   const { unmount } = render(<AppsRoot />)

  //   fireEvent.click(screen.queryByText('Check availability'));

  //   //select a check-in date
  //   const normalDates = await screen.queryAllByRole('cell', {name: /1/i});
  //   fireEvent.click(normalDates[0]);
  //   console.log('checking in on ', normalDates[0].innerHTML)

  //   const checkInDate = await screen.queryAllByTestId('checkInDate');
  //   console.log('checkInDate:', checkInDate[0].innerHTML)

  //   //select a check-out date & check that the form at the top appears this way
  //   const nextCheckOut = await screen.queryAllByRole('cell', {name: /3/i});
  //   fireEvent.click(nextCheckOut[0]);


  //   await waitFor(() => screen.queryAllByTestId('checkOutDate'));
  //   expect(screen.queryAllByTestId('checkOutDate')[0]).not.toEqual('Add date');

  //   //check that the date formatting on the calendar changed
  //   var checkInOut = await screen.queryAllByTestId('checkInOut');
  //   expect(checkInOut).toHaveLength(1);

  //   //check that the reservation form pops up
  //   const nightlyTotal = await screen.queryAllByText('$253 per night x 1 nights = $253');
  //   const cleaningFee = await screen.queryAllByText('Cleaning Fee: $10');
  //   const serviceFee = await screen.queryAllByText('Service Fee: $2');
  //   const total = await screen.queryAllByText('Total: $265');
  //   const reserveButton = await screen.queryAllByText('Reserve');

  //   expect(nightlyTotal[0]).toBeInTheDocument();
  //   expect(cleaningFee[0]).toBeInTheDocument();
  //   expect(serviceFee[0]).toBeInTheDocument();
  //   expect(total[0]).toBeInTheDocument();
  //   expect(reserveButton[0]).toBeInTheDocument();

  //   unmount();
  // })

  test('Selecting the selected check-in or check-out date should pull up the calendar, whether in the initial form or reservation summary', async() => {
    const { unmount } = await render(<AppsRoot />)

    // const calendarInit = await screen.queryAllByTestId('calendar');
    // expect(calendarInit[0].style._values.display).toEqual('none');

    // //await screen.logTestingPlaygroundURL();
    // const addDate = await screen.queryAllByText('Add date')
    // fireEvent.click(addDate[0]);

    // const calendar2 = await screen.queryAllByTestId('calendar');
    // expect(calendar2[0].style._values.display).toEqual('flex');


    // const normalDates1 = await screen.queryAllByRole('cell', {name: /1/i});

    // // //select a check-in date
    // await fireEvent.click(normalDates1[0]);
    // //await screen.logTestingPlaygroundURL();
    // //select a check-out date & check that the form at the top appears this way
    // const nextCheckOut = await screen.queryAllByRole('cell', {name: /3/i});
    // fireEvent.click(nextCheckOut[0]);

    // const checkOutDate = await screen.queryAllByTestId('checkOutDate');
    // expect(checkOutDate[0].innerHTML).not.toEqual('Add date');

    // const nextCheckOutClicked = await screen.queryAllByTestId('checkInOut');
    // //screen.logTestingPlaygroundURL();
    // expect(nextCheckOutClicked).not.toHaveLength(0);

    // fireEvent.click(checkOutDate[0]);
    // const calendar = await screen.queryAllByTestId('calendar');
    // expect(calendar[0].style._values.display).toEqual('flex');

    unmount();

  })
});



// test('Shows calendar if URL has appropriate hash', async() => {
//   var history = createMemoryHistory()

//   history.push('#availability-calendar')
//   render(<Router history={history} ><App /></Router>)
//   const calendar = await screen.findAllByTestId('calendar');
//   expect(calendar[0].style._values.display).toEqual('block');

// })