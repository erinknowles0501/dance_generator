// TODO Use requestAnimationFrame when/if move to browser.

import Env from "./env.js";

export default class WebEnv extends Env {
    bar;
    app = document.getElementById("app");

    constructor() {
        super();
    }

    play(bar) {
        this.bar = bar;

        this.bar.beats.forEach((beat) => {
            const moveEl = document.createElement("p");
            let moveText = (beat && beat.moveType) || "...";
            if (beat && beat.beats) {
                moveText = beat.beats
                    .map((beat) => beat && beat.moveType)
                    .join(", ");
            }
            moveEl.textContent = moveText;
            app.append(moveEl);
        });

        let beat = 0;
        let start, previousTimestamp;

        function step(timestamp) {
            beat++;

            if (start === undefined) {
                start = timestamp;
            }
            const elapsed = timestamp - start;

            if (previousTimestamp !== timestamp) {
                app.children[beat - 1].style.color = "red";
                if (app.children[beat - 2]) {
                    app.children[beat - 2].style.color = "black";
                }
            }

            if (beat < bar.beats.length) {
                previousTimestamp = timestamp;
                setTimeout(() => {
                    window.requestAnimationFrame(step);
                }, 1000);
            }
        }

        window.requestAnimationFrame(step);

        // this.bar.beats.forEach((beat, index) => {
        //     window.requestAnimationFrame(() => {
        //         if (beat === null) {
        //             console.log((this.isSubBar ? "--- " : "") + "...");
        //             return;
        //         }
        //         if (beat.beats) {
        //             beat.play();
        //             return;
        //         }
        //         console.log((this.isSubBar ? "--- " : "") + beat.moveType);
        //     });
        // });
    }
}
