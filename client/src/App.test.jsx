import React from 'react';
import renderer from 'react-test-renderer';
import App from './App.jsx';
import {render, fireEvent, screen} from '@testing-library/react';
import { TestWatcher } from 'jest';

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
  console.log(marchMonthsAfter)


  expect(marchMonthsAfter).toHaveLength(1);
  //expect(items).toHaveLength(1)
})

