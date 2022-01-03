import Beat from "./beat.js";

export default class Move extends Beat {
    moveType;

    constructor() {
        this.moveType = setMove();
    }

    setMove() {
        const moveTypes = ["up", "down", "left", "right", "chu"];
        this.moveType = moveTypes[Math.floor(Math.random() * moveTypes.length)];
    }

    execute() {
        //TODO: Later.    env.show(this.type);
        console.log(this.moveType);
    }
}
