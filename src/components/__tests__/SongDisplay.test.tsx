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
    // Calm color is #38bdf8 (sky-400)
    expect(calmLine).toHaveStyle({ color: '#38bdf8' });

    const encoreLine = screen.getByText('Line by Encore');
    // Encore color is #f472b6 (pink-400)
    expect(encoreLine).toHaveStyle({ color: '#f472b6' });
  });

  it('does not render settings button', () => {
    render(<SongDisplay song={mockSong} />);
    const settingsBtn = screen.queryByTitle('Settings');
    expect(settingsBtn).not.toBeInTheDocument();
  });
});