export default class Beat {
    moveType;
    moveTypes = ["up", "down", "left", "right", "chu"];

    constructor() {
        this.moveType = this.setMove();
    }

    setMove() {
        return this.moveTypes[
            Math.floor(Math.random() * this.moveTypes.length)
        ];
    }

    show() {
        //TODO: Later.    env.show(this.type);
        console.log(this.moveType);
    }
}
