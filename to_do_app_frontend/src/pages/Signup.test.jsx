import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from './Signup';

describe('Signup Component', () => {
  test('renders signup form correctly', () => {
    render(<Signup />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('validates input fields', async () => {
    render(<Signup />);
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signupButton = screen.getByRole('button', { name: /Sign Up/i });

    // Empty form submission
    userEvent.click(signupButton);
    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();

    // Valid form submission
    userEvent.type(usernameInput, 'testuser');
    userEvent.type(passwordInput, 'password123');
    userEvent.click(signupButton);
    expect(screen.queryByText(/Username is required/i)).toBeNull();
    expect(screen.queryByText(/Password is required/i)).toBeNull();
  });

  test('calls the onSubmit function with correct data', () => {
    const mockOnSubmit = jest.fn();
    render(<Signup onSubmit={mockOnSubmit} />);

    userEvent.type(screen.getByLabelText(/Username/i), 'testuser');
    userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    });
  });
});
