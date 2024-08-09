import fetch from "node-fetch";
import { encode } from "blurhash";
import sharp from 'sharp';
import sizeOf from "image-size";
import { URL } from 'url';

export interface IOptions {
    size?: number;
    offline?: boolean;
    timeout?: number;
}

export interface IOutput {
    encoded: string;
    width: number;
    height: number;
}

/**
 * **Generate a Blurhash string from a given image URL or local path.**
 *
 * @param {string} source - The image URL or local path to the image file.
 * @param {IOptions} [options] - The optional configuration options.
 * @param {number} [options.size=32] - The desired size of the image for encoding the Blurhash.
 * @param {boolean} [options.offline=false] - Set to `true` if the image source is a local path, `false` if it's a URL.
 * @param {number} [options.timeout=30000] - Timeout in milliseconds for fetch requests.
 * @returns {Promise<IOutput>} The Promise that resolves to the encoded Blurhash string, along with the image width and height.
 * @throws {Error} If the source is invalid or if there's an error processing the image.
 */

export const blurhashFromURL = async (source: string, options: IOptions = {}): Promise<IOutput> => {
    const { size = 32, offline = false, timeout = 30000 } = options;

    if (!source) {
        throw new Error("Source is required");
    }

    if (!offline) {
        try {
            new URL(source);
        } catch {
            throw new Error("Invalid URL provided");
        }
    }

    let width, height, returnedBuffer;

    try {
        if (offline) {
            const fs = await import("fs").catch(() => {
                throw new Error("Failed to import 'fs' module. Make sure you're in a Node.js environment.");
            });
            const { width: localWidth, height: localHeight } = sizeOf(source);
            width = localWidth;
            height = localHeight;
            returnedBuffer = await sharp(fs.readFileSync(source)).toBuffer();
        } else {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                const response = await fetch(source, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const arrayBuffer = await response.arrayBuffer();
                returnedBuffer = Buffer.from(arrayBuffer);

                const { width: remoteWidth, height: remoteHeight } = sizeOf(returnedBuffer);
                width = remoteWidth;
                height = remoteHeight;
            } finally {
                clearTimeout(timeoutId);
            }
        }

        const { info, data } = await sharp(returnedBuffer)
            .resize(size, size, {
                fit: "inside",
            })
            .ensureAlpha()
            .raw()
            .toBuffer({
                resolveWithObject: true,
            });

        const encoded = encode(
            new Uint8ClampedArray(data),
            info.width,
            info.height,
            4,
            4
        );

        const output: IOutput = {
            encoded,
            width,
            height,
        };

        return output;
    } catch (error) {
        throw new Error(`Failed to process image: ${error.message}`);
    }
};