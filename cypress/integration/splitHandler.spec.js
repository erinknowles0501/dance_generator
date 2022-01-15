import SplitHandler from "../../src/handlers/splitHandler.js";

describe("Split handler test", () => {
    const splitHandler = new SplitHandler();

    it("will decide to split", () => {
        splitHandler.splitPercentChance = 100;
        expect(splitHandler.decideIfSplit()).to.equal(true);
    });

    it("will unsplit if subbar contains only first beat", () => {
        const subBar = [true, null]; // Don't need real Beats - it's checking against existence
        expect(splitHandler.decideIfUnsplit(subBar)).to.equal(true);
    });

    it("will unsplit if subbar has no beats", () => {
        const subBar = [null, null];
        expect(splitHandler.decideIfUnsplit(subBar)).to.equal(true);
    });
});
