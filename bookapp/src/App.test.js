import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './Store/store';

test('renders the application without crashing', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  // Using queryAllByText because "Login" might appear in the Header and the Page
  const loginElements = screen.queryAllByText(/Login/i);
  expect(loginElements.length).toBeGreaterThan(0);
});
