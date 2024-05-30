import type { URLSearchParams as URLSearchParamsType } from "node:url";
import { Base64 } from "js-base64";
import { compressAsync, decompressAsync } from "lzutf8";
import { type Dispatch, type SetStateAction, type useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { debounceWait } from "./constants";

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
      },
    );
  });
}

async function decode(data: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    decompressAsync(Base64.decode(data), { inputEncoding: "BinaryString" }, (dataJson, error) => {
      if (error) {
        reject(error);
      } else {
        try {
          resolve(JSON.parse(dataJson));
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

export function useSearchParamState<S>(
  initialState: S | (() => S),
  searchParamName: string,
  callback?: ReturnType<typeof useCallback>,
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(initialState);

  const setSerchParamDebounced = useDebouncedCallback(
    async (newState: S, searchParamName: string) => {
      const url = new URL(window.location.href);

      const searchParams: URLSearchParamsType = await (async () => {
        if (newState === undefined || newState === null) {
          return url.searchParams;
        }
        const encodedState = await encode(newState);
        const newSearchParams = new URLSearchParams(url.searchParams);
        newSearchParams.set(searchParamName, encodedState);
        return newSearchParams;
      })();

      const searchString = searchParams.toString();

      const newUrl =
        url.origin + url.pathname + (searchString.length > 0 ? `?${searchString}` : "");

      if (newUrl.length < 2048) {
        history.replaceState(undefined, "", newUrl);
      }
    },
    debounceWait,
  );

  useEffect(() => {
    if (!window) return;

    const encodedState = new URL(window.location.href).searchParams?.get(searchParamName);

    if (!encodedState) return;

    (async () => {
      const loadedState = (await decode(encodedState)) as S;
      setState(loadedState);

      if (callback) {
        callback(loadedState);
      }
    })();
  }, [searchParamName, callback]);

  useEffect(() => {
    if (!window) return;
    setSerchParamDebounced(state, searchParamName);
  }, [setSerchParamDebounced, state, searchParamName]);

  return [state, setState];
}
