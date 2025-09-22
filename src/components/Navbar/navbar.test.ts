jest.mock('@/utils/auth-helpers', () => ({
  getAuthenticatedUserWithProfile: jest.fn(),
}));

import Navbar from '@/components/Navbar/Navbar';
import userEvent from "@testing-library/user-event";
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { render, screen } from '@testing-library/react';

const mockAuthenticatedUser = {
  user: { id: 'uuid-1234', email: 'testuser@example.com' },
  profile: { firstname: 'Mario', lastname: 'Rossi', role: 'admin' },
};

const mockUnauthenticatedUser = {
  user: null,
  profile: null,
  role: null,
};
describe('Navbar', () => {
  it('shows the user\'s name when logged in', async () => {
    (getAuthenticatedUserWithProfile as jest.Mock).mockReturnValue(mockAuthenticatedUser);

    render(await Navbar());

    const userName = screen.getByText('Mario');
    expect(userName).toBeInTheDocument();
  });
  it('shows contextual menu when logged in', async () => {
    (getAuthenticatedUserWithProfile as jest.Mock).mockReturnValue(mockAuthenticatedUser);

    render(await Navbar());
    const trigger = await screen.findByText("Mario");
    await userEvent.click(trigger);
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });
  it('shows "Login" when not logged in', async () => {
    (getAuthenticatedUserWithProfile as jest.Mock).mockReturnValue(mockUnauthenticatedUser);

    render(await Navbar());

    const userName = screen.getByText('Login');
    expect(userName).toBeInTheDocument();
  });
  it('shows navigation links', async () => {
    render(await Navbar());
    expect(screen.getByText('Partite')).toBeInTheDocument();
    expect(screen.getByText('Giochi')).toBeInTheDocument();
  });
});

describe('ModeToggle', () => {
  it('renders the ModeToggle component', async () => {
    render(await Navbar());
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('opens the dropdown menu when clicked', async () => {
    render(await Navbar());
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });
});