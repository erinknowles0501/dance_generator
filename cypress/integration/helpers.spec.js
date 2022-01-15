import {
    rollPercentage,
    getRandomFromZeroToMax,
} from "../../src/helpers/index.js";

describe("Roll percentage test", () => {
    it("will return true at the percentage passed", () => {
        cy.wrap({ rollPercentage }).invoke("rollPercentage");
        // TODO: Write something that runs a test X times and has a callback - almost every test is going to need it since almost all functionality is random.
    });
});
