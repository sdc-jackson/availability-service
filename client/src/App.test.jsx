import React from 'react';
import renderer from 'react-test-renderer';
import AppsRoot from './AppsRoot.jsx';
import {render, fireEvent, screen, cleanup, waitFor} from '@testing-library/react';
import { TestWatcher } from 'jest';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import exampleData from './exampleData.js';

import '@testing-library/jest-dom/extend-expect';
//import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'


it('renders correctly', () => {
  const tree = renderer
    .create(<AppsRoot />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});


const server = setupServer(
  rest.get('/109/availableDates', (req, res, ctx) => {
    return res(ctx.json(exampleData));
  }),
  rest.get('/109/minNightlyRate', (req, res, ctx) => {
    return res(ctx.json({minNightlyRate: 888}))
  })
)

beforeAll(() => server.listen());

beforeEach( () => {
  console.log('> setup test')
});

afterEach( () => {
  console.log('< teardown test')
  server.resetHandlers();
});

afterAll(() => server.close());

describe("Calendar tests", () => {






  test('Scroll to next month button', async() => {
    const { unmount } = render(<AppsRoot />)
    const marchMonthsBefore = await screen.queryByText('March');
    expect(marchMonthsBefore).toBe(null);

    fireEvent.click(screen.getByText('Check Availability'))
    fireEvent.click(screen.getAllByText('>>')[0]);

    const marchMonthsAfter = await screen.findAllByText('March');


    expect(marchMonthsAfter).toHaveLength(1);
    unmount();
  })


  test('Calendar has different formatting for available, unavailable, and checkOutOnly dates', async() => {
    const { unmount } = render(<AppsRoot />)


    fireEvent.click(screen.getByText('Check Availability'));

    const blockedDates = await screen.findAllByTestId('blocked');
    const normalDates = await screen.findAllByTestId('normal');
    const checkOutOnly = await screen.findAllByTestId('checkOutOnly');
    expect(blockedDates[0]).toBeInTheDocument();
    expect(normalDates[0]).toBeInTheDocument();
    expect(checkOutOnly[0]).toBeInTheDocument();

    unmount();

  })

  test('Hovering over an available date changes its formatting to \'hovered date\'', async() => {
    const { unmount } = render(<AppsRoot />)


    fireEvent.click(screen.getByText('Check Availability'));
    const normalDates = await screen.findAllByTestId('normal');

    fireEvent.mouseOver(normalDates[0]);

    const blockedDates = await screen.findAllByTestId('hoveredDate');
    expect(blockedDates[0]).toBeInTheDocument();

    unmount();
  })

  test('Selecting a check-in date updates the listed check-in date and changes the date style', async() => {
    const { unmount } = render(<AppsRoot />)



    fireEvent.click(screen.getByText('Check Availability'));
    const normalDates = await screen.findAllByTestId('normal');
    fireEvent.click(normalDates[0]);

    const blockedDates = await screen.findAllByTestId('checkInDate');
    //const checkInDate = await screen.findAllBy
    expect(blockedDates[0].innerHTML).toEqual('Mon Jan 18 2021');
    const checkInDate = await screen.findAllByTestId('checkInOut');
    expect(checkInDate[0]).toBeInTheDocument();
    unmount();

  })



  test('Selecting a check-out date updates the listed check-out date and pulls up the reservation summary', async() => {
    const { unmount } = render(<AppsRoot />)

    fireEvent.click(screen.getByText('Check Availability'));

    //select a check-in date
    const normalDates = await screen.findAllByTestId('normal');
    fireEvent.click(normalDates[0]);
    console.log('checking in on ', normalDates[0].innerHTML)

    const checkInDate = await screen.findAllByTestId('checkInDate');
    console.log('checkInDate:', checkInDate[0].innerHTML)

    //select a check-out date & check that the form at the top appears this way
    const nextCheckOut = await screen.findAllByTestId('normal');
    fireEvent.click(nextCheckOut[0]);


    await waitFor(() => screen.findAllByTestId('checkOutDate'));
    expect(screen.findAllByTestId('checkOutDate')[0]).not.toEqual('Add date');

    //check that the date formatting on the calendar changed
    var checkInOut = await screen.findAllByTestId('checkInOut');
    expect(checkInOut).toHaveLength(1);

    //check that the reservation form pops up
    const nightlyTotal = await screen.findAllByText('$253 per night x 1 nights = $253');
    const cleaningFee = await screen.findAllByText('Cleaning Fee: $10');
    const serviceFee = await screen.findAllByText('Service Fee: $2');
    const total = await screen.findAllByText('Total: $265');
    const reserveButton = await screen.findAllByText('Reserve');

    expect(nightlyTotal[0]).toBeInTheDocument();
    expect(cleaningFee[0]).toBeInTheDocument();
    expect(serviceFee[0]).toBeInTheDocument();
    expect(total[0]).toBeInTheDocument();
    expect(reserveButton[0]).toBeInTheDocument();

    unmount();
  })

  test('Selecting the selected check-in or check-out date should pull up the calendar, whether in the initial form or reservation summary', async() => {
    const { unmount } = render(<AppsRoot />)

    const calendarInit = await screen.findAllByTestId('calendar');
    expect(calendarInit[0].style._values.display).toEqual('none');

    const addDate = screen.getAllByText('Add date')
    fireEvent.click(addDate[0]);

    const calendar2 = await screen.findAllByTestId('calendar');
    expect(calendar2[0].style._values.display).toEqual('block');

    const normalDates1 = await screen.findAllByTestId('normal');

    // //select a check-in date
    fireEvent.click(normalDates1[0]);

    //select a check-out date & check that the form at the top appears this way
    const nextCheckOut = await screen.findAllByTestId('normal');
    fireEvent.click(nextCheckOut[0]);

    const checkOutDate = await screen.findAllByTestId('checkOutDate');
    expect(checkOutDate[0].innerHTML).not.toEqual('Add date');

    const nextCheckOutClicked = await screen.findAllByTestId('checkInOut');
    expect(nextCheckOutClicked).not.toHaveLength(0);

    fireEvent.click(checkOutDate[0]);
    const calendar = await screen.findAllByTestId('calendar');
    expect(calendar[0].style._values.display).toEqual('block');

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