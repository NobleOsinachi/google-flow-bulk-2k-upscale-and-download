const sleep = ms => new Promise(r => setTimeout(r, ms));

let running = true;
let iteration = 0;

const afterNextImage = 1200;
const afterDownloadClick = 400;
const afterUpscaleClick = 3000;
const timeout = 15000;

function log(msg) {
    console.log(`[Flow Auto] ${msg}`);
}

function stop() {
    running = false;
    log("STOPPED");
}

async function waitFor(getter, name) {
    const start = Date.now();

    while (running) {
        const el = getter();

        if (el) {
            log(`Found ${name}`);
            return el;
        }

        if (Date.now() - start > timeout) {
            throw new Error(`Timed out waiting for ${name}`);
        }

        await sleep(150);
    }

    throw new Error("Stopped");
}

function nextImage() {
    document.dispatchEvent(new KeyboardEvent("keydown", {
        key: "ArrowRight",
        code: "ArrowRight",
        keyCode: 39,
        which: 39,
        bubbles: true,
        cancelable: true
    }));

    log("→ Next image");
}

async function download() {
    const button = await waitFor(
        () => document.querySelector('button[aria-label="Download media"]'),
        "Download media"
    );

    button.click();
    log("Clicked Download media");

    await sleep(afterDownloadClick);
}

async function select2K() {
    const button = await waitFor(() => {
        return [...document.querySelectorAll("flow-menu-item button")]
            .find(button => {
                const text = (button.innerText || button.textContent || "")
                    .replace(/\s+/g, " ")
                    .trim()
                    .toLowerCase();

                return text.includes("2k") && text.includes("upscaled");
            });
    }, "2K Upscaled");

    button.click();
    log("Clicked 2K Upscaled");
}

async function run() {
    log("STARTED — current image will be processed FIRST. Type stop() to stop.");

    while (running) {
        iteration++;

        log(`========== ${iteration} ==========`);

        try {
            // FIRST: process the image currently open
            log("Processing current image...");
            
            await download();

            await select2K();

            log(`Waiting ${afterUpscaleClick}ms...`);
            await sleep(afterUpscaleClick);

            log(`Iteration ${iteration} complete`);

            // THEN: move to the next image
            if (running) {
                nextImage();

                log(`Waiting ${afterNextImage}ms for next image...`);
                await sleep(afterNextImage);
            }

        } catch (err) {
            console.error("[Flow Auto]", err);
            await sleep(2000);
        }
    }

    log("Automation stopped");
}

run();