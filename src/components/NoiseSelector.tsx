import { NoiseType, NOISE_TYPES } from '../models/NoiseType';

interface NoiseSelectorProps {
    selectedNoiseType: NoiseType;
    onNoiseTypeChange: (noiseType: NoiseType) => void;
    disabled?: boolean;
}

export function NoiseSelector({ selectedNoiseType, onNoiseTypeChange, disabled }: NoiseSelectorProps) {
    return (
        <div className="noise-selector" role="group" aria-label="Noise type">
            {NOISE_TYPES.map((noiseType) => (
                <button
                    key={noiseType.value}
                    type="button"
                    className={`noise-btn${selectedNoiseType === noiseType.value ? ' noise-btn--selected' : ''}`}
                    aria-pressed={selectedNoiseType === noiseType.value}
                    onClick={() => onNoiseTypeChange(noiseType.value)}
                    disabled={disabled}
                >
                    {noiseType.label}
                </button>
            ))}
        </div>
    );
}
