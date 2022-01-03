import Beat from "./beat";

export default class Bar {
    beats = [];

    constructor() {
        console.log("here!");
    }

    addBeat() {
        // TODO constants
        // TODO How determine rest probability percentage?
        const beatType = Math.random() < 0.3 ? "move" : "rest";
        const beat = new Beat(beatType);
        this.beats.push(beat);
    }

    play() {
        this.beats.forEach((beat) => {
            beat.show();
        });
    }
}
