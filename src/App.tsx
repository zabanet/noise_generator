import { useState, useEffect } from 'react';
import { NoiseType } from './models/NoiseType';
import { noiseSettingsStorageService } from './storage/NoiseSettingsStorageService';
import { noiseAudioService } from './audio/NoiseAudioService';
import { NoiseSelector } from './components/NoiseSelector';
import { VolumeSlider } from './components/VolumeSlider';
import { PlaybackButton } from './components/PlaybackButton';
import { StatusPanel } from './components/StatusPanel';

export function App() {
    const [selectedNoiseType, setSelectedNoiseType] = useState<NoiseType>(
        () => noiseSettingsStorageService.load().noiseType
    );
    const [volume, setVolume] = useState<number>(
        () => noiseSettingsStorageService.load().volume
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            noiseAudioService.disposeAsync().catch(() => { });
        };
    }, []);

    async function handleStart() {
        setIsTransitioning(true);
        try {
            setErrorMessage(null);
            await noiseAudioService.startAsync(selectedNoiseType, volume);
            setIsPlaying(true);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to start audio.';
            setErrorMessage(
                `Could not start audio: ${message}. Make sure your browser supports AudioWorklet.`
            );
        } finally {
            setIsTransitioning(false);
        }
    }

    async function handleStop() {
        setIsTransitioning(true);
        try {
            await noiseAudioService.stopAsync();
            setIsPlaying(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to stop audio.';
            setErrorMessage(`Could not stop audio: ${message}`);
        } finally {
            setIsTransitioning(false);
        }
    }

    async function handleNoiseTypeChange(noiseType: NoiseType) {
        setSelectedNoiseType(noiseType);
        noiseSettingsStorageService.save({ noiseType });
        if (isPlaying) {
            try {
                await noiseAudioService.setNoiseTypeAsync(noiseType);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to change noise type.';
                setErrorMessage(`Could not change noise type: ${message}`);
            }
        }
    }

    async function handleVolumeChange(newVolume: number) {
        setVolume(newVolume);
        noiseSettingsStorageService.save({ volume: newVolume });
        if (isPlaying) {
            try {
                await noiseAudioService.setVolumeAsync(newVolume);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to change volume.';
                setErrorMessage(`Could not change volume: ${message}`);
            }
        }
    }

    return (
        <main className="app">
            <div className="app-card">
                <h1 className="app-title">Noise Generator</h1>

                <section className="section" aria-labelledby="noise-type-heading">
                    <h2 id="noise-type-heading" className="section-title">Noise Type</h2>
                    <NoiseSelector
                        selectedNoiseType={selectedNoiseType}
                        onNoiseTypeChange={handleNoiseTypeChange}
                    />
                </section>

                <section className="section" aria-labelledby="volume-heading">
                    <h2 id="volume-heading" className="section-title">Volume</h2>
                    <VolumeSlider volume={volume} onVolumeChange={handleVolumeChange} />
                </section>

                <section className="section">
                    <PlaybackButton
                        isPlaying={isPlaying}
                        onStart={handleStart}
                        onStop={handleStop}
                        disabled={isTransitioning}
                    />
                </section>

                <section className="section" aria-labelledby="status-heading">
                    <h2 id="status-heading" className="section-title">Status</h2>
                    <StatusPanel
                        selectedNoiseType={selectedNoiseType}
                        volume={volume}
                        isPlaying={isPlaying}
                    />
                </section>

                {errorMessage !== null && (
                    <div className="error-message" role="alert">
                        {errorMessage}
                    </div>
                )}
            </div>
        </main>
    );
}
