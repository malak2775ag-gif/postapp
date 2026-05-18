import Login from '../components/login';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import reducer from '../Features/UserSlice';

// 3. Initialize the Mock Store
const mockStore = configureStore([]);
const store = mockStore({
  users: { isSuccess: false, isError: false, user: null, isLoading: false, message: '' },
});

// 4. Test the UI Snapshot
test('matches the UI snapshot with screen.debug()', () => {
  const { container } = render(
    <Provider store={store}>
      <Router>
        <Login />
      </Router>
    </Provider>
  );

  screen.debug(container);
  expect(container).toMatchSnapshot();
});

// 5. Validate Email Format
test('validates email format using regex', () => {
  render(
    <Provider store={store}>
      <Router>
        <Login />
      </Router>
    </Provider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  fireEvent.change(emailInput, { target: { value: 'valid.email@example.com' } });
  expect(emailRegex.test(emailInput.value)).toBe(true);

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  expect(emailRegex.test(emailInput.value)).toBe(false);
});

// 6. Validate Password Format
test('validates password format using regex', () => {
  render(
    <Provider store={store}>
      <Router>
        <Login />
      </Router>
    </Provider>
  );

  const passwordInput = screen.getByLabelText(/password/i);
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

  fireEvent.change(passwordInput, { target: { value: 'Abc@123' } });
  expect(passwordRegex.test(passwordInput.value)).toBe(true);
});

// 7. Testing the initial state of store
const initval1 = {
  user: null,
  isSuccess: false,
  isError: false,
  isLoading: false,
  message: '',
};

// 8. Test Form Submission Interaction
test('dispatches login action on form submission', () => {
  render(
    <Provider store={store}>
      <Router>
        <Login />
      </Router>
    </Provider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'Pass@123' } });
  fireEvent.click(loginButton);

  const actions = store.getActions();
  // Checks if at least one action was dispatched (the login pending action)
  expect(actions.length).toBeGreaterThan(0);
});

// 9. Test Loading State UI
test('shows loading state on the button when isLoading is true', () => {
  const loadingStore = mockStore({
    users: { isSuccess: false, isError: false, user: null, isLoading: true, message: '' },
  });

  render(
    <Provider store={loadingStore}>
      <Router>
        <Login />
      </Router>
    </Provider>
  );

  const loginButton = screen.getByRole('button');
  expect(loginButton).toBeDisabled();
  expect(loginButton).toHaveTextContent(/logging in/i);
});

test("Should return initial state from reducer", () => {
  expect(
    reducer(undefined, {
      type: undefined,
    })
  ).toEqual(initval1);
});