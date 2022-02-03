import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import type { URLSearchParams as URLSearchParamsType } from "url";

import { compressAsync, decompressAsync } from "lzutf8";
import { Base64 } from "js-base64";

async function encode(data: any): Promise<string> {
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

async function decode(data: string): Promise<unknown> {
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

export function useSearchParamState<S>(
  initialState: S | (() => S),
  searchParamName = "d",
  callback: ReturnType<typeof useCallback>
): [S, Dispatch<SetStateAction<S>>] {
  const [data, setData] = useState<S>(initialState);

  useEffect(() => {
    if (!window) return;

    const encodedData = new URL(window.location.href).searchParams?.get(
      searchParamName
    );

    if (!encodedData) return;

    (async () => {
      const loadedState = (await decode(encodedData)) as S;
      setData(loadedState);
      callback(loadedState);
    })();
  }, [searchParamName, callback]);

  useEffect(() => {
    if (!window) return;

    (async () => {
      const url = new URL(window.location.href);

      const searchParams: URLSearchParamsType = await (async () => {
        if (data === undefined || data === null) {
          return url.searchParams;
        } else {
          const encodedData = await encode(data);
          const newSearchParams = new URLSearchParams(url.searchParams);
          newSearchParams.set(searchParamName, encodedData);
          return newSearchParams;
        }
      })();

      const searchString = searchParams.toString();

      const newUrl =
        url.origin +
        url.pathname +
        (searchString.length > 0 ? "?" + searchString : "");

      if (newUrl.length < 2048) {
        history.replaceState(undefined, "", newUrl);
      }
    })();
  }, [data, searchParamName]);

  return [data, setData];
}
