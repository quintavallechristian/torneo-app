import { signup } from './actions';
import { redirect as mockRedirect } from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
const mockSignUp = jest.fn();
const mockInsert = jest.fn();
const mockFrom = jest.fn();
const mockSupabase = {
  auth: {
    signUp: mockSignUp,
  },
  from: mockFrom,
  insert: mockInsert,
};
jest.mock('@/utils/supabase/server', () => ({
  createClient: () => mockSupabase,
}));

function createFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => fd.append(key, value));
  return fd;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFrom.mockReturnValue(mockSupabase);
});

describe('login server action', () => {
  it('returns early if passwords do not match', async () => {
    const formData = createFormData({
      email: 'test@example.com',
      password: 'pass1',
      confirm_password: 'pass2',
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await signup(formData);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Passwords do not match');
    expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('logs error if signUp fails', async () => {
    mockSignUp.mockResolvedValue({ data: null, error: 'signup error' });
    const formData = createFormData({
      email: 'test@example.com',
      password: 'pass',
      confirm_password: 'pass',
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await signup(formData);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error signing up:',
      'signup error',
    );
    expect(mockRedirect).toHaveBeenCalledWith('/');
    consoleErrorSpy.mockRestore();
  });

  it('creates profile and assigns role on successful signup', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: 'user123' } },
      error: null,
    });
    mockInsert
      .mockResolvedValueOnce({ data: 'profileData', error: null }) // profile insert
      .mockResolvedValueOnce({ data: 'roleData', error: null }); // role insert

    const formData = createFormData({
      email: 'test@example.com',
      password: 'pass',
      confirm_password: 'pass',
      firstname: 'John',
      lastname: 'Doe',
      birthday: '2000-01-01',
      country: 'Italy',
    });
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    await signup(formData);
    expect(mockSupabase.insert).toHaveBeenNthCalledWith(1, [
      {
        user_id: 'user123',
        firstname: 'John',
        lastname: 'Doe',
        birthday: '2000-01-01',
        country: 'Italy',
      },
    ]);
    expect(mockSupabase.insert).toHaveBeenNthCalledWith(2, [
      { user_id: 'user123', role: 'user' },
    ]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Profile created successfully:',
      'profileData',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Role assigned successfully:',
      'roleData',
    );
    expect(mockRedirect).toHaveBeenCalledWith('/');
    consoleLogSpy.mockRestore();
  });

  it('logs error if profile creation fails', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: 'user123' } },
      error: null,
    });
    mockInsert
      .mockResolvedValueOnce({ data: null, error: 'profile error' })
      .mockResolvedValueOnce({ data: 'roleData', error: null });

    const formData = createFormData({
      email: 'test@example.com',
      password: 'pass',
      confirm_password: 'pass',
      firstname: 'John',
      lastname: 'Doe',
      birthday: '2000-01-01',
      country: 'Italy',
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await signup(formData);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error creating profile:',
      'profile error',
    );
    expect(mockRedirect).toHaveBeenCalledWith('/');
    consoleErrorSpy.mockRestore();
  });

  it('logs error if role assignment fails', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: 'user123' } },
      error: null,
    });
    mockInsert
      .mockResolvedValueOnce({ data: 'profileData', error: null })
      .mockResolvedValueOnce({ data: null, error: 'role error' });

    const formData = createFormData({
      email: 'test@example.com',
      password: 'pass',
      confirm_password: 'pass',
      firstname: 'John',
      lastname: 'Doe',
      birthday: '2000-01-01',
      country: 'Italy',
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await signup(formData);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error assigning role:',
      'role error',
    );
    expect(mockRedirect).toHaveBeenCalledWith('/');
    consoleErrorSpy.mockRestore();
  });
});
