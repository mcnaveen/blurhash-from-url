import fetch from "node-fetch";
import { encode, decode } from "blurhash";
import sharp from 'sharp';
import sizeOf from "image-size";

export interface IOptions {
    size?: number;
}

export interface IInput {
    url: string;
    options?: IOptions;
}
export interface IOutput {
    encoded: string;
    width: number;
    height: number;
}

export const blurhashFromURL = async (url: string, options: IOptions = {}) => {
    const { size = 32 } = options;

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const returnedBuffer = Buffer.from(arrayBuffer);

    const { width, height, } = sizeOf(returnedBuffer);

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
