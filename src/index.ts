import fetch from "node-fetch";
import { encode } from "blurhash";
import sharp from 'sharp';
import sizeOf from "image-size";

export interface IOptions {
    size?: number;
    offline?: boolean;
}

export interface IOutput {
    encoded: string;
    width: number;
    height: number;
}

/**
 * Generate a Blurhash string from a given image URL or local path.
 *
 * @param {string} source - The image URL or local path to the image file.
 * @param {IOptions} [options] - The optional configuration options.
 * @param {number} [options.size=32] - The desired size of the image for encoding the Blurhash.
 * @param {boolean} [options.offline=false] - Set to `true` if the image source is a local path, `false` if it's a URL.
 * @returns {Promise<IOutput>} The Promise that resolves to the encoded Blurhash string, along with the image width and height.
 * @default size 32
 * @default offline false
 * @example
 * ```js
 * import { blurhashFromURL } from "blurhash-from-url";
 * 
 * const output = await blurhashFromURL("https://i.imgur.com/NhfEdg2.png", {
 *    size: 32,
 * });
 * 
 * console.log(output);
 * ```
 */
export const blurhashFromURL = async (source: string, options: IOptions = {}): Promise<IOutput> => {
    const { size = 32, offline = false } = options;

    let width, height, returnedBuffer;

    if (offline) {
        const fs = await import("fs");
        const { width: localWidth, height: localHeight } = sizeOf(source);
        width = localWidth;
        height = localHeight;
        returnedBuffer = await sharp(fs.readFileSync(source)).toBuffer();
    } else {
        const response = await fetch(source);
        const arrayBuffer = await response.arrayBuffer();
        returnedBuffer = Buffer.from(arrayBuffer);

        const { width: remoteWidth, height: remoteHeight } = sizeOf(returnedBuffer);
        width = remoteWidth;
        height = remoteHeight;
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
};
