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
    log("🛑 STOPPED");
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

    log("→ Right Arrow pressed");
}

/*
 * Get something that identifies the currently displayed image.
 *
 * We use the visible image/video elements and capture their
 * current source information. If Flow changes to another image,
 * this value should change.
 */
function getCurrentImageSignature() {
    const elements = [...document.querySelectorAll("img")];

    const visibleImages = elements.filter(img => {
        const rect = img.getBoundingClientRect();
        const style = getComputedStyle(img);

        return (
            rect.width > 100 &&
            rect.height > 100 &&
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0"
        );
    });

    if (!visibleImages.length) {
        return null;
    }

    return visibleImages
        .map(img => ({
            src: img.currentSrc || img.src || "",
            width: img.naturalWidth || 0,
            height: img.naturalHeight || 0
        }))
        .sort((a, b) => a.src.localeCompare(b.src))
        .map(x => `${x.src}|${x.width}x${x.height}`)
        .join("||");
}

async function moveToNextImage() {
    const before = getCurrentImageSignature();

    log(`Current image signature: ${before}`);

    nextImage();

    const start = Date.now();

    while (running) {
        await sleep(200);

        const after = getCurrentImageSignature();

        // The image changed
        if (after && before && after !== before) {
            log("✅ Image changed — moving to next image");
            await sleep(afterNextImage);
            return true;
        }

        // Could not detect a previous signature
        // so give Flow a normal amount of time to update.
        if (!before && after) {
            log("✅ Image detected after navigation");
            await sleep(afterNextImage);
            return true;
        }

        // Nothing changed after timeout
        if (Date.now() - start > timeout) {
            log("🛑 Right Arrow did not change the image.");
            log("🏁 Assuming this is the last image.");
            return false;
        }
    }

    return false;
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
    log("🚀 STARTED");
    log("Current image will be processed FIRST.");
    log("Type stop() at any time to stop.");

    while (running) {
        iteration++;

        log(`========== IMAGE ${iteration} ==========`);

        try {
            // --------------------------------
            // 1. PROCESS CURRENT IMAGE
            // --------------------------------

            log("Processing current image...");

            await download();

            await select2K();

            log(`Waiting ${afterUpscaleClick}ms...`);
            await sleep(afterUpscaleClick);

            log(`✅ Image ${iteration} processed`);

            // --------------------------------
            // 2. MOVE TO NEXT IMAGE
            // --------------------------------

            if (!running) break;

            const changed = await moveToNextImage();

            // --------------------------------
            // 3. STOP IF RIGHT ARROW DID NOTHING
            // --------------------------------

            if (!changed) {
                log("================================");
                log("🏁 LAST IMAGE REACHED");
                log(`Processed ${iteration} image(s).`);
                log("Automation finished.");
                log("================================");

                running = false;
                break;
            }

        } catch (err) {
            console.error("[Flow Auto]", err);

            if (running) {
                log("Error encountered. Retrying...");
                await sleep(2000);
            }
        }
    }

    log("Automation stopped.");
}

run();
