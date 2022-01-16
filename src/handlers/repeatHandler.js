// TODO repeat grabs even-numbered amount of beats and starts at odd-numbered beats....?
// TODO repeat inserts repeated section anywhere in beat after original section - might skip 1+ beats first
// TODO don't repeat just rests

import { getRandomFromMinToMax, rollPercentage } from "../helpers/index.js";

export default class RepeatHandler {
    MINIMUM_REPEAT_LENGTH = 2; // Only repeating 1 beat doesn't seem very fun
    REPEAT_PERCENT_CHANCE = 25;

    beats = [];
    remainingBeats = 0;

    decideIfRepeat(beats, remainingBeats) {
        this.beats = beats;
        this.remainingBeats = remainingBeats;

        const hasEnoughBeatsToRepeat = beats.length >= this.minimumRepeatLength;
        const canSafelyRepeat = remainingBeats >= 2; // If we repeat two beats with only one beat left, we'll end up with too many beats!
        return (
            hasEnoughBeatsToRepeat &&
            canSafelyRepeat &&
            rollPercentage(this.REPEAT_PERCENT_CHANCE)
        );
    }

    decideRepeatLength() {
        const maxSafeDoubleLength = Math.floor(this.remainingBeats / 2);
        return getRandomFromMinToMax(
            this.MINIMUM_REPEAT_LENGTH,
            maxSafeDoubleLength
        );
    }

    makeBeats() {
        const repeatLength = this.decideRepeatLength();

        const beatsToRepeat = this.beats.slice(
            this.beats.length - repeatLength
        );
        return beatsToRepeat;
    }

    clear() {
        this.beats = [];
        this.remainingBeats = 0;
    }
}
