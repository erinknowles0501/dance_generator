import { rollPercentage } from "../helpers/index.js";
import Bar from "../bar.js";

export default class SplitHandler {
    SPLIT_PERCENT_CHANCE = 25;

    decideIfSplit() {
        return rollPercentage(this.SPLIT_PERCENT_CHANCE);
    }

    decideIfUnsplit(subBar) {
        // If subBar only contains two beats and the first one is a beat and the second is a rest,
        // convert to a beat instead of a subbar for simplicity's sake,
        // since they sound the same.
        // Also, if all beats are rests, unsplit. (Will then return just a rest)
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

    makeBeats() {
        const subBar = new Bar(2, true);
        if (this.decideIfUnsplit(subBar.beats)) {
            return subBar.beats[0];
        }
        return subBar;
    }
}
