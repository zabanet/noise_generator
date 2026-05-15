import { NoiseType, NOISE_TYPES } from '../models/NoiseType';

interface StatusPanelProps {
    selectedNoiseType: NoiseType;
    volume: number;
    isPlaying: boolean;
}

export function StatusPanel({ selectedNoiseType, volume, isPlaying }: StatusPanelProps) {
    const noiseLabel = NOISE_TYPES.find((n) => n.value === selectedNoiseType)?.label ?? selectedNoiseType;
    const percentage = Math.round(volume * 100);

    return (
        <div className="status-panel" role="status" aria-live="polite">
            <div className="status-row">
                <span className="status-label">Type</span>
                <span className="status-value">{noiseLabel}</span>
            </div>
            <div className="status-row">
                <span className="status-label">Volume</span>
                <span className="status-value">{percentage}%</span>
            </div>
            <div className="status-row">
                <span className="status-label">Status</span>
                <span className={`status-value status-playback${isPlaying ? ' status-playback--playing' : ''}`}>
                    {isPlaying ? 'Playing' : 'Stopped'}
                </span>
            </div>
        </div>
    );
}
