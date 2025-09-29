/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file __tests__/MatchEditPage.test.tsx
 */
import { render, screen } from '@testing-library/react';
import MatchEditPage from '@/app/matches/[id]/edit/page'; // aggiorna il path se diverso
import { createClient } from '@/utils/supabase/server';

// Mock dipendenze esterne
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/components/SpotlightCard', () => {
  const MockSpotlightCard = (props: any) => (
    <div data-testid="spotlight-card">{props.children}</div>
  );
  MockSpotlightCard.displayName = 'MockSpotlightCard';
  return MockSpotlightCard;
});

jest.mock('../../ClientMatchForm', () => ({
  __esModule: true,
  default: ({ match }: { match: any }) => (
    <div data-testid="client-match-form">
      ClientMatchForm with match {match?.id}
    </div>
  ),
}));

describe('MatchEditPage', () => {
  const mockCreateClient = createClient;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message when supabase returns error', async () => {
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

    const ui = await MatchEditPage({ params: Promise.resolve({ id: '1' }) });
    render(ui);

    expect(
      screen.getByText('Errore nel recupero del partita'),
    ).toBeInTheDocument();
  });

  it('renders title and description when match is found', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: {
                id: '42',
                name: 'Test Match',
                game: {
                  id: 'g1',
                  name: 'Catan',
                  min_players: 3,
                  max_players: 4,
                },
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchEditPage({ params: Promise.resolve({ id: '42' }) });
    render(ui);

    expect(screen.getByText('Modifica partita')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Compila i dettagli per organizzare una nuova competizione!',
      ),
    ).toBeInTheDocument();
  });

  it('passes match data to ClientMatchForm', async () => {
    const fakeMatch = {
      id: '77',
      name: 'My Fake Match',
      game: { id: 'gX', name: 'Fake Game', min_players: 2, max_players: 5 },
    };

    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: fakeMatch,
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchEditPage({ params: Promise.resolve({ id: '77' }) });
    render(ui);

    expect(screen.getByTestId('client-match-form')).toHaveTextContent('77');
  });

  it('wraps content inside SpotlightCard', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { id: '99', name: 'Wrapped Match', game: { id: 'g2' } },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchEditPage({ params: Promise.resolve({ id: '99' }) });
    render(ui);

    expect(screen.getByTestId('spotlight-card')).toBeInTheDocument();
  });

  it('renders page container with correct classes', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { id: '55', name: 'Check Classes', game: { id: 'g3' } },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchEditPage({ params: Promise.resolve({ id: '55' }) });
    const { container } = render(ui);

    const mainDiv = container.querySelector('div.min-h-screen');
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'bg-gradient-to-br',
    );
  });

  it('matches snapshot when rendering a valid match', async () => {
    mockCreateClient.mockResolvedValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: {
                id: 'snapshot',
                name: 'Snapshot Match',
                game: { id: 'g4', name: 'Snapshot Game' },
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const ui = await MatchEditPage({
      params: Promise.resolve({ id: 'snapshot' }),
    });
    const { asFragment } = render(ui);

    expect(asFragment()).toMatchSnapshot();
  });
});
