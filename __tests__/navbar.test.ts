// __tests__/my-component.test.js

// Questo dice a Jest di simulare il modulo auth-helpers
jest.mock('@/utils/auth-helpers', () => ({
  // Diciamo a Jest che getAuthenticatedUserWithProfile deve esistere e
  // che deve essere una funzione mockabile.
  getAuthenticatedUserWithProfile: jest.fn(),
}));

// Ora, prima di ogni test, impostiamo cosa deve ritornare la funzione mockata
import Navbar from '@/components/Navbar'; // Sostituisci con il tuo componente
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
    // Diciamo alla funzione mockata di restituire i nostri dati finti
    (getAuthenticatedUserWithProfile as jest.Mock).mockReturnValue(mockAuthenticatedUser);

    render(await Navbar());

    // Cerchiamo il nome dell'utente renderizzato
    const userName = screen.getByText('Mario'); // Aggiungi questo testo nel tuo componente
    expect(userName).toBeInTheDocument();
  });
  it('shows "Login" when not logged in', async () => {
    // Diciamo alla funzione mockata di restituire i nostri dati finti
    (getAuthenticatedUserWithProfile as jest.Mock).mockReturnValue(mockUnauthenticatedUser);

    render(await Navbar());

    // Cerchiamo il nome dell'utente renderizzato
    const userName = screen.getByText('Login'); // Aggiungi questo testo nel tuo componente
    expect(userName).toBeInTheDocument();
  });
});