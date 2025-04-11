import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AudioPlayer from '../../components/AudioPlayer';

// Mock the HTMLMediaElement API
window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = jest.fn();
Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 100
});

describe('AudioPlayer Component', () => {
  const defaultProps = {
    src: 'https://example.com/audio.mp3'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window.HTMLMediaElement.prototype, 'play');
    jest.spyOn(window.HTMLMediaElement.prototype, 'pause');
  });

  test('renders audio player correctly with default props', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    const audioPlayer = screen.getByTestId('audio-player');
    expect(audioPlayer).toBeInTheDocument();
    
    const audioControls = screen.getByTestId('audio-controls');
    expect(audioControls).toBeInTheDocument();
    
    // Should not show audio info when title and artist are not provided
    expect(screen.queryByTestId('audio-info')).not.toBeInTheDocument();
  });

  test('displays title and artist when provided', () => {
    render(<AudioPlayer {...defaultProps} title="Test Track" artist="Test Artist" />);
    
    const audioInfo = screen.getByTestId('audio-info');
    expect(audioInfo).toBeInTheDocument();
    expect(audioInfo).toHaveTextContent('Test Track');
    expect(audioInfo).toHaveTextContent('Test Artist');
  });

  test('does not render controls when showControls is false', () => {
    render(<AudioPlayer {...defaultProps} showControls={false} />);
    
    expect(screen.queryByTestId('audio-controls')).not.toBeInTheDocument();
  });

  test('toggles play/pause when button is clicked', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    const playPauseButton = screen.getByTestId('play-pause-button');
    
    // Initial state should be paused
    expect(playPauseButton).toHaveAttribute('aria-label', 'Play');
    
    // Click to play
    fireEvent.click(playPauseButton);
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    expect(playPauseButton).toHaveAttribute('aria-label', 'Pause');
    
    // Click to pause
    fireEvent.click(playPauseButton);
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
    expect(playPauseButton).toHaveAttribute('aria-label', 'Play');
  });

  test('calls onPlay handler when play is clicked', () => {
    const onPlay = jest.fn();
    render(<AudioPlayer {...defaultProps} onPlay={onPlay} />);
    
    const playPauseButton = screen.getByTestId('play-pause-button');
    fireEvent.click(playPauseButton);
    
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  test('calls onPause handler when pause is clicked', () => {
    const onPause = jest.fn();
    render(<AudioPlayer {...defaultProps} onPause={onPause} />);
    
    const playPauseButton = screen.getByTestId('play-pause-button');
    
    // First click to play
    fireEvent.click(playPauseButton);
    // Second click to pause
    fireEvent.click(playPauseButton);
    
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  test('changes progress when progress bar is changed', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    const progressBar = screen.getByTestId('progress-bar');
    fireEvent.change(progressBar, { target: { value: '50' } });
    
    expect(progressBar.value).toBe('50');
  });

  test('changes volume when volume control is adjusted', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    const volumeControl = screen.getByTestId('volume-control');
    fireEvent.change(volumeControl, { target: { value: '0.5' } });
    
    expect(volumeControl.value).toBe('0.5');
  });

  test('formats time correctly', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    const currentTimeDisplay = screen.getByTestId('current-time');
    const durationDisplay = screen.getByTestId('duration');
    
    // Initial time should be 0:00
    expect(currentTimeDisplay).toHaveTextContent('0:00');
    
    // Duration should default to the mocked value (100 seconds = 1:40)
    expect(durationDisplay).toHaveTextContent('1:40');
  });

  test('applies custom className when provided', () => {
    render(<AudioPlayer {...defaultProps} className="custom-player" />);
    
    const audioPlayer = screen.getByTestId('audio-player');
    expect(audioPlayer).toHaveClass('custom-player');
  });
});
