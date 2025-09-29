import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import matchesPage from './page';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock next/image
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

// Mock Button
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

// Mock SpotlightCard
jest.mock('@/components/SpotlightCard', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock Supabase client
const mockSelect = jest.fn();
const mockFrom = jest.fn(() => ({ select: mockSelect }));
const mockCreateClient = jest.fn(() => Promise.resolve({ from: mockFrom }));

jest.mock('@/utils/supabase/server', () => ({
  createClient: () => mockCreateClient(),
}));

describe('matchesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders matches when data is present', async () => {
    const matches = [
      {
        id: 1,
        name: 'Match 1',
        startAt: '2024-06-01T00:00:00Z',
        endAt: '2024-06-02T00:00:00Z',
        game: {
          name: 'Game A',
          image: '/game-a.png',
        },
      },
      {
        id: 2,
        name: 'Match 2',
        startAt: null,
        endAt: null,
        game: {
          name: 'Game B',
          image: null,
        },
      },
    ];
    mockSelect.mockResolvedValueOnce({ data: matches });

    // matchesPage is an async function returning JSX
    const Page = await matchesPage();
    render(Page);

    expect(screen.getByText('Partite')).toBeInTheDocument();
    expect(screen.getByText('Match 1')).toBeInTheDocument();
    expect(screen.getByText('Match 2')).toBeInTheDocument();
    expect(screen.getAllByText(/Gioco:/).length).toBe(2);
    expect(screen.getByText('Game A')).toBeInTheDocument();
    expect(screen.getByText('Game B')).toBeInTheDocument();
    expect(screen.getByText('Crea nuovo partita')).toBeInTheDocument();
    expect(
      screen.queryByText('Nessun partita disponibile.'),
    ).not.toBeInTheDocument();
  });

  it('renders empty state when no matches', async () => {
    mockSelect.mockResolvedValueOnce({ data: [] });

    const Page = await matchesPage();
    render(Page);

    expect(screen.getByText('Nessun partita disponibile.')).toBeInTheDocument();
    expect(screen.getByText('Crea nuovo partita')).toBeInTheDocument();
  });

  it('renders empty state when data is null', async () => {
    mockSelect.mockResolvedValueOnce({ data: null });

    const Page = await matchesPage();
    render(Page);

    expect(screen.getByText('Nessun partita disponibile.')).toBeInTheDocument();
    expect(screen.getByText('Crea nuovo partita')).toBeInTheDocument();
  });

  it('renders date as N/A if startAt or endAt is missing', async () => {
    const matches = [
      {
        id: 3,
        name: 'Match 3',
        startAt: null,
        endAt: null,
        game: {
          name: 'Game C',
          image: null,
        },
      },
    ];
    mockSelect.mockResolvedValueOnce({ data: matches });

    const Page = await matchesPage();
    render(Page);

    expect(screen.getByText('Da N/A a N/A')).toBeInTheDocument();
  });

  it('renders correct date format for startAt and endAt', async () => {
    const matches = [
      {
        id: 4,
        name: 'Match 4',
        startAt: '2024-06-10T00:00:00Z',
        endAt: '2024-06-12T00:00:00Z',
        game: {
          name: 'Game D',
          image: null,
        },
      },
    ];
    mockSelect.mockResolvedValueOnce({ data: matches });

    const Page = await matchesPage();
    render(Page);

    // Dates are formatted as locale date strings, so just check for year
    expect(screen.getByText(/Da.*2024.*a.*2024/)).toBeInTheDocument();
  });
});
