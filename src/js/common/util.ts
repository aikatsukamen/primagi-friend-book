import { saveAs } from 'file-saver';
import QRCode, { QRCodeRenderersOptions } from 'qrcode';
import React from 'react';

/** バイナリの16進数文字列をバイト列にする */
export const binStrToByte = (str: string): number[] => {
  // 2文字ずつ
  const list: string[] = [];
  let buf = '';
  for (let i = 1; i <= str.length; i++) {
    if (i % 2 === 0) {
      list.push(`${buf}${str[i - 1]}`);
      buf = '';
    } else {
      buf = str[i - 1];
    }
  }

  const result: number[] = [];
  for (let i = 0; i < list.length; i++) {
    result.push(parseInt(list[i], 16));
  }

  return result;
};

/** 配列を指定した個数の単位で分割 */
const chunk = <T>(array: T[], size: number): T[][] => {
  const chunked: T[][] = [];

  for (const element of array) {
    const last = chunked[chunked.length - 1];

    if (!last || last.length === size) {
      chunked.push([element]);
    } else {
      last.push(element);
    }
  }

  return chunked;
};

/**
 * CORS回避画像の取得
 * cacheに残ってればその画像を、そうでなければリクエストして画像を取得する
 */
const fetchPngImageAvoidCors = async (imageurl: string) => {
  console.log(`[fetchPngImageAvoidCors] ${imageurl}`);
  const cache = sessionStorage.getItem(`${imageurl}`);
  let isNeedGet = true;
  if (cache) {
    try {
      const init: RequestInit = {
        referrerPolicy: 'no-referrer',
      };
      await fetch(cache, init);
      isNeedGet = false;
    } catch (e) {
      // キャッシュリストにはあるんだけど何か取れなかった
      console.log('blobに無いので再取得: ' + imageurl);
    }
  }
  if (isNeedGet) {
    const res = await fetch(imageurl);
    const buf = await res.arrayBuffer();
    const blob = new Blob([buf], { type: 'image/png' });
    const url = URL.createObjectURL(blob);

    sessionStorage.setItem(imageurl, url);
    return url;
  } else {
    return cache as string;
  }
};

export type ReactQRCodeProps = {
  text?: string;
  data?: number[];
  title: string;
  thumbnail: string;
  background: string;
  backgroundRotate: boolean;
  options?: QRCodeRenderersOptions;
  tagType?: 'canvas' | 'img';
};

const qr2Image = async (data: string | number[], options: QRCodeRenderersOptions) => {
  let dataUrl = '';
  if (typeof data === 'string') {
    // テキストモード
    dataUrl = await new Promise((resolve) => {
      QRCode.toDataURL(data, options, (error: any, url: string) => {
        if (error) {
          throw error;
        }
        resolve(url);
      });
    });
  } else if (data) {
    // Byteモード
    dataUrl = await new Promise((resolve) => {
      QRCode.toDataURL([{ data: new Uint8ClampedArray(data), mode: 'byte' }], options, function (error: any, url: string) {
        if (error) {
          throw error;
        }
        resolve(url);
      });
    });
  }

  const qrImage = new Image();
  qrImage.src = dataUrl;
  return qrImage;
};

const loadImage = async (image: HTMLImageElement) => {
  await new Promise<void>((resolve) => {
    image.onload = () => {
      resolve();
    };
    image.onerror = () => {
      console.warn('読み込み失敗');
      resolve();
    };
  });
};

const canvas2Blob = async (canvas: HTMLCanvasElement, type?: string, quality?: number): Promise<Blob> => {
  const imageType = type ?? 'image/png';
  const imageQuality = quality ?? 0.9;

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw 'canvasがblobにできなかった';
        }
      },
      imageType,
      imageQuality,
    );
  });
};

/** blobをダウンロードする */
export const downloadBlob = (blob: Blob, filename: string) => {
  saveAs(blob, filename);
};

export function useDelayedEffect(effect: React.EffectCallback, deps: React.DependencyList, timeout = 1000) {
  React.useEffect(() => {
    const timeoutId = setTimeout(effect, timeout);

    return () => clearTimeout(timeoutId);
  }, deps);
}

/** Jsonファイルを取得 */
export async function fetchJson<T>(url: string): Promise<T> {
  const result = await fetch(url);
  const json = await result.json();
  return json as T;
}

/**
 * QRコードの認識停止
 */
export const stopRecogQR = () => {
  try {
    console.log(`stopRecogQR id=${window.codeReaderTimer}`);
    clearInterval(window.codeReaderTimer);
    const dom = (document.querySelector('video')!.srcObject as MediaStream).getVideoTracks()[0].stop();
  } catch (e) {
    // ビデオがまだ無いときとかにここに来るが、気にしない
  }
};
