import { getRandomFromMinToMax, rollPercentage } from "../helpers/index.js";

export default class RepeatHandler {
    static minimumRepeatLength = 2; // Only repeating 1 beat doesn't seem very fun
    static repeatPercentChance = 40;

    static decideRepeatLength(remainingBeats) {
        const maxSafeDoubleLength = Math.floor(remainingBeats / 2);
        return getRandomFromMinToMax(
            this.minimumRepeatLength,
            maxSafeDoubleLength
        );
    }

    static decideIfRepeat(beats, beatsNum) {
        const hasEnoughBeatsToRepeat = beats.length >= this.minimumRepeatLength;
        const canSafelyRepeat = beatsNum - beats.length >= 2; // If we repeat two beats with only one beat left, we'll end up with too many beats!
        return (
            hasEnoughBeatsToRepeat &&
            canSafelyRepeat &&
            rollPercentage(this.repeatPercentChance)
        );
    }
}
