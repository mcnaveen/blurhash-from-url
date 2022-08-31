import get from "axios";
import { encode, decode } from "blurhash";
import sharp from 'sharp';

export const blurhashFromURL = async (url: string) => {
    const image = await get(url, {
        responseType: "arraybuffer",
    });
    const returnedBuffer = Buffer.from(image.data);

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

    const output = {
        encoded: encoded,
        decoded: decoded,
        width: info.width,
        height: info.height,
    };

    return output;
};
