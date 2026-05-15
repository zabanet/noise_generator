export type NoiseType = 'white' | 'pink' | 'red';

export const NOISE_TYPES: ReadonlyArray<{ value: NoiseType; label: string }> = [
    { value: 'white', label: 'White noise' },
    { value: 'pink', label: 'Pink noise' },
    { value: 'red', label: 'Red / Brown noise' },
];
