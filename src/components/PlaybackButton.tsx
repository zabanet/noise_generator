interface PlaybackButtonProps {
    isPlaying: boolean;
    onStart: () => void | Promise<void>;
    onStop: () => void | Promise<void>;
    disabled?: boolean;
}

export function PlaybackButton({ isPlaying, onStart, onStop, disabled }: PlaybackButtonProps) {
    return (
        <button
            type="button"
            className={`playback-btn${isPlaying ? ' playback-btn--stop' : ' playback-btn--start'}`}
            onClick={isPlaying ? onStop : onStart}
            aria-label={isPlaying ? 'Stop noise' : 'Start noise'}
            disabled={disabled}
        >
            {isPlaying ? 'Stop' : 'Start'}
        </button>
    );
}
