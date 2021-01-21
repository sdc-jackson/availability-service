import React from 'react';
import renderer from 'react-test-renderer';
import App from './App.jsx';
import {render, fireEvent, screen} from '@testing-library/react';
import { TestWatcher } from 'jest';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import exampleData from './exampleData.js';

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
  //console.log(marchMonthsAfter)


  expect(marchMonthsAfter).toHaveLength(1);
  //expect(items).toHaveLength(1)
})


const server = setupServer(
  rest.get('/109/availableDates', (req, res, ctx) => {

    return res(ctx.json(exampleData))
  })
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Calendar shows up when user clicks add date under check-in', async() => {
  render(<App />)


  fireEvent.click(screen.getByText('Check Availability'));

  const janAfter = await screen.findAllByText('color: black; background-color: white;');
  expect(janAfter).toHaveLength(1);

})


