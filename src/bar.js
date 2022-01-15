import { v4 as uuidv4 } from "uuid";
import {
    getRandomFromMinToMax,
    getRandomFromZeroToMax,
    rollPercentage,
} from "./helpers/index.js";
import Beat from "./beat.js";
import SplitHandler from "./handlers/splitHandler.js";
import RepeatHandler from "./handlers/repeatHandler.js";
import FreestyleHandler from "./handlers/freestyleHandler.js";

export default class Bar {
    uuid = uuidv4();
    beatsNum; // Roughly analogous to a time signature and not an absolute value - these beats can be subdivided
    beats = [];
    isSubBar;

    splitHandler = SplitHandler;
    repeatHandler = RepeatHandler;
    freestyleHandler = FreestyleHandler;

    constructor(beatsNum = null, subBar = false, beats = []) {
        this.isSubBar = subBar;

        if (!beatsNum) {
            // TODO This 'decide if half-bar' should live elsewhere...?
            this.beatsNum = rollPercentage(80) ? 8 : 4; // TODO: Short bars should be followed by another short bar.
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
            if (
                !this.isSubBar &&
                this.repeatHandler.decideIfRepeat(this.beats, this.beatsNum)
            ) {
                // TODO repeat grabs even-numbered amount of beats and starts at odd-numbered beats....?
                // TODO repeat inserts repeated section anywhere in beat after original section - might skip 1+ beats first
                const repeatLength = this.repeatHandler.decideRepeatLength(
                    this.getRemainingBeats()
                );

                const beatsToRepeat = this.beats.slice(
                    this.beats.length - repeatLength
                );
                beatsToRepeat.forEach((beat) => {
                    this.beats.push(beat);
                });
                continue;
            }

            if (
                this.freestyleHandler.decideIfFreestyle(
                    this.getRemainingBeats()
                )
            ) {
                const freestyleLength =
                    this.freestyleHandler.decideFreestyleLength(
                        this.getRemainingBeats()
                    );
                for (let i = 0; i < freestyleLength; i++) {
                    this.beats.push(new Beat(Beat.freestyleType));
                }
                // NOTE Erin: Because decideIfRepeat() comes first, it has a higher chance of happening, even if they're weighted to technically both be 50/50.
                continue;
            }

            this.makeBeat();
        }

        // TODO Erin: Warning! This code sparks an infinite loop if rest probability is too high :)
        // TODO Erin: While this is 'technically' 'right' 'I guess' it doesn't feel right.
        // if (
        //     this.beats.length === this.beatsNum &&
        //     !this.isSubBar &&
        //     !Bar.hasAtLeastOneBeat(this.beats)
        // ) {
        //     // Re-roll!
        //     this.beats = [];
        //     this.generateBeats();
        // }
        if (
            this.beats.length === this.beatsNum &&
            !this.isSubBar &&
            !Bar.hasAtLeastOneBeat(this.beats)
        ) {
            // Pick a random beat and initialize it.
            this.beats[getRandomFromZeroToMax(this.beats.length - 1)] =
                new Beat();
        }
        //});
    }

    decideIfRest() {
        // TODO Add avoidance for odd-numbered beats - ie, somewhat avoid syncopation to make it easier! // TODO Have synco-avoid be an easy-ifier setting.
        // TODO Something like, minimum rests per bar? Unless half-bar or has large repeating pattern?
        // TODO Max rests per bar - some percentage maybe as upper bound, but, at very least, can't have an all-rest bar!
        // TODO Constant this as restChance

        return rollPercentage(30);
    }

    makeBeat() {
        // TODO insert multi-beat "come up with freestyle!" section - instead of defining your moves in advance, have to come up with something YOU CAN REMEMBER in real time, which you'll have to use whenever the freestyle section comes around until the next time the "come up with freestyle" section happens. NOTE that the way to make this less abusable (let's say they're not allowed to just sit there, but to prevent them from just rest, rest, rest, left, will need a) an audience they'll want to impress, and b) a 'flow' they'll want to keep in the groove of.

        if (!this.isSubBar && this.splitHandler.decideIfSplit()) {
            const subBar = new Bar(2, true);
            if (this.splitHandler.decideIfUnsplit(subBar.beats)) {
                this.beats.push(subBar.beats[0]);
                return;
            }
            this.beats.push(subBar);
            return;
        } else {
            this.beats.push(this.decideIfRest() ? null : new Beat());
            return;
        }
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

    static hasAtLeastOneBeat(beats) {
        return beats.reduce((hasBeats, beat) => {
            if (!!beat && beat.moveType) {
                return true;
            }
            if (!!beat && beat.beats && Bar.hasAtLeastOneBeat(beat.beats)) {
                return true;
            }
            return hasBeats;
        }, false);
    }

    getRemainingBeats() {
        return this.beatsNum - this.beats.length;
    }
}
