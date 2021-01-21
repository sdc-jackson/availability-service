import React from 'react';
import renderer from 'react-test-renderer';
import App from './App.jsx';
import {render, fireEvent, screen} from '@testing-library/react';
import { TestWatcher } from 'jest';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import exampleData from './exampleData.js';
import '@testing-library/jest-dom/extend-expect';

it('renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('Scroll to next month button', async() => {
  render(<App />)
  const marchMonthsBefore = await screen.queryByText('March');
  expect(marchMonthsBefore).toBe(null);

  fireEvent.click(screen.getByText('Check Availability'))
  fireEvent.click(screen.getByText('>>'));

  const marchMonthsAfter = await screen.findAllByText('March');


  expect(marchMonthsAfter).toHaveLength(1);
})


const server = setupServer(
  rest.get('/109/availableDates', (req, res, ctx) => {

    return res(ctx.json(exampleData))
  })
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Calendar has different formatting for available vs unavailable dates', async() => {
  render(<App />)


  fireEvent.click(screen.getByText('Check Availability'));

  const blockedDates = await screen.findAllByTestId('blocked');
  const normalDates = await screen.findAllByTestId('normal');
  expect(blockedDates[0]).toBeInTheDocument();
  expect(normalDates[0]).toBeInTheDocument();

})


