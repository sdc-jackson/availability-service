import React from 'react';
import renderer from 'react-test-renderer';
import AppsRoot from './AppsRoot.jsx';
import {render, fireEvent, screen, cleanup, waitFor} from '@testing-library/react';
import { TestWatcher } from 'jest';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import exampleData from './exampleData.js';

import '@testing-library/jest-dom/extend-expect';
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'



var server1 = setupServer(
  rest.get('/rooms/109/:thisone', async (req, res, ctx) => {

    if(req.params.thisone === 'availableDates') {
      return res(ctx.status(200), ctx.json(exampleData));
    } else {
      return res(ctx.status(200), ctx.json({minNightlyRate: 888}))
    }
  })
);



describe("Calendar tests", () => {


  test('Selecting the selected check-in or check-out date should pull up the calendar', async( done) => {

    server1.listen();
    const { unmount } = render(<AppsRoot />);

    var calendar1 = screen.queryAllByTestId('calendar');
    await waitFor(() => expect(calendar1[0].style._values.display).toEqual('none'));

    const checkOutDate = screen.queryAllByTestId('checkOutDate');
    fireEvent.click(checkOutDate[0]);

    var calendar2 = screen.queryAllByTestId('calendar');
    await waitFor(() => expect(calendar2[0].style._values.display).toEqual('flex'));

    setTimeout(() => {
      unmount();
      server1.close();
      done();
    }, 3000);
  })

  test('The calendars communicate- i.e. selecting a date in the secondary calendar modifies the displayed check-in date in the primary calendar', async( done) => {

    server1.listen();
    const { unmount } = render(<AppsRoot />);

    await waitFor(() => {
      const selectedCheckInDate = screen.queryAllByText("3");
      console.log(selectedCheckInDate[0].innerHTML);
      fireEvent.click(selectedCheckInDate[0]);
    });

    const checkInBox = screen.queryAllByTestId('checkInDate');
    var innerDate = checkInBox[0].innerHTML.split('>')
    var inner = innerDate[1].split('<')[0];
    await waitFor(() => expect(inner).toEqual('2/3/2021'));


    setTimeout(() => {
      //screen.logTestingPlaygroundURL()
      unmount();
      server1.close();
      done();
    }, 3000);
  })


  test('Clicking a check-in and check-out date pulls up the reservation summary', async(done) => {

    server1.listen();
    const { unmount } = render(<AppsRoot />);

    await waitFor(() => {
      const selectedCheckInDate = screen.queryAllByText("3");
      console.log(selectedCheckInDate[0].innerHTML);
      fireEvent.click(selectedCheckInDate[0]);
    });
    await waitFor(() => {
      const selectedCheckOutDate = screen.queryAllByText("5");
      console.log(selectedCheckOutDate[0].innerHTML);
      fireEvent.click(selectedCheckOutDate[0]);
    });

    await waitFor(() => {
      const reservationSummaryButton = screen.queryAllByText("Reserve");
      console.log(reservationSummaryButton[0].innerHTML);
      expect(reservationSummaryButton).toHaveLength(1);
    })


    setTimeout(() => {
      //screen.logTestingPlaygroundURL()
      unmount();
      server1.close();
      done();
    }, 3000);
  })


});

