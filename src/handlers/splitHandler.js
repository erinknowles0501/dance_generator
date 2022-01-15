import { rollPercentage } from "../helpers/index.js";

export default class SplitHandler {
    splitPercentChance = 20;

    decideIfSplit() {
        return rollPercentage(this.splitPercentChance);
    }

    decideIfUnsplit(subBar) {
        // If subBar only contains two beats and the first one is a beat and the second is a rest,
        // convert to a beat instead of a subbar for simplicity's sake,
        // since they sound the same.
        // Also, if all beats are rests, unsplit.
        const numRealBeats = subBar.reduce((prevValue, currentValue) => {
            if (!!currentValue) {
                return prevValue + 1;
            } else {
                return prevValue;
            }
        }, 0);
        if ((numRealBeats === 1 && !!subBar[0]) || numRealBeats === 0) {
            return true;
        }
        return false;
    }
}
