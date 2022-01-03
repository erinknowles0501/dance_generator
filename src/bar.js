import Beat from "./beat.js";

export default class Bar {
    beats = [];

    constructor() {
        this.generateBeats();
    }

    generateBeats() {
        // TODO: Use this code to ensure beats have generated before playing
        return new Promise((resolve) => {
            const totalBeats = 8; // Roughly analogous to a time signature and not an absolute value - these beats can be subdivided

            for (let i = 1; i < totalBeats + 1; i++) {
                if (i === totalBeats + 1) {
                    resolve();
                    break;
                }
                this.addBeat();
            }
        });
    }

    getRandomToMax(max) {
        // TODO check math to ensure even distribution
        return Math.floor(Math.random() * max + 1);
    }

    decideIfRest() {
        // TODO How best determine rest probability percentage?
        // TODO Add avoidance for odd-numbered beats - ie, somewhat avoid syncopation!
        const restProbabilityMax = 4;
        const restProbabilityMin = 1;
        const restProbability =
            this.getRandomToMax(restProbabilityMax) + restProbabilityMin;

        return Math.random() < restProbability / 10; // Divide by 10 to convert to a number between 0 and 1, for Math.random()
    }

    addBeat() {
        // TODO add 'repeating pattern' functionality ie grab a section and
        //   maybe repeat it at some point - easier and more rythmic than true random.
        // TODO add chance to split a beat into two for funkier rythym
        // TODO add chance for half-bar of only 4 beats for intensity

        const beat = this.decideIfRest() ? null : new Beat();
        this.beats.push(beat);
    }

    play() {
        // TODO move the play speed out
        // const playSpeed = 0.75; // How many seconds to linger on a beat.

        // TODO Use requestAnimationFrame when/if move to browser.
        // setTimeout(() => {
        this.beats.forEach((beat) => {
            if (beat === null) {
                console.log("...");
                return;
            }
            beat.show();
        });
        // }, playSpeed * 1000);
    }
}
