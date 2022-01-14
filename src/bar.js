import { v4 as uuidv4 } from "uuid";
import { getRandomToMax } from "./helpers/index.js"; // TODO Add 'roll percentage' - ie percentage(20) where it returns true or false with a 20% distribution.
import Beat from "./beat.js";

export default class Bar {
    uuid = uuidv4();
    beatsNum; // Roughly analogous to a time signature and not an absolute value - these beats can be subdivided
    beats = [];
    isSubBar;

    constructor(beatsNum = null, subBar = false, beats = []) {
        this.isSubBar = subBar;

        if (!beatsNum) {
            // TODO This 'decide if half-bar' should live elsewhere...?
            this.beatsNum = getRandomToMax(2) == 1 ? 8 : 4;
        } else {
            this.beatsNum = beatsNum;
        }

        if (beats.length) {
            this.beats = beats;
        } else {
            this.generateBeats();
        }
    }

    generateBeats() {
        // TODO: Use promise to ensure beats have generated before playing
        while (this.beats.length < this.beatsNum) {
            if (this.decideIfRepeat()) {
                // TODO repeat grabs even-numbered amount of beats and starts at odd-numbered beats....?
                // TODO repeat inserts repeated section anywhere in beat after original section - might skip 1+ beats first
                const repeatLength = this.decideRepeatLength(
                    this.beatsNum - this.beats.length
                );

                const beatsToRepeat = this.beats.slice(
                    this.beats.length - repeatLength
                );
                beatsToRepeat.forEach((beat) => {
                    this.beats.push(beat);
                });
                continue;
            }

            if (this.decideIfFreestyle()) {
                const freestyleLength = this.decideFreestyleLength(
                    this.beatsNum - this.beats.length
                );
                for (let i = 0; i < freestyleLength; i++) {
                    this.beats.push(new Beat(Beat.freestyleType));
                }
                // NOTE Erin: Because decideIfRepeat() comes first, it has a higher chance of happening, even if they're weighted to technically both be 50/50.
                continue;
            }

            this.makeBeat();
        }

        // TODO Erin: Warning! This code sparks an infinite loop if rest probability is too high :)
        // TODO Erin: While this is 'technically' 'right' 'I guess' it doesn't feel right.
        // if (
        //     this.beats.length === this.beatsNum &&
        //     !this.isSubBar &&
        //     !Bar.hasAtLeastOneBeat(this.beats)
        // ) {
        //     // Re-roll!
        //     this.beats = [];
        //     this.generateBeats();
        // }
        if (
            this.beats.length === this.beatsNum &&
            !this.isSubBar &&
            !Bar.hasAtLeastOneBeat(this.beats)
        ) {
            // Pick a random beat and initialize it.
            this.beats[getRandomToMax(this.beats.length - 1)] = new Beat();
        }
        //});
    }

    decideIfRest() {
        // TODO How best determine rest probability percentage?
        // TODO Add avoidance for odd-numbered beats - ie, somewhat avoid syncopation to make it easier!
        // TODO Something like, minimum rests per bar? Unless half-bar or has large repeating pattern?
        // TODO Max rests per bar - some percentage maybe as upper bound, but, at very least, can't have an all-rest bar!
        const restProbabilityMax = 4;
        const restProbabilityMin = 1;
        const restProbability =
            getRandomToMax(restProbabilityMax) + restProbabilityMin;

        return Math.random() < restProbability / 10; // Divide by 10 to convert to a number between 0 and 1, for Math.random()
    }

    decideIfSplit() {
        return !this.isSubBar && Math.random() < 0.2;
    }

    decideIfRepeat() {
        const hasAtLeastTwoBeatsAlready = this.beats.length >= 2; // Just repeating one beat isn't so fun
        const hasAtLeastTwoBeatsLeft = this.beatsNum - this.beats.length >= 2; // If we repeat two beats with only one beat left, we'll end up with too many beats!
        return (
            !this.isSubBar &&
            hasAtLeastTwoBeatsAlready &&
            hasAtLeastTwoBeatsLeft &&
            Math.random() < 0.4
        ); // TODO: In theory should someday be able to support isSubBar.
    }

    decideIfFreestyle() {
        const hasAtLeastOneBeatLeft = this.beatsNum - this.beats.length >= 1;
        return hasAtLeastOneBeatLeft && Math.random() < 0.2;
    }

    decideRepeatLength(remainingBeats) {
        const maxSafeDoubleNum = Math.floor(remainingBeats / 2);
        return getRandomToMax(maxSafeDoubleNum) + 1; // getRandomToMax() already adds 1 (to get positive number inclusive of max) so we add another to ensure repeat length is at least two beats long.
        // TODO Replace with helper function 'getRandomFromMinToMax' and rename 'getRandomToMax' to 'getRandomFromZeroToMax'
    }

    decideFreestyleLength(remainingBeats) {
        // TODO: This function and decideRepeatLength should be combined somehow.
        // TODO: When can prompt the user to define a freestyle, this should be used to define freestyle length, which should then be stored.
        const maxSafeNum = Math.floor(remainingBeats);
        const maxFreestyleLength = Math.floor(this.beatsNum / 2);
        return getRandomToMax(
            maxSafeNum > maxFreestyleLength ? maxFreestyleLength : maxSafeNum
        );
        // TODO Replace with helper function 'getRandomFromMinToMax' and rename 'getRandomToMax' to 'getRandomFromZeroToMax' - OR, don't replace??
    }

    decideIfUnsplit(subBar) {
        // If subBar only contains two beats and the first one is a beat and the second is a rest,
        // convert to a beat instead of a subbar for simplicity's sake,
        // since they sound the same.
        // Also, if all beats are rests, unsplit.
        // This functionality might be otherwise approached in this.makeBeats() with checks,
        // But I feel like doing it this way will make future functionality easier...
        const numRealBeats = subBar.reduce((prevValue, currentValue, index) => {
            if (!!currentValue) {
                return prevValue + 1;
            } else {
                return prevValue;
            }
        }, 0);
        if ((numRealBeats === 1 && !!subBar[0]) || numRealBeats === 0) {
            // TODO No bar can contain all rests - can move 'numRealBeats === 0' out when implemented.
            return true;
        }
        return false;
    }

    makeBeat() {
        // TODO insert multi-beat "freestyle" section - user defines an original move and performs it here :)
        // TODO insert multi-beat "come up with freestyle!" section - instead of defining your moves in advance, have to come up with something YOU CAN REMEMBER in real time, which you'll have to use whenever the freestyle section comes around until the next time the "come up with freestyle" section happens. NOTE that the way to make this less abusable (let's say they're not allowed to just sit there, but to prevent them from just rest, rest, rest, left, will need a) an audience they'll want to impress, and b) a 'flow' they'll want to keep in the groove of.

        if (this.decideIfSplit()) {
            const subBar = new Bar(2, true);
            if (this.decideIfUnsplit(subBar.beats)) {
                this.beats.push(subBar.beats[0]);
                return;
            }
            this.beats.push(subBar);
            return;
        } else {
            this.beats.push(this.decideIfRest() ? null : new Beat());
            return;
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

    static hasAtLeastOneBeat(beats) {
        return beats.reduce((hasBeats, beat) => {
            if (!!beat && beat.moveType) {
                return true;
            }
            if (!!beat && beat.beats && Bar.hasAtLeastOneBeat(beat.beats)) {
                return true;
            }
            return hasBeats;
        }, false);
    }
}
