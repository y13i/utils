import { compressAsync, decompressAsync } from "lzutf8";
import { Base64 } from "js-base64";
import { ReactNode } from "react";

export async function encode(data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    compressAsync(
      JSON.stringify(data),
      { outputEncoding: "BinaryString" },
      (compressedDataJson, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(Base64.encodeURI(compressedDataJson));
        }
      }
    );
  });
}

export async function decode(data: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    decompressAsync(
      Base64.decode(data),
      { inputEncoding: "BinaryString" },
      (dataJson, error) => {
        if (error) {
          reject(error);
        } else {
          try {
            resolve(JSON.parse(dataJson));
          } catch (e) {
            reject(e);
          }
        }
      }
    );
  });
}

export type PageAttribute = {
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
};
