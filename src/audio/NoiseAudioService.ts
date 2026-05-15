import { NoiseType } from '../models/NoiseType';

const WORKLET_URL = '/audio/noise-processor.js';
const PROCESSOR_NAME = 'noise-processor';
const FADE_TIME = 0.03;

class NoiseAudioService {
    private audioContext: AudioContext | null = null;
    private workletNode: AudioWorkletNode | null = null;
    private gainNode: GainNode | null = null;
    private workletLoaded = false;

    async startAsync(noiseType: NoiseType, volume: number): Promise<void> {
        const ctx = this.ensureAudioContext();

        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        if (!this.workletLoaded) {
            await ctx.audioWorklet.addModule(WORKLET_URL);
            this.workletLoaded = true;
        }

        if (this.workletNode) {
            this.workletNode.disconnect();
            this.workletNode = null;
        }
        if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
        }

        this.workletNode = new AudioWorkletNode(ctx, PROCESSOR_NAME);
        this.gainNode = ctx.createGain();
        this.workletNode.connect(this.gainNode);
        this.gainNode.connect(ctx.destination);

        const clampedVolume = Math.max(0, Math.min(1, volume));
        const now = ctx.currentTime;
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(clampedVolume, now + FADE_TIME);

        this.sendNoiseType(noiseType);
    }

    async stopAsync(): Promise<void> {
        if (!this.audioContext || !this.gainNode) return;

        const ctx = this.audioContext;
        const gainNode = this.gainNode;
        const now = ctx.currentTime;

        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0, now + FADE_TIME);

        await new Promise<void>((resolve) => {
            setTimeout(resolve, FADE_TIME * 1000 + 50);
        });

        if (this.workletNode) {
            this.workletNode.disconnect();
            this.workletNode = null;
        }
        gainNode.disconnect();
        this.gainNode = null;
    }

    async setNoiseTypeAsync(noiseType: NoiseType): Promise<void> {
        this.sendNoiseType(noiseType);
    }

    async setVolumeAsync(volume: number): Promise<void> {
        if (!this.audioContext || !this.gainNode) return;

        const clampedVolume = Math.max(0, Math.min(1, volume));
        const now = this.audioContext.currentTime;
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(clampedVolume, now + FADE_TIME);
    }

    async disposeAsync(): Promise<void> {
        if (this.workletNode) {
            this.workletNode.disconnect();
            this.workletNode = null;
        }
        if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = null;
        }
        if (this.audioContext) {
            await this.audioContext.close();
            this.audioContext = null;
            this.workletLoaded = false;
        }
    }

    private ensureAudioContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        return this.audioContext;
    }

    private sendNoiseType(noiseType: NoiseType): void {
        if (this.workletNode) {
            this.workletNode.port.postMessage({ type: 'setNoiseType', noiseType });
        }
    }
}

export const noiseAudioService = new NoiseAudioService();
