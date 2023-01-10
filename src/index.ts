import fetch from "node-fetch";
import { encode, decode } from "blurhash";
import sharp from 'sharp';

export interface IOutput {
    encoded: string;
    width: number;
    height: number;
}

export const blurhashFromURL = async (url: string, { size = 32 }: { size?: number } = {}) => {

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const returnedBuffer = Buffer.from(arrayBuffer);

    const { data, info } = await sharp(returnedBuffer)
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
        encoded: encoded,
        width: info.width,
        height: info.height,
    };

    return output;
};
