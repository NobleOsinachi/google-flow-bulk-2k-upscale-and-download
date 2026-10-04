# Google Flow — Bulk 2K Upscale & Download

A small **vanilla JavaScript browser-console automation script** for Google Flow that makes it easier to process multiple generated images.

Google Flow currently doesn't provide a simple **"Upscale All → Download All"** button for an entire project. If you have dozens or hundreds of generated images, manually opening each image, selecting **2K Upscaled**, and downloading it can become extremely tedious.

So I made a small script to automate that repetitive process.

> **Note:** This is not an official Google Flow feature, browser extension, or API. It simply automates the existing Flow interface using JavaScript running in your browser.

## What it does

The workflow is:

```text
Open an image in your Flow project
        ↓
Paste the script into the browser console
        ↓
Download current image
        ↓
Select "2K Upscaled"
        ↓
Wait for the upscale/download process
        ↓
Move to the next image
        ↓
Download
        ↓
Select "2K Upscaled"
        ↓
Repeat...
```

The important part is that the **currently open image is processed first**.

You do **not** need to manually move to the second image before starting the script.

## Current limitations

This script is intentionally simple.

* Works with **images only**
* Designed for **2K upscaling**
* Does not provide a one-click "Upscale All" feature inside Flow itself
* Does not use an official Flow API
* Relies on the current Flow UI and its HTML elements/selectors
* If Google changes Flow's interface or button structure, the script may stop working
* You need to have the Flow project open in your browser
* The script runs in the browser console and must remain active while the automation is running

This is basically a small automation layer on top of Flow's existing UI.

## How to use it

### 1. Open your Google Flow project

Open the Flow project containing the images you want to process.

### 2. Open the first image

Select/open the **first image you want to process**.

This is important because the script processes the image currently open **before** moving to the next image.

### 3. Open your browser Developer Console

In Chrome, you can usually open DevTools with:

```text
F12
```

or:

```text
Ctrl + Shift + J
```

Then open the **Console** tab.

### 4. Paste the script

Paste the JavaScript from this repository into the console and run it.

The script will automatically:

1. Process the current image.
2. Click **Download media**.
3. Select **2K Upscaled**.
4. Wait for the configured delay.
5. Move to the next image.
6. Repeat the process.

### 5. Let it run

You don't need to manually click through every image.

The console will show progress similar to:

```text
[Flow Auto] STARTED — current image will be processed FIRST.
[Flow Auto] Processing current image...
[Flow Auto] Found Download media
[Flow Auto] Clicked Download media
[Flow Auto] Found 2K Upscaled
[Flow Auto] Clicked 2K Upscaled
[Flow Auto] → Next image
```

## Browser download setting

For the smoothest experience, consider turning off your browser's **"Ask where to save each file before downloading"** setting.

Otherwise, your browser may interrupt the automation with a Save As dialog every time Flow downloads an image.

In Chrome:

**Settings → Downloads → turn off "Ask where to save each file before downloading"**

This allows downloads to go automatically to your configured Downloads folder instead of requiring you to manually choose a location for every image.

> **Tip:** If you don't want all the files mixed into your normal Downloads folder, configure your browser's download location to a dedicated folder before starting the automation.

## Stopping the script

The script provides a simple stop function:

```javascript
stop()
```

Type that into the browser console while the automation is running.

## Why I made this

I originally wanted to find a tool that could simply do:

```text
Flow Project
    ↓
Upscale everything to 2K
    ↓
Download everything
```

But Flow doesn't currently make this workflow particularly convenient.

Instead of manually clicking **Upscale → Download → Next → Upscale → Download** hundreds of times, I created this small script to automate the repetitive clicking.

It's nothing complicated — just a lightweight browser-console script that does the clicking for you.

## Important

This script is designed specifically around the **current Google Flow interface**.

If Flow changes its UI, selectors, button names, menus, or navigation behavior, the script may need to be updated.

Use it at your own discretion and don't rely on it for critical workflows without testing it on a small number of images first.

## Support

If you find this useful, consider ⭐ **starring the repository**.

If Flow changes something and the script stops working, feel free to open an issue with the relevant UI/console error so the selector or timing can be updated.

---

### Scope

**Supported:**

* ✅ Google Flow
* ✅ Images
* ✅ 2K Upscaling
* ✅ Automated downloading
* ✅ Processing multiple images sequentially
* ✅ Browser-console JavaScript

**Not currently supported:**

* ❌ Video upscaling
* ❌ Other resolutions
* ❌ Automatic project-wide selection through Flow's internal API
* ❌ Official Google Flow API integration
* ❌ Browser extension
* ❌ Guaranteed compatibility after future Flow UI changes

---

### ⭐ If this saved you from hundreds of repetitive clicks

**Star the repo if you found it useful.**


