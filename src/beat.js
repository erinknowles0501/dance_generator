import { v4 as uuidv4 } from "uuid";
import { getRandomToMax } from "./helpers/index.js";

export default class Beat {
    moveType;
    static moveTypes = ["up", "down", "left", "right", "chu"];
    uuid = uuidv4();

    constructor() {
        this.moveType = this.setMove();
        // console.log(`made beat ${this.moveType} ${this.uuid}`);
    }

    setMove() {
        return Beat.moveTypes[getRandomToMax(Beat.moveTypes.length - 1)];
    }

    show() {
        //TODO: Later.    env.show(this.type);
        //console.log(this.moveType);
        return this.moveType;
    }
}
