import { getRandomToMax } from "./helpers/index.js";
import Beat from "./beat.js";

export default class Bar {
    beatsNum; // Roughly analogous to a time signature and not an absolute value - these beats can be subdivided
    beats = [];
    isSubBar;

    constructor(beatsNum = null, subBar = false) {
        this.isSubBar = subBar;

        if (!beatsNum) {
            // TODO This 'decide if half-bar' should live elsewhere...?
            this.beatsNum = getRandomToMax(3) == 1 ? 8 : 4;
        } else {
            this.beatsNum = beatsNum;
        }
        this.generateBeats();
    }

    generateBeats() {
        console.log("generating beats..");
        // TODO: Use this promise code to ensure beats have generated before playing
        //return new Promise((resolve) => {
        for (let i = 1; i < this.beatsNum + 1; i++) {
            //if (i === this.beatsNum + 1) {
            //    resolve();
            //    break;
            //}
            this.beats.push(this.makeBeat());
        }
        //});
    }

    // generateSubBeats() {
    //     // TODO Decided finally that this lives here since need to decide if a beat is a rest and
    //     // decideIfRest() needs to live in this class because it needs to know about the Bar as a whole
    //     // empty array is truthy, array of nulls is truthy
    //     // NOTE Only allowing one level of subbeat and only allowing split in half, for ease of play.

    //     return new Bar( [
    //         this.decideIfRest() || this.makeBeat(),
    //         this.decideIfRest() || this.makeBeat(),
    //     ];
    // }

    decideIfRest() {
        // TODO How best determine rest probability percentage?
        // TODO Add avoidance for odd-numbered beats - ie, somewhat avoid syncopation to make it easier!
        // TODO Something like, minimum rests per bar? Unless half-bar or has large repeating pattern?
        const restProbabilityMax = 4;
        const restProbabilityMin = 1;
        const restProbability =
            getRandomToMax(restProbabilityMax) + restProbabilityMin;

        return Math.random() < restProbability / 10; // Divide by 10 to convert to a number between 0 and 1, for Math.random()
    }

    decideIfSplit() {
        return Math.random() < 0.2;
    }

    decideIfUnsplit() {
        // If subBar only contains two beats and the first one is a beat and the second is a rest,
        // convert to a beat instead of a subbar for simplicity's sake
        // since they sound the same.
        // This functionality might be otherwise approached in this.makeBeats() with checks,
        // But I feel like doing it this way will make future functionality easier...
        console.log("unsplit!");
        console.log("beats in unsplit", this.beats);
        const numRealBeats = this.beats.reduce((prevValue, currentValue) => {
            console.log(prevValue, currentValue);
            // if (currentValue) {
            // }
        });
        if (numRealBeats === 1 && this.beats[0]) {
            return true;
        }
        return false;
    }

    makeBeat() {
        // TODO add 'repeating pattern' functionality ie grab a section and
        //   maybe repeat it at some point - easier and more rythmic than true random.
        // TODO add chance for half-bar of only 4 beats for intensity

        if (this.decideIfSplit()) {
            const subBar = new Bar(2, true);
            if (this.decideIfUnsplit()) {
                return subBar.beats[0];
            }
            return this.subBar;
        } else {
            return this.decideIfRest() ? null : new Beat();
        }
    }

    play() {
        // TODO move the play speed out
        // const playSpeed = 0.75; // How many seconds to linger on a beat.

        // TODO Use requestAnimationFrame when/if move to browser.
        // setTimeout(() => {
        this.beats.forEach((beat) => {
            if (beat === null) {
                console.log((this.isSubBar ? "--- " : "") + "...");
                return;
            }
            if (beat.beats) {
                beat.play();
                return;
            }
            // if (this.isSubBar) {
            //     console.log("is subbar", this.beats);
            //     //console.log("---", beat.moveType);

            //     return;
            // }
            // if (beat.bar.isSubBar) {

            // }
            console.log((this.isSubBar ? "--- " : "") + beat.moveType);
        });
        // }, playSpeed * 1000);
    }
}
