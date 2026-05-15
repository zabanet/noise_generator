import type { CSSProperties } from 'react';

interface VolumeSliderProps {
    volume: number;
    onVolumeChange: (volume: number) => void;
}

export function VolumeSlider({ volume, onVolumeChange }: VolumeSliderProps) {
    const percentage = Math.round(volume * 100);

    return (
        <div className="volume-slider">
            <label htmlFor="volume-input" className="volume-label">
                Volume
            </label>
            <div className="volume-control">
                <input
                    id="volume-input"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    style={{ '--fill': `${percentage}%` } as CSSProperties}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="volume-range"
                    aria-valuetext={`${percentage}%`}
                />
                <span className="volume-value" aria-hidden="true">
                    {percentage}%
                </span>
            </div>
        </div>
    );
}
