import Bar from "./src/bar.js";
import WebEnv from "./src/environments/web.js";

// TODO: Add settings to expose difficulty level

// TODO: Conditionally set environment.
const env = new WebEnv();

const bar = new Bar();

env.play(bar);
