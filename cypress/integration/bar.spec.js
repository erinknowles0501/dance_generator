import Bar from "../../src/bar.js";

describe("Bar test", () => {
    const bar = new Bar();

    it("new Bar has some beats", () => {
        expect(bar.beats.length).to.be.at.least(1);
    });

    it("is not comprised of rests", () => {
        console.log(Bar.hasAtLeastOneBeat(bar.beats));
        expect(Bar.hasAtLeastOneBeat(bar.beats)).to.be.true;
    });
});
