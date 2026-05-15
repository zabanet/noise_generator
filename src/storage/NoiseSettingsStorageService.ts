import { NoiseType } from '../models/NoiseType';

const STORAGE_KEY_NOISE_TYPE = 'noise-generator:noiseType';
const STORAGE_KEY_VOLUME = 'noise-generator:volume';

const DEFAULT_NOISE_TYPE: NoiseType = 'pink';
const DEFAULT_VOLUME = 0.15;

const VALID_NOISE_TYPES: ReadonlyArray<NoiseType> = ['white', 'pink', 'red'];

export interface NoiseSettings {
    noiseType: NoiseType;
    volume: number;
}

class NoiseSettingsStorageService {
    load(): NoiseSettings {
        return {
            noiseType: this.loadNoiseType(),
            volume: this.loadVolume(),
        };
    }

    save(settings: Partial<NoiseSettings>): void {
        if (settings.noiseType !== undefined) {
            localStorage.setItem(STORAGE_KEY_NOISE_TYPE, settings.noiseType);
        }
        if (settings.volume !== undefined) {
            localStorage.setItem(STORAGE_KEY_VOLUME, String(settings.volume));
        }
    }

    private loadNoiseType(): NoiseType {
        const stored = localStorage.getItem(STORAGE_KEY_NOISE_TYPE);
        if (stored !== null && (VALID_NOISE_TYPES as ReadonlyArray<string>).includes(stored)) {
            return stored as NoiseType;
        }
        return DEFAULT_NOISE_TYPE;
    }

    private loadVolume(): number {
        const stored = localStorage.getItem(STORAGE_KEY_VOLUME);
        if (stored !== null) {
            const parsed = parseFloat(stored);
            if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
                return parsed;
            }
        }
        return DEFAULT_VOLUME;
    }
}

export const noiseSettingsStorageService = new NoiseSettingsStorageService();
