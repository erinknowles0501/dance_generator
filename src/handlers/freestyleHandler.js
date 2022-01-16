// TODO insert multi-beat "come up with freestyle!" section - instead of defining your moves in advance, have to come up with something YOU CAN REMEMBER in real time, which you'll have to use whenever the freestyle section comes around until the next time the "come up with freestyle" section happens. NOTE that the way to make this less abusable (let's say they're not allowed to just sit there, but to prevent them from just rest, rest, rest, left, will need a) an audience they'll want to impress, and b) a 'flow' they'll want to keep in the groove of.

import { getRandomFromMinToMax, rollPercentage } from "../helpers/index.js";
import Move from "../move.js";

export default class FreestyleHandler {
    MINIMUM_FREESTYLE_LENGTH = 2;
    MAX_FREESTYLE_LENGTH = 4;
    FREESTYLE_PERCENT_CHANCE = 9;

    remainingBeats = 0;

    decideIfFreestyle(remainingBeats) {
        this.remainingBeats = remainingBeats;

        const canSafelyFreestyle =
            remainingBeats >= this.MINIMUM_FREESTYLE_LENGTH;
        return (
            canSafelyFreestyle && rollPercentage(this.FREESTYLE_PERCENT_CHANCE)
        );
    }

    decideFreestyleLength() {
        // TODO: When can prompt the user to define a freestyle, this should be used to define freestyle length, which should then be stored.
        const max =
            this.remainingBeats > this.MAX_FREESTYLE_LENGTH
                ? this.MAX_FREESTYLE_LENGTH
                : this.remainingBeats;
        return getRandomFromMinToMax(this.MINIMUM_FREESTYLE_LENGTH, max);
    }

    makeBeats() {
        const moves = [];
        const freestyleLength = this.decideFreestyleLength();
        for (let i = 0; i < freestyleLength; i++) {
            moves.push(new Move(Move.freestyleType));
        }
        return moves;
    }

    clear() {
        this.remainingBeats = 0;
    }
}
