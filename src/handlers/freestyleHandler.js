import { getRandomFromMinToMax, rollPercentage } from "../helpers/index.js";

export default class FreestyleHandler {
    minimumFreestyleLength = 2;
    maxFreestyleLength = 4;
    freestylePercentChance = 15;

    decideIfFreestyle(remainingBeats) {
        const hasEnoughBeatsLeft =
            remainingBeats >= this.minimumFreestyleLength;
        return (
            hasEnoughBeatsLeft && rollPercentage(this.freestylePercentChance)
        );
    }

    decideFreestyleLength(remainingBeats) {
        // TODO: When can prompt the user to define a freestyle, this should be used to define freestyle length, which should then be stored.
        return getRandomFromMinToMax(
            this.minimumFreestyleLength,
            remainingBeats > this.maxFreestyleLength
                ? this.maxFreestyleLength
                : remainingBeats
        );
    }
}
