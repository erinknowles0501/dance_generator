import { v4 as uuidv4 } from "uuid";
import { getRandomFromZeroToMax } from "./helpers/index.js";

export default class Beat {
    moveType;
    static moveTypes = ["up", "down", "left", "right", "chu"];
    static freestyleType = "FREESTYLE";
    uuid = uuidv4();

    constructor(moveType = null) {
        if (!!moveType) {
            this.moveType = moveType;
        } else {
            this.moveType = this.setMove();
        }
    }

    setMove() {
        return Beat.moveTypes[
            getRandomFromZeroToMax(Beat.moveTypes.length - 1)
        ];
    }

    show() {
        //TODO: Later.    env.show(this.type);
        return this.moveType;
    }
}
