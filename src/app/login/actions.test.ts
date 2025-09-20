
import { login } from "@/app/login/actions";
import { redirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock del client Supabase per la tua funzione helper `createClient`
const mockSignInWithPassword = jest.fn();
const mockSupabase = {
  auth: {
    signInWithPassword: mockSignInWithPassword,
  },
};
jest.mock('@/utils/supabase/server', () => ({
  createClient: () => mockSupabase,
}));

// Mock di Next.js per la funzione `cookies`
const mockCookies = jest.fn();
jest.mock('next/headers', () => ({
  cookies: mockCookies,
}));


describe('login server action', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // clears call history, but keeps mock implementations
    // or jest.resetAllMocks(); // clears call history AND removes mock implementations
  });
  it('should call signInWithPassword and redirect on success', async () => {
    // 1. Definisci i dati finti che verranno usati nel test
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    // 2. Dì alla funzione mockata cosa deve restituire
    // `mockResolvedValueOnce` simula una promessa risolta.
    mockSignInWithPassword.mockResolvedValueOnce({
      error: null, // Nessun errore, simula un successo
    });

    // 3. Esegui la funzione da testare
    await login(formData);

    // 4. Fai le asserzioni per verificare il risultato
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

  // 5. Verifica che il reindirizzamento sia stato chiamato
  expect(redirect).toHaveBeenCalledWith('/');
  });

  it('should call signInWithPassword and throw error if failed', async () => {
    // 1. Definisci i dati finti che verranno usati nel test
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    // 2. Dì alla funzione mockata cosa deve restituire
    // `mockResolvedValueOnce` simula una promessa risolta.
    mockSignInWithPassword.mockResolvedValueOnce({
      error: { message: 'Invalid credentials' }, // Simula un errore
    });

    // 3. Esegui la funzione da testare
    await login(formData);

    // 4. Fai le asserzioni per verificare il risultato
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    // 5. Verifica che il reindirizzamento sia stato chiamato
    expect(redirect).toHaveBeenCalledWith('/error');
  });

  it('should throw if email is missing', async () => {
    const formData = new FormData();
    formData.append('password', 'password123');
    await expect(login(formData)).rejects.toThrow('Email and password are required');
    expect(mockSignInWithPassword).not.toHaveBeenCalled();
  });

  it('should throw if password is missing', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    await expect(login(formData)).rejects.toThrow();
    expect(mockSignInWithPassword).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors from supabase', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');
    mockSignInWithPassword.mockRejectedValueOnce(new Error('Network error'));
    await expect(login(formData)).rejects.toThrow('Network error');
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});