import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '@/App';

describe('App birthday state', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the countdown before the configured IST boundary', () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-14T23:59:00+05:30').getTime());
    render(<App />);
    expect(screen.getByRole('heading', { name: /deeps/i })).toBeInTheDocument();
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('renders the complete available birthday journey after the boundary', () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-15T00:01:00+05:30').getTime());
    render(<App />);
    expect(screen.getByText('LEVEL 31 UNLOCKED')).toBeInTheDocument();
    expect(screen.getByText('A few memories, held close')).toBeInTheDocument();
    expect(screen.getByText('The album is ready')).toBeInTheDocument();
    expect(screen.getByText('Words worth waiting for')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /replay the experience/i })).toBeInTheDocument();
  });

  it('opens the birthday experience with the explicit testing preview URL', () => {
    window.history.pushState({}, '', '/?preview=birthday');
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-08-14T23:59:00+05:30').getTime());
    render(<App />);
    expect(screen.getByText('Birthday preview')).toBeInTheDocument();
    expect(screen.getByText('LEVEL 31 UNLOCKED')).toBeInTheDocument();
    window.history.pushState({}, '', '/');
  });
});
