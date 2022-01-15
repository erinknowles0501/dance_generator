import SplitHandler from "../../src/handlers/splitHandler.js";

describe("Split handler test", () => {
    const splitHandler = new SplitHandler();

    it("will decide to split", () => {
        splitHandler.splitPercentChance = 100;
        expect(splitHandler.decideIfSplit()).to.equal(true);
    });

    it("will unsplit if subbar contains only one move, at first beat", () => {
        const subBar = [true, null]; // Don't need real Moves - it's just checking whether there's something there
        expect(splitHandler.decideIfUnsplit(subBar)).to.equal(true);
    });

    it("will unsplit if subbar has no moves", () => {
        const subBar = [null, null];
        expect(splitHandler.decideIfUnsplit(subBar)).to.equal(true);
    });
});
