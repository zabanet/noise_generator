class NoiseProcessor extends AudioWorkletProcessor {
    #noiseType = 'pink';

    // Pink noise filter state (Paul Kellet algorithm)
    #b0 = 0;
    #b1 = 0;
    #b2 = 0;
    #b3 = 0;
    #b4 = 0;
    #b5 = 0;
    #b6 = 0;

    // Red/brown noise integrator state
    #redLastOutput = 0;

    constructor() {
        super();

        this.port.onmessage = (event) => {
            if (event.data.type === 'setNoiseType') {
                this.#noiseType = event.data.noiseType;
            }
        };
    }

    #generateWhite() {
        return Math.random() * 2 - 1;
    }

    #generatePink() {
        const white = this.#generateWhite();

        // Paul Kellet pink noise filter — approximates 1/f spectrum
        this.#b0 = 0.99886 * this.#b0 + white * 0.0555179;
        this.#b1 = 0.99332 * this.#b1 + white * 0.0750759;
        this.#b2 = 0.96900 * this.#b2 + white * 0.1538520;
        this.#b3 = 0.86650 * this.#b3 + white * 0.3104856;
        this.#b4 = 0.55000 * this.#b4 + white * 0.5329522;
        this.#b5 = -0.7616 * this.#b5 - white * 0.0168980;

        // #b6 is used from the previous sample (one-sample delay), then updated
        const pink = this.#b0 + this.#b1 + this.#b2 + this.#b3 + this.#b4 + this.#b5 + this.#b6 + white * 0.5362;
        this.#b6 = white * 0.115926;

        return pink * 0.11;
    }

    #generateRed() {
        const white = this.#generateWhite();

        // Leaky integrator of white noise — emphasises low frequencies
        this.#redLastOutput = (this.#redLastOutput + 0.02 * white) / 1.02;

        return this.#redLastOutput * 3.5;
    }

    process(_inputs, outputs) {
        const output = outputs[0];

        for (let frame = 0; frame < output[0].length; frame++) {
            let sample;

            switch (this.#noiseType) {
                case 'white':
                    sample = this.#generateWhite();
                    break;
                case 'red':
                    sample = this.#generateRed();
                    break;
                case 'pink':
                default:
                    sample = this.#generatePink();
                    break;
            }

            // Write the same sample to all channels for a centred mono-like signal
            for (let channel = 0; channel < output.length; channel++) {
                output[channel][frame] = sample;
            }
        }

        return true;
    }
}

registerProcessor('noise-processor', NoiseProcessor);
