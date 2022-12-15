import fetch from "node-fetch";
import { encode, decode } from "blurhash";
import sharp from "sharp";

export interface IOutput {
    encoded: string;
    decoded: Uint8ClampedArray;
    width: number;
    height: number;
}

export const blurhashFromURL = (url: string): Promise<IOutput> => {
    return new Promise((resolve, reject) => {
        try {
            fetch(url)
                .then((response) => response.arrayBuffer())
                .then((arrayBuffer) => {
                    const returnedBuffer = Buffer.from(arrayBuffer);

                    return sharp(returnedBuffer)
                        .ensureAlpha()
                        .raw()
                        .toBuffer({
                            resolveWithObject: true,
                        });
                })
                .then(({ data, info }) => {
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

                    resolve(output);
                })
                .catch((error) => {
                    reject(
                        new Error(
                            `Failed to generate blurhash from URL: ${error.message}`
                        )
                    );
                });
        } catch (error) {
            reject(
                new Error(
                    `Failed to generate blurhash from URL: ${error.message}`
                )
            );
        }
    });
};
