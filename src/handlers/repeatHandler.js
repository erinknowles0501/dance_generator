// TODO repeat grabs even-numbered amount of beats and starts at odd-numbered beats....?
// TODO repeat inserts repeated section anywhere in beat after original section - might skip 1+ beats first
// TODO don't repeat just rests

import { getRandomFromMinToMax, rollPercentage } from "../helpers/index.js";

export default class RepeatHandler {
    MINIMUM_REPEAT_LENGTH = 2; // Only repeating 1 beat doesn't seem very fun
    REPEAT_PERCENT_CHANCE = 25;

    decideIfRepeat(beats, remainingBeats) {
        const hasEnoughBeatsToRepeat = beats.length >= this.minimumRepeatLength;
        const canSafelyRepeat = remainingBeats >= 2; // If we repeat two beats with only one beat left, we'll end up with too many beats!
        return (
            hasEnoughBeatsToRepeat &&
            canSafelyRepeat &&
            rollPercentage(this.REPEAT_PERCENT_CHANCE)
        );
    }

    decideRepeatLength(remainingBeats) {
        const maxSafeDoubleLength = Math.floor(remainingBeats / 2);
        return getRandomFromMinToMax(
            this.MINIMUM_REPEAT_LENGTH,
            maxSafeDoubleLength
        );
    }

    tryMakeBeats(beats, remainingBeats) {
        if (!this.decideIfRepeat(beats, remainingBeats)) {
            return false;
        }

        const repeatLength = this.decideRepeatLength(remainingBeats);

        const beatsToRepeat = beats.slice(beats.length - repeatLength);
        return beatsToRepeat;
    }
}
