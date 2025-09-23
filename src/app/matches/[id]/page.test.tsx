import { render, screen } from '@testing-library/react';
import { ROLE } from '@/types';
import matchDetailsPage from './page';

// mock next/image per evitare errori in JSDOM
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

// mock componenti UI che non ci interessano nei test
jest.mock('@/components/DeleteMatchButton', () => () => (
  <button>Delete</button>
));
jest.mock('@/components/SpotlightCard', () => ({ children }: any) => (
  <div data-testid="spotlight">{children}</div>
));
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h1>{children}</h1>,
}));

// mock auth + supabase
const mockGetAuthenticatedUserWithProfile = jest.fn();
jest.mock('@/utils/auth-helpers', () => ({
  getAuthenticatedUserWithProfile: () => mockGetAuthenticatedUserWithProfile(),
}));

const mockSingle = jest.fn();
const mockSelect = jest.fn(() => ({
  eq: jest.fn(() => ({ single: mockSingle })),
}));
const mockSupabase = { from: jest.fn(() => ({ select: mockSelect })) };

jest.mock('@/utils/supabase/server', () => ({
  createClient: () => mockSupabase,
}));

describe('matchDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error if supabase fails', async () => {
    mockGetAuthenticatedUserWithProfile.mockResolvedValue({ role: ROLE.User });
    mockSingle.mockResolvedValue({ data: null, error: 'boom' });

    const ui = await matchDetailsPage({ params: { id: '1' } });
    render(ui);

    expect(
      screen.getByText('Errore nel recupero del partita'),
    ).toBeInTheDocument();
  });

  it('renders match details with game and description', async () => {
    mockGetAuthenticatedUserWithProfile.mockResolvedValue({ role: ROLE.User });
    mockSingle.mockResolvedValue({
      data: {
        id: '1',
        name: 'Partita Test',
        description: 'Descrizione partita',
        startAt: '10:00',
        endAt: '12:00',
        min_players: 2,
        max_players: 4,
        players: [],
        game: { id: 'g1', name: 'Scacchi', image: '/game.png' },
      },
      error: null,
    });

    const ui = await matchDetailsPage({ params: { id: '1' } });
    render(ui);

    expect(screen.getByText('Partita Test')).toBeInTheDocument();
    expect(screen.getByText('Descrizione partita')).toBeInTheDocument();
    expect(screen.getByText('Scacchi')).toBeInTheDocument();
  });

  it('renders players list when present', async () => {
    mockGetAuthenticatedUserWithProfile.mockResolvedValue({ role: ROLE.User });
    mockSingle.mockResolvedValue({
      data: {
        id: '1',
        name: 'Partita con players',
        description: null,
        startAt: '10:00',
        endAt: '12:00',
        min_players: 1,
        max_players: 2,
        players: [
          {
            profile: { id: 'p1', username: 'Mario', image: '/mario.png' },
          },
        ],
        game: { id: 'g1', name: 'Monopoli', image: null },
      },
      error: null,
    });

    const ui = await matchDetailsPage({ params: { id: '1' } });
    render(ui);

    expect(screen.getByText('Mario')).toBeInTheDocument();
    expect(screen.getByAltText('Mario')).toHaveAttribute('src', '/mario.png');
  });

  it('shows admin button if role is Admin', async () => {
    mockGetAuthenticatedUserWithProfile.mockResolvedValue({ role: ROLE.Admin });
    mockSingle.mockResolvedValue({
      data: {
        id: '1',
        name: 'Admin match',
        description: null,
        startAt: '10:00',
        endAt: '12:00',
        min_players: 1,
        max_players: 2,
        players: [],
        game: { id: 'g1', name: 'Uno', image: null },
      },
      error: null,
    });

    const ui = await matchDetailsPage({ params: { id: '1' } });
    render(ui);

    expect(screen.getByTestId('Add player')).toBeInTheDocument();
  });
});
