import { v4 as uuidv4 } from "uuid";
import { getRandomFromZeroToMax, rollPercentage } from "./helpers/index.js";
import Move from "./move.js";
import SplitHandler from "./handlers/splitHandler.js";
import RepeatHandler from "./handlers/repeatHandler.js";
import FreestyleHandler from "./handlers/freestyleHandler.js";

export default class Bar {
    HALF_BAR_PERCENTAGE_CHANCE = 15;

    uuid = uuidv4();
    beatsNum; // Roughly analogous to a time signature and not an absolute value - these beats can be subdivided
    beats = [];
    isSubBar;
    isHalfBar;

    splitHandler = new SplitHandler();
    repeatHandler = new RepeatHandler();
    freestyleHandler = new FreestyleHandler();

    constructor(beatsNum = null, subBar = false, beats = []) {
        // TODO: Restructure so how many 'levels' deep into subbars we can go is a setting somewhere,
        // and structured so can technically be however deep, instead of subBars.
        this.isSubBar = subBar;

        if (!beatsNum) {
            if (this.decideIfHalfBar()) {
                // TODO: Short bars should be followed by another short bar.
                this.beatsNum = 4;
                this.isHalfBar = true;
            } else {
                this.beatsNum = 8;
            }
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
            const remainingBeats = this.getRemainingBeats();
            // TODO: Could also look at a factory on repeat/freestyle/split since they share makeBeats() and clear() (and, more or less, decideShouldMakeBeats()).
            const beatPossibilities = [this.makeSingleBeat()];
            if (this.repeatHandler.decideIfRepeat(this.beats, remainingBeats)) {
                beatPossibilities.push(this.repeatHandler.makeBeats());
                this.repeatHandler.clear();
            }
            if (this.freestyleHandler.decideIfFreestyle(remainingBeats)) {
                beatPossibilities.push(this.freestyleHandler.makeBeats());
                this.freestyleHandler.clear();
            }
            if (!this.isSubBar && this.splitHandler.decideIfSplit()) {
                beatPossibilities.push(this.splitHandler.makeBeats());
            }

            const whichIndex = getRandomFromZeroToMax(
                beatPossibilities.length - 1
            );

            const beatsToPush = beatPossibilities[whichIndex];

            if (beatsToPush !== null && !!beatsToPush.length) {
                beatsToPush.forEach((beat) => {
                    this.beats.push(beat);
                });
            } else {
                this.beats.push(beatsToPush);
            }
        }

        // Check for a bar that's all rests and 'fix'
        // Re-rolling a new bar is dangerous if rest percentage is too high - as it approaches 100%, the chance of an infinite loop also approaches 100%...
        if (
            this.beats.length === this.beatsNum &&
            !this.isSubBar &&
            !Bar.hasAtLeastOneMove(this.beats)
        ) {
            // Pick a random beat and initialize it as a move.
            this.beats[getRandomFromZeroToMax(this.beats.length - 1)] =
                new Move();
        }
        //});
    }

    makeSingleBeat() {
        return this.decideIfRest() ? null : new Move();
    }

    decideIfRest() {
        // TODO Add avoidance for odd-numbered beats - ie, somewhat avoid syncopation to make it easier! // TODO Have synco-avoid be an easy-ifier setting.
        // TODO Something like, minimum rests per bar? Unless half-bar or has large repeating pattern?
        // TODO Max rests per bar - some percentage maybe as upper bound, but, at very least, can't have an all-rest bar!
        // TODO Constant this as restChance

        return rollPercentage(30);
    }

    decideIfHalfBar() {
        return rollPercentage(this.HALF_BAR_PERCENTAGE_CHANCE);
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

    static hasAtLeastOneMove(beats) {
        return beats.reduce((hasMove, beat) => {
            if (!!beat && beat.moveType) {
                return true;
            }
            if (!!beat && beat.beats && Bar.hasAtLeastOneMove(beat.beats)) {
                return true;
            }
            return hasMove;
        }, false);
    }

    getRemainingBeats() {
        return this.beatsNum - this.beats.length;
    }
}
