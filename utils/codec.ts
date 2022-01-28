import { compressAsync, decompressAsync } from "lzutf8";
import base64url from "base64url";

export async function encode(data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    compressAsync(
      JSON.stringify(data),
      { outputEncoding: "BinaryString" },
      (compressedDataJson, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(base64url.encode(compressedDataJson));
        }
      }
    );
  });
}

export async function decode(data: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    decompressAsync(
      base64url.decode(data),
      { inputEncoding: "BinaryString" },
      (dataJson, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(dataJson));
        }
      }
    );
  });
}
