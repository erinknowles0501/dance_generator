import { getRandomFromMinToMax, rollPercentage } from "../helpers/index.js";

export default class FreestyleHandler {
    static minimumFreestyleLength = 2;
    static maxFreestyleLength = 4;
    static freestylePercentChance = 15;

    static decideIfFreestyle(remainingBeats) {
        const hasEnoughBeatsLeft =
            remainingBeats >= this.minimumFreestyleLength;
        return (
            hasEnoughBeatsLeft && rollPercentage(this.freestylePercentChance)
        );
    }

    static decideFreestyleLength(remainingBeats) {
        // TODO: When can prompt the user to define a freestyle, this should be used to define freestyle length, which should then be stored.
        return getRandomFromMinToMax(
            this.minimumFreestyleLength,
            remainingBeats > this.maxFreestyleLength
                ? this.maxFreestyleLength
                : remainingBeats
        );
    }
}
