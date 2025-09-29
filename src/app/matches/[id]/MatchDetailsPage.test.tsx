import { render, screen } from '@testing-library/react';
import MatchDetailsPage from '@/app/matches/[id]/page';
import { ROLE } from '@/types';

jest.mock('@/utils/auth-helpers', () => ({
  getAuthenticatedUserWithProfile: jest.fn(),
}));

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/components/DeleteMatchButton', () => () => (
  <div data-testid="delete-match-button">DeleteMatchButton</div>
));

jest.mock('@/components/AddPlayerModal/AddPlayerModal', () => ({
  AddPlayerModal: ({ matchId }: { matchId: string }) => (
    <div data-testid="add-player-modal">AddPlayerModal for {matchId}</div>
  ),
}));

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt || 'mocked-image'} />;
});

describe('MatchDetailsPage', () => {
  const mockCreateClient = require('@/utils/supabase/server').createClient;
  const mockGetAuth =
    require('@/utils/auth-helpers').getAuthenticatedUserWithProfile;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message when supabase returns error', async () => {
    mockGetAuth.mockResolvedValue({ role: ROLE.User });
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: null,
              error: { message: 'DB error' },
            }),
          }),
        }),
      }),
    });

    const ui = await MatchDetailsPage({ params: Promise.resolve({ id: '1' }) });
    render(ui);

    expect(
      screen.getByText('Errore nel recupero del partita'),
    ).toBeInTheDocument();
  });

  it('renders fallback when no match is found', async () => {
    mockGetAuth.mockResolvedValue({ role: ROLE.User });
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
    });

    const ui = await MatchDetailsPage({ params: Promise.resolve({ id: '2' }) });
    render(ui);

    expect(screen.getByText('Partita non trovata')).toBeInTheDocument();
  });

  it('renders match details with players', async () => {
    mockGetAuth.mockResolvedValue({ role: ROLE.Admin });
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: {
                id: '3',
                name: 'Test Match',
                description: 'Descrizione partita',
                startAt: '2025-09-23',
                endAt: '2025-09-24',
                min_players: 1,
                max_players: 4,
                game: { id: 'g1', name: 'Catan', image: '/catan.png' },
                players: [
                  {
                    profile: {
                      id: 'p1',
                      username: 'PlayerOne',
                      image: '/p1.png',
                    },
                  },
                ],
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchDetailsPage({ params: Promise.resolve({ id: '3' }) });
    render(ui);

    expect(screen.getByText('Test Match')).toBeInTheDocument();
    expect(screen.getByText('Catan')).toBeInTheDocument();
    expect(screen.getByText('PlayerOne')).toBeInTheDocument();
    expect(screen.getByTestId('add-player-modal')).toBeInTheDocument();
    expect(screen.getByTestId('delete-match-button')).toBeInTheDocument();
  });
  it('renders placeholder image if player has no image', async () => {
    mockGetAuth.mockResolvedValue({ role: ROLE.User });
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: {
                id: '10',
                name: 'Match senza immagine',
                description: 'ok',
                startAt: '2025-09-23',
                endAt: '2025-09-23',
                min_players: 1,
                max_players: 4,
                game: { id: 'g2', name: 'Monopoly' },
                players: [
                  {
                    profile: {
                      id: 'p2',
                      username: 'PlayerTwo',
                      image: null,
                    },
                  },
                ],
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchDetailsPage({
      params: Promise.resolve({ id: '10' }),
    });
    render(ui);

    const img = screen.getByRole('img', { name: /PlayerTwo/i });
    expect(img).toHaveAttribute('src', '/placeholder.png');
  });

  it('renders fallback description if none is provided', async () => {
    mockGetAuth.mockResolvedValue({ role: ROLE.User });
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: {
                id: '11',
                name: 'Match senza descrizione',
                description: '',
                startAt: '2025-09-23',
                endAt: '2025-09-23',
                min_players: 1,
                max_players: 4,
                game: { id: 'g3', name: 'Risk' },
                players: [],
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchDetailsPage({
      params: Promise.resolve({ id: '11' }),
    });
    render(ui);

    expect(
      screen.getByText('Descrizione non disponibile.'),
    ).toBeInTheDocument();
  });

  it('shows red players count if below minimum', async () => {
    mockGetAuth.mockResolvedValue({ role: ROLE.User });
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: {
                id: '12',
                name: 'Match con pochi giocatori',
                description: 'test',
                startAt: '2025-09-23',
                endAt: '2025-09-23',
                min_players: 2,
                max_players: 4,
                game: { id: 'g4', name: 'Uno' },
                players: [{ profile: { id: 'p3', username: 'SoloPlayer' } }],
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchDetailsPage({
      params: Promise.resolve({ id: '12' }),
    });
    render(ui);

    const span = screen.getByText('(1/4)');
    expect(span).toHaveClass('text-red-300');
  });

  it('shows green players count if meets minimum', async () => {
    mockGetAuth.mockResolvedValue({ role: ROLE.User });
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: {
                id: '13',
                name: 'Match con abbastanza giocatori',
                description: 'test',
                startAt: '2025-09-23',
                endAt: '2025-09-23',
                min_players: 2,
                max_players: 4,
                game: { id: 'g5', name: 'Ticket to Ride' },
                players: [
                  { profile: { id: 'p4', username: 'Alice' } },
                  { profile: { id: 'p5', username: 'Bob' } },
                ],
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchDetailsPage({
      params: Promise.resolve({ id: '13' }),
    });
    render(ui);

    const span = screen.getByText('(2/4)');
    expect(span).toHaveClass('text-green-300');
  });

  it('renders edit link', async () => {
    mockGetAuth.mockResolvedValue({ role: ROLE.User });
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: {
                id: '14',
                name: 'Match con edit',
                description: 'edit test',
                startAt: '2025-09-23',
                endAt: '2025-09-23',
                min_players: 1,
                max_players: 4,
                game: { id: 'g6', name: 'Carcassonne' },
                players: [],
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchDetailsPage({
      params: Promise.resolve({ id: '14' }),
    });
    render(ui);

    const editLink = screen.getByRole('link', { name: /Modifica/i });
    expect(editLink).toHaveAttribute('href', '/matches/14/edit');
  });

  it('shows fallback message when no players', async () => {
    mockGetAuth.mockResolvedValue({ role: ROLE.User });
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: {
                id: '15',
                name: 'Match senza giocatori',
                description: 'empty players',
                startAt: '2025-09-23',
                endAt: '2025-09-23',
                min_players: 1,
                max_players: 4,
                game: { id: 'g7', name: 'Splendor' },
                players: [],
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchDetailsPage({
      params: Promise.resolve({ id: '15' }),
    });
    render(ui);

    expect(screen.getByText('Nessun giocatore associato.')).toBeInTheDocument();
  });
});
