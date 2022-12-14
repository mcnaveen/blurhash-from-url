import fetch from "node-fetch";
import { encode, decode } from "blurhash";
import sharp from 'sharp';

export interface IOutput {
    encoded: string;
    decoded: Uint8ClampedArray;
    width: number;
    height: number;
}

export const blurhashFromURL = async (url: string) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const returnedBuffer = Buffer.from(arrayBuffer);

    const { data, info } = await sharp(returnedBuffer)
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
    const decoded = decode(encoded, info.width, info.height);

    const output: IOutput = {
        encoded: encoded,
        decoded: decoded,
        width: info.width,
        height: info.height,
    };

    return output;
};
