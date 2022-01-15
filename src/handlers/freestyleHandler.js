import { getRandomFromMinToMax } from "../helpers/index.js";

export default class FreestyleHandler {
    minimumFreestyleLength = 2;
    maxFreestyleLength = 4;

    static decideIfFreestyle(remainingBeats) {
        const hasEnoughBeatsLeft =
            remainingBeats >= this.minimumFreestyleLength;
        return hasEnoughBeatsLeft && Math.random() < 0.2;
    }

    static decideIfRepeat(beats, beatsNum) {
        const hasEnoughBeatsToRepeat = beats.length >= this.minimumRepeatLength;
        const canSafelyRepeat = beatsNum - beats.length >= 2; // If we repeat two beats with only one beat left, we'll end up with too many beats!
        return hasEnoughBeatsToRepeat && canSafelyRepeat && Math.random() < 0.4;
    }

    static decideFreestyleLength(remainingBeats) {
        // TODO: When can prompt the user to define a freestyle, this should be used to define freestyle length, which should then be stored.
        return getRandomFromMinToMax(
            minimumFreestyleLength,
            remainingBeats > this.maxFreestyleLength
                ? this.maxFreestyleLength
                : remainingBeats
        );
    }
}
