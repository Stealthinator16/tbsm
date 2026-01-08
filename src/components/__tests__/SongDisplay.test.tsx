import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SongDisplay from '../SongDisplay';
import { Song } from '../../types';

const mockSong: Song = {
  id: 'test-song',
  title: 'Test Song',
  slug: 'test-song',
  album: 'Test Album',
  lyrics: [
    { original: 'Line by Calm', speaker: 'Calm' },
    { original: 'Line by Encore', speaker: 'Encore ABJ' }
  ]
};

describe('SongDisplay Artist Highlights', () => {
  it('renders lyrics with default highlight colors', () => {
    render(<SongDisplay song={mockSong} />);
    
    const calmLine = screen.getByText('Line by Calm');
    // Default Calm color is #22d3ee (cyan-400)
    expect(calmLine).toHaveStyle({ color: '#22d3ee' });

    const encoreLine = screen.getByText('Line by Encore');
    expect(encoreLine).toHaveStyle({ color: '#fb923c' });
  });

  it('does not render settings button', () => {
    render(<SongDisplay song={mockSong} />);
    const settingsBtn = screen.queryByTitle('Settings');
    expect(settingsBtn).not.toBeInTheDocument();
  });
});